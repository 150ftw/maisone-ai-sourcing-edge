import { createFileRoute } from "@tanstack/react-router";
import { OverviewWrapper } from "../admin";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  return <OverviewWrapper />;
}
