"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavLogoAuthenticated from "../../components/NavLogo_Authenticated";
import NavLogoLogoOnly from "../../components/NavLogo_LogoOnly";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // New error state
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);  // Set loading to true before the request
      setError(null);  // Reset the error state before making the request

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
          credentials: "include", // Include credentials to send cookies
        });


        if (!response.ok) {
          setError("User is not authenticated. Redirecting...");  // Set error if response is not OK
          router.push("/");  // Redirect if not authenticated
        } else {
          const data = await response.json();
          setUser(data.user);  // Store user data in state
          console.log("User data fetched:", data);  // Log the user data
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");  // Set error if an exception is caught
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);  // Set loading to false after the request completes
      }
    };

    fetchUser();
  }, [router]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
        <NavLogoLogoOnly />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">
              Loading ...
            </h1>
          </div>
        </main>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <NavLogoAuthenticated />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div
          className="w-64 text-white p-4 overflow-y-auto h-screen"
          style={{ backgroundColor: "#E0DFDF" }}
        >
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Sidebar Title
          </h2>
          <p className="mb-4 text-center text-gray-600">
            This is a scrollable sidebar.
          </p>
        </div>
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">
              Welcome to the Homepage
            </h1>
            <p className="mt-2 text-gray-600">
              This is a simple homepage with a sidebar beside the navbar.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
}