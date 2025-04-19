"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { theme, updateTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const uploadFiles = async () => {
    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      // 🔐 Get access token from Flask endpoint
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}auth/get_user`,
        {
          credentials: "include", // Important to include cookies
        }
      );

      const userData = await userRes.json();

      const accessToken = userData.user.id;
      //console.log(accessToken);

      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}upload`,
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
      </div>
    </main>
  );
}
