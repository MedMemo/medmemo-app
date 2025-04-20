"use client"
import React, { useContext, createContext, useEffect } from "react";

interface Props {
    children ?: React.ReactNode;
}

export interface Theme {
        "name": string,
        "sidebar-background": string,
        "sidebar-logo": string,
        "sidebar-hover": string,
        "button-color": string,
        "main-background": string,
        "main-text-color": string,
        "main-text-inverse-color": string,
        "text-light-color": string,
        "text-dark-color": string,
        "chat-box-background": string,
        "setting-background": string,
};

const themeMap: { [key: string] : Theme} = {
    'light': {
        "name": "light",
        "sidebar-background": "#FFF9F9",
        "sidebar-logo": "#000000",
        "sidebar-hover": "#FEDBDC",
        "main-background": "#FFFFFF",
        "button-color": "#000000",
        "main-text-color": "#000000",
        "main-text-inverse-color": "#FFFFFF",
        "text-light-color": "#CFCFCF",
        "text-dark-color": "#A39A9A",
        "chat-box-background": "#F3ECEC",
        "setting-background": "#FFFFFF",
    },

    'dark': {
        "name": "dark",
        "sidebar-background": "#272121",
        "sidebar-logo": "#D4ABAB",
        "sidebar-hover": "#4F3E3E",
        "button-color": "#FFFFFF",
        "main-background": "#2D2929",
        "main-text-color": "#FFFFFF",
        "main-text-inverse-color": "#000000",
        "text-light-color": "#CFCFCF",
        "text-dark-color": "#A39A9A",
        "chat-box-background": "#473A3A",
        "setting-background": "#463a3a",
    },
}

// Type for the context
// This is basically the type for all the value we're passing down
// to all the props that are using it
interface ThemeContextInterface {
    theme: Theme;
    updateTheme: (theme: string) => void;
    themeMap: { [key: string] : Theme};
}

// The initial value for it
const InitThemeContext = {
    theme: themeMap["light"],
    updateTheme: (theme: string) => {},
    themeMap: themeMap
}

const ThemeContext = createContext<ThemeContextInterface>(InitThemeContext);

export function ThemeProvider({ children } : Props ) {

    const [theme, setTheme] = React.useState<Theme>(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme && themeMap[storedTheme] ? themeMap[storedTheme] : themeMap["light"];
    });

    function updateTheme(theme: string) {
        localStorage.setItem("theme", theme);
        return setTheme(themeMap[theme]);
    }

    return (
        <ThemeContext.Provider
        value={{theme, updateTheme, themeMap}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(){
    return useContext(ThemeContext)
}