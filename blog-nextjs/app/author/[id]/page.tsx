// ============================================================================
// Author Profile Page - Display User Information and Articles
// ============================================================================

import Header from "@/components/layout/Header";
import { getArticleList } from "@/lib/api/article";
import { getUserCard } from "@/lib/api/user";
import type { ArticleListItem, User } from "@/types";
import { notFound } from "next/navigation";

interface AuthorPageProps {
  params: {
    id: string;
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const authorId = parseInt(params.id);

  if (isNaN(authorId)) {
    notFound();
  }

  // Fetch author data
  let author: User | null = null;
  let articles: ArticleListItem[] = [];

  try {
    author = await getUserCard(authorId.toString());

    // Fetch author's articles
    const articlesData = await getArticleList({
      page: 1,
      page_size: 10,
    });

    // Filter articles by this author
    articles = articlesData.list.filter(
      (article) => article.author?.id === authorId,
    );
  } catch (error) {
    console.error("Failed to fetch author data:", error);
    notFound();
  }

  if (!author) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground">Author Profile</span>
        </nav>

        {/* Author Profile Card */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.username}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center font-medium text-2xl md:text-4xl">
                  {author.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {author.username}
              </h1>

              {author.signature && (
                <p className="text-lg text-muted-foreground mb-4">
                  {author.signature}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{author.email}</span>
                </div>

                {author.address && (
                  <div className="flex items-center gap-1">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{author.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Joined {formatDate(author.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    author.role_id === 2
                      ? "bg-google-red/10 text-google-red"
                      : "bg-google-green/10 text-google-green"
                  }`}
                >
                  {author.role_id === 2 ? "Admin" : "User"}
                </span>

                {author.status === 1 ? (
                  <span className="inline-flex items-center px-3 py-1 bg-google-blue/10 text-google-blue rounded-full text-sm font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    Frozen
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-google-blue mb-2">
              {articles.length}
            </div>
            <div className="text-muted-foreground">Articles</div>
          </div>

          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-google-green mb-2">
              {articles.reduce((sum, article) => sum + article.view_count, 0)}
            </div>
            <div className="text-muted-foreground">Total Views</div>
          </div>

          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-google-red mb-2">
              {articles.reduce((sum, article) => sum + article.like_count, 0)}
            </div>
            <div className="text-muted-foreground">Total Likes</div>
          </div>
        </div>

        {/* Author's Articles */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Articles by {author.username}
          </h2>

          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Article Cover */}
                    <div className="flex-shrink-0">
                      <img
                        src={article.cover}
                        alt={article.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="badge-blue">{article.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(article.created_at)}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-google-blue transition-colors">
                        <a href={`/article/${article.id}`}>{article.title}</a>
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.abstract}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          {article.view_count} views
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
                          {article.like_count} likes
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {article.comment_count} comments
                        </span>
                      </div>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-google-yellow/10 text-[hsl(45,100%,35%)] rounded-full text-xs"
                            >
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
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Articles Yet
              </h3>
              <p className="text-muted-foreground">
                {author.username} hasn&apos;t published any articles yet.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
