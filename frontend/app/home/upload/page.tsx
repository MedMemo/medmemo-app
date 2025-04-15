"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length) {
      setError(`File exceeds 5MB: ${oversizedFiles.map(f => f.name).join(", ")}`);
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
      const formData = new FormData();
      files.forEach(file => formData.append("file", file));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();

      sessionStorage.setItem("ocrData", JSON.stringify(data.ocr_data));
      router.push('/home/display');

    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-main-background text-gray-200 flex-grow flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg bg-sidebar-background rounded-xl p-6 shadow-lg">
        <div
          className={`border-4 border-dashed rounded-lg p-8 transition duration-300 ${
            isDragging ? "border-blue-500 bg-gray-700" : "border-gray-600"
          } flex flex-col items-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="mb-2 text-lg">Drag & drop or browse to upload</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
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
              <div key={idx} className="flex justify-between items-center bg-gray-800 rounded-lg p-3 my-2">
                <div className="flex items-center">
                  <FileText className="text-blue-400 mr-2" />
                  {file.name}
                </div>
                <X className="cursor-pointer text-red-500" onClick={() => setFiles(files.filter(f => f !== file))} />
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
          className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-green-900"
        >
          {uploading ? "Uploading..." : "Upload and Process"}
        </button>
      </div>
    </main>
  );
}
