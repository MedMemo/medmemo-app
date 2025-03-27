'use client';

import { useState, useEffect } from 'react';
import './styles.css';

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
    formData.append("access_key", "10401b94-9770-4647-827c-f13a280bb699");

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

      {/* Navbar */}
      <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="bg-white p-1 rounded">
              <img
                src="/images/medmemo_logo.png"
                alt="MedMemo Logo"
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-white text-[#D93D3D] font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Menu ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white font-bold rounded-md shadow-lg">
                <a href="/" className={defaultButtonStyle}>
                  Home
                </a>
                <a href="/about" className={defaultButtonStyle}>
                  About
                </a>
                <a href="/account" className={defaultButtonStyle}>
                  Account
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contact Form */}
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-left">
          <div className="contact-left-title">
            <h2>Contact Us!</h2>
            <hr />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="contact-inputs"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="contact-inputs"
            required
          />
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
  );
}