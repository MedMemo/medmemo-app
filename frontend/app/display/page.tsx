"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import NavLogo from "../../components/NavLogo_Authenticated"

interface OCRResult {
  key_value_pairs: Array<{
    key: string
    value: string
    confidence: number
  }>
  content: string[]
  file_type: string
  annotated_image?: string
}

export default function DocumentDisplayPage() {
  const router = useRouter()
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [documentContent, setDocumentContent] = useState({
    title: "",
    date: "",
    content: [] as string[],
    notes: ""
  })

  useEffect(() => {
    // Get the OCR result from localStorage
    const storedResult = localStorage.getItem('ocrResult')
    if (storedResult) {
      const result: OCRResult = JSON.parse(storedResult)
      setOcrResult(result)
      
      // Process the key-value pairs to extract common fields
      const kvPairs = result.key_value_pairs
      const title = kvPairs.find(pair => pair.key.toLowerCase().includes('title'))?.value || "Document"
      const date = kvPairs.find(pair => pair.key.toLowerCase().includes('date'))?.value || ""
      
      setDocumentContent({
        title,
        date,
        content: result.content,
        notes: ""
      })
    } else {
      // No OCR result found, redirect back
      router.push('/upload')
    }
  }, [router])

  const handleContentChange = (index: number, newText: string) => {
    const newContent = [...documentContent.content]
    newContent[index] = newText
    setDocumentContent({...documentContent, content: newContent})
  }

  const handleSave = () => {
    // In a real app, this would save the edited content
    alert("Changes saved successfully!")
    router.push("/home")
  }

  if (!ocrResult) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <NavLogo />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavLogo />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Upload
          </button>

          {ocrResult.annotated_image && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Annotated Document</h2>
              <img 
                src={`data:image/png;base64,${ocrResult.annotated_image}`} 
                alt="Annotated document"
                className="max-w-full border border-gray-200 rounded-md"
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{documentContent.title}</h1>
            {documentContent.date && (
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Date:</span> {documentContent.date}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Content</h2>
            
            <div className="space-y-4 mb-8">
              {documentContent.content.map((line, index) => (
                <div key={index} className="flex items-start">
                  <textarea
                    value={line}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="flex-1 p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={1}
                  />
                </div>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-800 mb-3">Additional Notes</label>
              <textarea
                value={documentContent.notes}
                onChange={(e) => setDocumentContent({...documentContent, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add any additional notes here..."
              />
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key-Value Pairs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ocrResult.key_value_pairs.map((pair, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-700">{pair.key}</p>
                  <p className="text-gray-600">{pair.value}</p>
                  <p className="text-xs text-gray-500">Confidence: {Math.round(pair.confidence * 100)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}