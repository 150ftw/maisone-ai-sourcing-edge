import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string) => {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  return import.meta.env?.[key];
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL") || "https://placeholder-value.supabase.co";
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY") || "placeholder-key";

if (supabaseUrl.includes("placeholder") || supabaseAnonKey.includes("placeholder")) {
  console.warn(
    "Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env/process variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
