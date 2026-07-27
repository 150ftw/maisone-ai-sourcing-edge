import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Plus, X, MessageSquare, Mail, Phone, Video, Paperclip, ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getTrackerCommunicationLogs,
  saveTrackerCommunicationLogs,
  getTrackerEnquiries,
  TrackerCommunicationLog,
  TrackerEnquiry
} from "@/lib/tracker-store";
import { CustomSelect } from "../../admin";

export const Route = createFileRoute("/admin/tracker/communication")({
  component: CommunicationRoute,
});

export function CommunicationRoute() {
  const [logs, setLogs] = useState<TrackerCommunicationLog[]>([]);
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState("");
  const [channel, setChannel] = useState<"Email" | "WhatsApp" | "Phone" | "Meeting" | "WeChat">("Email");
  const [direction, setDirection] = useState<"Inbound" | "Outbound">("Outbound");
  const [summary, setSummary] = useState("");
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    setLogs(getTrackerCommunicationLogs());
    setEnquiries(getTrackerEnquiries());
  }, []);

  const handleDeleteLog = (logId: string) => {
    if (window.confirm("Are you sure you want to delete this communication log entry?")) {
      const updated = logs.filter(l => l.id !== logId);
      saveTrackerCommunicationLogs(updated);
      setLogs(updated);
      toast.success("Communication log entry deleted.");
    }
  };

  const handleCreateLog = () => {
    if (!summary.trim()) return;

    const matchedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) || enquiries[0];

    const newLog: TrackerCommunicationLog = {
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString(),
      enquiry_id: matchedEnquiry?.id || "enq-1001",
      enquiry_number: matchedEnquiry?.enquiry_number || "ENQ-2026-001",
      client_id: matchedEnquiry?.client_id || "c-101",
      client_name: matchedEnquiry?.client_name || "Atelier Saint-Germain",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user_name: "Admin User",
      channel,
      direction,
      summary,
      attachment
    };

    const updated = [newLog, ...logs];
    saveTrackerCommunicationLogs(updated);
    setLogs(updated);
    setIsModalOpen(false);
    setSummary("");
    setAttachment("");
  };

  const filteredLogs = logs.filter(l => {
    const matchesQuery =
      l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.client_name && l.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.enquiry_number && l.enquiry_number.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesChannel = selectedChannel === "All" || l.channel === selectedChannel;
    return matchesQuery && matchesChannel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Communication Logs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manual activity timeline of emails, meetings, and messaging exchanges.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Log Communication
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communication entries, clients, enquiry numbers..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-foreground/[0.02] border border-border text-xs focus:outline-none focus:border-electric transition-colors"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            value={selectedChannel === "All" ? "Filter Channel" : selectedChannel}
            onChange={(v) => setSelectedChannel(v === "Filter Channel" ? "All" : v)}
            options={["All", "Email", "WhatsApp", "Phone", "Meeting", "WeChat"]}
          />
        </div>
      </div>

      {/* Timeline View */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <h3 className="font-serif text-base font-bold text-foreground">Activity Timeline</h3>

        <div className="relative border-l-2 border-electric/30 pl-6 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative">
              <span className={`absolute -left-[31px] top-1 size-4 rounded-full border-2 border-background flex items-center justify-center ${
                log.direction === "Inbound" ? "bg-blue-500" : "bg-electric"
              }`} />

              <div className="p-4 rounded-xl border border-border bg-foreground/[0.01] space-y-2 hover:border-electric/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-electric">{log.enquiry_number}</span>
                    <span className="text-xs font-semibold text-foreground">• {log.client_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-secondary">
                      {log.direction === "Inbound" ? <ArrowDownLeft className="size-3 text-blue-400" /> : <ArrowUpRight className="size-3 text-electric" />}
                      {log.channel} ({log.direction})
                    </span>
                    <span>{log.date} at {log.time}</span>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete Entry"
                      className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors ml-1 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed">{log.summary}</p>

                {log.attachment && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-electric/10 text-electric text-[11px] font-mono">
                    <Paperclip className="size-3" />
                    <span>{log.attachment}</span>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground/70">Logged by {log.user_name}</p>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No communication logs recorded yet.</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Manual Communication Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Link To Enquiry</label>
                <CustomSelect
                  value={enquiries.find(e => e.id === selectedEnquiryId)?.enquiry_number || enquiries[0]?.enquiry_number || "Select Enquiry"}
                  onChange={(val) => {
                    const matched = enquiries.find(e => e.enquiry_number === val);
                    if (matched) setSelectedEnquiryId(matched.id);
                  }}
                  options={enquiries.map(e => e.enquiry_number)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Channel</label>
                  <CustomSelect
                    value={channel}
                    onChange={(val) => setChannel(val as any)}
                    options={["Email", "WhatsApp", "Phone", "Meeting", "WeChat"]}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Direction</label>
                  <CustomSelect
                    value={direction}
                    onChange={(val) => setDirection(val as any)}
                    options={["Inbound", "Outbound"]}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Summary / Details</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Record call notes, email content, or meeting minutes..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Attachment Name (Optional)</label>
                <input
                  type="text"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  placeholder="e.g. Fabric_Spec_v2.pdf"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleCreateLog} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Save Communication Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
