// ============================================================================
// Article Creation Page - Dashboard
// ============================================================================

"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/userStore";
import { createArticle } from "@/lib/api/article";
import { uploadImage } from "@/lib/api/comment";
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Hash,
  FileText,
  X,
  Plus,
  Upload,
} from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

// ============================================================================
// Page Component
// ============================================================================

export default function CreateArticlePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Article data
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  React.useEffect(() => {
    // Only redirect after initialization and if not authenticated
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isInitialized, isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!abstract.trim()) {
      newErrors.abstract = "Abstract is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!coverImage.trim()) {
      newErrors.cover = "Cover image is required";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const articleData = {
        title: title.trim(),
        abstract: abstract.trim(),
        content: content.trim(),
        category: category.toLowerCase(),
        tags,
        cover: coverImage.trim() || "https://via.placeholder.com/800x400",
      };

      await createArticle(articleData);
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Failed to create article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);
        const response = await uploadImage(file, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });
        setCoverImage(response.url);
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("图片上传失败，请重试。");
        // Fallback to placeholder
        setCoverImage("https://via.placeholder.com/800x400");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === e.currentTarget) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-3 border-google-blue border-t-transparent rounded-full" />
          <span className="text-muted-foreground">Initializing...</span>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
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
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Create Article
                </h1>
                <p className="text-muted-foreground">
                  Write and publish your blog post
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? "Edit" : "Preview"}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Article"}
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue ${
                  errors.title ? "border-google-red" : "border-border"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-google-red">{errors.title}</p>
              )}
            </div>

            {/* Abstract */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Abstract
              </label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Write a brief summary of your article..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue resize-none ${
                  errors.abstract ? "border-google-red" : "border-border"
                }`}
              />
              {errors.abstract && (
                <p className="mt-1 text-sm text-google-red">
                  {errors.abstract}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Content
              </label>
              {previewMode ? (
                <div className="min-h-[400px] p-4 bg-muted rounded-lg">
                  <div className="prose max-w-none">
                    <h1>{title}</h1>
                    <p>{abstract}</p>
                    <MarkdownRenderer content={content} />
                  </div>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article content here..."
                  rows={15}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue resize-none font-mono ${
                    errors.content ? "border-google-red" : "border-border"
                  }`}
                />
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-google-red">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="card p-6">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cover Image
              </h3>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-google-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin h-6 w-6 border-2 border-google-blue border-t-transparent rounded-full" />
                          <span className="text-sm">上传中...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span className="text-sm">Upload Cover Image</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="card p-6">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Category
              </h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue ${
                  errors.category ? "border-google-red" : "border-border"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-google-red">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="card p-6">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Tags
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                    className="p-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-google-blue/10 text-google-blue rounded-full text-sm"
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
                )}
                <p className="text-xs text-muted-foreground">
                  Add up to 5 tags to help readers find your article
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
