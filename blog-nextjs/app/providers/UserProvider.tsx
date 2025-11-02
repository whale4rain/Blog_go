// ============================================================================
// User Provider - Proper Authentication Initialization
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/userStore";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      try {
        // Wait a bit to ensure localStorage is available
        await new Promise((resolve) => setTimeout(resolve, 0));
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  // Show loading state while initializing
  if (!isReady || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-3 border-google-blue border-t-transparent rounded-full" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
