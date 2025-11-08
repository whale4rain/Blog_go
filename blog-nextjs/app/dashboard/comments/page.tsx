// ============================================================================
// Comments Management Page - Dashboard
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { deleteComments } from "@/lib/api/comment";
import {
  MessageSquare,
  ArrowLeft,
  Trash2,
  Reply,
  Flag,
  Check,
  Search,
  AlertTriangle,
} from "lucide-react";

interface Comment {
  id: number;
  article_id: number;
  article_title: string;
  user_id: number;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  p_id: number | null;
  content: string;
  like_count: number;
  reply_count: number;
  status: "approved" | "pending" | "spam" | "deleted";
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export default function CommentsPage() {
  const router = useRouter();
  const { user, isLoggedIn, hasHydrated } = useUserStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  useEffect(() => {
    // Wait for Zustand to rehydrate state from localStorage
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchComments();
  }, [isLoggedIn, hasHydrated, currentPage, statusFilter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // Mock data - in real app would fetch from API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockComments: Comment[] = [
        {
          id: 1,
          article_id: 1,
          article_title: "Getting Started with Next.js",
          user_id: 2,
          user: {
            id: 2,
            username: "Jane Smith",
            avatar: "https://picsum.photos/seed/user2/100/100.jpg",
          },
          p_id: null,
          content:
            "Great article! Very helpful information about Next.js fundamentals. I especially liked the explanation of server-side rendering.",
          like_count: 12,
          reply_count: 2,
          status: "approved",
          created_at: "2024-03-15T10:30:00Z",
          updated_at: "2024-03-15T10:30:00Z",
          replies: [
            {
              id: 2,
              article_id: 1,
              article_title: "Getting Started with Next.js",
              user_id: 1,
              user: {
                id: 1,
                username: "John Doe",
                avatar: "https://picsum.photos/seed/user1/100/100.jpg",
              },
              p_id: 1,
              content:
                "I agree! The examples were very clear and easy to follow.",
              like_count: 5,
              reply_count: 0,
              status: "approved",
              created_at: "2024-03-15T11:00:00Z",
              updated_at: "2024-03-15T11:00:00Z",
            },
          ],
        },
        {
          id: 3,
          article_id: 2,
          article_title: "React Best Practices",
          user_id: 3,
          user: {
            id: 3,
            username: "Bob Wilson",
            avatar: "https://picsum.photos/seed/user3/100/100.jpg",
          },
          p_id: null,
          content:
            "This is spam content that should be moderated. Check out my website for cheap products!",
          like_count: 0,
          reply_count: 0,
          status: "spam",
          created_at: "2024-03-14T15:45:00Z",
          updated_at: "2024-03-14T15:45:00Z",
        },
        {
          id: 4,
          article_id: 3,
          article_title: "TypeScript Tips and Tricks",
          user_id: 4,
          user: {
            id: 4,
            username: "Alice Johnson",
            avatar: "https://picsum.photos/seed/user4/100/100.jpg",
          },
          p_id: null,
          content:
            "Can you write more about advanced TypeScript patterns? I'd love to see more content on conditional types.",
          like_count: 8,
          reply_count: 1,
          status: "pending",
          created_at: "2024-03-13T09:20:00Z",
          updated_at: "2024-03-13T09:20:00Z",
        },
      ];

      setComments(mockComments);
      setTotalPages(1);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    commentId: number,
    newStatus: Comment["status"],
  ) => {
    try {
      // Mock API call - in real app would call API
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, status: newStatus }
            : comment,
        ),
      );
    } catch (error) {
      console.error("Failed to update comment status:", error);
      alert("Failed to update comment status");
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComments([commentId]);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
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
      setComments((prev) =>
        prev.filter((comment) => !selectedComments.includes(comment.id)),
      );
      setSelectedComments([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comments:", error);
      alert("Failed to delete comments");
    }
  };

  const handleReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    try {
      // Mock reply - in real app would call API
      const newReply: Comment = {
        id: Date.now(),
        article_id: comments.find((c) => c.id === commentId)?.article_id || 0,
        article_title:
          comments.find((c) => c.id === commentId)?.article_title || "",
        user_id: user?.id || 0,
        user: {
          id: user?.id || 0,
          username: user?.username || "",
          avatar: user?.avatar || "",
        },
        p_id: commentId,
        content: replyContent,
        like_count: 0,
        reply_count: 0,
        status: "approved",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                reply_count: comment.reply_count + 1,
                replies: [...(comment.replies || []), newReply],
              }
            : comment,
        ),
      );

      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
      alert("Failed to post reply");
    }
  };

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    );
  };

  const getStatusBadge = (status: Comment["status"]) => {
    const statusStyles = {
      approved: "bg-google-green/10 text-google-green",
      pending: "bg-google-yellow/10 text-[hsl(45,100%,35%)]",
      spam: "bg-google-red/10 text-google-red",
      deleted: "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.article_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="spam">Spam</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-blue/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-google-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {comments.length}
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
                  {comments.filter((c) => c.status === "approved").length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-yellow/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-[hsl(45,100%,35%)]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {comments.filter((c) => c.status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-red/10 rounded-lg">
                <Flag className="w-6 h-6 text-google-red" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {comments.filter((c) => c.status === "spam").length}
                </div>
                <div className="text-sm text-muted-foreground">Spam</div>
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
                  onClick={() => {
                    selectedComments.forEach((id) =>
                      handleStatusChange(id, "approved"),
                    );
                    setSelectedComments([]);
                  }}
                  className="px-4 py-2 bg-google-green text-white rounded-lg hover:bg-[hsl(142,71%,41%)] transition-colors text-sm"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => {
                    selectedComments.forEach((id) =>
                      handleStatusChange(id, "spam"),
                    );
                    setSelectedComments([]);
                  }}
                  className="px-4 py-2 bg-google-yellow text-white rounded-lg hover:bg-[hsl(45,100%,35%)] transition-colors text-sm"
                >
                  Mark as Spam
                </button>
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
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
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
                        {getStatusBadge(comment.status)}
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
                          {comment.article_title}
                        </Link>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {comment.like_count} likes
                        </span>
                        {comment.reply_count > 0 && (
                          <>
                            <span>•</span>
                            <button
                              onClick={() => toggleCommentExpansion(comment.id)}
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {comment.reply_count} replies
                            </button>
                          </>
                        )}
                      </div>

                      {/* Replies */}
                      {comment.replies &&
                        comment.replies.length > 0 &&
                        expandedComments.includes(comment.id) && (
                          <div className="ml-8 mt-4 space-y-4 border-l-2 border-border pl-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3"
                              >
                                <img
                                  src={reply.user.avatar}
                                  alt={reply.user.username}
                                  className="w-8 h-8 rounded-full"
                                />
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

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="ml-8 mt-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReply(comment.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleReply(comment.id)}
                              className="px-4 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id,
                            )
                          }
                          className="p-2 text-muted-foreground hover:text-google-blue hover:bg-google-blue/10 rounded"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        {comment.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment.id, "approved")
                            }
                            className="p-2 text-muted-foreground hover:text-google-green hover:bg-google-green/10 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {comment.status !== "spam" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment.id, "spam")
                            }
                            className="p-2 text-muted-foreground hover:text-google-yellow hover:bg-google-yellow/10 rounded"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        )}
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
