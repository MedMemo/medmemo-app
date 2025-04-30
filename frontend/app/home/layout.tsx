import React from "react";
import SideBar from "@/components/ui/sidebar";

import { useTheme } from "next-themes";

const HomeLayout = ({ children } : {children: React.ReactNode}) => {



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