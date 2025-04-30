"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
}

export default function DocumentDisplayPage() {
  const [ocrData, setOcrData] = useState<{ kv_pairs: KeyValuePair[]; annotated_image: string }>({
    kv_pairs: [],
    annotated_image: "",
  });
  const router = useRouter();


  const handleFieldChange = (index: number, field: 'key' | 'value', newText: string) => {
    const updated = [...ocrData.kv_pairs];
    updated[index][field] = newText;
    setOcrData({ ...ocrData, kv_pairs: updated });
  };

  const handleSubmit= () => {
    sessionStorage.setItem("ocrData", JSON.stringify(ocrData));
    router.push('/home/summary');
  };

  const handleBackClick = async () => {
    const savedFilesMetadata = sessionStorage.getItem("filesMetadata");
    if (savedFilesMetadata) {
      try {
        const filesMetadata = JSON.parse(savedFilesMetadata);
        if (filesMetadata.length > 0) {
          const fileName = filesMetadata[0].name;
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
            { credentials: "include" }
          );
          if (!userRes.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await userRes.json();
          const userId = userData.user.id;

          try {

            // Call the /remove endpoint to remove the file
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/database/remove/${fileName}`,
              {
                method: 'DELETE',
                headers: {
                  'Authorization': `${userId}}`,
                },
              }
            );

            const data = await response.json();
            if (response.ok) {
              sessionStorage.removeItem("filesMetadata")
            } else {
              console.error('Error removing the file:', data.error);
            }
          } catch (error) {
            console.error('Error during remove request:', error);
          }
        }
      } catch (error) {
        console.error("Error parsing session data:", error);
      }
    }
    router.push('/home/upload');
  };


  useEffect(() => {
    const storedData = sessionStorage.getItem("ocrData");
    if (storedData) {
      setOcrData(JSON.parse(storedData));
      sessionStorage.removeItem("ocrData");
    }
  }, []);


  return (
    <main className="min-h-screen bg-main-background flex-grow flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={ handleBackClick }
            className="text-main-text-color cursor-pointer text-sm flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Upload
          </button>
        </div>

        <div className="bg-sidebar-background rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-main-text-color">📝 Review & Edit Extracted Information</h2>

          {ocrData.annotated_image && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-main-text-color mb-2">Scanned Document</h3>
              <img
                src={`data:image/png;base64,${ocrData.annotated_image}`}
                alt="Annotated"
                className="rounded-md border border-gray-600 max-w-full"
              />
            </div>
          )}

          <div className="space-y-4">
            {ocrData.kv_pairs.map((pair, idx) => (
              <div
                key={idx}
                className="bg-chat-box-background p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex-1 text-main-text-color ">
                  <label className="text-sm mb-2 block">Field Name</label>
                  <input
                    type="text"
                    value={pair.key}
                    onChange={(e) => handleFieldChange(idx, 'key', e.target.value)}
                    className="w-full p-2 rounded-md bg-setting-pill-background text-main-text-color focus:outline-none focus:ring-1 focus:ring-main-text-color"
                    placeholder="e.g., Doctor Name"
                  />
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <label className="text-sm mb-2 block">Value</label>
                  <input
                    type="text"
                    value={pair.value}
                    onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                    className="w-full p-2 rounded-md bg-setting-pill-background text-main-text-color focus:outline-none focus:ring-1 focus:ring-main-text-color"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <button
              className="px-6 py-2 \
              bg-button-color hover:bg-button-hover
              text-main-text-inverse-color hover:text-main-text-color
              font-medium rounded-md flex items-center justify-center transition"
              onClick={handleSubmit}
            >
              <Save className="w-5 h-5 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}