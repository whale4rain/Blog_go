// ============================================================================
// Comments Management Page - Dashboard
// ============================================================================

"use client";

import { deleteComments, getAdminCommentList } from "@/lib/api/comment";
import { useUserStore } from "@/lib/store/userStore";
import type { Comment } from "@/types";
import {
    ArrowLeft,
    Check,
    MessageSquare,
    Search,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 扩展 Comment 类型以包含文章标题
interface CommentWithArticle extends Comment {
  article_title?: string;
}

export default function CommentsPage() {
  const router = useRouter();
  const { user, isLoggedIn, hasHydrated } = useUserStore();

  const [comments, setComments] = useState<CommentWithArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  useEffect(() => {
    // Wait for Zustand to rehydrate state from localStorage
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchComments();
  }, [isLoggedIn, hasHydrated, currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        page_size: 20,
      };

      // 添加搜索过滤
      if (searchQuery.trim()) {
        params.content = searchQuery;
      }

      const response = await getAdminCommentList(params);
      
      // 添加 article_title 字段（如果后端没有返回）
      const commentsWithTitle = response.list.map((comment) => ({
        ...comment,
        article_title: `Article ${comment.article_id}`, // 后端可能没有返回文章标题
      }));

      setComments(commentsWithTitle);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / 20));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      // 出错时显示空列表
      setComments([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComments([commentId]);
      fetchComments(); // 重新获取列表
      setSelectedComments([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteComments(selectedComments);
      fetchComments(); // 重新获取列表
      setSelectedComments([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comments:", error);
      alert("Failed to delete comments");
    }
  };

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    );
  };

  const filteredComments = comments.filter((comment) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      comment.content.toLowerCase().includes(search) ||
      comment.user.username.toLowerCase().includes(search) ||
      comment.article_title?.toLowerCase().includes(search)
    );
  });

  const toggleCommentSelection = (commentId: number) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    );
  };

  const toggleAllSelection = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map((comment) => comment.id));
    }
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
                <h1 className="text-3xl font-bold text-foreground">Comments</h1>
                <p className="text-muted-foreground">
                  Moderate and manage user comments
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    fetchComments();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <button
              onClick={() => fetchComments()}
              className="px-6 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-blue/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-google-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Comments
                </div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-green/10 rounded-lg">
                <Check className="w-6 h-6 text-google-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {comments.length}
                </div>
                <div className="text-sm text-muted-foreground">On This Page</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="card p-4 mb-6 bg-google-blue/10 border border-google-blue/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedComments.length} comment
                {selectedComments.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-google-red text-white rounded-lg hover:bg-[hsl(4,90%,58%)] transition-colors text-sm"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedComments([])}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="card">
          {loading ? (
            <div className="p-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="skeleton h-20 w-full rounded" />
                </div>
              ))}
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                No comments found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No comments have been posted yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Selection Controls */}
              <div className="p-4 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedComments.length === filteredComments.length
                    }
                    onChange={toggleAllSelection}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all
                  </span>
                </label>
                <span className="text-sm text-muted-foreground">
                  {filteredComments.length} comment
                  {filteredComments.length !== 1 ? "s" : ""}
                </span>
              </div>

              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => toggleCommentSelection(comment.id)}
                      className="mt-1 rounded border-border"
                    />

                    {/* User Avatar */}
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full"
                    />

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-foreground">
                          {comment.user.username}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      <div className="text-foreground mb-3">
                        {comment.content}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>on</span>
                        <Link
                          href={`/article/${comment.article_id}`}
                          className="text-google-blue hover:underline"
                        >
                          {comment.article_title || `Article ${comment.article_id}`}
                        </Link>
                        {comment.like_count > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {comment.like_count} likes
                            </span>
                          </>
                        )}
                        {comment.children && comment.children.length > 0 && (
                          <>
                            <span>•</span>
                            <button
                              onClick={() => toggleCommentExpansion(comment.id)}
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {comment.children.length} replies
                            </button>
                          </>
                        )}
                      </div>

                      {/* Replies */}
                      {comment.children &&
                        comment.children.length > 0 &&
                        expandedComments.includes(comment.id) && (
                          <div className="ml-8 mt-4 space-y-4 border-l-2 border-border pl-4">
                            {comment.children.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3"
                              >
                                {reply.user.avatar ? (
                                  <img
                                    src={reply.user.avatar}
                                    alt={reply.user.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center text-sm font-medium">
                                    {reply.user.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-foreground text-sm">
                                      {reply.user.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-foreground">
                                    {reply.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => {
                            setSelectedComments([comment.id]);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-google-red hover:bg-google-red/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      pageNum === currentPage
                        ? "bg-google-blue text-white"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Confirm Deletion
            </h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete {selectedComments.length} comment
              {selectedComments.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-google-red text-white rounded-lg hover:bg-[hsl(4,90%,58%)] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
