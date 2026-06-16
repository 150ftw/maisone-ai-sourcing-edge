import { createFileRoute } from "@tanstack/react-router";
import { Trends } from "@/components/maisone/Dashboard";

export const Route = createFileRoute("/admin/trends")({
  component: TrendsRoute,
});

function TrendsRoute() {
  return <Trends />;
}
