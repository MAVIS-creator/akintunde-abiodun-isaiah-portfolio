import { fallbackProjects } from "./config.js";
import {
  formatDate,
  getSupabaseClient,
  toYouTubeEmbedUrl,
} from "./supabase-client.js";

const grid = document.getElementById("projects-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

let projectCache = [];
let currentFilter = "all";

function projectCard(project) {
  const videoUrl = toYouTubeEmbedUrl(project.youtube_url);

  return `
    <article class="card-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <img class="project-thumb" src="${project.hero_image_url || "https://placehold.co/900x560"}" alt="${project.title}" loading="lazy" />
      <div class="space-y-3 p-5">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-accent-500">${project.category || "project"}</p>
          <p class="text-xs text-slate-500">${formatDate(project.completed_at)}</p>
        </div>
        <h3 class="font-display text-2xl text-brand-900">${project.title}</h3>
        <p class="text-sm text-slate-700">${project.summary || ""}</p>
        <p class="text-xs text-slate-500">${project.location || "Location not provided"}</p>
        ${
          videoUrl
            ? `<div class="rounded border border-slate-200 bg-slate-100 p-2">
                <iframe
                  class="h-48 w-full rounded"
                  src="${videoUrl}"
                  title="${project.title} video"
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderProjects() {
  if (!grid) return;

  const filtered =
    currentFilter === "all"
      ? projectCache
      : projectCache.filter((project) => project.category === currentFilter);

  grid.innerHTML = filtered.length
    ? filtered.map((project) => projectCard(project)).join("")
    : `<article class="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No project found in this category yet.</article>`;
}

async function fetchProjects() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return fallbackProjects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,title,summary,category,location,completed_at,hero_image_url,youtube_url",
    )
    .order("completed_at", { ascending: false });

  if (error) {
    console.warn("Using fallback projects:", error.message);
    return fallbackProjects;
  }

  if (!data || data.length === 0) {
    return fallbackProjects;
  }

  return data;
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active-filter"));
    btn.classList.add("active-filter");
    currentFilter = btn.dataset.filter;
    renderProjects();
  });
});

async function init() {
  projectCache = await fetchProjects();
  renderProjects();
}

init();
