import { createFileRoute } from "@tanstack/react-router";
import { SuppliersWrapper } from "../admin";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersRoute,
});

function SuppliersRoute() {
  return <SuppliersWrapper />;
}
