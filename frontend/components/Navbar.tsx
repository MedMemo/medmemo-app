"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


const NavBar = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {

        const fetchUser = async () => {
            setIsLoading(true);  // Set loading to true before the request

            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
                    credentials: "include", // Include credentials to send cookies
                });

                if (!response.ok) {
                    console.log("User is not authenticated. Redirecting...");
                } else {
                    // Log the user data
                    setIsAuthenticated(() => !isAuthenticated);  // Store user data in state
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);  // Set loading to false after the request completes
            }
        };

        fetchUser();

    }, [])


    return (
        <nav className="text-black text-sm  bg-transparent pt-5 p-4" >
            <div className="flex justify-end">
                {isAuthenticated &&
                <h1 className="font-merriweather text-3xl font-bold text-center text-black mb-6">
                    User is authenticated
                </h1>
                }
                <div className="font-semibold">
                    <a onClick={() => router.push('/contact_us')} className="px-4 py-2 hover:text-[#FF6F61] cursor-pointer">
                        Contact Us
                    </a>
                    <a onClick={() => router.push('/about')} className="px-4 py-2 hover:text-[#FF6F61] cursor-pointer">
                        About
                    </a>
                </div>
            </div>
        </nav>
    );

};

export default NavBar;