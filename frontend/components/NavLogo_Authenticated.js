"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const NavLogoAuthenticated = () => {

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

        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/download/${visitId}`);

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

  const handleLogOut = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json ();

      if (!response.ok) {
        console.error("Logout error:", data.error || "An error occured during logout.");
        return;
      }

      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error);
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
              <a href="/account" className={defaultButtonStyle}>Account (Demo)</a>
              
              <button onClick={handleDownload} className={defaultButtonStyle}>
                Download File (Demo)
              </button>
              <button onClick={handleLogOut} className={defaultButtonStyle}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
    
};

export default NavLogoAuthenticated;