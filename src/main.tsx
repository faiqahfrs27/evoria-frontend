import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./index.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useAuth } from "./stores/useAuth";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Payment from "./pages/Payment";
import Dashboard from "./pages/dashboard/Dashboard";

const queryClient = new QueryClient();

function OrganizerRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "ORGANIZER") return <Navigate to="/" />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/events/:slug",
    element: <EventDetail />,
  },
  {
    path: "/transactions/:transactionId/payment",
    element: <Payment />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register/organizer",
    element: <Register role="ORGANIZER" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <OrganizerRoute>
        <Dashboard />
      </OrganizerRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview" },
      { path: "events" },
      { path: "create-event" },
      { path: "transactions" },
      { path: "manual-payments" },
      { path: "attendees" },
      { path: "vouchers" },
      { path: "create-voucher" },
      { path: "profile" },
      { path: "change-password" },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
