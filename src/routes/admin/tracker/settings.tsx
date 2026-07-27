import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Settings as SettingsIcon, ShieldCheck, Lock, Users, Save, Check, DollarSign, Database, Download, Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  TrackerSettings,
  UserRole,
  CurrencyCode,
  CURRENCY_SYMBOLS,
  DEFAULT_EXCHANGE_RATES,
  getTrackerSettings,
  saveTrackerSettings,
  exportFullSystemBackup,
  importFullSystemBackup
} from "@/lib/tracker-store";
import { CustomSelect } from "../../admin";

export const Route = createFileRoute("/admin/tracker/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const [settings, setSettings] = useState<TrackerSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tracker_settings")
        .select("value")
        .eq("key", "agency_settings")
        .single();

      if (!error && data && data.value) {
        const fetched = data.value as TrackerSettings;
        setSettings({
          ...fetched,
          exchange_rates: fetched.exchange_rates || DEFAULT_EXCHANGE_RATES,
          hedging_buffer_percent: fetched.hedging_buffer_percent ?? 0
        });
      } else {
        const local = getTrackerSettings();
        const defaultSettings: TrackerSettings = {
          ...local,
          exchange_rates: local.exchange_rates || DEFAULT_EXCHANGE_RATES,
          hedging_buffer_percent: local.hedging_buffer_percent ?? 0
        };
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setSettings(getTrackerSettings());
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
      saveTrackerSettings(settings);
      try {
        await supabase
          .from("tracker_settings")
          .upsert({ key: "agency_settings", value: settings }, { onConflict: "key" });
      } catch (sbErr) {
        console.warn("Supabase settings save warning:", sbErr);
      }

      setSavedSuccess(true);
      toast.success("Tracker settings and currency config saved!");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings.");
    }
  };

  const handleBackup = () => {
    exportFullSystemBackup();
    toast.success("Full system backup JSON downloaded!");
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (confirm("Are you sure you want to restore system data? This will overwrite your current local dataset with the backup contents.")) {
          const success = importFullSystemBackup(parsed);
          if (success) {
            toast.success("System data restored successfully!");
            setTimeout(() => window.location.reload(), 1000);
          } else {
            toast.error("Invalid backup file format.");
          }
        }
      } catch (err) {
        console.error("Backup parse error:", err);
        toast.error("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-80 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-32 bg-foreground/10 rounded-xl" />
        </div>
        <div className="h-48 w-full bg-foreground/10 rounded-2xl" />
      </div>
    );
  }

  if (!settings) return null;

  const allRoles: UserRole[] = ["Admin", "Staff", "Finance", "Factory", "Agent", "Read Only"];
  const currencyCodes: CurrencyCode[] = ["USD", "EUR", "GBP", "INR", "RMB"];
  const currentRates = settings.exchange_rates || DEFAULT_EXCHANGE_RATES;

  return (
    <div className="space-y-6">
      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Tracker Platform Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure ERP metadata, Multi-Currency exchange rates, system backups, and RBAC permissions.
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

      {/* General Agency Configuration */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2">
          <SettingsIcon className="size-5 text-electric" />
          General Agency Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block">Agency Title</label>
            <input
              type="text"
              value={settings.agency_name}
              onChange={(e) => setSettings({ ...settings, agency_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.02] border border-border font-medium text-xs focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block">Default System Base Currency</label>
            <CustomSelect
              value={`${settings.currency} (${CURRENCY_SYMBOLS[settings.currency] || "$"})`}
              onChange={(val) => {
                const code = val.split(" ")[0] as CurrencyCode;
                setSettings({ ...settings, currency: code });
              }}
              options={currencyCodes.map((code) => `${code} (${CURRENCY_SYMBOLS[code]})`)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block">Fiscal Year Start</label>
            <input
              type="text"
              value={settings.fiscal_year_start}
              onChange={(e) => setSettings({ ...settings, fiscal_year_start: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.02] border border-border font-medium text-xs focus:outline-none focus:border-electric transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Multi-Currency & Exchange Rates Engine */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <DollarSign className="size-5 text-electric" />
              Multi-Currency Engine & Exchange Rates
            </h3>
            <p className="text-xs text-muted-foreground">Configure exchange rates relative to 1.00 USD base and currency risk hedging buffers.</p>
          </div>

          <button
            onClick={() => setSettings({ ...settings, exchange_rates: DEFAULT_EXCHANGE_RATES })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="size-3.5" />
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {currencyCodes.map((code) => (
            <div key={code} className="p-3.5 rounded-xl border border-border bg-foreground/[0.01] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground font-mono">{code} ({CURRENCY_SYMBOLS[code]})</span>
                <span className="text-[10px] text-muted-foreground">Rate vs USD</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={currentRates[code] ?? 1.0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 1.0;
                  setSettings({
                    ...settings,
                    exchange_rates: {
                      ...currentRates,
                      [code]: val
                    }
                  });
                }}
                disabled={code === "USD"}
                className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-mono font-bold text-electric disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Currency Risk Hedging Buffer Slider */}
        <div className="p-4 rounded-xl border border-border bg-electric/[0.02] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground">Currency Risk Margin Buffer:</span>
            <span className="font-mono text-electric font-bold">+{settings.hedging_buffer_percent || 0}% Hedging Buffer</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={settings.hedging_buffer_percent || 0}
            onChange={(e) => setSettings({ ...settings, hedging_buffer_percent: parseFloat(e.target.value) })}
            className="w-full accent-electric cursor-pointer"
          />
          <p className="text-[11px] text-muted-foreground">
            Adds a protective exchange rate buffer for cross-border factory payouts and client invoice conversions.
          </p>
        </div>
      </div>

      {/* Database Backup, Restore & System Maintenance */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold flex items-center gap-2">
            <Database className="size-5 text-electric" />
            System Database Backup & Restore
          </h3>
          <p className="text-xs text-muted-foreground">Export or restore full JSON backups of enquiries, clients, factories, invoices, and settings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <Download className="size-5 text-electric" />
              <h4 className="font-bold text-sm text-foreground">Export Full System Backup</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Downloads a complete `.json` snapshot file containing all tracker enquiries, clients, factory profiles, financial invoices, and settings.
            </p>
            <button
              onClick={handleBackup}
              className="px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Download className="size-4" />
              Download Backup (.json)
            </button>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="size-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-foreground">Restore System Backup</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a previously exported `.json` backup file to restore system records across local storage and Supabase database.
            </p>
            <button
              onClick={handleRestoreClick}
              className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-foreground/5 text-foreground font-bold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="size-4 text-emerald-400" />
              Restore Backup (.json)
            </button>
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
