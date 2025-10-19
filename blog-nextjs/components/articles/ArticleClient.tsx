// ============================================================================
// Article Client Component - Interactive Elements for Article Page
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Share2, X, Calendar, Clock, Eye, Tag } from "lucide-react";
import type { Article, Comment } from "@/types";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

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

  return (
    <>
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
            <span className="badge bg-google-red/10 text-google-red">Top</span>
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
              onClick={() => alert("Comment feature - implement with API call")}
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
    </>
  );
}

// Comment Card Component
function CommentCard({ comment }: { comment: Comment }) {
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

  return (
    <div className="card p-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.user.avatar ? (
            <img
              src={comment.user.avatar}
              alt={comment.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium">
              {comment.user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-foreground">
              {comment.user.username}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatTimeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-foreground leading-relaxed mb-3">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button className="text-muted-foreground hover:text-google-blue transition-colors">
              Reply
            </button>
            <button className="text-muted-foreground hover:text-google-red transition-colors">
              Report
            </button>
          </div>
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
