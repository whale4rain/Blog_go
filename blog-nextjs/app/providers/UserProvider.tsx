// ============================================================================
// User Provider - Initialize User State on App Load
// ============================================================================

"use client";

import { checkRefreshTokenCookie, setupCookieMonitor } from "@/lib/debug/cookieDebug";
import { useUserStore } from "@/lib/store/userStore";
import React, { useEffect } from "react";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeUser } = useUserStore();

  useEffect(() => {
    // Initialize user state from localStorage on app load
    // Note: Zustand persist middleware already auto-restores state from localStorage
    // This is a fallback to ensure backward compatibility and handle edge cases
    initializeUser();

    // Temporary debug: Monitor cookies
    setupCookieMonitor();
    checkRefreshTokenCookie();
  }, []); // Empty deps - only run once on mount

  return <>{children}</>;
}
