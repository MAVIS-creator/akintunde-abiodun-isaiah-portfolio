import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration from your app's config.js
const supabaseUrl = "https://vlhvqdgokvetrjbjomyh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsaHZxZGdva3ZldHJqYmpvbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTI0MjcsImV4cCI6MjA5MDI4ODQyN30.s83H1Gb3BZLNzT7oaZWHG4QgFsYKThbZwyNUomGu_Vs";
const storageBucket = "portfolio-media";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const projectsData = [
  {
    title: "Residential Duplex Development - Kurudu Housing Estate, Abuja",
    category: "building",
    location: "Kurudu Housing Estate, Abuja",
    summary: "A comprehensive residential construction project featuring modern architectural lines, premium exterior finishing, and integrated landscaping.",
    description: "This project highlights the full lifecycle of a residential duplex. From the structurally sound foundation to the elegant orange and cream exterior palette. It features specialized parapet designs, high-quality window installations, and a fully paved compound using interlocking stones for durability and aesthetic appeal.",
    hero_image: "Building Design (Exterior) at Kurudu Housing Estate, Abuja.jpeg",
    gallery: [
      "Building at Kurudu Housing Estate, Abuja.jpeg",
      "Completed Building at Kurudu Housing Estate, Abuja.jpeg",
      "Interlock Design (Exterior) at Kurudu Housing Estate, Abuja.jpeg",
      "Pillar Design (Exterior) at Kurudu Housing Estate, Abuja.jpeg",
      "Pillar Design (Exterior) at Kurudu Housing Estate, Abuja (2).jpeg",
      "Building Design (Exterior) at Kurudu Housing Estate, Abuja (2).jpeg",
      "Building Design (Exterior) at Kurudu Housing Estate, Abuja (3).jpeg"
    ],
    video_urls: ["https://res.cloudinary.com/djlafgsad/video/upload/v1774872672/Building_Design_at_Kurudu_Housing_Estate_Abuja_strotw.mp4"]
  },
  {
    title: "Decorative Exterior Wall & Pillar Artistry - Ibadan",
    category: "exterior",
    location: "Ibadan, Oyo State",
    summary: "Bespoke exterior wall and pillar finishing featuring handcrafted geometric patterns and textured cement artistry.",
    description: "Specialized in elevating building aesthetics through custom wall designs. This project showcases unique diamond-shaped geometric patterns and textured finishes on perimeter walls and structural pillars, providing a premium, artistic look to the building's exterior.",
    hero_image: "Pillar, Wall Design at Ibadan (Exterior Design).jpeg",
    gallery: [
      "Pillar, Wall Design at Ibadan (Exterior Design) (2).jpeg",
      "Pillar, Wall Design at Ibadan (Exterior Design) (3).jpeg",
      "Pillar, Wall Design at Ibadan (Exterior Design) (4).jpeg",
      "Pillar, Wall Design at Ibadan (Exterior Design) (5).jpeg",
      "Pillar, Wall Design at Ibadan (Exterior Design) (6).jpeg"
    ],
    video_urls: [
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800521/Pillar_Wall_Design_at_Ibadan_Exterior_Design_oeoi5h.mp4",
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800454/Pillar_Design_at_Ibadan_Exterior_Design_jqk1db.mp4"
    ]
  },
  {
    title: "Premium Parapet & Facade Design - OPIC",
    category: "exterior",
    location: "OPIC, Ogun State",
    summary: "Expert installation of building parapets and facade enhancements to improve structural aesthetics.",
    description: "Focus on the top-level architectural details that define a building's silhouette. This project demonstrates the precision molding and finishing of parapets at the OPIC estate, ensuring clean lines and sustainable exterior protection.",
    hero_image: null, // No specific image for this
    gallery: [],
    video_urls: [
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800424/Building_Parapet_Design_at_OPIC_sxg0wv.mp4",
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800417/Building_Parapet_Design_at_OPIC_2_uxohmu.mp4"
    ]
  },
  {
    title: "Architectural Painting & Finishing - Ibadan",
    category: "exterior",
    location: "Ibadan, Oyo State",
    summary: "High-quality exterior painting and surface finishing for large-scale residential buildings.",
    description: "Showcasing the transformative power of professional painting. This project involves the application of premium weather-shield paints with a dual-tone color scheme, highlighting architectural features and providing long-lasting protection against the elements.",
    hero_image: "Pillar, Wall Design at Ibadan (Exterior Design) (5).jpeg",
    gallery: [],
    video_urls: [
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800433/Painted_Building_Design_at_Ibadan_tayh6m.mp4",
      "https://res.cloudinary.com/djlafgsad/video/upload/v1774800412/Painted_Building_Design_at_Ibadan_2_beaqwh.mp4"
    ]
  },
  {
    title: "Custom Flower Pot Molding & Landscape Decor - Ibadan",
    category: "exterior",
    location: "Ibadan, Oyo State",
    summary: "On-site molding of decorative concrete flower pots and landscape elements.",
    description: "Crafting durable and aesthetic landscape accessories. This project involves the manual molding of bell-shaped concrete flower pots, designed to complement the building's exterior design and enhance the green spaces.",
    hero_image: "Flower Pot Dec at Ibadan (Exterior Design).jpeg",
    gallery: [],
    video_urls: ["https://res.cloudinary.com/djlafgsad/video/upload/v1774800403/Flower_Pot_Dec_at_Ibadan_Exterior_Design_shidfn.mp4"]
  },
  {
    title: "Specialized Window Frame & Wall Paving",
    category: "exterior",
    location: "Commercial Site",
    summary: "Precision installation of decorative window frames and brick-textured wall paving.",
    description: "Focused on the finer details of exterior wall cladding. This project features the installation of thick architectural window pre-casts and the application of brick-style wall tiles to create a sophisticated, multi-textured facade.",
    hero_image: "Exterior Window Design.jpeg",
    gallery: ["Exterior Window Design (2).jpeg"],
    video_urls: []
  }
];

async function uploadFile(fileName) {
  if (!fileName) return null;
  const filePath = path.join(__dirname, 'assets', 'images', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .upload(`projects/${Date.now()}_${fileName}`, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }

  const { data: publicData } = supabase.storage
    .from(storageBucket)
    .getPublicUrl(data.path);

  return publicData.publicUrl;
}

async function seed() {
  console.log("Starting seed process...");

  for (const project of projectsData) {
    console.log(`Processing project: ${project.title}`);

    // Upload hero image if exists
    const heroImageUrl = project.hero_image ? await uploadFile(project.hero_image) : null;

    // Create project
    const { data: projectRecord, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        summary: project.summary,
        category: project.category,
        location: project.location,
        hero_image_url: heroImageUrl,
        featured: true // Mark these as featured
      })
      .select()
      .single();

    if (projectError) {
      console.error(`Error creating project ${project.title}:`, projectError.message);
      continue;
    }

    const projectId = projectRecord.id;

    // Upload and link gallery images
    for (const [index, img] of project.gallery.entries()) {
      const url = await uploadFile(img);
      if (url) {
        await supabase.from('project_media').insert({
          project_id: projectId,
          media_type: 'image',
          media_url: url,
          sort_order: index
        });
      }
    }

    // Link videos
    for (const [index, video] of project.video_urls.entries()) {
      await supabase.from('project_media').insert({
        project_id: projectId,
        media_type: 'video_link', // The DB schema uses video_link but my display logic expects Cloudinary links to be handled
        media_url: video,
        sort_order: project.gallery.length + index
      });
    }

    console.log(`Successfully seeded: ${project.title}`);
  }

  console.log("Seed process completed.");
}

seed().catch(console.error);
