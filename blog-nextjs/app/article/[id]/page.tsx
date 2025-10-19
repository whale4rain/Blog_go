// ============================================================================
// Article Detail Page - Full Article View with Comments
// ============================================================================

import React from "react";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/api/article";
import { getCommentList } from "@/lib/api/comment";
import Header from "@/components/layout/Header";
import ArticleClient from "@/components/articles/ArticleClient";
import type { Article, Comment } from "@/types";

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articleId = parseInt(params.id);

  if (isNaN(articleId)) {
    notFound();
  }

  // Fetch article data
  let article: Article | null = null;
  let comments: Comment[] = [];

  try {
    article = await getArticleById(articleId);
    const commentsData = await getCommentList({
      article_id: articleId,
      page: 1,
      page_size: 50,
    });
    comments = commentsData.list || [];
  } catch (error) {
    console.error("Failed to fetch article:", error);
    notFound();
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Article Container */}
      <article className="container-custom py-12">
        <div className="flex gap-8 max-w-7xl mx-auto">
          <ArticleClient article={article} comments={comments} />
        </div>
      </article>
    </div>
  );
}

// ============================================================================
// Metadata Generation
// ============================================================================

export async function generateMetadata({ params }: ArticlePageProps) {
  const articleId = parseInt(params.id);

  if (isNaN(articleId)) {
    return {
      title: "Article Not Found",
    };
  }

  try {
    const article = await getArticleById(articleId);

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    return {
      title: article.title,
      description: article.abstract,
      keywords: article.tags.join(", "),
      openGraph: {
        title: article.title,
        description: article.abstract,
        type: "article",
        publishedTime: article.created_at,
        authors: [article.author.username],
        tags: article.tags,
      },
    };
  } catch (error) {
    return {
      title: "Article Not Found",
    };
  }
}
