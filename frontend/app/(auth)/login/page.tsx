"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavLogo from "../../../components/NavLogo_LogoOnly"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.BASE_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure credentials are included
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid login credentials.");
      } else {
        setSuccess("Login successful!");
        console.log("Logged in:", data);
        router.push("/home"); // Redirect to home page or wherever after successful login
      }

      // Reset form data
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <NavLogo />

      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-3xl font-bold text-center text-black mb-6">Login</h2>
          {/* Login Form */}
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
            <div className="mb-6">
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

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-[#D93D3D] text-white font-bold text-lg rounded-lg hover:bg-[#FF5757] transition">
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-800">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline hover:text-">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
