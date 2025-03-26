"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { getDocument } from "pdfjs-dist";

export default function UploadOCR() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async function () {
      const pdfData = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await getDocument({ data: pdfData }).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = { canvasContext: context, viewport };
        await page.render(renderContext).promise;

        // Use Tesseract.js to extract text
        const { data } = await Tesseract.recognize(canvas, "eng");
        extractedText += data.text + "\n";
      }

      setText(extractedText);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {loading ? <p>Extracting text...</p> : <pre>{text}</pre>}
    </div>
  );
}
