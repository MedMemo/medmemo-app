"use client";

import NavLogo from "../../components/NavLogo_Authenticated";

const features = [
  {
    icon: "fas fa-upload",
    title: "Upload Documents",
    description:
      "Upload hospital documents (PDF, DOCX, TXT) with confirmation. Secure storage and fast uploads.",
  },
  {
    icon: "fas fa-camera",
    title: "Document Scanner",
    description:
      "Scan documents to text with 90% accuracy. Resubmission if blurry or unsupported format.",
  },
  {
    icon: "fas fa-clipboard",
    title: "Summarize Medical Visit",
    description:
      "Generate concise summaries of visits with key details. Summarized within 1 minute.",
  },
  {
    icon: "fas fa-download",
    title: "Download/Export Summary",
    description:
      "Download summaries as PDF or text. Option to email to a registered address.",
  },
  {
    icon: "fas fa-comments",
    title: "AI Chatbot",
    description:
      "Get answers to health-related queries and personalized responses based on your visit history.",
  },
  {
    icon: "fas fa-book",
    title: "Suggested Articles",
    description:
      "Receive recommended articles from verified sources based on your health visit summaries.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <NavLogo />

      <div className="flex flex-grow items-center justify-center p-8">
        <main className="w-full max-w-3xl text-center">
          <h1 className="font-bold text-[50px] text-[#433f3f] mt-10">About Us</h1>
          <p className="mt-6 text-gray-700 leading-relaxed text-lg">
            <span className="font-semibold text-[#D93D3D]">MedMemo</span> is a
            powerful web application designed to empower patients with easy
            access to essential health information. It allows users to seamlessly
            track and manage their medical documents, helping them stay informed
            and in control of their health journey. With MedMemo, you can store,
            organize, and quickly retrieve your healthcare records—all in one
            place.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            Our goal is to provide users with a clear and concise summary of
            their medical history. MedMemo makes it easy to understand complex
            healthcare documents and ensures you never miss out on important
            medical insights. With additional resources at your fingertips,
            you'll always have the information you need to make informed
            decisions about your health.
          </p>
        </main>
      </div>

      <div className="flex flex-grow items-center justify-center p-8">
        <main className="w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-[#433f3f]">Features</h2>
          <p className="mt-4 text-gray-600 text-lg">
            MedMemo offers a suite of tools to help you manage your health data
            with ease and security.
          </p>

          {/* Dynamic feature boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
              >
                <div className="text-4xl text-[#D93D3D] mb-4">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="text-2xl font-semibold text-[#433f3f]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
