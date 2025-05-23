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

  const uploadFile = async () => {
    if (!files.length) return;
    setUploading(true);
    setError(null);

    try {

      const userData = JSON.parse(sessionStorage.getItem("userData") || "{}")
      const userId = userData.id
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/database/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `${userId}`,
          },
          body: formData,
        });
      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        throw new Error(uploadData.error || "Upload failed");
      }
      const uploadData = await uploadRes.json();
      sessionStorage.setItem("ocrData", JSON.stringify(uploadData.ocr_data));
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
            className="text-main-text-color w-9 h-9 mb-4"
          />
          <p
            className="text-main-text-color mb-2 text-lg"
          >
            Choose a file or drag & drop it here
          </p>
          <p className="mb-5 text-base text-text-dark-color">
            JPEG, PNG, PDF formats, up to 50MB
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-button-color hover:bg-button-hover
          text-main-text-inverse-color hover:text-main-text-color px-6 py-2 rounded-3xl text-sm"
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
          className="mt-4 w-full py-2
          bg-button-color hover:bg-button-hover
          text-main-text-inverse-color hover:text-main-text-color
          rounded-lg
          disabled:bg-transparent disabled:border-chat-box-background disabled:text-chat-box-background disabled:border-2"
        >
          {uploading ? "Uploading..." : "Upload and Process"}
        </button>
      </div>
    </main>
  );
}