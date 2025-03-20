import React from "react";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient("your_project_url", "your_supabase_api_key");

// Upload file using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("bucket_name")
    .upload("file_path", file);
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

const Upload = () => {
  return <div>Upload</div>;
};

export default Upload;
