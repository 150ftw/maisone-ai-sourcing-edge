import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, ShieldCheck, Lock, Users, Save, Check } from "lucide-react";
import {
  getTrackerSettings,
  saveTrackerSettings,
  TrackerSettings,
  UserRole
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/tracker/settings")({
  component: SettingsRoute,
});

export function SettingsRoute() {
  const [settings, setSettings] = useState<TrackerSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(getTrackerSettings());
  }, []);

  const handleSave = () => {
    if (!settings) return;
    saveTrackerSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
