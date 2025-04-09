"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import Link from "next/link"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const sidebarItems = [

    {
        name: "Upload",
        href: "/home/upload",
        icon: BsPeople,
    },
    {
        name: "Chat",
        href: "/home/chat",
        icon: FiMail,
    },
];

interface userInterface {
    id: string;
    email: string;
}


const SideBar = () => {

    const pathname = usePathname()
    const [user, setUser] = useState<userInterface>({
        id: "",
        email: "",
    })

    useEffect(() => {
        userInfo()
    }, [])


    async function userInfo () {

        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
            credentials: "include"
        })
        .then((res: Response) => {
            if(!res.ok) throw new Error(res.statusText);
            else return res.json();
        })
        .then((data) => {
            console.log("User info:", data.user.email);
            setUser({"id": data.user.id, "email": data.user.email})
            return data;
        })
        .catch((error) => {
            console.error("Error fetching user info:", error);
        })
    }


    return (
        <>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" className="bg-sidebar-background flex flex-col top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 p-3" aria-label="Sidebar">
                <div className="flex flex-1 py-4 overflow-y-auto  dark:bg-gray-800 ">
                        <ul className="w-full space-y-2 font-medium">
                            <li>
                                <a href="/home" className="flex items-center p-2 text-sidebar-logo rounded-lg dark:text-white">
                                    <span className="text-4xl ms-3">MedMemo</span>
                                </a>
                            </li>
                            {sidebarItems.map(({ name, href, icon: Icon }) => {
                                return (
                                <li className="w-full"  key={name}>

                                    <Link
                                    className={`flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-sidebar-hover dark:hover:bg-gray-700 group ${
                                        pathname === href ? "bg-sidebar-hover" : ""
                                    }`}
                                    href={href}
                                    >

                                        <span className="flex-1 ms-3 whitespace-nowrap">{name}</span>
                                    </Link>
                                </li>
                                );
                            })}
                        </ul>
                </div>
                <div className="flex text-white  " >
                    {user
                        ? <div className="w-full hover:bg-sidebar-hover rounded-lg flex p-3">{user.email}</div>
                        : ""
                    }
                </div>
            </aside>
        </>
    );

};

export default SideBar;