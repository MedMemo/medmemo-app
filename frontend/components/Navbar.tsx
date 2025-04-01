"use client";

import { useRouter } from "next/navigation";

const NavBar = () => {

    const router = useRouter();


    return (
        <nav className="text-black text-sm  bg-transparent pt-5 p-4" >
            <div className="flex justify-end">
                <div className="font-semibold">
                    <a onClick={() => router.push('/contact_us')} className="px-4 py-2 hover:text-[#FF6F61] cursor-pointer">
                        Contact Us
                    </a>
                </div>
            </div>
        </nav>
    );

};

export default NavBar;