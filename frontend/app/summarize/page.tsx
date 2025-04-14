"use client";

import { useEffect, useState } from "react";

export default function Summarize() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {

        // Placeholder Data - This would be extracted from the uploaded transcript
        const transcript = "Patient is a 55-year-old male with a history of hypertension and type 2 diabetes. He complains of headaches for the past week and has been experiencing dizziness. The patient is currently taking Lisinopril for hypertension and Metformin for diabetes. He denies any chest pain or shortness of breath.";

        const fetchSummarize = async () => {
            try {

                console.time("Parallel Fetch");

                const [summaryResponse, articlesResponse] = await Promise.all([
                    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/summarize/summary", {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
                        body: JSON.stringify({ transcript }),
                    }),
                    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/summarize/articles", {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
                        body: JSON.stringify({ transcript }),
                    }),
                ]);

                console.timeEnd("Parallel Fetch");

                const summaryData = await summaryResponse.json();
                const articlesData = await articlesResponse.json();
                console.log({... summaryData, ...articlesData})
                setData({... summaryData, ...articlesData})


            } catch (error) {
                console.error("Error fetching summary and articles:", error);
            }
        };
        fetchSummarize();

    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    
    return (
        <div className="p-6 space-y-6">
        {/* Summary Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Summary</h2>
          <p className="text-gray-700 whitespace-pre-line">{data.summary}</p>
        </div>
  
        {/* Articles Containers */}
        {data.articles && typeof data.articles === 'object' && Object.entries(data.articles).map(([keyword, articles]: [string, any]) => (
          <div key={keyword} className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{keyword}</h3>
            <ul className="list-disc pl-6 space-y-2">
              {articles.map((article: { Title: string; URL: string }, index: number) => (
                <li key={index}>
                  <a
                    href={article.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {article.Title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
    


};


