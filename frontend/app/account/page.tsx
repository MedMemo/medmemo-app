"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavLogoAuthenticated from "../../components/NavLogo_Authenticated";
import NavLogoLogoOnly from "../../components/NavLogo_LogoOnly";

export default function Home() {
const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountAge, setAccountAge] = useState<string>("Calculating...");
  const router = useRouter();

  type User = {
    email: string;
    created_at: string;
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
          credentials: "include",
        });

        if (!response.ok) {
          setError("User is not authenticated. Redirecting...");
          router.push("/");
        } else {
          const data = await response.json();
          setUser(data.user);

          if (data.user?.created_at) {
            updateAccountAge(data.user.created_at);
            const interval = setInterval(() => updateAccountAge(data.user.created_at), 1000);
            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const updateAccountAge = (createdAt: string) => {
    if (!createdAt) return;

    const createdDate = new Date(createdAt);
    const now = new Date();

    let diff = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    const timeUnits = [
      { label: "y", value: Math.floor(diff / (60 * 60 * 24 * 365)) },
      { label: "m", value: Math.floor((diff % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30)) },
      { label: "d", value: Math.floor((diff % (60 * 60 * 24 * 30)) / (60 * 60 * 24)) },
      { label: "h", value: Math.floor((diff % (60 * 60 * 24)) / (60 * 60)) },
      { label: "m", value: Math.floor((diff % (60 * 60)) / 60) },
      { label: "s", value: diff % 60 },
    ];

    const formattedAge = timeUnits
      .filter(unit => unit.value > 0)
      .map(unit => `${unit.value}${unit.label}`)
      .join(" ");

    setAccountAge(formattedAge || "0s");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <NavLogoLogoOnly />
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Loading ...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <NavLogoLogoOnly />
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">{error}</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavLogoAuthenticated />
      <main className="flex-1 p-8">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Account Information
          </h1>
          {user ? (
            <div className="space-y-2 font-semibold text-[#0a0a23]">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <p><strong>Account Age:</strong> {accountAge}</p>
            </div>
          ) : (
            <p className="text-center text-gray-600">No user data available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
