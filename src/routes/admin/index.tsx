import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  return <Navigate to="/admin/tracker" replace />;
}
