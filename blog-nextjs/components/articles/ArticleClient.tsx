// ============================================================================
// Article Client Component - Interactive Elements for Article Page
// ============================================================================

"use client";

import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import TableOfContents from "@/components/ui/TableOfContents";
import type { Article, Comment } from "@/types";
import { Calendar, Clock, Eye, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ArticleClientProps {
  article: Article;
  comments: Comment[];
}

export default function ArticleClient({
  article,
  comments,
}: ArticleClientProps) {
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement actual like functionality
    alert("Like feature - implement with API call");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/search"
            className="hover:text-google-blue transition-colors"
          >
            Articles
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-blue">{article.category}</span>
            {article.is_top && (
              <span className="badge bg-google-red/10 text-google-red">
                Top
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.abstract}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium">
                  {article.author.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-foreground font-medium">
                {article.author.username}
              </span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={article.created_at}>
                {formatDate(article.created_at)}
              </time>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(article.created_at)}</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.view_count} views</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-google-yellow/10 text-[hsl(45,100%,35%)] rounded-full text-sm"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="mb-12">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Article Actions */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
              isLiked
                ? "bg-google-red text-white hover:bg-[hsl(4,90%,48%)]"
                : "bg-google-blue text-white hover:bg-[hsl(214,90%,48%)]"
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </button>

          <button
            className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* Author Card */}
        <div className="card p-6 mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            About the Author
          </h3>
          <div className="flex items-start gap-4">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium text-xl">
                {article.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-1">
                {article.author.username}
              </h4>
              {article.author.signature && (
                <p className="text-muted-foreground mb-2">
                  {article.author.signature}
                </p>
              )}
              <Link
                href={`/author/${article.author.id}`}
                className="text-google-blue hover:underline font-medium"
              >
                View Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Comments ({comments.length})
          </h2>

          {/* Comment Form - Placeholder */}
          <div className="card p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Leave a Comment
            </h3>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
              placeholder="Share your thoughts..."
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-6 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
                onClick={() =>
                  alert("Comment feature - implement with API call")
                }
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </section>

        {/* Related Articles - Placeholder */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Related Articles
          </h2>
          <p className="text-muted-foreground">
            Related articles will be shown here...
          </p>
        </section>
      </div>

      {/* Table of Contents Sidebar */}
      <TableOfContents content={article.content} className="hidden lg:block" />
    </div>
  );
}

// Comment Card Component
function CommentCard({ comment }: { comment: Comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;

    // TODO: Implement actual reply API call
    alert(`Reply to ${comment.user.username}: ${replyContent}`);
    setReplyContent("");
    setShowReplyForm(false);
  };

  return (
    <div className="card p-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <a
            href={`/author/${comment.user.id}`}
            className="block hover:opacity-80 transition-opacity"
          >
            {comment.user.avatar ? (
              <img
                src={comment.user.avatar}
                alt={comment.user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium text-lg">
                {comment.user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </a>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 mb-2">
              <a
                href={`/author/${comment.user.id}`}
                className="font-semibold text-foreground hover:text-google-blue transition-colors"
              >
                {comment.user.username}
              </a>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(comment.created_at)}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  comment.user.role_id === 2
                    ? "bg-google-red/10 text-google-red"
                    : "bg-google-green/10 text-google-green"
                }`}
              >
                {comment.user.role_id === 2 ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Author Details */}
          {(comment.user.signature || comment.user.address) && (
            <div className="text-sm text-muted-foreground mb-3">
              {comment.user.signature && (
                <p className="mb-1 italic">
                  &quot;{comment.user.signature}&quot;
                </p>
              )}
              {comment.user.address && (
                <p className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {comment.user.address}
                </p>
              )}
            </div>
          )}

          <p className="text-foreground leading-relaxed mb-4">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm mb-4">
            <button
              className="flex items-center gap-1 text-muted-foreground hover:text-google-blue transition-colors"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Reply
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-google-red transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Report
            </button>
            <a
              href={`/author/${comment.user.id}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-google-blue transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              View Profile
            </a>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reply to {comment.user.username}
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors resize-none"
                  placeholder="Write your reply..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>
                  {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "Reply" : "Replies"}
                </span>
                {comment.replies.length > 2 && (
                  <button
                    className="text-google-blue hover:underline"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded
                      ? "Show less"
                      : `Show ${comment.replies.length - 2} more`}
                  </button>
                )}
              </div>

              <div className="space-y-4 pl-4 border-l-2 border-border">
                {(isExpanded
                  ? comment.replies
                  : comment.replies.slice(0, 2)
                ).map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <a
                        href={`/author/${reply.user.id}`}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        {reply.user.avatar ? (
                          <img
                            src={reply.user.avatar}
                            alt={reply.user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium text-sm">
                            {reply.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </a>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={`/author/${reply.user.id}`}
                          className="font-medium text-foreground hover:text-google-blue transition-colors text-sm"
                        >
                          {reply.user.username}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tag Icon Component
function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );
}
