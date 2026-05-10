import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps a page to require authentication.
 * Unauthenticated users are redirected to the login page (/).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loginStatus } = useInternetIdentity();

  // While auth state is loading, show a Matrix-style spinner instead of blank page
  if (loginStatus === "idle") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
