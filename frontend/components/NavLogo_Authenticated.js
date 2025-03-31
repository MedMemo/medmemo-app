"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const NavLogo = () => {

  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleHomePage = () => {
    router.push("/home");
  };

  const defaultButtonStyle =
  "block w-full px-4 py-2 text-gray-700 hover:bg-gray-200 transition text-left";

  const handleDownload = async () => {
    const visitId = 1; // Download summary based on visitID
    try {
      // download.py runs on port 5000
        const response = await fetch(`http://127.0.0.1:8080/download/${visitId}`);

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `summary_${visitId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error:", error);
    }
  };

  return (
    <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
      <div className="flex justify-between items-center w-full">
        {/* Logo and Title */}
        <div className="flex items-center cursor-pointer space-x-8" onClick={handleHomePage}>
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
              <a href="/home" className={defaultButtonStyle}>Home</a>
              <a href="/about" className={defaultButtonStyle}>About</a>
              <a href="/upload" className={defaultButtonStyle}>Upload (Demo)</a>
              <a href="/display" className={defaultButtonStyle}>Display (Demo)</a>
              
              <button onClick={handleDownload} className={defaultButtonStyle}>
                Download File (Demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
    
};

export default NavLogo;