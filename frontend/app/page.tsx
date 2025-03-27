"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push("/login"); 
  };

  const handleSignUp = () => {
    router.push("/signup")
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center cursor-pointer space-x-8" onClick={handleRedirect}>
            <div className="bg-white p-1 rounded">
              <img
                src="/images/medmemo_logo.png"
                alt="MedMemo Logo"
                className="h-20 w-20"/>
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>
          {/* Sign In and Sign Up Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              className="bg-white text-[#D93D3D] px-4 py-2 text-lg rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition"
              >Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-white text-[#D93D3D] px-4 py-2 text-lg rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition"
              >Sign Up
            </button>
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
            <p className="mt-2 text-gray-800">
              This is a simple Landing Page with a navbar
            </p>
          </div>
        </main>
      </div>

    </div>
  );
}
