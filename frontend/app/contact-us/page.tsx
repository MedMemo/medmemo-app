'use client';

import { useState, useEffect } from 'react';
import './styles.css';

export default function ContactPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const defaultButtonStyle =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 transition";

  //only change state on client-side
  useEffect(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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