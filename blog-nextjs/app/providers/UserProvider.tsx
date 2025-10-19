// ============================================================================
// User Provider - Initialize User State on App Load
// ============================================================================

"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeUser } = useUserStore();

  useEffect(() => {
    // Initialize user state from localStorage on app load
    initializeUser();
  }, [initializeUser]);

  return <>{children}</>;
}
