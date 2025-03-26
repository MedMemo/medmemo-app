"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload } from "lucide-react"

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null) // Add state for success message
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)

    if (droppedFiles.length > 0) {
      validateAndSetFiles(droppedFiles)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFiles(Array.from(e.target.files))
    }
  }

  const validateAndSetFiles = (selectedFiles: File[]) => {
    const oversizedFiles = selectedFiles.filter((file) => file.size > 5 * 1024 * 1024)

    if (oversizedFiles.length > 0) {
      setError(`File size exceeds the 5MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      return
    }

    setFiles(selectedFiles)
    setError(null)
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null) // Reset success message before uploading

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("file", file)
      })

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "File upload failed")
      }

      const data = await response.json()
      setSuccessMessage(data.message) // Set success message on successful upload
      setFiles([]) // Clear files after upload
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-medium text-gray-800 mb-2">File Upload</h2>
      <p className="text-sm text-gray-600 mb-4">Supported file types: png, pdf, jpg, etc. (&lt;5mb)</p>

      <div
        className={`border-2 border-dashed rounded-md p-8 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } transition-colors duration-200 flex flex-col items-center justify-center min-h-[240px]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-1">Drag and drop your files</p>
          <p className="text-gray-700 font-medium mb-6">here to upload</p>

          <p className="text-gray-500 mb-4">OR</p>

          <button
            onClick={handleBrowseClick}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </button>

          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" multiple />
        </div>
      </div>

      {files.length === 0 && (
        <div className="flex items-center mt-4 text-red-500">
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
            <span className="text-red-500 font-bold">!</span>
          </div>
          <p className="text-sm">No files attached - please upload a file to continue.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center mt-4 text-red-500">
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
            <span className="text-red-500 font-bold">!</span>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center mt-4 text-green-500">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <span className="text-green-500 font-bold">✓</span>
          </div>
          <p className="text-sm">{successMessage}</p> {/* Display success message */}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h3>
          <ul className="text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index} className="mb-1">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}
    </div>
  )
}
