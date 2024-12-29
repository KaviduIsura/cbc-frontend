import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZGZxeGFhcG55ZHBmY2tqemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzUwOTIsImV4cCI6MjA1MTA1MTA5Mn0.5zNALwEI1NtNIXd0nZ1l6mp3LUn0PkwkxFMLQoTE0f4`;
const url = "https://ppdfqxaapnydpfckjzbn.supabase.co";
export default function FileUploadTest() {
  const [file, setFile] = useState(null);

  function handleUpload() {
    if (file == null) {
      alert("Please select file");
      return;
    }
    console.log(file);
    const fileName = file.name;
    const extension = fileName.split(".")[fileName.split(".").length - 1];

    if (extension != "jpeg" && extension != "png") {
      alert("please select jpg or png file");
      return;
    }
    const supabase = createClient(url, key);
    supabase.storage
      .from("images")
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then((res) => {
        console.log(res);
      });

    const url2 = supabase.storage.from("images").getPublicUrl(file.name);
    console.log(url2);
  }
  return (
    <div>
      <h1>File Upload Test</h1>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
