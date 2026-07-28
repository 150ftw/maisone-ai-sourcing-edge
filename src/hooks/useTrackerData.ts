// src/hooks/useTrackerData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  TrackerClient,
  TrackerFactory,
  TrackerAgent,
  TrackerEnquiry,
  TrackerCommunicationLog,
  getTrackerClients,
  saveTrackerClients,
  getTrackerFactories,
  saveTrackerFactories,
  getTrackerAgents,
  saveTrackerAgents,
  getTrackerEnquiries,
  saveTrackerEnquiries,
  getTrackerCommunicationLogs,
  saveTrackerCommunicationLogs
} from "@/lib/tracker-store";

// Query Keys
export const TRACKER_QUERY_KEYS = {
  CLIENTS: ["tracker", "clients"],
  FACTORIES: ["tracker", "factories"],
  AGENTS: ["tracker", "agents"],
  ENQUIRIES: ["tracker", "enquiries"],
  LOGS: ["tracker", "logs"],
};

// 1. Fetch Clients Hook
export function useTrackerClients() {
  return useQuery<TrackerClient[]>({
    queryKey: TRACKER_QUERY_KEYS.CLIENTS,
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("tracker_clients").select("*");
        if (error || !data) throw error || new Error("No data returned");
        saveTrackerClients(data as TrackerClient[]);
        return data as TrackerClient[];
      } catch (err) {
        console.warn("Supabase fetch failed for tracker_clients, using local fallback:", err);
        return getTrackerClients();
      }
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

// 2. Fetch Factories Hook (maps suppliers table to TrackerFactory)
export function useTrackerFactories() {
  return useQuery<TrackerFactory[]>({
    queryKey: TRACKER_QUERY_KEYS.FACTORIES,
    queryFn: async () => {
      try {
        const { data: dbFactories, error } = await supabase.from("suppliers").select("*");
        if (error || !dbFactories) throw error || new Error("No suppliers data");
        const mapped: TrackerFactory[] = dbFactories.map((db: any) => {
          let contactPersonStr = db.owner_details || db.contact_person || "Unknown";
          if (typeof contactPersonStr === "string" && contactPersonStr.startsWith("{")) {
            try {
              const parsed = JSON.parse(contactPersonStr);
              contactPersonStr = parsed.owner || "Unknown";
            } catch (e) {}
          }
          return {
            id: db.id,
            created_at: db.created_at,
            factory_name: db.name || "Unknown",
            category: db.category || "General",
            location: `${db.city || ""}, ${db.region || ""}`.replace(/^, |^,/g, ""),
            contact_person: contactPersonStr,
            email: db.email_id || db.email || "",
            whatsapp: db.contact_no || "",
            lead_time: db.lead_time?.toString() || "30-45 Days",
            quality_rating: parseFloat(db.rating) || 4.5
          };
        });
        saveTrackerFactories(mapped);
        return mapped;
      } catch (err) {
        console.warn("Supabase fetch failed for factories, using local fallback:", err);
        return getTrackerFactories();
      }
    },
    staleTime: 1000 * 30,
  });
}

// 3. Fetch Agents Hook
export function useTrackerAgents() {
  return useQuery<TrackerAgent[]>({
    queryKey: TRACKER_QUERY_KEYS.AGENTS,
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("tracker_agents").select("*");
        if (error || !data) throw error;
        saveTrackerAgents(data as TrackerAgent[]);
        return data as TrackerAgent[];
      } catch (err) {
        console.warn("Supabase fetch failed for tracker_agents, using local fallback:", err);
        return getTrackerAgents();
      }
    },
    staleTime: 1000 * 30,
  });
}

// 4. Fetch Enquiries with Assembled Stages & History
export function useTrackerEnquiries() {
  return useQuery<TrackerEnquiry[]>({
    queryKey: TRACKER_QUERY_KEYS.ENQUIRIES,
    queryFn: async () => {
      try {
        const { data: dbEnquiries, error: enqsError } = await supabase
          .from("tracker_enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (enqsError || !dbEnquiries) throw enqsError || new Error("Failed to fetch enquiries");

        const { data: dbStages } = await supabase
          .from("tracker_enquiry_stages")
          .select("*")
          .order("created_at", { ascending: false });

        const assembled: TrackerEnquiry[] = dbEnquiries.map((e: any) => {
          const stagesForEnq = (dbStages || []).filter((s: any) => s.enquiry_id === e.id);

          const stage_data: Record<number, any> = {};
          [...stagesForEnq]
            .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
            .forEach((s: any) => {
              stage_data[s.stage_number] = {
                ...(s.stage_data || {}),
                status: s.status,
                notes: s.notes,
                updated_at: s.created_at
              };
            });

          const history = stagesForEnq.map((s: any) => ({
            id: s.id,
            enquiry_id: s.enquiry_id,
            stage_number: s.stage_number,
            stage_name: s.stage_name,
            status: s.status,
            stage_data: s.stage_data,
            notes: s.notes,
            updated_by: s.updated_by || "Admin User",
            created_at: s.created_at
          }));

          return {
            ...e,
            stage_data,
            history
          };
        });

        saveTrackerEnquiries(assembled);
        return assembled;
      } catch (err) {
        console.warn("Supabase fetch failed for tracker_enquiries, using local fallback:", err);
        return getTrackerEnquiries();
      }
    },
    staleTime: 1000 * 15, // 15 seconds
  });
}

// 5. Fetch Communication Logs
export function useTrackerLogs() {
  return useQuery<TrackerCommunicationLog[]>({
    queryKey: TRACKER_QUERY_KEYS.LOGS,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tracker_communication_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data) throw error;
        saveTrackerCommunicationLogs(data as TrackerCommunicationLog[]);
        return data as TrackerCommunicationLog[];
      } catch (err) {
        console.warn("Supabase fetch failed for logs, using local fallback:", err);
        return getTrackerCommunicationLogs();
      }
    },
    staleTime: 1000 * 30,
  });
}

// === MUTATIONS ===

// Save/Upsert Client Mutation
export function useSaveClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (client: TrackerClient) => {
      try {
        const { error } = await supabase.from("tracker_clients").upsert(client);
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase client upsert error, saved locally:", err);
      }
      // Update fallback local store
      const current = getTrackerClients();
      const exists = current.some((c) => c.id === client.id);
      const updated = exists ? current.map((c) => (c.id === client.id ? client : c)) : [client, ...current];
      saveTrackerClients(updated);
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.CLIENTS });
    },
  });
}

// Update Stage Mutation
export function useUpdateStageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      enquiryId,
      stageNumber,
      stageName,
      status,
      stageData,
      notes,
      updatedBy = "Admin User"
    }: {
      enquiryId: string;
      stageNumber: number;
      stageName: string;
      status: string;
      stageData: Record<string, any>;
      notes: string;
      updatedBy?: string;
    }) => {
      // 1. Insert stage record into Supabase
      try {
        const { error: stageErr } = await supabase.from("tracker_enquiry_stages").insert([{
          enquiry_id: enquiryId,
          stage_number: stageNumber,
          stage_name: stageName,
          status,
          stage_data: stageData,
          notes,
          updated_by: updatedBy
        }]);
        if (stageErr) console.warn("Supabase stage insert warning:", stageErr);

        // 2. Update enquiry current stage & status
        const { error: enqErr } = await supabase
          .from("tracker_enquiries")
          .update({
            current_stage: stageNumber,
            current_status: status,
            updated_at: new Date().toISOString()
          })
          .eq("id", enquiryId);
        if (enqErr) console.warn("Supabase enquiry update warning:", enqErr);
      } catch (err) {
        console.warn("Stage update Supabase call failed, executing local fallback:", err);
      }

      // Update local storage cache fallback
      const enquiries = getTrackerEnquiries();
      const updatedEnquiries = enquiries.map((e) => {
        if (e.id === enquiryId) {
          const currentStageData = e.stage_data || {};
          const newStageRecord = {
            ...stageData,
            status,
            notes,
            updated_at: new Date().toISOString()
          };
          const newHistoryItem = {
            id: `s-${Date.now()}`,
            enquiry_id: enquiryId,
            stage_number: stageNumber as any,
            stage_name: stageName,
            status,
            stage_data: stageData,
            notes,
            updated_by: updatedBy,
            created_at: new Date().toISOString()
          };
          return {
            ...e,
            current_stage: stageNumber as any,
            current_status: status,
            updated_at: new Date().toISOString(),
            stage_data: {
              ...currentStageData,
              [stageNumber]: newStageRecord
            },
            history: [newHistoryItem, ...(e.history || [])]
          };
        }
        return e;
      });
      saveTrackerEnquiries(updatedEnquiries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
    },
  });
}

// Save New Enquiry Mutation
export function useCreateEnquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEnq: TrackerEnquiry) => {
      try {
        const { error } = await supabase.from("tracker_enquiries").insert([{
          id: newEnq.id,
          enquiry_number: newEnq.enquiry_number,
          client_id: newEnq.client_id,
          client_name: newEnq.client_name,
          country: newEnq.country,
          product_reference: newEnq.product_reference,
          communication_channel: newEnq.communication_channel,
          enquiry_details: newEnq.enquiry_details,
          fabric_details: newEnq.fabric_details,
          images: newEnq.images,
          target_price: newEnq.target_price,
          currency: newEnq.currency,
          agent_id: newEnq.agent_id,
          agent_name: newEnq.agent_name,
          current_stage: newEnq.current_stage,
          current_status: newEnq.current_status
        }]);

        if (error) console.warn("Supabase enquiry insert warning:", error);

        // Also insert initial stage 1 record
        await supabase.from("tracker_enquiry_stages").insert([{
          enquiry_id: newEnq.id,
          stage_number: 1,
          stage_name: "Enquiry Received",
          status: newEnq.current_status,
          stage_data: {},
          notes: "Initial enquiry created.",
          updated_by: "Admin User"
        }]);
      } catch (err) {
        console.warn("Supabase enquiry insert error:", err);
      }

      // Update LocalStorage fallback
      const enquiries = getTrackerEnquiries();
      const updated = [newEnq, ...enquiries];
      saveTrackerEnquiries(updated);
      return newEnq;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
    },
  });
}

// Save Communication Log Mutation
export function useAddCommunicationLogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log: TrackerCommunicationLog) => {
      try {
        const { error } = await supabase.from("tracker_communication_logs").insert([log]);
        if (error) console.warn("Supabase log insert warning:", error);
      } catch (err) {
        console.warn("Supabase log insert error:", err);
      }
      const logs = getTrackerCommunicationLogs();
      const updated = [log, ...logs];
      saveTrackerCommunicationLogs(updated);
      return log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.LOGS });
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.ENQUIRIES });
    },
  });
}

// Delete Client Mutation
export function useDeleteClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("tracker_clients").delete().eq("id", id);
        if (error) console.warn("Supabase delete client warning:", error);
      } catch (err) {
        console.warn("Supabase delete client error:", err);
      }
      const current = getTrackerClients();
      const updated = current.filter((c) => c.id !== id);
      saveTrackerClients(updated);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRACKER_QUERY_KEYS.CLIENTS });
    },
  });
}
