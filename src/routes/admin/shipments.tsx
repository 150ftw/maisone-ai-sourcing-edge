import { createFileRoute } from "@tanstack/react-router";
import { ShipmentsWrapper } from "../admin";

export const Route = createFileRoute("/admin/shipments")({
  component: ShipmentsRoute,
});

function ShipmentsRoute() {
  return <ShipmentsWrapper />;
}
