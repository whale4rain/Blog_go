// ============================================================================
// Home Page - Main Blog Landing Page
// ============================================================================

"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  getCategoryStats,
  getTagStats,
  searchArticles,
} from "@/lib/api/article";
import type { ArticleSource, CategoryStat, Hit, TagStat } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

export default function HomePage() {
  // State
  const [articles, setArticles] = useState<Hit<ArticleSource>[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [tags, setTags] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, categoriesResponse, tagsResponse] =
          await Promise.all([
            searchArticles({ 
              page: 1, 
              page_size: 12,
              sort: "time",
              order: "desc"
            }),
            getCategoryStats(),
            getTagStats(),
          ]);

        // Handle Elasticsearch Hit response format
        setArticles(articlesResponse.list || []);
        setCategories(categoriesResponse || []);
        const tagsData = tagsResponse || [];
        setTags(Array.isArray(tagsData) ? tagsData.slice(0, 20) : []);
      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-google-blue/5 via-white/5 to-blue-50/5 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to <span className="text-gradient">whale4blog</span>
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="card p-6">
                    <div className="skeleton h-48 mb-4 rounded-lg" />
                    <div className="skeleton h-6 w-3/4 mb-2" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
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

function ArticleCard({ article }: { article: Hit<ArticleSource> }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const source = article._source;

  return (
    <Link
      href={`/article/${article._id}`}
      className="card-hover overflow-hidden flex flex-col group"
    >
      {/* Cover Image */}
      {source.cover && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={source.cover}
            alt={source.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <span className="badge-blue">{source.category}</span>
          <span>{formatDate(source.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-google-blue transition-colors line-clamp-2">
          {source.title}
        </h3>

        {/* Abstract */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {source.abstract}
        </p>

        {/* Tags */}
        {source.tags && source.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {source.tags.slice(0, 3).map((tag) => (
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
              {source.views}
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
              {source.likes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
