import { appConfig } from "./config.js";

const SUPABASE_JS_CDN =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

let cachedClient;

export async function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  if (
    !appConfig.supabaseUrl ||
    !appConfig.supabaseAnonKey ||
    appConfig.supabaseUrl.includes("YOUR_PROJECT")
  ) {
    return null;
  }

  const { createClient } = await import(SUPABASE_JS_CDN);
  cachedClient = createClient(
    appConfig.supabaseUrl,
    appConfig.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return cachedClient;
}

export function toYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch (error) {
    return "";
  }

  return "";
}

export function formatDate(dateInput) {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return dateInput;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
