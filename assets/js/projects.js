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

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function projectCard(project) {
  const videoUrl = toYouTubeEmbedUrl(project.youtube_url);
  const mediaItems = project.media || [];
  const imageGallery = mediaItems.filter((item) => item.media_type === "image");
  const videoLinks = mediaItems.filter(
    (item) => item.media_type === "video_link",
  );

  const galleryMarkup = imageGallery.length
    ? `<div class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        ${imageGallery
          .map(
            (item) =>
              `<img class="h-24 w-full rounded border border-slate-200 object-cover" src="${escapeHtml(item.media_url)}" alt="${escapeHtml(project.title)} gallery image" loading="lazy" />`,
          )
          .join("")}
      </div>`
    : "";

  const extraVideosMarkup = videoLinks.length
    ? `<div class="mt-4 space-y-2">
        ${videoLinks
          .map((item) => {
            const embedded = toYouTubeEmbedUrl(item.media_url);
            if (embedded) {
              return `<div class="rounded border border-slate-200 bg-slate-100 p-2">
                  <iframe
                    class="h-48 w-full rounded"
                    src="${escapeHtml(embedded)}"
                    title="${escapeHtml(project.title)} extra video"
                    loading="lazy"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>`;
            }

            return `<a href="${escapeHtml(item.media_url)}" target="_blank" rel="noopener noreferrer" class="inline-block rounded border border-brand-500 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-slate-50">Open video link</a>`;
          })
          .join("")}
      </div>`
    : "";

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
        ${galleryMarkup}
        ${extraVideosMarkup}
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

  const projectIds = data.map((project) => project.id);
  const { data: mediaRows, error: mediaError } = await supabase
    .from("project_media")
    .select("id,project_id,media_type,media_url,sort_order")
    .in("project_id", projectIds)
    .order("sort_order", { ascending: true });

  if (mediaError) {
    console.warn("Project media unavailable:", mediaError.message);
    return data.map((project) => ({ ...project, media: [] }));
  }

  const mediaByProject = (mediaRows || []).reduce((acc, item) => {
    if (!acc[item.project_id]) {
      acc[item.project_id] = [];
    }
    acc[item.project_id].push(item);
    return acc;
  }, {});

  return data.map((project) => ({
    ...project,
    media: mediaByProject[project.id] || [],
  }));
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
