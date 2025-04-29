"use client";

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from "react";
import { Upload, FileText, X, AlertTriangle, Trash, ExternalLink, Download, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pastFiles, setPastFiles] = useState<{ name: string; url: string }[]>([]);
  const [activeImageOptions, setActiveImageOptions] = useState<number | null>(null);
  const { theme, updateTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndSetFiles(Array.from(e.target.files));
  };

  const validateAndSetFiles = (selectedFiles: File[]) => {
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length) {
      setError(
        `File exceeds 5MB: ${oversizedFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }
    setFiles(selectedFiles);
    setError(null);
  };

  const openImage = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    window.open(url, '_blank');
    setActiveImageOptions(null);
  };

  const toggleImageOptions = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageOptions(activeImageOptions === idx ? null : idx);
  };

  const uploadFile = async () => {
    if (!files.length) return;
    setUploading(true);
    setError(null);

    try {

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
        { credentials: "include" }
      );
      const userData = await userRes.json();
      const userId = userData.user.id;
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/database/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `${userId}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const uploadData = await response.json();
        throw new Error(uploadData.error || "Upload failed");
      }
      const data = await response.json();
      sessionStorage.setItem("ocrData", JSON.stringify(data.ocr_data));
      const fileMetadata = files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      sessionStorage.setItem("filesMetadata", JSON.stringify(fileMetadata));
      router.push("/home/display");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (targetFileName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
        { credentials: "include" }
      );
      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userRes.json();
      const userId = userData.user.id;

      const deleteRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/database/remove/${encodeURIComponent(targetFileName)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${userId}`,
          },
        }
      );
      const deleteData = await deleteRes.json();
      if (!deleteRes.ok) {
        console.error("Error deleting file:", deleteData);
        setError(deleteData.error || `Failed to delete ${targetFileName}`);
        return;
      }

      // Remove the image from the state
      setPastFiles(pastFiles.filter(file => file.name !== targetFileName));
      setActiveImageOptions(null);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    }
  };


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
          { credentials: "include" }
        );
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userRes.json();
        const userId = userData.user.id;
  
        // Fetch list of files
        const listFilesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/database/list_files`,
          {
            method: "GET",
            headers: {
              Authorization: `${userId}`,
            },
          }
        );
        if (!listFilesRes.ok) {
          throw new Error('Failed to fetch file list');
        }
        const listFilesData = await listFilesRes.json();
  
        const validFiles: { name: string; url: string }[] = [];
  
        // Fetch signed URLs for each file
        for (const file of listFilesData.files || []) {
          if (
            file.name &&
            (file.name.endsWith(".png") ||
              file.name.endsWith(".jpg") ||
              file.name.endsWith(".jpeg") ||
              file.name.endsWith(".pdf"))
          ) {
            const signedUrlRes = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/database/get_signed_url/${file.name}`,
              {
                method: "GET",
                headers: {
                  Authorization: `${userId}`,
                },
              }
            );
            if (!signedUrlRes.ok) {
              console.error(`Error fetching signed URL for ${file.name}:`, await signedUrlRes.json());
              setError(`Error fetching signed URL for ${file.name}`); 
            }
  
            const signedUrlData = await signedUrlRes.json();
  
            if (signedUrlData.signed_url) {
              validFiles.push({ name: file.name, url: signedUrlData.signed_url });
            } else {
              console.error(`No signed URL found for ${file.name}`);
              setError(`No signed URL found for ${file.name}`); 
            }
          }
        }
  
        setPastFiles(validFiles);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to load filess.");
      }
    };
    fetchFiles();
  }, []);
   
  useEffect(() => {
    // Handle clicks outside the dropdown menu
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setActiveImageOptions(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [optionsRef]);

  
  return (
    <main className="min-h-screen bg-transparent text-gray-200 flex-grow flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-xl p-6">
        <div
          className={`border-5 border-dashed rounded-3xl p-6 transition duration-300 ${
            isDragging
              ? "border-blue-500 bg-gray-700"
              : "border-chat-box-background"
          } flex flex-col items-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload
            className="w-9 h-9 mb-4"
            style={{
              color: theme["main-text-color"],
            }}
          />
          <p
            className="mb-2 text-lg"
            style={{
              color: theme["main-text-color"],
            }}
          >
            Choose a file or drag & drop it here
          </p>
          <p className="mb-5 text-base text-text-dark-color">
            JPEG, PNG, PDF formats, up to 50MB
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 hover:bg-gray-200 rounded-3xl text-black text-sm"
            style={{
              backgroundColor: theme["button-color"],
              color: theme["main-text-inverse-color"],
            }}
          >
            Browse Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-800 rounded-lg p-3 my-2"
              >
                <div className="flex items-center">
                  <FileText className="text-blue-400 mr-2" />
                  {file.name}
                </div>
                <X
                  className="cursor-pointer text-white"
                  onClick={() => setFiles(files.filter((f) => f !== file))}
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-800 p-3 mt-2 rounded-lg flex items-center">
            <AlertTriangle className="mr-2" /> {error}
            <button 
              className="ml-auto text-white" 
              onClick={() => setError(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          onClick={uploadFile}
          disabled={uploading || !files.length}
          className="mt-4 w-full py-2 bg-white hover:bg-green-700 text-black rounded-lg
          disabled:bg-transparent disabled:border-chat-box-background disabled:text-chat-box-background disabled:border-2"
        >
          {uploading ? "Uploading..." : "Upload and Process"}
        </button>

        {/* Display past files */}
        {pastFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {pastFiles.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <div className="group relative">
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="w-32 h-32 object-cover rounded-md mb-2" 
                  />
                  <button 
                    className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full opacity-70 hover:opacity-100"
                    onClick={(e) => toggleImageOptions(idx, e)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {activeImageOptions === idx && (
                    <div 
                      ref={optionsRef}
                      className="absolute right-0 mt-1 bg-gray-800 rounded-md shadow-lg z-10 w-36"
                    >
                      <button 
                        className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-700"
                        onClick={(e) => openImage(file.url, e)}
                      >
                        <ExternalLink size={16} className="mr-2" /> Open
                      </button>
                      <button 
                        className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-700 text-red-400"
                        onClick={(e) => deleteFile(file.name, e)}
                      >
                        <Trash size={16} className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm break-all">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}