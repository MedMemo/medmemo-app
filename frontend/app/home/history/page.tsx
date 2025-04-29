"use client";

import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen bg-transparent text-gray-200 flex-grow flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-xl p-6">
      </div>
    </main>
  );
}