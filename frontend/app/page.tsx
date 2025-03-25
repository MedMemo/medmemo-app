"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultButtonStyle =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 transition";

  const handleLogin = () => {
    router.push("/login"); // Redirects to the login page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav style={{ backgroundColor: "#d93d3d" }} className="text-white p-4">
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
        </div>
      </nav>

      <div className="flex flex-grow">


        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">
              Welcome to the Landing Page
            </h1>
            <p className="mt-2 text-gray-600">
              This is a simple Landing Page with a navbar
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
