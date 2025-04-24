'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface SummaryResponse {
  summary?: string;
  error?: string;
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const ocrData = sessionStorage.getItem('ocrData');

    if (!ocrData) {
      setError('No data available for summarization.');
      setLoading(false);
      return;
    }

    const parsedData = JSON.parse(ocrData);
    const transcript = parsedData.kv_pairs
      .map((pair: { key: string; value: string }) => `${pair.key}: ${pair.value}`)
      .join('\n');

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/summarize/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    })
      .then((res) => res.json())
      .then((data: SummaryResponse) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSummary(data.summary || 'No summary returned.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-main-background text-gray-200 flex-grow flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={() => router.push('/home/display')}
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
              {summary}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
