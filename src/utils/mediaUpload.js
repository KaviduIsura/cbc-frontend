import { createClient } from "@supabase/supabase-js";
const key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZGZxeGFhcG55ZHBmY2tqemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzUwOTIsImV4cCI6MjA1MTA1MTA5Mn0.5zNALwEI1NtNIXd0nZ1l6mp3LUn0PkwkxFMLQoTE0f4`;
const url = "https://ppdfqxaapnydpfckjzbn.supabase.co";

export default function uploadMediaToSupabase(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("File not added");
    }
    let fileName = file.name;
    const extension = fileName.split(".")[fileName.split(".").length - 1];

    const supabase = createClient(url, key);
    const timeStamp = new Date().getTime();
    fileName = timeStamp + "." + extension;

    supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(() => {
        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
        resolve(publicUrl);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
