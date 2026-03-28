import { fallbackReferences } from "./config.js";
import { formatDate, getSupabaseClient } from "./supabase-client.js";

const container = document.getElementById("references-grid");

function referenceCard(ref) {
  const verifiedBadge = ref.verified
    ? '<span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Verified</span>'
    : '<span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Pending verification</span>';

  const previewBlock = ref.document_url
    ? `<a href="${ref.document_url}" target="_blank" rel="noopener" class="mt-3 inline-block rounded bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900">Open Letter</a>`
    : '<p class="mt-3 text-xs text-slate-500">Document upload pending.</p>';

  return `
    <article class="card-enter rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-display text-2xl text-brand-900">${ref.referee_name}</h3>
        ${verifiedBadge}
      </div>
      <p class="mt-1 text-sm font-semibold text-brand-700">${ref.referee_role || "Referee"}${ref.company_name ? `, ${ref.company_name}` : ""}</p>
      <p class="mt-2 text-xs text-slate-500">Issued: ${formatDate(ref.issued_date)}</p>
      <p class="mt-3 text-sm leading-6 text-slate-700">${ref.summary || "Recommendation letter available."}</p>
      ${previewBlock}
      ${
        ref.document_url
          ? `<a href="${ref.document_url}" download class="ml-2 inline-block rounded border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-brand-700 hover:text-brand-700">Download</a>`
          : ""
      }
    </article>
  `;
}

async function fetchReferences() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return fallbackReferences;
  }

  const { data, error } = await supabase
    .from("references")
    .select(
      "id,referee_name,referee_role,company_name,issued_date,summary,document_url,verified",
    )
    .eq("is_public", true)
    .order("issued_date", { ascending: false });

  if (error) {
    console.warn("Using fallback references:", error.message);
    return fallbackReferences;
  }

  return data;
}

async function init() {
  if (!container) return;

  const refs = await fetchReferences();
  container.innerHTML = refs.length
    ? refs.map((item) => referenceCard(item)).join("")
    : '<article class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No reference letters published yet.</article>';
}

init();
