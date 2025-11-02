// ============================================================================
// Auth Debug Component - Development Only
// ============================================================================

"use client";

import React from "react";
import { useAuth } from "@/lib/store/userStore";

/**
 * Authentication Debug Component
 *
 * This component displays real-time authentication state information
 * for debugging purposes. It only appears in development mode.
 */
export function AuthDebug() {
  const authState = useAuth();

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const getStorageInfo = () => {
    try {
      const storage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          storage[key] = value ? `${value.substring(0, 20)}...` : "null";
        }
      }
      return storage;
    } catch (error) {
      const errorStorage: Record<string, string> = {};
      errorStorage.error = "Failed to read localStorage";
      return errorStorage;
    }
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-md backdrop-blur-sm">
      <div className="mb-3 text-yellow-400 font-bold border-b border-yellow-400/30 pb-2">
        🐛 Auth Debug Info
      </div>

      {/* Authentication Status */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-300">Initialized:</span>
          <span
            className={
              authState.isInitialized ? "text-green-400" : "text-red-400"
            }
          >
            {authState.isInitialized ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Authenticated:</span>
          <span
            className={
              authState.isAuthenticated ? "text-green-400" : "text-red-400"
            }
          >
            {authState.isAuthenticated ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Can Access Dashboard:</span>
          <span
            className={
              authState.canAccessDashboard ? "text-green-400" : "text-red-400"
            }
          >
            {authState.canAccessDashboard ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Is Admin:</span>
          <span
            className={authState.isAdmin ? "text-green-400" : "text-gray-400"}
          >
            {authState.isAdmin ? "✅ Yes" : "❌ No"}
          </span>
        </div>
      </div>

      {/* User Information */}
      <div className="space-y-1 mb-3 border-t border-gray-600 pt-2">
        <div className="text-gray-300 mb-1">User Info:</div>
        <div className="ml-2">
          <div>Username: {authState.user?.username || "None"}</div>
          <div>Email: {authState.user?.email || "None"}</div>
          <div>ID: {authState.user?.id || "None"}</div>
          <div>Role: {authState.user?.role || "None"}</div>
        </div>
      </div>

      {/* Token Information */}
      <div className="space-y-1 mb-3 border-t border-gray-600 pt-2">
        <div className="text-gray-300 mb-1">Tokens:</div>
        <div className="ml-2">
          <div>Access Token: {authState.token ? "Present" : "None"}</div>
          <div>
            Refresh Token: {authState.refreshToken ? "Present" : "None"}
          </div>
        </div>
      </div>

      {/* localStorage Information */}
      <div className="space-y-1 mb-3 border-t border-gray-600 pt-2">
        <div className="text-gray-300 mb-1">localStorage:</div>
        <div className="ml-2 text-xs">
          {Object.entries(storageInfo).map(([key, value]) => (
            <div key={key} className="text-gray-400">
              {key}: {value}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t border-gray-600 pt-2">
        <button
          onClick={handleRefreshPage}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          🔄 Refresh
        </button>
        <button
          onClick={handleClearStorage}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
        >
          🗑️ Clear Storage
        </button>
      </div>

      {/* Timestamp */}
      <div className="text-gray-500 text-xs mt-2 border-t border-gray-600 pt-2">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
