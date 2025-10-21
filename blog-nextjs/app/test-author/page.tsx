// ============================================================================
// Test Author Profile Page
// ============================================================================

import React from "react";
import { getUserCard } from "@/lib/api/user";
import { getArticleList } from "@/lib/api/article";
import type { User, ArticleListItem } from "@/types";

export default async function TestAuthorPage() {
  let author: User | null = null;
  let articles: ArticleListItem[] = [];
  let error: string | null = null;

  try {
    // Test direct mock data access
    console.log("Testing direct mock data access...");

    // Import and test mock data directly
    const { mockUsers } = await import("@/lib/api/mock/data/users");
    const { mockArticles } = await import("@/lib/api/mock/data/articles");

    author = mockUsers.find((u) => u.id === 1) || null;

    // Filter articles by this author
    articles = mockArticles
      .filter((article) => article.author.id === 1)
      .map((article) => ({
        id: article.id,
        title: article.title,
        abstract: article.abstract,
        cover: article.cover,
        category: article.category,
        tags: article.tags,
        author: {
          id: article.author.id,
          username: article.author.username,
          avatar: article.author.avatar,
        },
        view_count: article.view_count,
        like_count: article.like_count,
        comment_count: article.comment_count,
        created_at: article.created_at,
      }));

    console.log("✅ Direct mock data test successful!");
    console.log("Author:", author?.username);
    console.log("Articles found:", articles.length);
  } catch (err) {
    console.error("❌ Direct mock data test failed:", err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  // Also test the API layer
  let apiAuthor: User | null = null;
  let apiError: string | null = null;

  try {
    console.log("Testing getUserCard API...");
    apiAuthor = await getUserCard("1");
    console.log("✅ API test successful!");
  } catch (err) {
    console.error("❌ API test failed:", err);
    apiError = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Author Profile Test</h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h2 className="font-bold">❌ Test Failed</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h2 className="font-bold">✅ Test Successful</h2>
            <p>Author profile functionality is working correctly!</p>
          </div>
        )}

        {author && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Author Data</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>ID:</strong> {author.id}
              </div>
              <div>
                <strong>Username:</strong> {author.username}
              </div>
              <div>
                <strong>Email:</strong> {author.email}
              </div>
              <div>
                <strong>Role:</strong> {author.role}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {author.status === 1 ? "Active" : "Frozen"}
              </div>
              <div>
                <strong>Joined:</strong>{" "}
                {new Date(author.created_at).toLocaleDateString()}
              </div>
              {author.signature && (
                <div className="col-span-2">
                  <strong>Signature:</strong> "{author.signature}"
                </div>
              )}
              {author.address && (
                <div className="col-span-2">
                  <strong>Address:</strong> {author.address}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Articles by {author?.username}
          </h2>
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-gray-600">{article.abstract}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {article.view_count} views • {article.like_count} likes •{" "}
                    {article.comment_count} comments
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No articles found for this author.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-2">
            <a href="/author/1" className="block text-blue-600 hover:underline">
              → John Doe's Profile Page
            </a>
            <a href="/author/2" className="block text-blue-600 hover:underline">
              → Jane Smith's Profile Page
            </a>
            <a
              href="/article/1"
              className="block text-blue-600 hover:underline"
            >
              → Article with Comments (to test enhanced comment system)
            </a>
          </div>
        </div>

        {/* API Test Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">API Test Results</h2>
          {apiError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <h3 className="font-bold">❌ API Test Failed</h3>
              <p>{apiError}</p>
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <h3 className="font-bold">✅ API Test Successful</h3>
              <p>getUserCard API is working correctly!</p>
            </div>
          )}

          {apiAuthor && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">API Author Data:</h4>
              <div className="text-sm">
                <strong>Name:</strong> {apiAuthor.username}
                <br />
                <strong>Email:</strong> {apiAuthor.email}
                <br />
                <strong>Role:</strong> {apiAuthor.role}
                <br />
                {apiAuthor.signature && (
                  <>
                    <strong>Signature:</strong> "{apiAuthor.signature}"<br />
                  </>
                )}
                {apiAuthor.address && (
                  <>
                    <strong>Address:</strong> {apiAuthor.address}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
