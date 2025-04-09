"use client";
import { createContext, useState, useContext } from "react";

const initialValue = {
    isCollapsed: false,
    toggleSidebarCollapse: () => {},
};

const SidebarContext = createContext(initialValue);

export const SidebarProvider = ({ children } : {children: React.ReactNode} ) => {
    const [isCollapsed, setCollapse] = useState(false);

    const toggleSidebarCollapse = () => {
        setCollapse((prevState) => !prevState);
    };

    return (
        <SidebarContext.Provider value={{isCollapsed, toggleSidebarCollapse}}>
            {children}
        </SidebarContext.Provider>
    );
};

export function useSideBar(){
    return useContext(SidebarContext)
}