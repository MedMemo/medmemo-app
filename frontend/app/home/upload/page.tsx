"use client";

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from "react";
import { Upload, FileText, X, AlertTriangle, Trash, ExternalLink, Download, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from '@supabase/supabase-js';

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [activeImageOptions, setActiveImageOptions] = useState<number | null>(null);
  const { theme, updateTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
          { credentials: "include" }
        );
        const userData = await userRes.json();
        const userId = userData.user.id;
  
        const { data: files, error: listError } = await supabase.storage
          .from('documents')
          .list(userId, { limit: 100 });
  
        if (listError) {
          console.error('Error listing user files:', listError);
          return;
        }
  
        const validFiles: { name: string; url: string }[] = [];
  
        for (const file of files || []) {
          if (file.name && (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.pdf'))) {
            const { data: signedUrlData, error: urlError } = await supabase.storage
              .from('documents')
              .createSignedUrl(`${userId}/${file.name}`, 60 * 60); // 1 hour
  
            if (urlError) {
              console.error('Error creating signed URL:', urlError);
              continue;
            }
  
            if (signedUrlData?.signedUrl) {
              validFiles.push({ name: file.name, url: signedUrlData.signedUrl });
            }
          }
        }
  
        setImages(validFiles);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };
  
    fetchImages();
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

  const uploadFiles = async () => {
    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
        { credentials: "include" }
      );

      const userData = await userRes.json();

      const accessToken = userData.user.id;

      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();

      sessionStorage.setItem("ocrData", JSON.stringify(data.ocr_data));
      router.push("/home/display");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
        { credentials: "include" }
      );
      const userData = await userRes.json();
      const userId = userData.user.id;

      const { error } = await supabase.storage
        .from('documents')
        .remove([`${userId}/${imageName}`]);

      if (error) {
        console.error('Error deleting file:', error);
        setError(`Failed to delete ${imageName}`);
        return;
      }

      // Remove the image from the state
      setImages(images.filter(img => img.name !== imageName));
      setActiveImageOptions(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
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
          onClick={uploadFiles}
          disabled={uploading || !files.length}
          className="mt-4 w-full py-2 bg-white hover:bg-green-700 text-black rounded-lg
          disabled:bg-transparent disabled:border-chat-box-background disabled:text-chat-box-background disabled:border-2"
        >
          {uploading ? "Uploading..." : "Upload and Process"}
        </button>

        {/* Display uploaded images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {images.map((image, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <div className="group relative">
                  <img 
                    src={image.url} 
                    alt={image.name} 
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
                        onClick={(e) => openImage(image.url, e)}
                      >
                        <ExternalLink size={16} className="mr-2" /> Open
                      </button>
                      <button 
                        className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-700 text-red-400"
                        onClick={(e) => deleteImage(image.name, e)}
                      >
                        <Trash size={16} className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm break-all">{image.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}