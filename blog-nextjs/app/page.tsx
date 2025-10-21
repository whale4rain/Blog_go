// ============================================================================
// Home Page - Main Blog Landing Page
// ============================================================================

import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getArticleList,
  getCategoryStats,
  getTagStats,
} from "@/lib/api/article";
import type { ArticleListItem, CategoryStat, TagStat } from "@/types";

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

export default async function HomePage() {
  // Fetch data on the server
  let articles: ArticleListItem[] = [];
  let categories: CategoryStat[] = [];
  let tags: TagStat[] = [];

  try {
    const [articlesResponse, categoriesResponse, tagsResponse] =
      await Promise.all([
        getArticleList({ page: 1, page_size: 12 }),
        getCategoryStats(),
        getTagStats(),
      ]);

    // Handle response format - mock API returns PaginatedResponse directly
    articles = articlesResponse.list || [];
    categories = categoriesResponse || [];
    const tagsData = tagsResponse || [];
    tags = Array.isArray(tagsData) ? tagsData.slice(0, 20) : [];
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-google-blue/5 via-white/5 to-blue-50/5 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to <span className="text-gradient">Inspiration Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover insightful articles, tutorials, and stories crafted with
              passion
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/search"
                className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
              >
                Explore Articles
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Articles */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Latest Articles
              </h2>
              <p className="text-muted-foreground">Fresh content for you</p>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No articles yet</p>
              </div>
            )}

            {/* Load More */}
            {articles.length >= 12 && (
              <div className="mt-8 text-center">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  View All Articles
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/search?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <span className="text-foreground group-hover:text-google-blue transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Cloud */}
            {tags.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/search?tag=${encodeURIComponent(tag.name)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-full hover:bg-google-blue/10 hover:text-google-blue transition-colors text-sm"
                    >
                      {tag.name}
                      <span className="text-xs text-muted-foreground">
                        ({tag.count})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Article Card Component
// ----------------------------------------------------------------------------

function ArticleCard({ article }: { article: ArticleListItem }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link
      href={`/article/${article.id}`}
      className="card-hover overflow-hidden flex flex-col group"
    >
      {/* Cover Image */}
      {article.cover && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <span className="badge-blue">{article.category}</span>
          <span>{formatDate(article.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-google-blue transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Abstract */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {article.abstract}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {/* Author */}
          <div className="flex items-center gap-2">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-google-blue text-white text-xs flex items-center justify-center">
                {article.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-foreground">
              {article.author.username}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {article.view_count}
            </span>
            <span className="flex items-center gap-1">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {article.like_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
