// src/hooks/useRealtimeTracker.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TRACKER_QUERY_KEYS } from "./useTrackerData";

export function useRealtimeTracker() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to Postgres changes on tracker platform tables
    const channel = supabase
      .channel("realtime_tracker_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracker_enquiries" },
        (payload) => {
          console.log("[Realtime] tracker_enquiries change received:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracker_enquiry_stages" },
        (payload) => {
          console.log("[Realtime] tracker_enquiry_stages change received:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracker_clients" },
        (payload) => {
          console.log("[Realtime] tracker_clients change received:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.CLIENTS });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "suppliers" },
        (payload) => {
          console.log("[Realtime] suppliers change received:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.FACTORIES });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracker_communication_logs" },
        (payload) => {
          console.log("[Realtime] tracker_communication_logs change received:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.LOGS });
          queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Realtime] Successfully subscribed to ERP tracker tables WebSocket feed.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
