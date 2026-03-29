import { appConfig } from "./config.js";
import { formatDate, getSupabaseClient } from "./supabase-client.js";

const projectForm = document.getElementById("project-form");
const referenceForm = document.getElementById("reference-form");
const projectList = document.getElementById("project-list");
const referenceList = document.getElementById("reference-list");
const statusText = document.getElementById("dashboard-status");
const logoutBtn = document.getElementById("logout-btn");

let supabase;

function setStatus(message, isError = false) {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.className = isError
    ? "text-sm text-red-600"
    : "text-sm text-emerald-600";
}

async function requireAdminSession() {
  supabase = await getSupabaseClient();
  if (!supabase) {
    setStatus("Supabase not configured. Update assets/js/config.js.", true);
    throw new Error("Supabase unavailable");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !appConfig.allowedAdminEmails.includes(session.user.email)) {
    window.location.href = "./login.html";
    throw new Error("Unauthorized");
  }
}

async function uploadToStorage(file, folder) {
  if (!file) return "";

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(appConfig.storageBucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(appConfig.storageBucket).getPublicUrl(fileName);

  return publicUrl;
}

async function uploadManyToStorage(files, folder) {
  if (!files || files.length === 0) return [];
  const uploads = Array.from(files).map((file) =>
    uploadToStorage(file, folder),
  );
  return Promise.all(uploads);
}

function projectListItem(project) {
  return `
    <article class="rounded border border-slate-200 p-3 text-sm">
      <p class="font-semibold text-brand-900">${project.title}</p>
      <p class="text-xs text-slate-500">${project.category} | ${project.location || "No location"} | ${formatDate(project.completed_at)}</p>
      <button data-id="${project.id}" data-type="project" class="mt-2 rounded border border-red-300 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>
    </article>
  `;
}

function referenceListItem(ref) {
  return `
    <article class="rounded border border-slate-200 p-3 text-sm">
      <p class="font-semibold text-brand-900">${ref.referee_name}</p>
      <p class="text-xs text-slate-500">${ref.referee_role} | ${formatDate(ref.issued_date)}</p>
      <button data-id="${ref.id}" data-type="reference" class="mt-2 rounded border border-red-300 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>
    </article>
  `;
}

async function loadDashboardLists() {
  let projects = [];
  let references = [];

  if (projectList) {
    const { data, error: projectsError } = await supabase
      .from("projects")
      .select("id,title,category,location,completed_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (projectsError) {
      setStatus(projectsError.message, true);
      return;
    }

    projects = data || [];
    projectList.innerHTML = projects.length
      ? projects.map((item) => projectListItem(item)).join("")
      : '<p class="text-sm text-slate-500">No projects yet.</p>';
  }

  if (referenceList) {
    const { data, error: refsError } = await supabase
      .from("references")
      .select("id,referee_name,referee_role,issued_date")
      .order("created_at", { ascending: false })
      .limit(20);

    if (refsError) {
      setStatus(refsError.message, true);
      return;
    }

    references = data || [];
    referenceList.innerHTML = references.length
      ? references.map((item) => referenceListItem(item)).join("")
      : '<p class="text-sm text-slate-500">No reference letters yet.</p>';
  }

  setStatus("Dashboard synced.");
}

projectForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    setStatus("Saving project...");
    const imageFile = document.getElementById("project-image").files[0];
    const galleryFiles = document.getElementById(
      "project-gallery-images",
    ).files;
    const extraVideosRaw = document
      .getElementById("project-extra-videos")
      .value.split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const heroImageUrl = await uploadToStorage(imageFile, "projects");
    const galleryUrls = await uploadManyToStorage(
      galleryFiles,
      "projects/gallery",
    );

    const payload = {
      title: document.getElementById("project-title").value.trim(),
      summary: document.getElementById("project-summary").value.trim(),
      category: document.getElementById("project-category").value,
      location: document.getElementById("project-location").value.trim(),
      completed_at: document.getElementById("project-date").value || null,
      youtube_url: document.getElementById("project-youtube").value.trim(),
      hero_image_url: heroImageUrl,
      featured: document.getElementById("project-featured").checked,
    };

    const { data: savedProject, error } = await supabase
      .from("projects")
      .insert([payload])
      .select("id")
      .single();
    if (error) throw error;

    const mediaPayload = [
      ...galleryUrls.map((url, index) => ({
        project_id: savedProject.id,
        media_type: "image",
        media_url: url,
        sort_order: index,
      })),
      ...extraVideosRaw.map((url, index) => ({
        project_id: savedProject.id,
        media_type: "video_link",
        media_url: url,
        sort_order: galleryUrls.length + index,
      })),
    ];

    if (mediaPayload.length) {
      const { error: mediaError } = await supabase
        .from("project_media")
        .insert(mediaPayload);
      if (mediaError) throw mediaError;
    }

    projectForm.reset();
    setStatus("Project saved successfully.");
    await loadDashboardLists();
  } catch (error) {
    setStatus(error.message, true);
  }
});

referenceForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    setStatus("Saving reference letter...");
    const file = document.getElementById("ref-doc").files[0];
    const documentUrl = await uploadToStorage(file, "references");

    const payload = {
      referee_name: document.getElementById("ref-name").value.trim(),
      referee_role: document.getElementById("ref-role").value.trim(),
      company_name: document.getElementById("ref-company").value.trim(),
      summary: document.getElementById("ref-summary").value.trim(),
      issued_date: document.getElementById("ref-date").value || null,
      document_url: documentUrl,
      verified: document.getElementById("ref-verified").checked,
      is_public: document.getElementById("ref-public").checked,
    };

    const { error } = await supabase.from("references").insert([payload]);
    if (error) throw error;

    referenceForm.reset();
    setStatus("Reference saved successfully.");
    await loadDashboardLists();
  } catch (error) {
    setStatus(error.message, true);
  }
});

async function deleteRecord(type, id) {
  if (!id) return;

  const table = type === "project" ? "projects" : "references";
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    setStatus(error.message, true);
    return;
  }

  setStatus(`${type} deleted.`);
  await loadDashboardLists();
}

projectList?.addEventListener("click", async (event) => {
  const btn = event.target.closest('button[data-type="project"]');
  if (!btn) return;
  await deleteRecord("project", btn.dataset.id);
});

referenceList?.addEventListener("click", async (event) => {
  const btn = event.target.closest('button[data-type="reference"]');
  if (!btn) return;
  await deleteRecord("reference", btn.dataset.id);
});

logoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "./login.html";
});

(async function initDashboard() {
  try {
    await requireAdminSession();
    await loadDashboardLists();
  } catch (error) {
    console.error(error.message);
  }
})();
