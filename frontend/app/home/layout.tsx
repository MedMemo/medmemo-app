"use client";
import React from "react";
import SideBar from "@/components/ui/sidebar";

import { useTheme } from "@/context/ThemeContext";

const HomeLayout = ({ children } : {children: React.ReactNode}) => {

  const { theme, updateTheme } = useTheme();

  return (
    <div className="h-screen flex flex-row justify-start">
        <SideBar />
        <div className="min-h-screen text-gray-200 flex flex-grow flex-col"
        style={{
          backgroundColor: theme["main-background"]
        }}>
            {children}
        </div>
    </div>
  );
};

export default HomeLayout;