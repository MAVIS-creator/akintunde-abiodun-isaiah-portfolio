import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vlhvqdgokvetrjbjomyh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsaHZxZGdva3ZldHJqYmpvbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTI0MjcsImV4cCI6MjA5MDI4ODQyN30.s83H1Gb3BZLNzT7oaZWHG4QgFsYKThbZwyNUomGu_Vs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log("Verifying Projects...");
  const { data: projects, error: pError } = await supabase.from('projects').select('*');
  if (pError) console.error("Projects Error:", pError.message);
  else console.log(`Found ${projects.length} projects.`);

  console.log("Verifying Media...");
  const { data: media, error: mError } = await supabase.from('project_media').select('*');
  if (mError) console.error("Media Error:", mError.message);
  else console.log(`Found ${media.length} media items.`);

  if (projects) {
    projects.forEach(p => {
      console.log(`- ${p.title} (Hero: ${p.hero_image_url ? 'Yes' : 'No'})`);
    });
  }
}

verify().catch(console.error);
