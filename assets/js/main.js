import { fallbackProjects } from "./config.js";
import { formatDate, getSupabaseClient } from "./supabase-client.js";

const featuredContainer = document.getElementById("featured-projects");
const lastUpdated = document.getElementById("last-updated");

if (lastUpdated) {
  lastUpdated.textContent = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function featuredCard(project) {
  return `
    <article class="card-enter card-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <img class="project-thumb" src="${project.hero_image_url || "https://placehold.co/900x560"}" alt="${project.title}" loading="lazy" />
      <div class="space-y-3 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">${project.category || "project"}</p>
        <h3 class="font-display text-2xl text-brand-900">${project.title}</h3>
        <p class="text-sm text-slate-700">${project.summary || ""}</p>
        <p class="text-xs text-slate-500">${project.location || "Location not provided"} | ${formatDate(project.completed_at)}</p>
      </div>
    </article>
  `;
}

async function fetchFeaturedProjects() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return fallbackProjects.filter((item) => item.featured).slice(0, 3);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,title,summary,category,location,completed_at,featured,hero_image_url",
    )
    .eq("featured", true)
    .order("completed_at", { ascending: false })
    .limit(3);

  if (error) {
    console.warn("Using fallback featured projects:", error.message);
    return fallbackProjects.filter((item) => item.featured).slice(0, 3);
  }

  if (!data || data.length === 0) {
    return fallbackProjects.filter((item) => item.featured).slice(0, 3);
  }

  return data;
}

async function initFeatured() {
  if (!featuredContainer) return;
  const items = await fetchFeaturedProjects();
  featuredContainer.innerHTML = items
    .map((item) => featuredCard(item))
    .join("");
}

initFeatured();
