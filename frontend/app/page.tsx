"use client";

import { useRouter } from "next/navigation";
import NavLogo from "../components/NavLogo_LandingPage"

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
      <NavLogo />
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
