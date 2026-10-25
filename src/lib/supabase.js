import { createClient } from "@supabase/supabase-js";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Auto-correct URL if user provided a project name instead of project ref URL
if (supabaseAnonKey && supabaseAnonKey.includes(".")) {
  try {
    const base64Url = supabaseAnonKey.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonStr);

    if (payload?.ref && (!supabaseUrl || !supabaseUrl.includes(payload.ref))) {
      const correctUrl = `https://${payload.ref}.supabase.co`;
      console.info(`[Intellus Auth] Auto-normalizing Supabase URL to ${correctUrl}`);
      supabaseUrl = correctUrl;
    }
  } catch (err) {
    // ignore parsing failure
  }
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project") &&
  supabaseAnonKey !== "your-anon-key"
);

// If keys are provided, initialize real Supabase client.
// Otherwise create a dummy client with a mock URL so imports never crash.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient("https://placeholder-project.supabase.co", "placeholder-anon-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
