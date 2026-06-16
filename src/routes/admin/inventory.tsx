import { createFileRoute } from "@tanstack/react-router";
import { InventoryWrapper } from "../admin";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryRoute,
});

function InventoryRoute() {
  return <InventoryWrapper />;
}
