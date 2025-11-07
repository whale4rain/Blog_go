// ============================================================================
// Auth Fix Page - Clear and Reinitialize Authentication State
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { clearAuth } from "@/lib/api/client";
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

export default function FixAuthPage() {
  const router = useRouter();
  const { logout, login, user, isAuthenticated, isAdmin, isInitialized } = useUserStore();
  const [isFixing, setIsFixing] = useState(false);
  const [fixMessage, setFixMessage] = useState<string>("");
  const [fixStatus, setFixStatus] = useState<"idle" | "success" | "error">("idle");

  // Get current localStorage state for debugging
  const getLocalStorageInfo = () => {
    if (typeof window === "undefined") return {};

    return {
      hasAccessToken: !!localStorage.getItem("access_token"),
      hasUser: !!localStorage.getItem("user-auth-storage"),
      userAuthStorage: localStorage.getItem("user-auth-storage"),
      allKeys: Object.keys(localStorage),
    };
  };

  // Get current cookie state for debugging
  const getCookieInfo = () => {
    if (typeof document === "undefined") return {};

    const cookies = document.cookie.split(";").reduce((acc: any, cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name) acc[name] = decodeURIComponent(value || "");
      return acc;
    }, {});

    return {
      hasRefreshToken: !!cookies["x-refresh-token"],
      refreshTokenLength: cookies["x-refresh-token"]?.length || 0,
      allCookies: Object.keys(cookies),
    };
  };

  // Complete authentication reset
  const performAuthReset = async () => {
    setIsFixing(true);
    setFixMessage("Starting authentication reset...");
    setFixStatus("idle");

    try {
      // Step 1: Clear all local storage
      setFixMessage("Clearing local storage...");
      if (typeof window !== "undefined") {
        // Clear all auth-related keys
        const keysToRemove = [
          "access_token",
          "refresh_token", // Old key that might exist
          "user",
          "user-auth-storage",
        ];

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });

        // Also clear any other auth-related keys
        Object.keys(localStorage).forEach(key => {
          if (key.includes("token") || key.includes("auth") || key.includes("user")) {
            localStorage.removeItem(key);
          }
        });
      }

      // Step 2: Use store logout to clear state
      setFixMessage("Clearing user store state...");
      logout();

      // Step 3: Clear auth using utility function
      setFixMessage("Clearing authentication data...");
      clearAuth();

      // Step 4: Wait a moment for state to settle
      setFixMessage("Finalizing cleanup...");
      await new Promise(resolve => setTimeout(resolve, 100));

      setFixMessage("✅ Authentication state successfully reset!");
      setFixStatus("success");

      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("Auth reset error:", error);
      setFixMessage(`❌ Error during reset: ${error instanceof Error ? error.message : "Unknown error"}`);
      setFixStatus("error");
    } finally {
      setIsFixing(false);
    }
  };

  // Fix admin role specifically
  const fixAdminRole = async () => {
    if (!user || user.role_id !== 2) {
      setFixMessage("❌ Current user is not an admin (role_id ≠ 2)");
      setFixStatus("error");
      return;
    }

    setIsFixing(true);
    setFixMessage("Fixing admin role detection...");

    try {
      // Force update the admin state in the store
      const store = useUserStore.getState();

      // Re-initialize with correct admin flag
      store.setState({
        ...store,
        isAdmin: true,
        isInitialized: true,
      });

      setFixMessage("✅ Admin role detection fixed!");
      setFixStatus("success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Admin role fix error:", error);
      setFixMessage(`❌ Error fixing admin role: ${error instanceof Error ? error.message : "Unknown error"}`);
      setFixStatus("error");
    } finally {
      setIsFixing(false);
    }
  };

  const localStorageInfo = getLocalStorageInfo();
  const cookieInfo = getCookieInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-red-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Authentication Fix
          </h1>
          <p className="text-gray-600">
            Fix authentication state issues and admin role detection
          </p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Store Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Store Status
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Initialized:</span>
                <span className={isInitialized ? "text-green-600" : "text-red-600"}>
                  {isInitialized ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authenticated:</span>
                <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {isAuthenticated ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <span className={isAdmin ? "text-green-600" : "text-red-600"}>
                  {isAdmin ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Has User:</span>
                <span className={user ? "text-green-600" : "text-red-600"}>
                  {user ? "✓" : "✗"}
                </span>
              </div>
              {user && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p>User ID: {user.id}</p>
                  <p>Username: {user.username}</p>
                  <p>Role ID: {user.role_id} ({user.role_id === 2 ? "Admin" : user.role_id === 1 ? "User" : "Guest"})</p>
                  <p>Email: {user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Storage Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Storage Status</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">localStorage</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Access Token:</span>
                    <span className={localStorageInfo.hasAccessToken ? "text-green-600" : "text-red-600"}>
                      {localStorageInfo.hasAccessToken ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Storage:</span>
                    <span className={localStorageInfo.hasUser ? "text-green-600" : "text-red-600"}>
                      {localStorageInfo.hasUser ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Keys: {localStorageInfo.allKeys.join(", ")}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Cookies</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Refresh Token:</span>
                    <span className={cookieInfo.hasRefreshToken ? "text-green-600" : "text-red-600"}>
                      {cookieInfo.hasRefreshToken ? "✓" : "✗"}
                    </span>
                  </div>
                  {cookieInfo.hasRefreshToken && (
                    <div className="text-xs text-gray-500">
                      Length: {cookieInfo.refreshTokenLength} chars
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Cookies: {cookieInfo.allCookies.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fix Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Fix Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={performAuthReset}
              disabled={isFixing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${isFixing ? "animate-spin" : ""}`} />
              {isFixing ? "Resetting..." : "Complete Reset"}
            </button>

            {user && user.role_id === 2 && !isAdmin && (
              <button
                onClick={fixAdminRole}
                disabled={isFixing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${isFixing ? "animate-spin" : ""}`} />
                {isFixing ? "Fixing..." : "Fix Admin Role"}
              </button>
            )}
          </div>
        </div>

        {/* Fix Status */}
        {fixMessage && (
          <div className={`rounded-xl p-6 mb-8 ${
            fixStatus === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : fixStatus === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center gap-3">
              {fixStatus === "success" && <CheckCircle className="w-6 h-6 text-green-600" />}
              {fixStatus === "error" && <AlertTriangle className="w-6 h-6 text-red-600" />}
              <div>
                <p className="font-medium">
                  {fixStatus === "success" ? "Success" : fixStatus === "error" ? "Error" : "Processing"}
                </p>
                <p className="text-sm mt-1">{fixMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            📋 When to Use This Tool
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>
              <strong>Complete Reset:</strong> Use when authentication is completely broken,
              state is inconsistent, or you want to start fresh.
            </li>
            <li>
              <strong>Fix Admin Role:</strong> Use when you have admin credentials (role_id = 2)
              but the UI doesn't recognize you as an admin.
            </li>
            <li>
              <strong>After Reset:</strong> You'll be redirected to login page.
              Log in again to reinitialize your session properly.
            </li>
          </ul>
        </div>

        {/* Manual Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            🔧 Manual Troubleshooting
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>If issues persist:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Clear browser cookies and cache</li>
              <li>Open Developer Tools → Application → Storage → Clear Site Data</li>
              <li>Restart browser</li>
              <li>Try a different browser or incognito mode</li>
              <li>Check browser console for JavaScript errors</li>
              <li>Verify backend server is running on port 8080</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
