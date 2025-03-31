"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultButtonStyle =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 transition";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="bg-white p-1 rounded">
              <img
                src="/images/medmemo_logo.png"
                alt="MedMemo Logo"
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>
          {/* Dropdown Menu */}
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="px-4 py-2 bg-white text-[#D93D3D] font-bold rounded-lg hover:bg-gray-200 transition">
              Menu ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white font-bold rounded-md shadow-lg">
                <a href="/" className={defaultButtonStyle}>Home</a>
                <a href="/about" className={defaultButtonStyle}>About</a>
                <a href="/account" className={defaultButtonStyle}>Account</a>

              </div>
            )}
          </div>
        </div>
      </nav>

    <div className="flex flex-grow items-center justify-center p-8">
        <main className="w-full max-w-3xl text-center">
            <h1 className="font-bold text-[50px] text-[#433f3f] mt-10">
                About Us
            </h1>
            <p className="mt-6 text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold text-[#D93D3D]">MedMemo</span> is a powerful web application designed to empower patients with easy access to essential health information.  
      It allows users to seamlessly track and manage their medical documents, helping them stay informed and in control of their health journey.  
      With MedMemo, you can store, organize, and quickly retrieve your healthcare records—all in one place.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            Our goal is to provide users with a clear and concise summary of their medical history. MedMemo makes it easy to understand complex healthcare documents and ensures you never miss out on important medical insights.  
            With additional resources at your fingertips, you'll always have the information you need to make informed decisions about your health.
            </p>
        </main>
    </div>

    <div className="flex flex-grow items-center justify-center p-8">
  <main className="w-full max-w-5xl text-center">
    <h2 className="text-3xl font-bold text-[#433f3f]">
      Features
    </h2>
    <p className="mt-4 text-gray-600 text-lg">
      MedMemo offers a suite of tools to help you manage your health data with ease and security.
    </p>

    {/* Box1 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-upload"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">Upload Documents</h3>
        <p className="mt-2 text-gray-700">
          Upload hospital documents (PDF, DOCX, TXT) with confirmation. Secure storage and fast uploads.
        </p>
      </div>

      {/* Box2 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-camera"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">Document Scanner</h3>
        <p className="mt-2 text-gray-700">
          Scan documents to text with 90% accuracy. Resubmission if blurry or unsupported format.
        </p>
      </div>

      {/* Box3 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-clipboard"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">Summarize Medical Visit</h3>
        <p className="mt-2 text-gray-700">
          Generate concise summaries of visits with key details. Summarized within 1 minute.
        </p>
      </div>

      {/* Box4 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-download"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">Download/Export Summary</h3>
        <p className="mt-2 text-gray-700">
          Download summaries as PDF or text. Option to email to a registered address.
        </p>
      </div>

      {/* Box5 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-comments"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">AI Chatbot</h3>
        <p className="mt-2 text-gray-700">
          Get answers to health-related queries and personalized responses based on your visit history.
        </p>
      </div>

      {/* Box6 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <div className="text-4xl text-[#D93D3D] mb-4">
          <i className="fas fa-book"></i>
        </div>
        <h3 className="text-2xl font-semibold text-[#433f3f]">Suggested Articles</h3>
        <p className="mt-2 text-gray-700">
          Receive recommended articles from verified sources based on your health visit summaries.
        </p>
      </div>
    </div>
  </main>
</div>




    </div>
  );
}