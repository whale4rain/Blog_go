// ============================================================================
// Hydration Test Page
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/userStore";

export default function HydrationTestPage() {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hydration Test
          </h1>
          <p className="text-muted-foreground">
            Test to verify hydration issues are resolved
          </p>
        </div>

        <div className="space-y-6">
          {/* Status Display */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div className="space-y-2">
              <div>Mounted: {mounted ? "✅ Yes" : "❌ No"}</div>
              <div>Initialized: {isInitialized ? "✅ Yes" : "❌ No"}</div>
              <div>Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</div>
              <div>Username: {user?.username || "None"}</div>
            </div>
          </div>

          {/* Client vs Server Check */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">
              Client vs Server Render Check
            </h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Client-side Time: </span>
                {typeof window !== "undefined" ? new Date().toISOString() : "SSR"}
              </div>
              <div>
                <span className="font-medium">Random Number: </span>
                {mounted ? Math.random() : "SSR"}
              </div>
              <div>
                <span className="font-medium">User Agent: </span>
                {mounted
                  ? navigator.userAgent.substring(0, 50) + "..."
                  : "SSR"}
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              {mounted ? (
                <div className="text-green-600">
                  ✅ Hydration successful - No mismatch detected
                </div>
              ) : (
                <div className="text-yellow-600">
                  ⏳ Waiting for client-side hydration...
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-4">
                If you see this message without any hydration errors, the
                hydration issue has been resolved.
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Check browser console for hydration errors
              </li>
              <li>
                Refresh the page to test hydration again
              </li>
              <li>
                The random number should change on each refresh
              </li>
              <li>
                Client-side information should appear after mounting
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
