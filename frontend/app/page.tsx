"use client";

import { useRouter } from "next/navigation";
import landing_page_image from "../public/images/landing_page_image.svg";

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
    <div className="min-h-screen bg-[#FFECE5] flex-col text-black">

      <main className="flex flex-col-reverse md:flex-row md:justify-center md:items-center flex-grow align-middle pt-12">

          <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">

            <div className="flex flex-col w-2/5 justify-center align-middle items-start text-center md:text-left">
              <h1 className="mb-2 text-5xl font-bold leading-tight">
                MedMemo
              </h1>
              <p className="leading-normal text-lg mb-4">
                Keeping track of your medical visits shouldn’t be complicated.
                MedMemo helps you create clear, structured notes from your healthcare
                provider visits, ensuring you never miss important details
              </p>
              <button className="text-sm rounded-md lg:mx-0 hover:underline text-white bg-[#DB5972] font-bold py-2 px-6 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              onClick={handleSignUp}>
                Try Now
              </button>
            </div>

            <div className=" w-3/5 py-6 text-center">
              <img
                src={landing_page_image.src}
                alt="Landing Page"
                className="w-full h-auto object-cover"
              />
            </div>

        </div>
      </main>
    </div>
  );
}
