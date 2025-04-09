import React from "react";
import SideBar from "@/components/ui/sidebar";

const HomeLayout = ({ children } : {children: React.ReactNode}) => {
  return (
    <div className="h-screen flex flex-row justify-start">
        <SideBar />
        <div className="min-h-screen bg-main-background text-gray-200 flex flex-grow flex-col">
            {children}
        </div>
    </div>
  );
};

export default HomeLayout;