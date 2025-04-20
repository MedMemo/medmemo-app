"use client"
import { useTheme } from "@/context/ThemeContext"

export default function UploadedDocuments() {

    const { theme, updateTheme } = useTheme();

    function fetchAllDocuments() {

    }

    return (
        <main className="flex flex-col px-24 py-12">
            <h1 className="text-2xl font-semibold pb-3"> Files </h1>
            <p className="text-base font-semibold pb-6"> Find all of your uploaded documents right here. </p>
            <div className="relative overflow-x-auto">
                <table className="w-full min-h-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                    className="text-xs uppercase"
                    style={{
                        color: theme["main-text-color"]
                    }}>
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                File Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                File Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                File Size
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Uploaded Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {/* Action */}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className=" border-b  border-gray-200 hover:bg-sidebar-hover "
                        style={{
                            color: theme["main-text-color"]
                        }}>
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                            <td className="px-6 py-4">
                                Laptop
                            </td>
                            <td className="px-6 py-4">
                                $2999
                            </td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>

                        <tr className=" border-b  border-gray-200 hover:bg-sidebar-hover "
                        style={{
                            color: theme["main-text-color"]
                        }}>
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                            <td className="px-6 py-4">
                                Laptop
                            </td>
                            <td className="px-6 py-4">
                                $2999
                            </td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    )
}