"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js 13 or later

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      // Make the fetch request to your Flask API's sign-up endpoint
      const response = await fetch(process.env.BASE_URL + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // Ensure credentials are included
        body: JSON.stringify({
          email,
          password, // Send email and password to the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess("Sign Up Success!");
        console.log("User created:", data);
        router.push("/home");  // Redirect to home page or login page after successful sign-up
      }

      // Reset form data
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error signing up:", err);
      setError("An unexpected error occurred.");
    }
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
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-3xl font-bold text-center text-black mb-6">Sign Up</h2>

          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-800">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-800">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-[#D93D3D] text-white font-bold text-lg rounded-lg hover:bg-[#FF5757] transition">
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-gray-800">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>

    </div>
  );
}
