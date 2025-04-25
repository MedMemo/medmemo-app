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

  useEffect(() => {
    const storedData = sessionStorage.getItem("ocrData");
    if (storedData) {
      setOcrData(JSON.parse(storedData));
      sessionStorage.removeItem("ocrData");
    }
  }, []);

  const handleFieldChange = (index: number, field: 'key' | 'value', newText: string) => {
    const updated = [...ocrData.kv_pairs];
    updated[index][field] = newText;
    setOcrData({ ...ocrData, kv_pairs: updated });
  };

  const handleSaveChanges = async () => {
    sessionStorage.setItem("ocrData", JSON.stringify(ocrData));
    router.push('/home/chat');
  };

  return (
    <main className="min-h-screen bg-main-background text-gray-200 flex-grow flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/home/upload')}
            className="text-blue-400 hover:text-blue-500 text-sm flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Upload
          </button>
        </div>

        <div className="bg-sidebar-background rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">📝 Review & Edit Extracted Information</h2>

          {ocrData.annotated_image && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Scanned Document</h3>
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
                className="bg-gray-900 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-1 block">Field Name</label>
                  <input
                    type="text"
                    value={pair.key}
                    onChange={(e) => handleFieldChange(idx, 'key', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Doctor Name"
                  />
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <label className="text-sm text-gray-400 mb-1 block">Value</label>
                  <input
                    type="text"
                    value={pair.value}
                    onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center transition"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}