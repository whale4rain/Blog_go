// ============================================================================
// Edit Article Page - Dashboard
// ============================================================================

"use client";

import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { getArticleById, updateArticle } from "@/lib/api/article";
import { uploadImage } from "@/lib/api/comment";
import { useUserStore } from "@/lib/store/userStore";
import type {
  Article,
  CreateArticleRequest
} from "@/types";
import { ArrowLeft, Plus, Save, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoggedIn, hasHydrated } = useUserStore();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: "",
    abstract: "",
    content: "",
    category: "",
    tags: [],
    cover: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Technology",
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Personal",
    "Tutorial",
    "News",
  ];

  useEffect(() => {
    // Wait for Zustand to rehydrate state from localStorage
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (articleId) {
      fetchArticle();
    }
  }, [isLoggedIn, hasHydrated, articleId]);

  const fetchArticle = async () => {
    try {
      setFetching(true);
      const fetchedArticle = await getArticleById(articleId);
      setArticle(fetchedArticle);

      setFormData({
        title: fetchedArticle.title,
        abstract: fetchedArticle.abstract,
        content: fetchedArticle.content,
        category: fetchedArticle.category,
        tags: fetchedArticle.tags,
        cover: fetchedArticle.cover || "",
      });
    } catch (error) {
      console.error("Failed to fetch article:", error);
      alert("Failed to load article. Please try again.");
      router.push("/dashboard/articles");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Convert status string to number
    if (name === "status") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in the title and content");
      return;
    }

    try {
      setPublishing(true);
      setLoading(true);

      const articleData = {
        ...formData,
        id: articleId,
        abstract:
          formData.abstract || formData.content.substring(0, 200) + "...",
      };

      await updateArticle(articleId, articleData);

      // Show success message
      alert(`Article updated successfully!`);

      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Failed to update article:", error);
      alert("Failed to update article. Please try again.");
    } finally {
      setLoading(false);
      setPublishing(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      const response = await uploadImage(file);
      
      if (response && response.url) {
        // 如果返回的是相对路径，转换为完整 URL
        let imageUrl = response.url;
        if (imageUrl.startsWith('/')) {
          // 使用 Next.js 代理路径
          imageUrl = imageUrl;
        }
        setFormData((prev) => ({ ...prev, cover: imageUrl }));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // 重置 input 以允许重新选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (!isLoggedIn || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Article Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The article you&apos;re trying to edit doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/dashboard/articles")}
            className="text-google-blue hover:underline"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/articles")}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit Article
                </h1>
                <p className="text-muted-foreground">Update your blog post</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave()}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="card p-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue text-lg"
              />
            </div>

            {/* Cover Image */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cover Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {formData.cover ? (
                <div className="relative">
                  <img
                    src={formData.cover}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, cover: "" }))
                    }
                    className="absolute top-2 right-2 p-2 bg-google-red text-white rounded-full hover:bg-[hsl(4,90%,58%)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-google-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue mb-2"></div>
                      <span className="text-muted-foreground">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-muted-foreground">
                        Upload cover image
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Content Editor */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-foreground"
                >
                  Content
                </label>
                <button
                  onClick={togglePreview}
                  className="text-sm text-google-blue hover:underline"
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>
              {!showPreview ? (
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here..."
                  rows={20}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue font-mono"
                />
              ) : (
                <div className="min-h-[500px] p-6 border border-border rounded-lg">
                  <h1>{formData.title}</h1>
                  <p>{formData.abstract}</p>
                  <MarkdownRenderer content={formData.content} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Abstract */}
            <div className="card p-6 mb-6">
              <label
                htmlFor="abstract"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Abstract
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Brief summary of your article..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.abstract?.length || 0}/200 characters
              </p>
            </div>

            {/* Category */}
            <div className="card p-6 mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="card p-6 mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>

              {/* Current Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-google-blue/10 text-google-blue text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-google-red"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tags */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue text-sm"
                />
                <button
                  onClick={() => handleAddTag(tagInput)}
                  className="px-3 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add up to 5 tags
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
