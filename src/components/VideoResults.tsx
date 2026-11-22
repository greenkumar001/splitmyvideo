
"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import {
  Download,
  FileVideo,
  Archive,
  Trash2,
  Loader2,
  HardDrive,
  RefreshCw,
  Video,
  X,
  Upload,
} from "lucide-react";

import type { StoredClip } from "@/lib/video-storage";
import {
  readClip,
  deleteClip,
  clearAllClips,
  getStorageInfo,
} from "@/lib/video-storage";

import {
  getYouTubeAccessToken,
  uploadYouTubeVideo,
  loadGoogleIdentityScript,
} from "@/lib/youtube";
type Props = {
  results: StoredClip[];
  onResultsChange: (clips: StoredClip[]) => void;
};

type StorageInfo = {
  usage: number;
  quota: number;
  available: number;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export default function VideoResults({
  results,
  onResultsChange,
}: Props) {
  const [zipping, setZipping] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [storageLoading, setStorageLoading] = useState(true);
  // YouTube Upload Modal
  const [selectedClip, setSelectedClip] = useState<StoredClip | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [privacyStatus, setPrivacyStatus] = useState<
    "private" | "unlisted" | "public"
  >("private");

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectingYouTube, setConnectingYouTube] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    loadGoogleIdentityScript().catch((error) => {
      console.error("Google Identity Services preload failed:", error);
    });
  }, []);
  async function openYouTubeModal(item: StoredClip) {
    try {
      const blob = await readClip(item);
      const url = URL.createObjectURL(blob);

      setSelectedClip(item);
      setPreviewUrl(url);
      setVideoTitle(item.name.replace(/\.[^/.]+$/, ""));
      setVideoDescription("");
      setPrivacyStatus("private");
      setAccessToken(null);
    } catch (error) {
      console.error("Could not open clip preview:", error);
      alert("Could not load this clip. Please try again.");
    }
  }

  function closeYouTubeModal() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedClip(null);
    setPreviewUrl(null);
    setVideoTitle("");
    setVideoDescription("");
    setAccessToken(null);
  }
  async function connectYouTube() {
    setConnectingYouTube(true);

    try {
      const token = await getYouTubeAccessToken();

      setAccessToken(token);
    } catch (error) {
      console.error("YouTube connection failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not connect to YouTube."
      );
    } finally {
      setConnectingYouTube(false);
    }
  }
  async function handleYouTubeUpload() {
    if (!selectedClip) return;

    if (!accessToken) {
      alert("Please connect your YouTube channel first.");
      return;
    }

    if (!videoTitle.trim()) {
      alert("Please enter a video title.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const blob = await readClip(selectedClip);

      const videoId = await uploadYouTubeVideo({
        accessToken,
        video: blob,
        title: videoTitle.trim(),
        description: videoDescription.trim(),
        privacyStatus,
        onProgress: (percentage) => {
          setUploadProgress(percentage);
        },
      });
      console.log("YouTube token exists:", !!accessToken);
      console.log("YouTube token length:", accessToken?.length);
      console.log("Selected clip:", selectedClip?.name);
      alert(
        `Video uploaded successfully!\n\n` +
        `https://www.youtube.com/watch?v=${videoId}`
      );
    } catch (error) {
      console.error("YouTube upload failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "YouTube upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  async function refreshStorageInfo() {
    setStorageLoading(true);

    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error("Could not read browser storage:", error);
      setStorageInfo(null);
    } finally {
      setStorageLoading(false);
    }
  }

  useEffect(() => {
    refreshStorageInfo();
  }, [results]);

  function downloadFile(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadOne(item: StoredClip) {
    setDownloadingId(item.id);

    try {
      const blob = await readClip(item);
      downloadFile(blob, item.name);
    } catch (error) {
      console.error("Clip download failed:", error);
      alert(`Could not download ${item.name}.`);
    } finally {
      setDownloadingId(null);
    }
  }


  async function downloadAll() {
    const totalSize = results.reduce(
      (total, item) => total + item.size,
      0
    );

    const MAX_ZIP_SIZE = 200 * 1024 * 1024;

    if (totalSize > MAX_ZIP_SIZE) {
      alert(
        "These clips are too large for a safe browser ZIP download. " +
        "Please download clips individually."
      );
      return;
    }

    setZipping(true);

    try {
      const zip = new JSZip();

      for (const item of results) {
        const blob = await readClip(item);
        zip.file(item.name, blob);
      }

      const archive = await zip.generateAsync({
        type: "blob",
      });

      downloadFile(archive, "SplitMyVideo-clips.zip");
    } catch (error) {
      console.error("ZIP creation failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not create ZIP file."
      );
    } finally {
      setZipping(false);
    }
  }


  async function handleDelete(item: StoredClip) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.name}?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await deleteClip(item);

      onResultsChange(
        results.filter((clip) => clip.id !== item.id)
      );
    } catch (error) {
      console.error("Clip deletion failed:", error);
      alert("Could not delete this clip.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleClearAll() {
    const confirmed = window.confirm(
      `Delete all ${results.length} saved clips? This cannot be undone.`
    );

    if (!confirmed) return;

    setClearing(true);

    try {
      await clearAllClips();
      onResultsChange([]);
    } catch (error) {
      console.error("Clear all failed:", error);
      alert("Could not clear saved clips.");
    } finally {
      setClearing(false);
    }
  }

  const busy =
    zipping ||
    downloadingId !== null ||
    deletingId !== null ||
    clearing;

  const usagePercentage =
    storageInfo && storageInfo.quota > 0
      ? Math.min(
        100,
        (storageInfo.usage / storageInfo.quota) * 100
      )
      : 0;

  return (
    <div className="space-y-5">
      {/* Browser Storage Dashboard */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <HardDrive size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Browser Storage
              </h2>
              <p className="text-sm text-gray-500">
                Chrome storage information
              </p>
            </div>
          </div>

          <button
            onClick={refreshStorageInfo}
            disabled={storageLoading}
            className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh storage information"
            aria-label="Refresh storage information"
          >
            <RefreshCw
              size={17}
              className={storageLoading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {storageLoading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
            <Loader2 size={17} className="animate-spin" />
            Reading storage information...
          </div>
        ) : storageInfo ? (
          <>
            <div className="mb-3 flex justify-between text-sm">
              <span className="font-medium text-gray-700">
                Storage used
              </span>
              <span className="font-semibold text-gray-900">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              aria-label="Browser storage usage"
              aria-valuenow={Math.round(usagePercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">Used</p>
                <p className="mt-1 font-bold text-gray-900">
                  {formatBytes(storageInfo.usage)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="mt-1 font-bold text-green-600">
                  {formatBytes(storageInfo.available)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Total quota</p>
                <p className="mt-1 font-bold text-gray-900">
                  {formatBytes(storageInfo.quota)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              These figures represent estimated storage usage and quota
              for this browser origin, not only SplitMyVideo clips.
              Actual available space may change.
            </p>
          </>
        ) : (
          <p className="py-3 text-sm text-gray-500">
            Storage information is not available in this browser.
          </p>
        )}
      </section>

      {/* Saved Clips */}
      {results.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your video clips
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {results.length} clips saved successfully.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearAll}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {clearing ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                Clear All
              </button>

              <button
                onClick={downloadAll}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Archive size={17} />
                {zipping ? "Creating ZIP..." : "Download All"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileVideo className="shrink-0 text-blue-600" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => downloadOne(item)}
                    disabled={busy}
                    className="rounded-lg border p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    aria-label={`Download ${item.name}`}
                    title="Download clip"
                  >
                    {downloadingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => openYouTubeModal(item)}
                    disabled={busy || uploading}
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Upload ${item.name} to YouTube`}
                    title="Upload to YouTube"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={busy}
                    className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Delete ${item.name}`}
                    title="Delete clip"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* YouTube Upload Modal */}
      {selectedClip && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="text-red-600" size={25} />
                <h2 className="text-xl font-bold text-gray-900">
                  Upload to YouTube
                </h2>
              </div>

              <button
                onClick={closeYouTubeModal}
                disabled={uploading}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <video
              src={previewUrl}
              controls
              playsInline
              className="mb-5 max-h-72 w-full rounded-xl bg-black"
            />

            <p className="mb-4 truncate text-sm text-gray-500">
              Selected clip: {selectedClip.name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Video title
                </label>
                <input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  maxLength={100}
                  disabled={uploading}
                  placeholder="Enter video title"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  maxLength={5000}
                  rows={4}
                  disabled={uploading}
                  placeholder="Write your video description..."
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Visibility
                </label>
                <select
                  value={privacyStatus}
                  onChange={(e) =>
                    setPrivacyStatus(
                      e.target.value as "private" | "unlisted" | "public"
                    )
                  }
                  disabled={uploading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {!accessToken ? (
                <button
                  onClick={connectYouTube}
                  disabled={connectingYouTube || uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {connectingYouTube ? (
                    <Loader2 className="animate-spin" size={19} />
                  ) : (
                    <Video size={19} />
                  )}
                  {connectingYouTube
                    ? "Connecting..."
                    : "Connect YouTube Channel"}
                </button>
              ) : (
                <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                  YouTube channel connected
                </div>
              )}

              {uploading && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Uploading video...
                    </span>
                    <span className="font-bold text-red-600">
                      {uploadProgress}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-red-600 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleYouTubeUpload}
                disabled={!accessToken || uploading || !videoTitle.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <Upload size={19} />
                )}
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
