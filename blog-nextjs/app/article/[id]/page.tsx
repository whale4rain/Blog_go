// ============================================================================
// Article Detail Page - Full Article View with Comments (Client-side Rendering)
// ============================================================================

"use client";

import ArticleClient from "@/components/articles/ArticleClient";
import Header from "@/components/layout/Header";
import { getArticleById } from "@/lib/api/article";
import { getCommentList } from "@/lib/api/comment";
import type { Article, Comment } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Loading Component
// ----------------------------------------------------------------------------

function ArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Page Component
// ----------------------------------------------------------------------------

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid article ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch article data
        const articleData = await getArticleById(params.id);

        // Transform the data to match the expected Article interface
        const transformedArticle: Article = {
          id: params.id,
          cover: articleData.cover,
          title: articleData.title,
          category: articleData.category,
          tags: articleData.tags,
          abstract: articleData.abstract,
          content: articleData.content || "",
          author: {
            id: 0,
            uuid: "",
            username: "whale",
            email: "",
            role_id: 1,
            status: 1,
            created_at: articleData.created_at,
            updated_at: articleData.updated_at || articleData.created_at,
          },
          author_id: 0,
          view_count: articleData.view_count || 0,
          like_count: articleData.like_count || 0,
          comment_count: articleData.comment_count || 0,
          status: 1,
          is_top: false,
          created_at: articleData.created_at,
          updated_at: articleData.updated_at || articleData.created_at,
        };

        setArticle(transformedArticle);

        // Fetch comments
        await fetchComments(params.id);
      } catch (err) {
        console.error("Failed to fetch article or comments:", err);
        setError(
          "Failed to load article. The article may not exist or has been removed.",
        );

        // Redirect to 404 after a short delay
        setTimeout(() => {
          router.push("/404");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router]);

  const fetchComments = async (articleId: string) => {
    try {
      const commentsData = await getCommentList({
        article_id: articleId,
        page: 1,
        page_size: 50,
      });
      setComments(commentsData.list || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Show loading state
  if (loading) {
    return <ArticleLoading />;
  }

  // Show error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              {error ||
                "The article you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-google-blue/90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show article content
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Article Container */}
      <article className="w-full py-12">
        <div className="w-full px-6 lg:px-8">
          <ArticleClient
            article={article}
            comments={comments}
            onCommentAdded={() => fetchComments(article.id)}
          />
        </div>
      </article>
    </div>
  );
}
