// ============================================================================
// Search & Archive Page - Article Search with Filters
// ============================================================================

"use client";

import Header from "@/components/layout/Header";
import {
    getCategoryStats,
    getTagStats,
    searchArticles,
} from "@/lib/api/article";
import type { ArticleSource, CategoryStat, Hit, TagStat } from "@/types";
import {
    Filter,
    Folder,
    Search,
    Tag as TagIcon,
    X
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Search Page Component
// ----------------------------------------------------------------------------

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [articles, setArticles] = useState<Hit<ArticleSource>[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [tags, setTags] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [sortBy, setSortBy] = useState<
    "time" | "view" | "comment" | "like" | ""
  >((searchParams.get("sort") as any) || "time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as any) || "desc",
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [
    searchQuery,
    selectedCategory,
    selectedTag,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        getCategoryStats(),
        getTagStats(),
      ]);
      setCategories(categoriesData || []);
      setTags(tagsData?.slice(0, 30) || []);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await searchArticles({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        sort: sortBy || undefined,
        order: sortOrder,
        page: currentPage,
        page_size: 12,
      });

      setArticles(result.list || []);
      setTotalResults(result.total || 0);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setArticles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTag) params.set("tag", selectedTag);
    if (sortBy !== "time") params.set("sort", sortBy);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setSortBy("time");
    setSortOrder("desc");
    setCurrentPage(1);
    router.push("/search");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  const totalPages = Math.ceil(totalResults / 12);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-custom py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Search & Archive
          </h1>
          <p className="text-lg text-muted-foreground">
            Find articles by keyword, category, or tag
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full h-12 pl-12 pr-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 h-12 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 h-12 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="card p-6 mb-8 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => {
                    setSelectedTag(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.name} value={tag.name}>
                      {tag.name} ({tag.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sort By
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    setSortBy(sort as any);
                    setSortOrder(order as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                >
                  <option value="time-desc">Newest First (Default)</option>
                  <option value="time-asc">Oldest First</option>
                  <option value="view-desc">Most Viewed</option>
                  <option value="like-desc">Most Liked</option>
                  <option value="comment-desc">Most Commented</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-google-blue/10 text-google-blue rounded-full text-sm">
                Query: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-google-green/10 text-google-green rounded-full text-sm">
                <Folder className="w-3 h-3" />
                {selectedCategory}
                <button onClick={() => setSelectedCategory("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-google-yellow/10 text-[hsl(45,100%,35%)] rounded-full text-sm">
                <TagIcon className="w-3 h-3" />
                {selectedTag}
                <button onClick={() => setSelectedTag("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-google-red hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? (
              "Searching..."
            ) : (
              <>
                Found{" "}
                <span className="font-semibold text-foreground">
                  {totalResults}
                </span>{" "}
                {totalResults === 1 ? "article" : "articles"}
              </>
            )}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="card p-6">
                <div className="skeleton h-48 mb-4" />
                <div className="skeleton h-6 w-3/4 mb-2" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-google-blue text-white border-google-blue"
                          : "border-border hover:bg-muted"
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
                  className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
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
      {source.cover && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={source.cover}
            alt={source.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <span className="badge-blue">{source.category}</span>
          <span>{formatDate(source.created_at)}</span>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-google-blue transition-colors line-clamp-2">
          {source.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {source.abstract}
        </p>

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

        <div className="flex items-center justify-between pt-4 border-t border-border">
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

// ----------------------------------------------------------------------------
// Main Page Component with Suspense
// ----------------------------------------------------------------------------

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container-custom py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
