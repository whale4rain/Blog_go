// ============================================================================
// Articles Management Page - Dashboard
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { getArticleList, deleteArticle } from "@/lib/api/article";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import type { ArticleListItem } from "@/types";

// ============================================================================
// Page Component
// ============================================================================

export default function ArticlesPage() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchArticles();
  }, [isLoggedIn, currentPage, searchTerm]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await getArticleList({
        page: currentPage,
        page_size: 10,
        query: searchTerm || undefined,
      });

      setArticles(response.list);
      setTotalPages(Math.ceil(response.total / response.page_size));
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      fetchArticles();
      setSelectedArticles([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedArticles.map((id) => deleteArticle(id)));
      fetchArticles();
      setSelectedArticles([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete articles:", error);
    }
  };

  const toggleArticleSelection = (id: number) => {
    setSelectedArticles((prev) =>
      prev.includes(id)
        ? prev.filter((articleId) => articleId !== id)
        : [...prev, id],
    );
  };

  const toggleAllSelection = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map((article) => article.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Articles Management
                </h1>
                <p className="text-muted-foreground">
                  Manage and organize your blog articles
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/articles/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Article
            </Link>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="card p-4 mb-6 bg-google-blue/10 border border-google-blue/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedArticles.length} article
                {selectedArticles.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger text-sm"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedArticles([])}
                  className="btn-secondary text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedArticles.length === articles.length &&
                        articles.length > 0
                      }
                      onChange={toggleAllSelection}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="skeleton h-4 w-4 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="skeleton h-4 w-48 rounded mb-2" />
                        <div className="skeleton h-3 w-32 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="skeleton h-6 w-20 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="skeleton h-4 w-24 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="skeleton h-4 w-24 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="skeleton h-8 w-20 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : articles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No articles found</p>
                      <Link
                        href="/dashboard/articles/create"
                        className="text-google-blue hover:underline mt-2 inline-block"
                      >
                        Create your first article
                      </Link>
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-muted transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => toggleArticleSelection(article.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {article.cover && (
                            <img
                              src={article.cover}
                              alt={article.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-foreground mb-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.abstract}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-google-blue/10 text-google-blue">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.view_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {article.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {article.comment_count}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/article/${article.id}`}
                            target="_blank"
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/articles/${article.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedArticles([article.id]);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-muted-foreground hover:text-google-red transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {articles.length} of {totalPages * 10} articles
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Confirm Deletion
            </h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete {selectedArticles.length} article
              {selectedArticles.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleBulkDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
