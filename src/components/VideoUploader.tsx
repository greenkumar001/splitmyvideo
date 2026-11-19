
"use client";

import { useRef, useState } from "react";
import { Upload, FileVideo, X } from "lucide-react";

type Props = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
};

export default function VideoUploader({ file, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function selectFile(selected?: File) {
    if (!selected) return;

    if (!selected.type.startsWith("video/") &&
      !/\.(mp4|mov|mkv|webm|avi)$/i.test(selected.name)) {
      alert("Please select a valid video file.");
      return;
    }

    onFileSelect(selected);
  }

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        selectFile(e.dataTransfer.files[0]);
      }}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-12 ${dragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-blue-400"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mkv"
        className="hidden"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />

      {file ? (
        <div className="mx-auto max-w-md">
          <FileVideo className="mx-auto mb-4 text-blue-600" size={44} />
          <p className="break-all font-semibold text-gray-900">
            {file.name}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <button
            onClick={() => onFileSelect(null)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <X size={16} /> Remove video
          </button>
        </div>
      ) : (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Upload size={30} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Upload your video
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your video here, or browse files
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            className="mt-6 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Choose Video
          </button>

          <p className="mt-5 text-xs text-gray-400">
            MP4, MOV, MKV, WebM and AVI
          </p>
        </>
      )}
    </section>
  );
}
