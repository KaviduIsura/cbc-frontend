import { createClient } from "@supabase/supabase-js";

// Use environment variables from Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client once
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function uploadMediaToSupabase(file) {
  if (!file) {
    return Promise.reject("No file provided");
  }

  return new Promise(async (resolve, reject) => {
    try {
      const timeStamp = Date.now();
      const cleanName = file.name.replace(/\s+/g, "-");
      const fileName = `${timeStamp}-${cleanName}`;

      // Upload to the "images" bucket
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        return reject(error.message);
      }

      // Generate a public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      resolve(publicUrl);
    } catch (error) {
      reject(error);
    }
  });
}
