'use client';

import { useState, useEffect } from 'react';
import './styles.css';
import NavLogoAuthenticated from '../../components/NavLogo_Authenticated';
import Image from 'next/image';

export default function ContactPage() {
const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);//dropdown menu visible or invisible
const [status, setStatus] = useState<string>('');//submit success or failed
const [showToast, setShowToast] = useState<boolean>(false);//toast notif

  const defaultButtonStyle: string =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 transition";

  useEffect(() => {
    setIsDropdownOpen(false);
  }, []);


  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setStatus('');
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // don't submit empty form
    setStatus(''); // reset status and then submit
    const formData = new FormData(e.target as HTMLFormElement);

    //Web3Form key
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "");

    // convert to JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      // send form to Web3Form
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      if (!response.ok) {//err checking
        const responseText = await response.text();
        console.error("Error:", response.status, responseText);
        throw new Error(`HTTP err. Status: ${response.status}`);
      }

      // get JSON
      const result = await response.json();

      if (result.success) {
        setStatus("Form Sent to Devs!");
        setShowToast(true);
        (e.target as HTMLFormElement).reset();//reset form
      } else {
        setStatus(result.message || "Message failed to send");
        console.error("Err:", result);
      }
    } catch (error) {
      setStatus("Error Occured.");
      console.error("Submission Err:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

    <div className="flex flex-grow">

    {/* Toast Notif*/}
    {showToast && (
  <div
    id="toast-simple"
    className="fixed bottom-4 right-4 flex items-center min-w-[400px] max-w-[600px] min-h-[80px] px-10 py-6 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 text-xl"
    role="alert"
  >
    <div className="flex items-center justify-center gap-4 w-full">
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-500 transform rotate-90"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
        />
      </svg>
      <div className="text-xl font-normal text-center">{status}</div>
    </div>
  </div>
)}

   {/* Contact Us Page */}
   <div className="contact-container flex flex-grow items-start justify-center gap-x-10">

     {/* img and boxes */}
   <div className="left-section flex flex-col items-center gap-2">
      {/* Image on the left */}
  <div className="contact-image-container w-full max-w-[650px]">
    <Image
      src="/images/contact-us.png"
      alt="Contact Us"
      width={650}
      height={300}
      className="contact-image w-full h-auto"
    />
  </div>

 {/* Three Boxes*/}
 <div className="social-boxes flex justify-center gap-7 w-full">
      {/* Box 1 */}
      <a href="https://instagram.com" className="block ">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 w-40 h-40 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-300"
      style={{ boxShadow: "rgba(19, 111, 240, 0.29) -5px 5px, rgba(66, 159, 230, 0.41) -10px 10px, rgba(85, 164, 229, 0.44) -15px 15px, rgba(35, 131, 255, 0.15) -20px 20px, rgba(105, 193, 237, 0.18) -25px 25px" }}
      >
      <p className="text-gray-800 text-xl font-bold">Instagram</p>
        <p className="text-gray-800 text-xl">@medmemo</p>
        <div className="flex justify-center items-center mt-2">
          <Image
            src="/images/instagram.png"
            alt="Instagram Logo"
            width={40}
            height={40}
          />
        </div>
      </div>
      </a>

      {/* Box 2 */}
      <a href="https://x.com" className="block">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 w-40 h-40 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-300"
      style={{ boxShadow: "rgba(19, 111, 240, 0.29) -5px 5px, rgba(66, 159, 230, 0.41) -10px 10px, rgba(85, 164, 229, 0.44) -15px 15px, rgba(35, 131, 255, 0.15) -20px 20px, rgba(105, 193, 237, 0.18) -25px 25px" }}
      >
      <p className="text-gray-800 text-xl font-bold">Twitter</p>
        <p className="text-gray-800 text-xl">@medTweets</p>
        <div className="flex justify-center items-center mt-2">
          <Image
            src="/images/twitter.png"
            alt="Instagram Logo"
            width={40}
            height={40}
          />
        </div>
      </div>
      </a>

      {/* Box 3 */}
      <a href="https://facebook.com" className="block">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 w-40 h-40 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-300 "
      style={{ boxShadow: "rgba(19, 111, 240, 0.29) -5px 5px, rgba(66, 159, 230, 0.41) -10px 10px, rgba(85, 164, 229, 0.44) -15px 15px, rgba(35, 131, 255, 0.15) -20px 20px, rgba(105, 193, 237, 0.18) -25px 25px" }}
      >
      <p className="text-gray-800 text-xl font-bold">Facebook</p>
        <p className="text-gray-800 text-xl">@MedMemo</p>
        <div className="flex justify-center items-center mt-2">
          <Image
            src="/images/facebook.png"
            alt="Instagram Logo"
            width={40}
            height={40}
          />
        </div>
      </div>
      </a>

    </div>
  </div>

        <form onSubmit={handleSubmit} className="contact-left w-full max-w-md p-10">
          <div className="contact-left-title">
          <p className="text-xl font-semibold text-blue-800 -mt-3">  We'd love to hear from you!</p>
            <h2>Contact Us!</h2>
            <hr />
          </div>

          <label htmlFor="name" className="text-gray-600 font-semibold text-xl -mb-6">
    Your Name:
  </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="contact-inputs"
            required
          />
          <label htmlFor="name" className="text-gray-600 font-semibold text-xl -mb-6">
    Your Email:
  </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="contact-inputs"
            required
          />
          <label htmlFor="name" className="text-gray-600 font-semibold text-xl -mb-6">
    Leave Your Message:
  </label>
          <textarea
            name="message"
            placeholder="Message"
            className="contact-inputs"
            required
          />
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
    </div>
 );
}