"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js 13 or later
import NavBar from "../../../components/Navbar";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      // Make the fetch request to your Flask API's sign-up endpoint
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/signup", {
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

    <div className="min-h-screen bg-[#ffffff] flex flex-col">

      {/* Navbar */}
      <NavBar />

      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg w-fit">

          <h1 className="font-merriweather text-7xl font-bold text-center text-black mb-6">MedMemo</h1>
          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input type="email"
              id="email"
              aria-describedby="helper-text-explanation"
              className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black
              placeholder:text-center"
              placeholder="email address*"></input>
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

            <div className="mb-6">
              {/* <label htmlFor="confirmPassword" className="block text-gray-800">Confirm Password</label> */}
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 mt-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black
                placeholder:text-center"
                placeholder="confirm password*"
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
