// ============================================================================
// Images Management Page - Dashboard
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  X,
  FolderOpen,
  Calendar,
  FileImage,
} from "lucide-react";

type ImageFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  folder?: string;
  dimensions?: {
    width: number;
    height: number;
  };
};

export default function ImagesPage() {
  const router = useRouter();
  const { user, isLoggedIn, hasHydrated } = useUserStore();

  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const folders = [
    { id: "all", name: "All Images", count: 0 },
    { id: "articles", name: "Articles", count: 0 },
    { id: "covers", name: "Cover Images", count: 0 },
    { id: "gallery", name: "Gallery", count: 0 },
    { id: "uploads", name: "Recent Uploads", count: 0 },
  ];

  useEffect(() => {
    // Wait for Zustand to rehydrate state from localStorage
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchImages();
  }, [isLoggedIn, hasHydrated]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Mock data - in real app would fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockImages: ImageFile[] = [
        {
          id: "1",
          name: "blog-cover-1.jpg",
          url: "https://picsum.photos/seed/blog1/800/400.jpg",
          size: 245760,
          type: "image/jpeg",
          uploadedAt: "2024-03-15T10:30:00Z",
          folder: "covers",
          dimensions: { width: 800, height: 400 },
        },
        {
          id: "2",
          name: "article-image-2.png",
          url: "https://picsum.photos/seed/article2/600/400.jpg",
          size: 184320,
          type: "image/png",
          uploadedAt: "2024-03-14T15:45:00Z",
          folder: "articles",
          dimensions: { width: 600, height: 400 },
        },
        {
          id: "3",
          name: "gallery-photo-3.jpg",
          url: "https://picsum.photos/seed/gallery3/1200/800.jpg",
          size: 512000,
          type: "image/jpeg",
          uploadedAt: "2024-03-13T09:20:00Z",
          folder: "gallery",
          dimensions: { width: 1200, height: 800 },
        },
        {
          id: "4",
          name: "recent-upload-4.webp",
          url: "https://picsum.photos/seed/recent4/400/400.jpg",
          size: 98304,
          type: "image/webp",
          uploadedAt: "2024-03-16T14:10:00Z",
          folder: "uploads",
          dimensions: { width: 400, height: 400 },
        },
        {
          id: "5",
          name: "blog-cover-5.jpg",
          url: "https://picsum.photos/seed/blog5/800/400.jpg",
          size: 262144,
          type: "image/jpeg",
          uploadedAt: "2024-03-12T11:25:00Z",
          folder: "covers",
          dimensions: { width: 800, height: 400 },
        },
      ];

      setImages(mockImages);

      // Update folder counts
      folders.forEach(folder => {
        if (folder.id === "all") {
          folder.count = mockImages.length;
        } else {
          folder.count = mockImages.filter(img => img.folder === folder.id).length;
        }
      });
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    const newImages: ImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      const newImage: ImageFile = {
        id: `upload-${Date.now()}-${i}`,
        name: file.name,
        url,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        folder: "uploads",
      };

      // Get dimensions for images
      if (file.type.startsWith("image/")) {
        const img = new window.Image();
        img.onload = () => {
          newImage.dimensions = { width: img.width, height: img.height };
        };
        img.src = url;
      }

      newImages.push(newImage);
    }

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setImages(prev => [...newImages, ...prev]);
    setUploading(false);
    setShowUploadModal(false);
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} image${ids.length > 1 ? "s" : ""}?`)) {
      return;
    }

    try {
      // Mock delete - in real app would call API
      setImages(prev => prev.filter(img => !ids.includes(img.id)));
      setSelectedImages([]);
    } catch (error) {
      console.error("Failed to delete images:", error);
      alert("Failed to delete images. Please try again.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id)
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "all" || image.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Images</h1>
                <p className="text-muted-foreground">Manage your media library</p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              Upload Images
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Folders */}
            <div className="card p-6 mb-6">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Folders
              </h3>
              <div className="space-y-2">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-google-blue/10 text-google-blue"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>{folder.name}</span>
                    <span className="text-sm text-muted-foreground">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Info */}
            <div className="card p-6">
              <h3 className="font-medium text-foreground mb-4">Storage Usage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used</span>
                    <span>2.4 MB / 100 MB</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-google-blue h-2 rounded-full" style={{ width: "2.4%" }}></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {images.length} images uploaded
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="card p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-google-blue/10 text-google-blue" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-google-blue/10 text-google-blue" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedImages.length > 0 && (
              <div className="card p-4 mb-6 bg-google-blue/10 border border-google-blue/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(selectedImages)}
                      className="px-4 py-2 bg-google-red text-white rounded-lg hover:bg-[hsl(4,90%,58%)] transition-colors text-sm"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedImages([])}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Images Grid/List */}
            <div
              className={`card p-6 ${dragActive ? "border-2 border-dashed border-google-blue" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading images...</p>
                  </div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No images found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedFolder !== "all"
                      ? "Try adjusting your filters"
                      : "Upload your first images to get started"}
                  </p>
                  {!searchQuery && selectedFolder === "all" && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Images
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Selection Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.length === filteredImages.length}
                        onChange={toggleAllSelection}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground">Select all</span>
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredImages.map((image) => (
                        <div
                          key={image.id}
                          className={`relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                            selectedImages.includes(image.id) ? "ring-2 ring-google-blue" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={() => toggleImageSelection(image.id)}
                            className="absolute top-2 left-2 z-10 rounded border-border"
                          />
                          <div
                            className="aspect-square bg-cover bg-center cursor-pointer"
                            style={{ backgroundImage: `url(${image.url})` }}
                            onClick={() => setPreviewImage(image)}
                          />
                          <div className="p-3">
                            <p className="text-sm font-medium text-foreground truncate mb-1">
                              {image.name}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatFileSize(image.size)}</span>
                              {image.dimensions && (
                                <span>{image.dimensions.width}×{image.dimensions.height}</span>
                              )}
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => setPreviewImage(image)}
                              className="p-1 bg-white/90 rounded hover:bg-white"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete([image.id])}
                              className="p-1 bg-white/90 rounded hover:bg-white text-google-red"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="space-y-2">
                      {filteredImages.map((image) => (
                        <div
                          key={image.id}
                          className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted transition-colors ${
                            selectedImages.includes(image.id) ? "bg-google-blue/5 border-google-blue" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={() => toggleImageSelection(image.id)}
                            className="rounded border-border"
                          />
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{image.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(image.size)}</span>
                              {image.dimensions && (
                                <span>{image.dimensions.width}×{image.dimensions.height}</span>
                              )}
                              <span>{formatDate(image.uploadedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPreviewImage(image)}
                              className="p-2 text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete([image.id])}
                              className="p-2 text-muted-foreground hover:text-google-red"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Upload Images</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-google-blue bg-google-blue/5" : "border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground mb-2">Drop images here or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports JPG, PNG, GIF, WebP up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Choose Files
              </label>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-google-blue mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
              <p className="font-medium mb-2">{previewImage.name}</p>
              <div className="flex items-center gap-4 text-sm">
                <span>{formatFileSize(previewImage.size)}</span>
                {previewImage.dimensions && (
                  <span>{previewImage.dimensions.width}×{previewImage.dimensions.height}</span>
                )}
                <span>{formatDate(previewImage.uploadedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
