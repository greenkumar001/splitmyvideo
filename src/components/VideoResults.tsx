
"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, FileVideo, Archive } from "lucide-react";
import type { SplitResult } from "@/lib/ffmpeg";

type Props = {
  results: SplitResult[];
};

export default function VideoResults({ results }: Props) {
  const [zipping, setZipping] = useState(false);

  function downloadFile(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = name;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadAll() {
    setZipping(true);

    try {
      const zip = new JSZip();

      results.forEach((item) => {
        zip.file(item.name, item.blob);
      });

      const archive = await zip.generateAsync({ type: "blob" });
      downloadFile(archive, "SplitMyVideo-clips.zip");
    } catch {
      alert("Could not create ZIP file.");
    } finally {
      setZipping(false);
    }
  }

  if (!results.length) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Your video clips
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {results.length} clips created successfully.
          </p>
        </div>

        <button
          onClick={downloadAll}
          disabled={zipping}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Archive size={17} />
          {zipping ? "Creating ZIP..." : "Download All"}
        </button>
      </div>

      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileVideo className="shrink-0 text-blue-600" />
              <span className="truncate text-sm font-medium text-gray-800">
                {item.name}
              </span>
            </div>

            <button
              onClick={() => downloadFile(item.blob, item.name)}
              className="shrink-0 rounded-lg border p-2 text-blue-600 hover:bg-blue-50"
              aria-label={`Download ${item.name}`}
            >
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
