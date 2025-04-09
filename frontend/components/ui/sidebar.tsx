"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import Link from "next/link"
import { useSideBar } from "@/app/context/SidebarContext";

const sidebarItems = [

    {
        name: "History",
        href: "/upload",
        icon: BsPeople,
    },
    {
        name: "Chat",
        href: "/chat",
        icon: FiMail,
    },
];


const SideBar = () => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const { isCollapsed, toggleSidebarCollapse } = useSideBar()
    const pathname = usePathname()

    return (
        <div>
            <button className="btn" onClick={toggleSidebarCollapse}>
                {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
            </button>
            <aside className="w-[17rem] h-full bg-red transition-all duration-[0.4s] ease-[cubic-bezier(0.175,0.885,0.32,1.1)] overflow-hidden p-4" data-collapse={isCollapsed}>
                <div className="w-max flex items-center gap-4 border-b-black mb-4 pb-4 border-b border-solid">
                    <p className="text-[1.2rem] font-semibold text-black">MedMemo</p>
                </div>
                <ul className="list-none">
                {sidebarItems.map(({ name, href, icon: Icon }) => {
                    return (
                    <li className="sidebar__item" key={name}>
                        <Link
                        className={`text-base no-underline text-black flex  mb-4 px-4 py-[0.8rem] rounded-[0.8rem] ${
                            pathname === href ? "text-white bg-emerald-500" : ""
                        }`}
                        href={href}
                        >
                            <span className="inline-block text-[1.2rem]">
                                <Icon />
                            </span>
                            <span className="ml-2">{name}</span>
                        </Link>
                    </li>
                    );
                })}
                </ul>
            </aside>
        </div>
    );

};

export default SideBar;