"use client";
import React, { useEffect } from "react";
import SideBar from "@/components/ui/sidebar";

import { useTheme } from "next-themes";

const HomeLayout = ({ children } : {children: React.ReactNode}) => {

  const { systemTheme, theme, setTheme } = useTheme();


  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }
  , []);

  return (
    <div className="h-screen flex flex-row justify-start">
        <SideBar />
        <div className="bg-main-background min-h-screen text-gray-200 flex flex-grow flex-col">
            {children}
        </div>
    </div>
  );
};

export default HomeLayout;