// ============================================================================
// Authentication Test Page
// ============================================================================

"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store/userStore";
import { AuthDebug } from "@/components/debug/AuthDebug";

export default function TestAuthPage() {
  const { isAuthenticated, isInitialized, user, token } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-3 border-google-blue border-t-transparent rounded-full" />
          <span className="text-muted-foreground">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Authentication Test
          </h1>
          <p className="text-muted-foreground">
            Test authentication state and persistence
          </p>
        </div>

        <div className="space-y-6">
          {/* Auth Status Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span>Initialized:</span>
                <span className={isInitialized ? "text-green-600" : "text-red-600"}>
                  {isInitialized ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Authenticated:</span>
                <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {isAuthenticated ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Has Token:</span>
                <span className={token ? "text-green-600" : "text-red-600"}>
                  {token ? "✅ Yes" : "❌ No"}
                </span>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            {user ? (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Username:</span> {user.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user.role}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {user.status === 1 ? "Active" : "Inactive"}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No user information available</p>
            )}
          </div>

          {/* Test Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/articles"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    If you can access the dashboard after refreshing this page,
                    authentication persistence is working correctly.
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors"
                  >
                    Go to Login
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    Please log in to test authentication persistence.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Check the authentication status above</li>
              <li>If not authenticated, go to login and come back</li>
              <li>Refresh this page (F5 or Ctrl+R)</li>
              <li>Verify that authentication status remains the same</li>
              <li>Check the debug panel in the bottom-right corner</li>
              <li>Try accessing the dashboard link</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <strong>Expected behavior:</strong> After logging in, refreshing the page
              should maintain your authentication state. The debug panel should show
              consistent information across refreshes.
            </div>
          </div>
        </div>
      </div>

      {/* Debug Component */}
      <AuthDebug />
    </div>
  );
}
