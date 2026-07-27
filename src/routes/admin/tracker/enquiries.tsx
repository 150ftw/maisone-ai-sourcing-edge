import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, X, ChevronRight, CheckCircle2, Clock, AlertCircle,
  FileText, ArrowRight, MessageSquare, History, User, Building, Truck, DollarSign, ShieldCheck, Lock
} from "lucide-react";
import {
  getTrackerEnquiries,
  saveTrackerEnquiries,
  getTrackerClients,
  getTrackerFactories,
  getTrackerAgents,
  getTrackerCommunicationLogs,
  saveTrackerCommunicationLogs,
  STAGE_NAMES,
  STAGE_STATUS_OPTIONS,
  StageNumber,
  TrackerEnquiry,
  TrackerClient,
  TrackerFactory,
  TrackerAgent,
  TrackerCommunicationLog
} from "@/lib/tracker-store";
import { toast } from "sonner";
import { CustomSelect } from "../../admin";

export const Route = createFileRoute("/admin/tracker/enquiries")({
  component: EnquiriesRoute,
});

export const BLOCKING_STATUSES = [
  "Dropped",
  "No Suitable Factory",
  "Rejected",
  "Failed",
  "Rework Required",
  "Rework",
  "Hold",
  "Lost",
  "Revision Requested"
];

export const isStatusBlocking = (status?: string) => {
  if (!status) return false;
  return BLOCKING_STATUSES.includes(status);
};

export const getUnlockedMaxStage = (enquiry: TrackerEnquiry): StageNumber => {
  let maxUnlocked: StageNumber = 1;

  for (let s = 1; s <= 13; s++) {
    const stageData = enquiry.stage_data?.[s];
    if (stageData) {
      maxUnlocked = s as StageNumber;
      if (isStatusBlocking(stageData.status)) {
        return s as StageNumber;
      }
    } else {
      break;
    }
  }

  const lastStageData = enquiry.stage_data?.[maxUnlocked];
  const lastStageStatus = lastStageData?.status || enquiry.current_status;
  if (!isStatusBlocking(lastStageStatus) && maxUnlocked < 13) {
    return (maxUnlocked + 1) as StageNumber;
  }

  return maxUnlocked as StageNumber;
};

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Approved":
    case "Completed":
    case "Dispatched":
    case "Received":
    case "Paid":
    case "Passed":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "New":
    case "Submitted":
    case "Sourcing":
    case "Costing":
    case "Sampling":
    case "Production":
    case "Development":
    case "In Progress":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "Pending":
    case "Due":
    case "Not Due":
    case "Under Review":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "Rejected":
    case "Failed":
    case "Dropped":
    case "Overdue":
    case "Hold":
    case "Lost":
    case "Rework Required":
    case "Rework":
    case "Revision Requested":
      return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
    default:
      return "bg-secondary text-foreground border-border";
  }
};

export function EnquiriesRoute() {
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [clients, setClients] = useState<TrackerClient[]>([]);
  const [factories, setFactories] = useState<TrackerFactory[]>([]);
  const [agents, setAgents] = useState<TrackerAgent[]>([]);
  const [logs, setLogs] = useState<TrackerCommunicationLog[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedFactory, setSelectedFactory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");

  // Selected Enquiry Drawer State
  const [selectedEnquiry, setSelectedEnquiry] = useState<TrackerEnquiry | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"stages" | "history" | "logs">("stages");

  // Stage editing form state
  const [activeStageNumber, setActiveStageNumber] = useState<StageNumber>(1);
  const [stageFormData, setStageFormData] = useState<Record<string, any>>({});
  const [stageStatus, setStageStatus] = useState("");
  const [stageNotes, setStageNotes] = useState("");

  // New Enquiry Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newEnquiryNumber, setNewEnquiryNumber] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [newProductRef, setNewProductRef] = useState("");
  const [newChannel, setNewChannel] = useState("Email");
  const [newDetails, setNewDetails] = useState("");
  const [newFabric, setNewFabric] = useState("");
  const [newTargetPrice, setNewTargetPrice] = useState("");

  // New Communication Log State inside Drawer
  const [newLogSummary, setNewLogSummary] = useState("");
  const [newLogChannel, setNewLogChannel] = useState<"Email" | "WhatsApp" | "Phone" | "Meeting" | "WeChat">("Email");
  const [newLogDirection, setNewLogDirection] = useState<"Inbound" | "Outbound">("Outbound");

  const loadAllData = () => {
    const enqs = getTrackerEnquiries();
    setEnquiries(enqs);
    setClients(getTrackerClients());
    setFactories(getTrackerFactories());
    setAgents(getTrackerAgents());
    setLogs(getTrackerCommunicationLogs());

    if (selectedEnquiry) {
      const updated = enqs.find(e => e.id === selectedEnquiry.id);
      if (updated) setSelectedEnquiry(updated);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (selectedEnquiry) {
      setActiveStageNumber(selectedEnquiry.current_stage);
      const currentData = selectedEnquiry.stage_data?.[selectedEnquiry.current_stage] || {};
      setStageFormData(currentData);
      setStageStatus(selectedEnquiry.current_status);
      setStageNotes(currentData.notes || "");
    }
  }, [selectedEnquiry]);

  // Open & prep stage form
  const handleSelectStageNumber = (stageNum: StageNumber) => {
    if (!selectedEnquiry) return;
    const maxUnlocked = getUnlockedMaxStage(selectedEnquiry);
    if (stageNum > maxUnlocked) return;

    setActiveStageNumber(stageNum);
    const existing = selectedEnquiry.stage_data?.[stageNum] || {};
    setStageFormData(existing);
    setStageStatus(existing.status || STAGE_STATUS_OPTIONS[stageNum]?.[0] || "New");
    setStageNotes(existing.notes || "");
  };

  // Save stage update & preserve history & advance to next stage if allowed
  const handleSaveStageUpdate = () => {
    if (!selectedEnquiry) return;

    const allEnquiries = [...enquiries];
    const index = allEnquiries.findIndex(e => e.id === selectedEnquiry.id);
    if (index === -1) return;

    const existingEnquiry = allEnquiries[index];

    // Check if factory is selected/shortlisted in stageFormData
    const updatedFactoryName = stageFormData.factory_name || stageFormData.factory || existingEnquiry.factory_name;
    let updatedFactoryId = existingEnquiry.factory_id;
    if (updatedFactoryName) {
      const matchedFac = factories.find(f => f.factory_name === updatedFactoryName);
      if (matchedFac) updatedFactoryId = matchedFac.id;
    }

    const updatedStageData = {
      ...(existingEnquiry.stage_data || {}),
      [activeStageNumber]: {
        ...stageFormData,
        status: stageStatus,
        notes: stageNotes, // STORE AUDIT NOTES IN STAGE DATA
        updated_at: new Date().toISOString()
      }
    };

    const newHistoryRecord = {
      id: `h-${Date.now()}`,
      enquiry_id: existingEnquiry.id,
      stage_number: activeStageNumber,
      stage_name: STAGE_NAMES[activeStageNumber - 1],
      status: stageStatus,
      stage_data: stageFormData,
      notes: stageNotes,
      updated_by: "Admin User",
      created_at: new Date().toISOString()
    };

    const previousStatus = existingEnquiry.stage_data?.[activeStageNumber]?.status || (activeStageNumber === existingEnquiry.current_stage ? existingEnquiry.current_status : undefined);
    const wasBlocking = isStatusBlocking(previousStatus);
    const isBlocking = isStatusBlocking(stageStatus);

    // Automatically log blocking or unblocking status changes into Communication Logs
    if (isBlocking) {
      const autoLog: TrackerCommunicationLog = {
        id: `log-auto-${Date.now()}`,
        created_at: new Date().toISOString(),
        enquiry_id: existingEnquiry.id,
        enquiry_number: existingEnquiry.enquiry_number,
        client_id: existingEnquiry.client_id,
        client_name: existingEnquiry.client_name,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user_name: "System / Admin",
        channel: "Email",
        direction: "Outbound",
        summary: `⚠️ [AUTOMATIC STAGE ALERT - Stage #${activeStageNumber}: ${STAGE_NAMES[activeStageNumber - 1]}] Status set to '${stageStatus}'. ${stageNotes ? `Notes: "${stageNotes}"` : "Progression halted until resolution."}`
      };
      const updatedLogs = [autoLog, ...logs];
      saveTrackerCommunicationLogs(updatedLogs);
      setLogs(updatedLogs);
    } else if (wasBlocking && !isBlocking) {
      const autoLog: TrackerCommunicationLog = {
        id: `log-auto-${Date.now()}`,
        created_at: new Date().toISOString(),
        enquiry_id: existingEnquiry.id,
        enquiry_number: existingEnquiry.enquiry_number,
        client_id: existingEnquiry.client_id,
        client_name: existingEnquiry.client_name,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user_name: "System / Admin",
        channel: "Email",
        direction: "Outbound",
        summary: `✅ [AUTOMATIC RESOLUTION ALERT - Stage #${activeStageNumber}: ${STAGE_NAMES[activeStageNumber - 1]}] Status unblocked from '${previousStatus}' to '${stageStatus}'. ${stageNotes ? `Notes: "${stageNotes}"` : "Progression resumed."}`
      };
      const updatedLogs = [autoLog, ...logs];
      saveTrackerCommunicationLogs(updatedLogs);
      setLogs(updatedLogs);
    }

    // Calculate progression stage and status
    let nextStage: StageNumber;
    let nextStatus: string = stageStatus;

    if (isBlocking) {
      nextStage = activeStageNumber;
    } else if (activeStageNumber === 13) {
      nextStage = 13;
    } else {
      nextStage = Math.min(13, activeStageNumber + 1) as StageNumber;
      // Use next stage's status if already filled, otherwise stageStatus
      const nextStageData = updatedStageData[nextStage];
      if (nextStageData?.status) {
        nextStatus = nextStageData.status;
      }
    }

    const updatedEnquiry: TrackerEnquiry = {
      ...existingEnquiry,
      updated_at: new Date().toISOString(),
      current_stage: nextStage,
      current_status: nextStatus,
      factory_name: updatedFactoryName,
      factory_id: updatedFactoryId,
      stage_data: updatedStageData,
      history: [newHistoryRecord, ...(existingEnquiry.history || [])]
    };

    allEnquiries[index] = updatedEnquiry;
    saveTrackerEnquiries(allEnquiries);
    setEnquiries(allEnquiries);

    if (activeStageNumber === 13 && !isBlocking) {
      // Exit enquiry view on Stage 13 save
      setSelectedEnquiry(null);
      toast.success(`Enquiry ${existingEnquiry.enquiry_number} Stage #13 (Bulk Payment) saved! Order tracking completed.`);
    } else {
      setSelectedEnquiry(updatedEnquiry);
      // Auto navigate to nextStage and prep its form
      setActiveStageNumber(nextStage);
      const nextStageExisting = updatedStageData[nextStage] || {};
      setStageFormData(nextStageExisting);
      setStageStatus(nextStageExisting.status || STAGE_STATUS_OPTIONS[nextStage]?.[0] || "New");
      setStageNotes(nextStageExisting.notes || "");
      toast.success(`Stage #${activeStageNumber} saved successfully!`);
    }
  };

  // Add Communication Log (tagged with current stage)
  const handleAddLog = () => {
    if (!selectedEnquiry || !newLogSummary.trim()) return;

    const newEntry: TrackerCommunicationLog = {
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString(),
      enquiry_id: selectedEnquiry.id,
      enquiry_number: selectedEnquiry.enquiry_number,
      client_id: selectedEnquiry.client_id,
      client_name: selectedEnquiry.client_name,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user_name: "Admin User",
      channel: newLogChannel,
      direction: newLogDirection,
      summary: `[Stage #${activeStageNumber}: ${STAGE_NAMES[activeStageNumber - 1]}] ${newLogSummary}`
    };

    const allLogs = [newEntry, ...logs];
    saveTrackerCommunicationLogs(allLogs);
    setLogs(allLogs);
    setNewLogSummary("");
  };

  // Create New Enquiry
  const handleCreateEnquiry = () => {
    if (!newProductRef.trim()) return;
    const matchedClient = clients.find(c => c.id === newClientId) || clients[0];

    const nextNumber = `ENQ-2026-00${enquiries.length + 1}`;
    const newEnq: TrackerEnquiry = {
      id: `enq-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      enquiry_number: newEnquiryNumber || nextNumber,
      client_id: matchedClient?.id || "c-101",
      client_name: matchedClient?.company_name || "Client Agency",
      country: matchedClient?.country || "France",
      product_reference: newProductRef,
      communication_channel: newChannel,
      enquiry_details: newDetails,
      fabric_details: newFabric,
      images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop"],
      target_price: parseFloat(newTargetPrice) || 0,
      current_stage: 1,
      current_status: "New",
      stage_data: {
        1: {
          date_received: new Date().toISOString().split("T")[0],
          channel: newChannel,
          details: newDetails,
          fabric: newFabric,
          target_price: parseFloat(newTargetPrice) || 0,
          status: "New"
        }
      },
      history: [
        {
          id: `h-${Date.now()}`,
          enquiry_id: `enq-${Date.now()}`,
          stage_number: 1,
          stage_name: "Enquiry Received",
          status: "New",
          stage_data: {},
          updated_by: "Admin User",
          created_at: new Date().toISOString()
        }
      ]
    };

    const updated = [newEnq, ...enquiries];
    saveTrackerEnquiries(updated);
    setEnquiries(updated);
    setIsNewModalOpen(false);
    // Reset form
    setNewProductRef("");
    setNewDetails("");
    setNewFabric("");
    setNewTargetPrice("");
  };

  // Filter Enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch =
      e.enquiry_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.product_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClient = selectedClient === "All" || e.client_name === selectedClient;
    const matchesFactory = selectedFactory === "All" || e.factory_name === selectedFactory;
    const matchesStatus = selectedStatus === "All" || e.current_status === selectedStatus;
    const matchesStage = selectedStage === "All" || e.current_stage.toString() === selectedStage;

    return matchesSearch && matchesClient && matchesFactory && matchesStatus && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Enquiry Management</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track fashion orders through 13 sequential stages with complete audit history.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Create New Enquiry
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Enquiry #, Client, Product, Country..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
            <CustomSelect
              value={selectedClient === "All" ? "Filter Client" : selectedClient}
              onChange={(v) => setSelectedClient(v === "Filter Client" ? "All" : v)}
              options={["All", ...clients.map(c => c.company_name)]}
            />

            <CustomSelect
              value={selectedFactory === "All" ? "Filter Factory" : selectedFactory}
              onChange={(v) => setSelectedFactory(v === "Filter Factory" ? "All" : v)}
              options={["All", ...factories.map(f => f.factory_name)]}
            />

            <CustomSelect
              value={selectedStage === "All" ? "Filter Stage" : `Stage ${selectedStage}`}
              onChange={(v) => setSelectedStage(v === "All" ? "All" : v.replace("Stage ", ""))}
              options={["All", ...STAGE_NAMES.map((_, idx) => `Stage ${idx + 1}`)]}
            />

            <CustomSelect
              value={selectedStatus === "All" ? "Filter Status" : selectedStatus}
              onChange={(v) => setSelectedStatus(v === "Filter Status" ? "All" : v)}
              options={["All", "New", "Sourcing", "Submitted", "Approved", "Production", "Dispatched", "Paid", "Hold"]}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border overflow-x-auto">
          <div className="p-4 bg-foreground/[0.02] grid grid-cols-12 gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider items-center">
            <div className="col-span-2">Enquiry / Client</div>
            <div className="col-span-2">Product Reference</div>
            <div className="col-span-3">Current Stage</div>
            <div className="col-span-2">Assigned Factory</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {filteredEnquiries.map((e) => (
            <div
              key={e.id}
              onClick={() => setSelectedEnquiry(e)}
              className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-foreground/[0.03] transition-colors cursor-pointer text-xs min-w-[850px]"
            >
              <div className="col-span-2">
                <p className="font-mono font-bold text-electric">{e.enquiry_number}</p>
                <p className="font-medium text-foreground">{e.client_name}</p>
                <p className="text-[10px] text-muted-foreground">{e.country}</p>
              </div>

              <div className="col-span-2">
                <p className="font-semibold text-foreground">{e.product_reference}</p>
                <p className="text-[10px] text-muted-foreground">Target: ${e.target_price}</p>
              </div>

              <div className="col-span-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-electric/10 text-electric font-semibold text-[11px] whitespace-nowrap">
                  Stage {e.current_stage}: {STAGE_NAMES[e.current_stage - 1]}
                </span>
              </div>

              <div className="col-span-2">
                <p className="font-medium text-foreground">{e.factory_name || "Unassigned"}</p>
                <p className="text-[10px] text-muted-foreground">{e.agent_name || "Direct"}</p>
              </div>

              <div className="col-span-2 flex items-center">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap inline-flex items-center gap-1.5 ${getStatusBadgeStyles(e.current_status)}`}>
                  <span className="size-1.5 rounded-full bg-current" />
                  {e.current_status}
                </span>
              </div>

              <div className="col-span-1 text-right flex items-center justify-end">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedEnquiry(e);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-electric/30 bg-electric/10 hover:bg-electric hover:text-background transition-all text-xs font-bold text-electric whitespace-nowrap shrink-0 shadow-sm"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}

          {filteredEnquiries.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-xs">
              No enquiries match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Selected Enquiry Detailed Drawer / Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-4xl h-full bg-background border-l border-border shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-card">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-electric">{selectedEnquiry.enquiry_number}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-electric/15 text-electric uppercase">
                      Stage {selectedEnquiry.current_stage}: {STAGE_NAMES[selectedEnquiry.current_stage - 1]}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold mt-1 text-foreground">{selectedEnquiry.product_reference}</h2>
                  <p className="text-xs text-muted-foreground">{selectedEnquiry.client_name} ({selectedEnquiry.country})</p>
                </div>

                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Sub-tabs */}
              <div className="flex border-b border-border bg-card/50 px-6 gap-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveDrawerTab("stages")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    activeDrawerTab === "stages" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  13-Stage Progression
                </button>

                <button
                  onClick={() => setActiveDrawerTab("history")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    activeDrawerTab === "history" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Audit History ({selectedEnquiry.history?.length || 0})
                </button>

                <button
                  onClick={() => setActiveDrawerTab("logs")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    activeDrawerTab === "logs" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Communication Logs ({logs.filter(l => l.enquiry_id === selectedEnquiry.id).length})
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeDrawerTab === "stages" && (
                  <div className="space-y-8">
                    {/* Horizontal 13-Stage Stepper */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progression Stepper</p>
                        <span className="text-[11px] text-electric font-semibold">
                          Unlocked Up To Stage #{getUnlockedMaxStage(selectedEnquiry)}
                        </span>
                      </div>

                      {isStatusBlocking(selectedEnquiry.current_status) && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-400">
                          <AlertCircle className="size-4 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Order Progression Blocked at Stage #{selectedEnquiry.current_stage} ({STAGE_NAMES[selectedEnquiry.current_stage - 1]})</p>
                            <p className="text-[11px] opacity-90 mt-0.5">
                              Status is currently set to <span className="font-semibold underline font-mono">{selectedEnquiry.current_status}</span>. Upcoming stages are inaccessible until this issue is resolved or saved with an approved status.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
                        {STAGE_NAMES.map((name, idx) => {
                          const num = (idx + 1) as StageNumber;
                          const maxUnlocked = getUnlockedMaxStage(selectedEnquiry);
                          const isUnlocked = num <= maxUnlocked;
                          const isPassed = num < selectedEnquiry.current_stage;
                          const isCurrent = num === selectedEnquiry.current_stage;
                          const isSelected = num === activeStageNumber;

                          return (
                            <button
                              key={name}
                              disabled={!isUnlocked}
                              onClick={() => handleSelectStageNumber(num)}
                              title={!isUnlocked ? `Stage ${num} is locked until previous stage is completed.` : name}
                              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                                !isUnlocked
                                  ? "bg-foreground/5 border-border/40 text-muted-foreground/40 cursor-not-allowed opacity-40"
                                  : isSelected
                                  ? "bg-electric text-background border-electric font-bold shadow-md cursor-pointer"
                                  : isCurrent
                                  ? "bg-electric/20 text-electric border-electric/40 cursor-pointer"
                                  : isPassed
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-pointer"
                                  : "bg-card border-border text-muted-foreground hover:text-foreground cursor-pointer"
                              }`}
                            >
                              <span className="size-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-foreground/10">
                                {!isUnlocked ? <Lock className="size-3" /> : num}
                              </span>
                              <span className="whitespace-nowrap">{name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Stage Form Panel */}
                    <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-electric">
                            Stage {activeStageNumber} Form
                          </span>
                          <h3 className="font-serif text-lg font-bold">{STAGE_NAMES[activeStageNumber - 1]}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground font-semibold">Status:</label>
                          <CustomSelect
                            value={stageStatus || STAGE_STATUS_OPTIONS[activeStageNumber]?.[0] || "New"}
                            onChange={(val) => setStageStatus(val)}
                            options={STAGE_STATUS_OPTIONS[activeStageNumber] || ["Pending", "Completed"]}
                          />
                        </div>
                      </div>

                      {/* Stage Specific Fields Render */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeStageNumber === 1 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Date Received</label>
                              <input
                                type="date"
                                value={stageFormData.date_received || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, date_received: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Target Price ($)</label>
                              <input
                                type="number"
                                value={stageFormData.target_price || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, target_price: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Fabric & Material Specs</label>
                              <textarea
                                rows={2}
                                value={stageFormData.fabric || selectedEnquiry.fabric_details || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, fabric: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 2 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Shortlisted Factory</label>
                              <CustomSelect
                                value={stageFormData.factory_name || "Select Factory"}
                                onChange={(val) => setStageFormData({ ...stageFormData, factory_name: val })}
                                options={factories.map(f => f.factory_name)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Internal Review Date</label>
                              <input
                                type="date"
                                value={stageFormData.review_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, review_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 3 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Cost Breakdown (FOB/CIF)</label>
                              <input
                                type="text"
                                value={stageFormData.cost_breakdown || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, cost_breakdown: e.target.value })}
                                placeholder="e.g. FOB $18.50/unit"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Cost Received Date</label>
                              <input
                                type="date"
                                value={stageFormData.cost_received_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, cost_received_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 4 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Sample Size & Quantity</label>
                              <input
                                type="text"
                                value={stageFormData.sample_info || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, sample_info: e.target.value })}
                                placeholder="e.g. Size M, 2 Units"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Tracking Number</label>
                              <input
                                type="text"
                                value={stageFormData.tracking || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, tracking: e.target.value })}
                                placeholder="DHL / FedEx Tracking"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 5 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Sample Invoice Number</label>
                              <input
                                type="text"
                                value={stageFormData.invoice_number || `SMP-INV-${selectedEnquiry.enquiry_number.slice(-3)}`}
                                onChange={(e) => setStageFormData({ ...stageFormData, invoice_number: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Invoice Amount ($)</label>
                              <input
                                type="number"
                                value={stageFormData.amount || 350}
                                onChange={(e) => setStageFormData({ ...stageFormData, amount: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 6 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Payment Received ($)</label>
                              <input
                                type="number"
                                value={stageFormData.amount_received || 0}
                                onChange={(e) => setStageFormData({ ...stageFormData, amount_received: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Payment Date</label>
                              <input
                                type="date"
                                value={stageFormData.payment_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, payment_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 7 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Decision</label>
                              <CustomSelect
                                value={stageFormData.decision || "Approved"}
                                onChange={(val) => setStageFormData({ ...stageFormData, decision: val })}
                                options={["Approved", "Revision Requested", "Rejected", "Hold"]}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Approval Date</label>
                              <input
                                type="date"
                                value={stageFormData.approval_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, approval_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 8 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Purchase Order Number</label>
                              <input
                                type="text"
                                value={stageFormData.po_number || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, po_number: e.target.value })}
                                placeholder="PO-10023"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Bulk Order Value ($)</label>
                              <input
                                type="number"
                                value={stageFormData.order_value || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, order_value: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 9 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Production Start Date</label>
                              <input
                                type="date"
                                value={stageFormData.prod_start || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, prod_start: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Expected Completion Date</label>
                              <input
                                type="date"
                                value={stageFormData.expected_completion || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, expected_completion: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 10 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">QC Report Outcome</label>
                              <CustomSelect
                                value={stageFormData.qc_outcome || "Passed"}
                                onChange={(val) => setStageFormData({ ...stageFormData, qc_outcome: val })}
                                options={["Pending", "Passed", "Failed", "Rework Required"]}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">QC Inspection Date</label>
                              <input
                                type="date"
                                value={stageFormData.qc_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, qc_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 11 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Carrier & Tracking</label>
                              <input
                                type="text"
                                value={stageFormData.shipment_tracking || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, shipment_tracking: e.target.value })}
                                placeholder="Maersk Air / DHL #88123"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Delivery (ETA)</label>
                              <input
                                type="date"
                                value={stageFormData.eta || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, eta: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 12 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Bulk Invoice Number</label>
                              <input
                                type="text"
                                value={stageFormData.bulk_inv_number || `BLK-INV-${selectedEnquiry.enquiry_number.slice(-3)}`}
                                onChange={(e) => setStageFormData({ ...stageFormData, bulk_inv_number: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Invoice Amount ($)</label>
                              <input
                                type="number"
                                value={stageFormData.bulk_amount || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, bulk_amount: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}

                        {activeStageNumber === 13 && (
                          <>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Final Settlement Received ($)</label>
                              <input
                                type="number"
                                value={stageFormData.final_payment || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, final_payment: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Settlement Date</label>
                              <input
                                type="date"
                                value={stageFormData.settlement_date || ""}
                                onChange={(e) => setStageFormData({ ...stageFormData, settlement_date: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Audit Update Notes</label>
                        <input
                          type="text"
                          value={stageNotes}
                          onChange={(e) => setStageNotes(e.target.value)}
                          placeholder="Add internal notes for this stage update..."
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleSaveStageUpdate}
                          className="px-5 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span>
                            {activeStageNumber < 13 && !isStatusBlocking(stageStatus)
                              ? `Save Stage #${activeStageNumber} Progress & Advance to Stage #${activeStageNumber + 1} →`
                              : `Save Stage #${activeStageNumber} Progress`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeDrawerTab === "history" && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-base font-bold">Audit History (Immutable Log)</h3>
                    <div className="relative border-l-2 border-electric/30 pl-4 space-y-6">
                      {selectedEnquiry.history?.map((h) => (
                        <div key={h.id} className="relative">
                          <span className="absolute -left-[21px] top-1 size-3 rounded-full bg-electric border-2 border-background" />
                          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-electric">Stage {h.stage_number}: {h.stage_name}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(h.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-xs font-semibold text-foreground">Status set to: {h.status}</p>
                            <p className="text-[11px] text-muted-foreground">Updated by: {h.updated_by}</p>
                            {h.notes && <p className="text-xs text-foreground/80 italic mt-1">"{h.notes}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDrawerTab === "logs" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-electric">Add Communication Entry</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-muted-foreground">Channel</label>
                          <CustomSelect
                            value={newLogChannel}
                            onChange={(val) => setNewLogChannel(val as any)}
                            options={["Email", "WhatsApp", "Phone", "Meeting", "WeChat"]}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Direction</label>
                          <CustomSelect
                            value={newLogDirection}
                            onChange={(val) => setNewLogDirection(val as any)}
                            options={["Inbound", "Outbound"]}
                          />
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={newLogSummary}
                        onChange={(e) => setNewLogSummary(e.target.value)}
                        placeholder="Log email summary, meeting minutes, or WhatsApp update..."
                        className="w-full px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs"
                      />
                      <button
                        onClick={handleAddLog}
                        className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs cursor-pointer"
                      >
                        Add Entry
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline History</h4>
                      {logs.filter(l => l.enquiry_id === selectedEnquiry.id).map((l) => (
                        <div key={l.id} className="p-4 rounded-xl border border-border bg-card space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-electric">{l.channel} ({l.direction})</span>
                            <span className="text-[10px] text-muted-foreground">{l.date} at {l.time}</span>
                          </div>
                          <p className="text-xs text-foreground">{l.summary}</p>
                          <p className="text-[10px] text-muted-foreground">Logged by: {l.user_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Enquiry Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">New Sourcing Enquiry</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Select Client</label>
                <CustomSelect
                  value={clients.find(c => c.id === newClientId)?.company_name || clients[0]?.company_name || "Select Client"}
                  onChange={(val) => {
                    const matched = clients.find(c => c.company_name === val);
                    if (matched) setNewClientId(matched.id);
                  }}
                  options={clients.map(c => c.company_name)}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Product Reference</label>
                <input
                  type="text"
                  value={newProductRef}
                  onChange={(e) => setNewProductRef(e.target.value)}
                  placeholder="e.g. FW26 Double-Breasted Wool Trench Coat"
                  className="w-full px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Channel</label>
                  <CustomSelect
                    value={newChannel}
                    onChange={(v) => setNewChannel(v)}
                    options={["Email", "WhatsApp", "Phone", "WeChat"]}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Target Price ($)</label>
                  <input
                    type="number"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    placeholder="150"
                    className="w-full px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Enquiry Specs / Details</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Enter design, fabric, and volume specs..."
                  className="w-full px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEnquiry}
                className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md"
              >
                Create Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
