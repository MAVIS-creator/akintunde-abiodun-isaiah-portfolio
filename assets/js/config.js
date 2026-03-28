export const appConfig = {
  // Use: Project Settings -> API -> Project URL
  supabaseUrl: "https://vlhvqdgokvetrjbjomyh.supabase.co",
  // Use: Project Settings -> API -> anon public key (starts with eyJ...)
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsaHZxZGdva3ZldHJqYmpvbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTI0MjcsImV4cCI6MjA5MDI4ODQyN30.s83H1Gb3BZLNzT7oaZWHG4QgFsYKThbZwyNUomGu_Vs",
  storageBucket: "portfolio-media",
  allowedAdminEmails: ["akintunde.dolapo1@gmail.com", "akintunde.abiodun1@gmail.com"],
};

export const fallbackProjects = [
  {
    id: "sample-1",
    title: "Residential Duplex Construction",
    summary:
      "Complete building project from foundation to finishing with integrated MEP systems.",
    category: "building",
    location: "Lagos, Nigeria",
    completed_at: "2024-11-10",
    featured: true,
    hero_image_url:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    youtube_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  },
  {
    id: "sample-2",
    title: "Exterior Finishing and Compound Development",
    summary:
      "Exterior design, fencing, paving, and drainage layout for a commercial site.",
    category: "exterior",
    location: "Abuja, Nigeria",
    completed_at: "2023-08-21",
    featured: true,
    hero_image_url:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    youtube_url: "",
  },
  {
    id: "sample-3",
    title: "Integrated Electrical and Mechanical Upgrade",
    summary:
      "Electrical rewiring and mechanical systems support for a mixed-use property.",
    category: "electrical",
    location: "Ibadan, Nigeria",
    completed_at: "2022-03-14",
    featured: false,
    hero_image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    youtube_url: "",
  },
];

export const fallbackReferences = [
  {
    id: "ref-1",
    referee_name: "Engr. Joseph Adebayo",
    referee_role: "Project Consultant",
    company_name: "Primeview Realty",
    issued_date: "2024-12-01",
    summary:
      "Confirmed excellent delivery quality, technical depth, and adherence to timeline.",
    document_url: "",
    verified: true,
  },
];



