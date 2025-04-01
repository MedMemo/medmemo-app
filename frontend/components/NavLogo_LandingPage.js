"use client";

import { useRouter } from "next/navigation";

const NavLogo = () => {

  const router = useRouter();

  const handleLandingPage = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push("/login"); 
  };

  const handleSignUp = () => {
    router.push("/signup")
  };

    return (
        <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center cursor-pointer space-x-8" onClick={handleLandingPage}>
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
    );
    
};

export default NavLogo;