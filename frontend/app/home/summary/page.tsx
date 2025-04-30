'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'

interface SummaryResponse {
  summary?: string;
  error?: string;
}

interface ArticlesResponse {
  articles?: any[];
  error?: string;
}

interface Article {
  Title: string;
  Author: string | null;
  URL: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export default function SummaryPage() {
  const [summary, setSummary] = useState<string>('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filesMetadata, setFilesMetadata] = useState<any[]>(() => {
    const savedFilesMetadata = sessionStorage.getItem("filesMetadata");
    return savedFilesMetadata ? JSON.parse(savedFilesMetadata) : []; 
  });
  const [ocrData, setOcrData] = useState<any | null>(() => {
    const savedOcrData = sessionStorage.getItem("ocrData");
    return savedOcrData ? JSON.parse(savedOcrData) : null; // Parse OCR data from sessionStorage if available
  });  
  const router = useRouter();

  const handleSaveSummary = async () => {
    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get_user`,
        { credentials: "include" }
      );

      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userRes.json();
      const userId = userData.user.id;

      const { error } = await supabase
      .from('DOCUMENTS')
      .update({
        summary: summary,
        articles: articles,
      })
      .eq('user_id', userId)
      .eq('file_name', filesMetadata[0]?.name)
  
    if (error) {
      throw new Error(error.message || 'Update table failed')
    }
    

      sessionStorage.removeItem('ocrData');
      sessionStorage.removeItem('filesMetadata') 
      router.push("/home/history")
    } catch (err) {
      console.error('Error updating table:', err);
      setError('Failed to update table');
    }
  };
  
  const handleBackClick = () => {
    if (ocrData && filesMetadata) {
      sessionStorage.setItem('ocrData', JSON.stringify(ocrData));
      sessionStorage.setItem('filesMetadata', JSON.stringify(filesMetadata))
    }
    router.push('/home/display');
  }


  useEffect(() => {

    // Safely accessing process.env.NEXT_PUBLIC_BASE_URL and checking if it's defined
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      setError('Base URL is not defined.');
      setLoading(false);
      return;
    }

    // Step 1: Fetch the summary
    fetch(`${baseUrl}/summarize/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ocr_data: { kv_pairs: ocrData.kv_pairs } }),
    })
      .then((res) => res.json())
      .then((data: SummaryResponse) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSummary(data.summary || 'No summary returned.');

          // Step 2: After the summary, fetch articles using the summary
          fetch(`${baseUrl}/summarize/articles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ summary: data.summary }),
          })
            .then((res) => res.json())
            .then((data: ArticlesResponse) => {
              if (data.error) {
                setError(data.error);
              } else {
                setArticles(data.articles || []);
              }
            })
            .catch((err) => setError(err.message))
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch((err) => setError(err.message));
  }, []);


  return (
    <main className="min-h-screen bg-main-background text-gray-200 flex-grow flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={handleBackClick}
          className="text-blue-400 hover:text-blue-500 text-sm flex items-center mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Document
        </button>
  
        <div className="bg-sidebar-background rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">📝 Medical Document Summary</h2>
  
          {loading && <p className="text-white">Generating summary...</p>}
  
          {error && <p className="text-red-400">Error: {error}</p>}
  
          {!loading && !error && (
            <div className="text-gray-300 whitespace-pre-line">
              <div className="mb-6">{summary}</div>
  
              {articles && Object.keys(articles).length > 0 ? (
                Object.entries(articles).map(([condition, articlesForCondition]) => (
                  <div key={condition} className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{condition}</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      {articlesForCondition.length > 0 ? (
                        articlesForCondition.map((article: Article, index: number) => (
                          <li key={index}>
                            <a
                              href={article.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {article.Title}
                            </a>
                            <p className="text-gray-500 mt-1">Author: {article.Author || 'N/A'}</p>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No articles available.</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-white">No articles found.</p>
              )}
              <div className="mt-8 text-right">
                <button
                  onClick={handleSaveSummary}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center transition"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
  
  
  
}
