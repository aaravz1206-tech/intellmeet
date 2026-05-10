import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-load pages for code-splitting
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const MeetingRoomPage = lazy(() =>
  import("@/pages/MeetingRoomPage").then((m) => ({
    default: m.MeetingRoomPage,
  })),
);
const MeetingHistoryPage = lazy(() =>
  import("@/pages/MeetingHistoryPage").then((m) => ({
    default: m.MeetingHistoryPage,
  })),
);
const WhiteboardPage = lazy(() =>
  import("@/pages/WhiteboardPage").then((m) => ({ default: m.WhiteboardPage })),
);
const RecordingDetailPage = lazy(() =>
  import("@/pages/RecordingDetailPage").then((m) => ({
    default: m.RecordingDetailPage,
  })),
);

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="code-label text-muted-foreground">INITIALISING...</span>
    </div>
  </div>
);

// ─── Route Definitions ───────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const meetingRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meeting/$roomCode",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MeetingRoomPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MeetingHistoryPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const whiteboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/whiteboard/$roomCode",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <WhiteboardPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const recordingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recording/$id",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <RecordingDetailPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  meetingRoomRoute,
  historyRoute,
  whiteboardRoute,
  recordingDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
