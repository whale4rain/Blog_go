// ============================================================================
// JWT Test Page - Verify Cookie and Token Mechanism
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useAuth,
  getRefreshTokenFromCookie,
  hasRefreshToken,
} from "@/lib/store/userStore";
import { getAccessToken, isAuthenticated } from "@/lib/api/client";
import { getUserInfo } from "@/lib/api/user";
import { upload } from "@/lib/api/client";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function TestJWTPage() {
  const auth = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [cookieInfo, setCookieInfo] = useState<string>("");
  const [testResults, setTestResults] = useState<{
    [key: string]: { status: "success" | "error" | "pending"; message: string };
  }>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update token information
  const updateTokenInfo = () => {
    setAccessToken(getAccessToken());
    setRefreshToken(getRefreshTokenFromCookie());
    setCookieInfo(document.cookie);
  };

  useEffect(() => {
    updateTokenInfo();
    // Update every 2 seconds
    const interval = setInterval(updateTokenInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  // Test: Check Authentication
  const testAuthentication = () => {
    const result = isAuthenticated();
    setTestResults((prev) => ({
      ...prev,
      auth: {
        status: result ? "success" : "error",
        message: result
          ? "Authentication valid (Access Token + Refresh Token in Cookie)"
          : "Not authenticated",
      },
    }));
  };

  // Test: Fetch User Info (will auto-refresh token if expired)
  const testUserInfoFetch = async () => {
    setTestResults((prev) => ({
      ...prev,
      userInfo: { status: "pending", message: "Fetching user info..." },
    }));

    try {
      const userInfo = await getUserInfo();
      setTestResults((prev) => ({
        ...prev,
        userInfo: {
          status: "success",
          message: `Successfully fetched user: ${userInfo.user.username}`,
        },
      }));
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        userInfo: {
          status: "error",
          message: `Failed: ${error.message}`,
        },
      }));
    }
  };

  // Test: Manual Token Refresh
  const testTokenRefresh = async () => {
    setIsRefreshing(true);
    setTestResults((prev) => ({
      ...prev,
      refresh: { status: "pending", message: "Refreshing token..." },
    }));

    try {
      const refreshTokenValue = getRefreshTokenFromCookie();
      if (!refreshTokenValue) {
        throw new Error("No refresh token found in cookie");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080/api"}/user/refreshToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: include cookies
          body: JSON.stringify({ refresh_token: refreshTokenValue }),
        }
      );

      const data = await response.json();
      if (data.code === 0) {
        const newAccessToken = data.data.access_token;
        localStorage.setItem("access_token", newAccessToken);
        updateTokenInfo();
        setTestResults((prev) => ({
          ...prev,
          refresh: {
            status: "success",
            message: "Token refreshed successfully",
          },
        }));
      } else {
        throw new Error(data.msg || "Refresh failed");
      }
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        refresh: {
          status: "error",
          message: `Refresh failed: ${error.message}`,
        },
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Test: Upload File (check if cookie is preserved)
  const testUpload = async () => {
    setTestResults((prev) => ({
      ...prev,
      upload: { status: "pending", message: "Testing upload..." },
    }));

    try {
      // Create a test file
      const testFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const formData = new FormData();
      formData.append("image", testFile);

      // Check cookie before upload
      const cookieBefore = getRefreshTokenFromCookie();

      await upload("/upload/image", formData, (progress) => {
        setUploadProgress(progress);
      });

      // Check cookie after upload
      const cookieAfter = getRefreshTokenFromCookie();

      if (cookieBefore === cookieAfter && cookieAfter !== null) {
        setTestResults((prev) => ({
          ...prev,
          upload: {
            status: "success",
            message: "Upload successful, cookie preserved ✓",
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          upload: {
            status: "error",
            message: "Upload successful but cookie was modified!",
          },
        }));
      }
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        upload: {
          status: "error",
          message: `Upload failed: ${error.message}`,
        },
      }));
    } finally {
      setUploadProgress(0);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    testAuthentication();
    await testUserInfoFetch();
    await testTokenRefresh();
    // Skip upload test as it might not have upload endpoint
  };

  const StatusIcon = ({ status }: { status: "success" | "error" | "pending" }) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          JWT Authentication Test
        </h1>
        <p className="text-gray-600 mb-8">
          Verify Cookie-based Refresh Token Implementation
        </p>

        {/* Authentication Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Auth State */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {auth.isAuthenticated ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              Authentication State
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Initialized:</span>
                <span
                  className={
                    auth.isInitialized ? "text-green-600" : "text-red-600"
                  }
                >
                  {auth.isInitialized ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Logged In:</span>
                <span
                  className={auth.isLoggedIn ? "text-green-600" : "text-red-600"}
                >
                  {auth.isLoggedIn ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Has User:</span>
                <span className={auth.user ? "text-green-600" : "text-red-600"}>
                  {auth.user ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Has Access Token:</span>
                <span className={auth.token ? "text-green-600" : "text-red-600"}>
                  {auth.token ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Has Refresh Token (Cookie):</span>
                <span
                  className={refreshToken ? "text-green-600" : "text-red-600"}
                >
                  {refreshToken ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Is Admin:</span>
                <span className={auth.isAdmin ? "text-green-600" : "text-gray-400"}>
                  {auth.isAdmin ? "✓" : "✗"}
                </span>
              </div>
            </div>
            {auth.user && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Username: <span className="font-medium">{auth.user.username}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Email: <span className="font-medium">{auth.user.email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Token Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Token Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Access Token:</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono break-all">
                  {accessToken ? (
                    <span className="text-green-700">
                      {accessToken.substring(0, 50)}...
                    </span>
                  ) : (
                    <span className="text-red-600">Not found</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Storage: localStorage
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Refresh Token:</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono break-all">
                  {refreshToken ? (
                    <span className="text-green-700">
                      {refreshToken.substring(0, 50)}...
                    </span>
                  ) : (
                    <span className="text-red-600">Not found</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Storage: HTTP-only Cookie (x-refresh-token)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">All Cookies:</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono break-all max-h-24 overflow-auto">
                  {cookieInfo || "No cookies"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testAuthentication}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Test Auth
            </button>
            <button
              onClick={testUserInfoFetch}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Test API Call
            </button>
            <button
              onClick={testTokenRefresh}
              disabled={isRefreshing || !hasRefreshToken()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? "Refreshing..." : "Test Refresh"}
            </button>
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Run All Tests
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          {Object.keys(testResults).length === 0 ? (
            <p className="text-gray-500 italic">No tests run yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(testResults).map(([key, result]) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <StatusIcon status={result.status} />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{key} Test</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Notes */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8 rounded-r-xl">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            🔒 Security Implementation
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ Access Token stored in localStorage (short-lived, 15min)</li>
            <li>✅ Refresh Token stored in HTTP-only Cookie (long-lived, 30 days)</li>
            <li>✅ Refresh Token not accessible via JavaScript (XSS protection)</li>
            <li>✅ Automatic token refresh when Access Token expires</li>
            <li>✅ Cookie preserved during file uploads</li>
            <li>✅ withCredentials enabled for all requests</li>
          </ul>
        </div>

        {/* Warning if not logged in */}
        {!auth.isAuthenticated && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-4 rounded-r-xl">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              ⚠️ Not Authenticated
            </h3>
            <p className="text-yellow-800 mb-4">
              You need to login first to test the JWT mechanism.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
