"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Dispatch } from "react";
import { Description, Dialog, DialogPanel, DialogTitle,
    Tab, TabGroup, TabList, TabPanel, TabPanels,
    Select, Label, Field, MenuSeparator
} from '@headlessui/react'
import { BsPeople } from "react-icons/bs";
import { VscChromeClose, VscSettingsGear, VscSignOut, VscSend } from "react-icons/vsc";
import { FiMail } from "react-icons/fi";
import Link from "next/link"

import { useTheme } from "next-themes";

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
    {
        name: "History",
        href: "/home/history",
    },
    {
        name: "Medical Reminder",
        href: "/home/calendar",
    }
];

interface userInterface {
    id: string;
    email: string;
    createdAt: string;
}

const Settings = ({ isOpen, setIsOpen, user }: { isOpen: boolean, setIsOpen: Dispatch<React.SetStateAction<boolean>>, user: userInterface }) => {

    const { systemTheme, theme, setTheme } = useTheme();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    };


    // Compute formatted dates
    const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const createdAtString = createdDate.toLocaleDateString();
    const accountAgeInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    return (

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}
        className="relative z-[200]"
        >
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-[rgba(0,0,0,0.36)]">
            <DialogPanel
            className="
            bg-setting-background text-main-text-color
            min-w-lg space-y-4 border border-main-background  px-6 pt-4 pb-8 rounded-2xl shadow-lg">
                <div className="flex w-full justify-between items-center">
                    <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                    <div className="rounded-sm hover:bg-gray-100 p-1">
                        <VscChromeClose className="text-main-text-color"
                        onClick={() => setIsOpen(false)} />
                    </div>
                </div>

                <TabGroup>
                    <TabList
                    className="bg-setting-pill-background text-main-text-color flex space-x-1 rounded-md p-1">
                        <Tab className="w-full rounded-md py-1 px-3 text-sm font-semibold cursor-pointer data-[selected]:shadow-sm focus:outline-none data-[selected]:bg-setting-pill-selected data-[selected]:text-main-text-inverse-color">General</Tab>
                        <Tab className="w-full rounded-md py-1 px-3 text-sm font-semibold cursor-pointer data-[selected]:shadow-sm focus:outline-none data-[selected]:bg-setting-pill-selected data-[selected]:text-main-text-inverse-color">Profile</Tab>
                        <Tab className="w-full rounded-md py-1 px-3 text-sm font-semibold cursor-pointer data-[selected]:shadow-sm focus:outline-none data-[selected]:bg-setting-pill-selected data-[selected]:text-main-text-inverse-color">About</Tab>
                    </TabList>
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <Description>
                                <Field className="flex w-full justify-between">
                                    <Label>Theme</Label>
                                    <Select onChange={handleThemeChange} name="theme" aria-label="Theme" defaultValue={theme}>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </Select>
                                </Field>
                            </Description>
                        </TabPanel>
                        <TabPanel>
                            <Description
                            className="text-main-text-color"
                            >
                                <div className="space-y-2 font-semibold">
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Created At:</strong> {createdAtString}</p>
                                    <p><strong>Account Age:</strong> {accountAgeInDays} days</p>
                                </div>
                            </Description>
                        </TabPanel>
                        <TabPanel>
                            <Description className="space-y-4 text-main-text-color">
                                {/* Logo */}
                                <div className="flex justify-center">
                                </div>
                                {/* About text */}
                                <h2 className="text-lg font-semibold">About Us</h2>
                                <p className="text-sm font-semibold">
                                    MedMemo helps you upload, scan, summarize and export your medical documents—all in one secure place.
                                </p>
                                {/* Features list */}
                                <ul className="list-disc list-inside text-sm space-y-1 font-semibold">
                                    <li><i className="fas fa-upload" /> Upload: PDF, DOCX, TXT securely</li>
                                    <li><i className="fas fa-camera" /> Scan: 90%+ accuracy, auto-resubmit blurry scans</li>
                                    <li><i className="fas fa-clipboard" /> Summarize: Key visit details in 1 min</li>
                                    <li><i className="fas fa-download" /> Export: PDF/text or email summaries</li>
                                    <li><i className="fas fa-comments" /> Chatbot: Health Q&A based on your history</li>
                                    <li><i className="fas fa-book" /> Articles: Curated reading based on summaries</li>
                                </ul>
                            </Description>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[200]">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40">
            <DialogPanel className="min-w-lg w-[28rem] space-y-4 bg-white border px-6 pt-4 pb-8 rounded-2xl shadow-lg">
              <div className="flex w-full justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                <button onClick={() => setIsOpen(false)} className="rounded-sm hover:bg-gray-100 p-1">
                  <VscChromeClose className="text-black" />
                </button>
              </div>
      
              <TabGroup>
                <TabList className="flex space-x-2 rounded-md bg-gray-100 p-1">
                  <Tab className="w-full rounded-md py-1 px-3 text-sm font-medium text-gray-700 data-[selected]:bg-white data-[selected]:shadow-sm focus:outline-none">General</Tab>
                  <Tab className="w-full rounded-md py-1 px-3 text-sm font-medium text-gray-700 data-[selected]:bg-white data-[selected]:shadow-sm focus:outline-none">Profile</Tab>
                  <Tab className="w-full rounded-md py-1 px-3 text-sm font-medium text-gray-700 data-[selected]:bg-white data-[selected]:shadow-sm focus:outline-none">About</Tab>
                </TabList>
      
                <TabPanels className="mt-4 text-sm text-gray-700">
                  <TabPanel>
                    <Description>
                      <Field className="flex justify-between items-center">
                        <Label>Theme</Label>
                        <Select onChange={handleThemeChange} name="theme" aria-label="Theme">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </Select>
                      </Field>
                    </Description>
                  </TabPanel>
      
                  <TabPanel>
                    <Description>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Created At:</strong> {createdAtString}</p>
                        <p><strong>Account Age:</strong> {accountAgeInDays} days</p>
                      </div>
                    </Description>
                  </TabPanel>
      
                  <TabPanel>
                    <Description className="space-y-4">
                      <h2 className="text-lg font-semibold">About Us</h2>
                      <p>MedMemo helps you upload, scan, summarize and export your medical documents—all in one secure place.</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Upload: PDF, DOCX, TXT securely</li>
                        <li>Scan: 90%+ accuracy, auto-resubmit blurry scans</li>
                        <li>Summarize: Key visit details in 1 min</li>
                        <li>Export: PDF/text or email summaries</li>
                        <li>Chatbot: Health Q&A based on your history</li>
                        <li>Articles: Curated reading based on summaries</li>
                      </ul>
                    </Description>
                  </TabPanel>
                </TabPanels>
              </TabGroup>

            </DialogPanel>
          </div>
        </Dialog>
    );
};

const PopUp = ({ setIsOpen, user }: { setIsOpen: Dispatch<React.SetStateAction<boolean>>, user: userInterface }) => {
    const router = useRouter();
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const handleLogOut = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (!response.ok) {
                console.error("Logout error:", data.error || "An error occured during logout.");
                return;
            }

            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            {isSettingOpen &&
                <Settings isOpen={isSettingOpen} setIsOpen={setIsSettingOpen} user={user} />}

            <div className="bottom-[4.5rem] origin-top-right absolute left-[1rem] mt-2 -mr-1 rounded-md shadow-lg z-100">
                <div className="py-3 px-2 rounded-md shadow-xs relative font-semibold bg-setting-background ">
                    <a onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSettingOpen(open => !open);
                    }} className="flex items-center gap-2 px-4 py-2 text-base rounded-md hover:bg-setting-hover transition ease-in-out duration-150 text-main-text-color">
                        <VscSettingsGear className="w-5.5 h-5.5" />
                        Settings
                    </a>
                    <Link href="/home/contact-us" className="flex items-center gap-2 px-4 py-2 text-base rounded-md hover:bg-setting-hover transition ease-in-out duration-150 text-main-text-color" onClick={() => setIsOpen(false)}>
                        <VscSend className="w-5.5 h-5.5" />
                        <span className="flex-1 whitespace-nowrap">Contact us</span>
                    </Link>
                    <a onClick={handleLogOut}
                    className="text-main-text-color flex items-center gap-2 px-4 py-2 text-base rounded-md hover:bg-setting-hover transition ease-in-out duration-150">
                        <VscSignOut className="w-5.5 h-5.5" />
                        Log out
                    </a>
                </div>
            </div>
        </>
    );
};

const SideBar = () => {

    const pathname = usePathname()
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [user, setUser] = useState<userInterface>({
        id: "",
        email: "",
        createdAt: "",
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
            setUser({ id: data.user.id, email: data.user.email, createdAt: data.user.created_at });
            return data;
        })
        .catch((error) => {
            console.error("Error fetching user info:", error);
        })
    }

    return (
        <>
            {isPopUpOpen &&
                <PopUp setIsOpen={setIsPopUpOpen} user={user} />}

            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" className="flex flex-col top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 p-3 text-main-text-color bg-sidebar-background" aria-label="Sidebar">
                <div className="flex flex-1 py-4 overflow-y-auto">

                        <ul className="w-full space-y-2 font-medium">
                            <li>
                                <a href="/home" className="text-sidebar-logo flex items-center p-2 pb-7 rounded-lg ">
                                    <span className="text-4xl ms-3">MedMemo</span>
                                </a>
                            </li>
                            {sidebarItems.map(({ name, href, icon: Icon }) => {
                                return (
                                <li className="w-full"  key={name}>

                                    <Link
                                    className={`text-main-text-color flex items-center p-2  rounded-md hover:bg-sidebar-hover group ${pathname === href ? 'bg-sidebar-hover' : ''}`}
                                    href={href}
                                    >

                                        <span className="flex-1 ms-3 whitespace-nowrap">{name}</span>
                                    </Link>
                                </li>
                                );
                            })}
                        </ul>
                </div>
                <div className="flex text-white ">
                    {user
                        ? <button className="w-full" onClick={() => setIsPopUpOpen(isPopUpOpen => !isPopUpOpen)}>
                            <div
                            className="
                            text-main-text-color
                            hover:bg-sidebar-hover rounded-lg flex p-3">{user.email}</div>
                        </button>
                        : ""
                    }
                </div>
            </aside>
        </>
    );
};

export default SideBar;