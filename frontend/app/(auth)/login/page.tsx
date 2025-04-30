"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/login", {
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


      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg w-fit">

          <h1 className="text-7xl font-bold text-center text-black mb-6">MedMemo</h1>
          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input type="email"
              id="email"
              aria-describedby="helper-text-explanation"
              className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black
              placeholder:text-center"
              placeholder="email address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required></input>
            </div>

            <div className="mb-4">
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black
                placeholder:text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="password*"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-[#D93D3D] text-white font-bold text-lg rounded-lg hover:bg-[#FF5757] transition">
                Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-800">
            Already have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
