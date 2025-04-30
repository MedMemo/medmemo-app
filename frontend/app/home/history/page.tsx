"use client";

import { ExternalLink, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HistoryItem {
  file_name: string;
  summary?: string;
  articles?: Record<string, Article[]>;
}

interface Article {
  Title: string;
  URL: string;
  Author?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<{ [fileName: string]: string }>({}); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [selectedFile, setSelectedFile] = useState<HistoryItem | null>(null);
  const [userId, setUserId] = useState<string>('');
  const optionsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      setError('Base URL is not defined.');
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const userRes = await fetch(
          `${baseUrl}/auth/get_user`,
          { credentials: "include" }
        );
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userRes.json();
        setUserId(userData.user.id);

        const historyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/database/get_history`, 
          {
            method: "GET",
            headers: {
              Authorization: `${userId}`
            }
          });
        if (!historyRes.ok) {
          const historyData = await historyRes.json();
          throw new Error(historyData.error || "get history failed");
        }

        const historyData = await historyRes.json();
        setHistory(historyData.history)
        
        const fetchSignedUrls = async () => {
          const fileUrls: { [fileName: string]: string } = {};
          for (const item of historyData.history) {
            const fileName = item.file_name;

            // Fetch signed URL for each file
            const signedUrlRes = await fetch(
              `${baseUrl}/database/get_signed_url/${fileName}`,
              {
                method: "GET",
                headers: {
                  Authorization: `${userId}`,
                },
              }
            );
            if (!signedUrlRes.ok) {
              throw new Error(`Failed to fetch signed URL for ${fileName}`);
            }

            const signedUrlData = await signedUrlRes.json();
            if (signedUrlData.signed_url) {
              fileUrls[fileName] = signedUrlData.signed_url;
            }
          }
          setSignedUrls(fileUrls);
        };

        await fetchSignedUrls();
      } catch (err) {
        console.error("Error updating table:", err);
        setError("Failed to update table");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const openFile = (item: HistoryItem) => {
    setSelectedFile(item); 
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };

  const deleteFile = async (fileName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        setError('Base URL is not defined.');
        setIsLoading(false);
        return;
      }

      const deleteRes = await fetch(
        `${baseUrl}/database/remove/${encodeURIComponent(
          fileName
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${userId}`,
          },
        }
      );
      if (!deleteRes.ok) {
        const deleteData = await deleteRes.json();
        setError(deleteData.error || `Failed to delete ${fileName}`);
        return;
      }

      // Remove the file from the history
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.file_name !== fileName)
      );
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file");
    }
  };
  
  return (
    <main className="min-h-screen bg-transparent text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Your History</h1>

      {isLoading ? (
        <p className="text-white text-center">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-white text-center">No history found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6 w-full">
          {history.map((item, idx) => (
            <div
              key={idx}
              className=" rounded-xl p-4 shadow-md flex flex-col items-center max-w-xs mx-auto"
            >
               {/* Item Name */}
              <h3 className="text-white text-lg font-semibold mb-2">{item.file_name}</h3>
              {/* Image/iframe container */}
              {signedUrls[item.file_name] ? (
                <div className="relative w-full">
                  {item.file_name.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={signedUrls[item.file_name]}
                      className="w-full h-64 object-contain rounded-md mb-2"
                      title={item.file_name}
                      style={{
                        border: "none",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    />
                  ) : (
                    <img
                      src={signedUrls[item.file_name]}
                      alt={item.file_name}
                      className="w-full h-64 object-contain rounded-md mb-2"
                    />
                  )}
                  {/* Button to open the file in modal */}
                  <button
                    className="absolute top-2 right-2 bg-gray-800 p-2 rounded-full opacity-70 hover:opacity-100"
                    onClick={() => openFile(item)}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-300">Loading preview...</p>
              )}

              {/* Button to delete */}
              <button
                className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                onClick={(e) => deleteFile(item.file_name, e)}
              >
                <Trash size={16} className="mr-2 inline" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Modal for enlarged image and details */}
      {modalOpen && selectedFile && ( 
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-110">
          <div className="relative bg-white p-6 rounded-md max-w-5xl w-full flex flex-col max-h-[95vh]"> 
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl z-10" 
              onClick={closeModal}
              aria-label="Close Modal"
            >&times;</button>

            {selectedFile.file_name && (
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pr-8 break-words"> 
                {selectedFile.file_name}
              </h2>
            )}
            <div className="flex flex-grow gap-6 overflow-y-auto"> 
              <div className="w-full md:w-1/2 flex-shrink-0 h-full"> 
                <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden">
                  {selectedFile.file_name.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={signedUrls[selectedFile.file_name]} 
                      className="w-full h-full object-contain"
                      title="Enlarged View"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <img
                      src={signedUrls[selectedFile.file_name]} 
                      alt="Enlarged View"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
              {selectedFile.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedFile.summary}</p>

                  {/* Download Summary Button */}
                  <button
                    onClick={() => {
                      const blob = new Blob([selectedFile.summary || ""], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${selectedFile.file_name}_summary.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Download Summary
                  </button>
                </div>
              )}

                {selectedFile.articles && Object.keys(selectedFile.articles).length > 0 ? (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Related Articles</h3>
                    {Object.entries(selectedFile.articles).map(([condition, articlesForCondition]) => (
                      <div
                        key={condition}
                        className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300" 
                      >
                        <h4 className="text-base font-medium text-gray-800 mb-2">{condition}</h4> 
                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                          {Array.isArray(articlesForCondition) && articlesForCondition.length > 0 ? (
                            articlesForCondition.map((article, articleIndex) => (
                              <li key={articleIndex}>
                                <a
                                  href={article.URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {article.Title}
                                </a>
                                {article.Author && (
                                  <div className="text-sm text-gray-500">
                                    Author: {article.Author}
                                  </div>
                                )}
                              </li>
                            ))
                          ) : (
                            <li>No articles available for this condition.</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedFile.summary && <p className="text-gray-500">No articles found.</p>
                )}
              </div> 
            </div> 
          </div> 
        </div> 
      )}

    </main>
  );

  
  
  
}