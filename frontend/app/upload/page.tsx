"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, FileText, X, CheckCircle2, AlertTriangle } from "lucide-react"

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

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
      setSuccessMessage(data.message)
      setFiles([])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Files</h2>
          <p className="text-sm text-gray-500">Supported types: png, pdf, jpg (Max 5MB)</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-all duration-300 ${
            isDragging 
              ? "border-blue-500 bg-blue-50 scale-105" 
              : "border-gray-300 hover:border-blue-400"
          } flex flex-col items-center justify-center min-h-[200px]`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Drag and drop files here</p>
          <p className="text-gray-500 mb-4">or</p>
          <button
            onClick={handleBrowseClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
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
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Files:</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center bg-red-50 p-3 rounded-md mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center bg-green-50 p-3 rounded-md mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {files.length > 0 && (
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors 
              disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </button>
        )}
      </div>
    </div>
  )
}