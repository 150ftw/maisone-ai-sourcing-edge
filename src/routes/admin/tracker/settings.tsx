import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, ShieldCheck, Lock, Users, Save, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  TrackerSettings,
  UserRole
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/tracker/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const [settings, setSettings] = useState<TrackerSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tracker_settings")
        .select("value")
        .eq("key", "agency_settings")
        .single();

      if (!error && data) {
        setSettings(data.value as TrackerSettings);
      } else {
        // Seed default settings if the key is missing
        const defaultSettings: TrackerSettings = {
          agency_name: "Maisone Global Sourcing ERP",
          currency: "USD",
          fiscal_year_start: "January 1",
          active_roles: ["Admin", "Staff"],
          permissions: {
            "Admin": ["All Access", "Create/Edit/Delete All", "Manage Finance", "Manage Roles"],
            "Staff": ["View All", "Create/Edit Enquiries", "Add Communication Logs", "View Finance"],
            "Finance": ["View Enquiries", "Manage Invoices", "Record Payments", "Export Financial Reports"],
            "Factory": ["View Assigned Enquiries", "Update Production Stage", "Upload QC Photos"],
            "Agent": ["View Regional Enquiries", "Add Client Logs", "Submit Costing"],
            "Read Only": ["View Dashboards", "View Reports"]
          }
        };

        const { error: seedError } = await supabase
          .from("tracker_settings")
          .insert([{ key: "agency_settings", value: defaultSettings }]);

        if (!seedError) {
          setSettings(defaultSettings);
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from("tracker_settings")
        .upsert({ key: "agency_settings", value: settings }, { onConflict: "key" });

      if (error) throw error;
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-80 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-32 bg-foreground/10 rounded-xl" />
        </div>

        {/* General config panel skeleton */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-5 bg-foreground/10 rounded" />
            <div className="h-5 w-56 bg-foreground/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 w-24 bg-foreground/10 rounded-full" />
                <div className="h-9 w-full bg-foreground/10 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* RBAC panel skeleton */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-5 bg-foreground/10 rounded" />
                <div className="h-5 w-64 bg-foreground/10 rounded-lg" />
              </div>
              <div className="h-3 w-48 bg-foreground/10 rounded-full" />
            </div>
            <div className="h-6 w-28 bg-foreground/10 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-foreground/10 rounded-lg" />
                  <div className="h-5 w-24 bg-foreground/10 rounded-full" />
                </div>
                <div className="h-2.5 w-32 bg-foreground/10 rounded-full" />
                <div className="space-y-1.5">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-2.5 bg-foreground/10 rounded-full" style={{ width: `${60 + j * 10}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const allRoles: UserRole[] = ["Admin", "Staff", "Finance", "Factory", "Agent", "Read Only"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Tracker Platform Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure ERP metadata, currency defaults, and Role-Based Access Control (RBAC).
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="size-4 text-background" /> : <Save className="size-4" />}
          {savedSuccess ? "Saved Successfully!" : "Save Settings"}
        </button>
      </div>

      {/* Agency Metadata Form */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2">
          <SettingsIcon className="size-5 text-electric" />
          General Agency Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Agency Title</label>
            <input
              type="text"
              value={settings.agency_name}
              onChange={(e) => setSettings({ ...settings, agency_name: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Default Currency</label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Fiscal Year Start</label>
            <input
              type="text"
              value={settings.fiscal_year_start}
              onChange={(e) => setSettings({ ...settings, fiscal_year_start: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
            />
          </div>
        </div>
      </div>

      {/* RBAC Permission Architecture */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-5 text-electric" />
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-muted-foreground">Architectural roles and privilege matrix</p>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-electric/15 text-electric font-semibold">
            Admin & Staff Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRoles.map((role) => {
            const isActive = settings.active_roles.includes(role);
            const perms = settings.permissions[role] || ["View Dashboards"];

            return (
              <div
                key={role}
                className={`p-4 rounded-xl border transition-all ${
                  isActive ? "border-electric/40 bg-electric/[0.02]" : "border-border bg-foreground/[0.01] opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs font-serif text-foreground">{role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-secondary text-muted-foreground"
                  }`}>
                    {isActive ? "Active Role" : "Future Extension"}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Granted Capabilities:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    {perms.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
