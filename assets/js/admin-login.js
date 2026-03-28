import { appConfig } from "./config.js";
import { getSupabaseClient } from "./supabase-client.js";

const form = document.getElementById("login-form");
const statusText = document.getElementById("login-status");

function setStatus(message, isError = false) {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.className = isError
    ? "mt-4 text-sm text-red-600"
    : "mt-4 text-sm text-emerald-600";
}

async function ensureSessionRedirect() {
  const supabase = await getSupabaseClient();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && appConfig.allowedAdminEmails.includes(session.user.email)) {
    window.location.href = "./dashboard.html";
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!appConfig.allowedAdminEmails.includes(email)) {
    setStatus("This email is not allowed for admin access.", true);
    return;
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    setStatus("Supabase is not configured. Update assets/js/config.js.", true);
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setStatus(error.message, true);
    return;
  }

  setStatus("Login successful. Redirecting...");
  window.location.href = "./dashboard.html";
});

ensureSessionRedirect();
