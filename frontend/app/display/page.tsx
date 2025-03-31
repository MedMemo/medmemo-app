"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import NavLogo from "../../components/NavLogo_Authenticated"

export default function DocumentDisplayPage() {
  const router = useRouter()
  // Placeholder data - this would come from your OCR model in reality
  const [documentContent, setDocumentContent] = useState({
    title: "Medical Report - Dr. Smith",
    date: "2023-11-15",
    doctor: "Dr. Sarah Smith",
    patient: "John Doe",
    content: [
      "Patient presented with persistent headaches and dizziness.",
      "Blood pressure: 130/85 mmHg",
      "Diagnosis: Tension headaches",
      "Prescribed: Ibuprofen 400mg as needed",
      "Follow-up in 2 weeks if symptoms persist"
    ],
    notes: ""
  })

  const handleContentChange = (index: number, newText: string) => {
    const newContent = [...documentContent.content]
    newContent[index] = newText
    setDocumentContent({...documentContent, content: newContent})
  }

  const handleSave = () => {
    // In a real app, this would save the edited content
    alert("Changes saved successfully!")
    router.push("/home") // Navigate back to home or upload page
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
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

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{documentContent.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <p><span className="font-semibold">Date:</span> {documentContent.date}</p>
              <p><span className="font-semibold">Doctor:</span> {documentContent.doctor}</p>
              <p><span className="font-semibold">Patient:</span> {documentContent.patient}</p>
            </div>
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
        </div>
      </div>
    </div>

  )
}