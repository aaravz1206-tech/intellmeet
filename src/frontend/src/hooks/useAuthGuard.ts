import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Redirects unauthenticated users to / and authenticated users away from /.
 * Must be called inside a component rendered within the router.
 */
export function useAuthGuard(options?: { requireAuth?: boolean }) {
  const { isAuthenticated, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const requireAuth = options?.requireAuth ?? true;

  useEffect(() => {
    if (loginStatus === "idle") return; // still loading

    const atLogin = location.pathname === "/";

    if (requireAuth && !isAuthenticated && !atLogin) {
      navigate({ to: "/" });
    } else if (isAuthenticated && atLogin) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, loginStatus, location.pathname, navigate, requireAuth]);

  return { isAuthenticated, loginStatus };
}
