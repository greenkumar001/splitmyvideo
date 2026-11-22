
const GOOGLE_IDENTITY_SCRIPT =
  "https://accounts.google.com/gsi/client";

const YOUTUBE_UPLOAD_SCOPE =
  "https://www.googleapis.com/auth/youtube.upload";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenClient = {
  requestAccessToken: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: {
              type: string;
              message?: string;
            }) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${GOOGLE_IDENTITY_SCRIPT}"]`
    ) as HTMLScriptElement | null;

    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      if (window.google?.accounts?.oauth2) {
        resolve();
      } else {
        googleScriptPromise = null;
        reject(new Error("Google Identity Services failed to initialize."));
      }
    };

    const handleError = () => {
      googleScriptPromise = null;
      reject(new Error("Unable to load Google Identity Services."));
    };

    if (existingScript) {
      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });
    } else {
      script.src = GOOGLE_IDENTITY_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = handleLoad;
      script.onerror = handleError;
      document.head.appendChild(script);
    }
  });

  return googleScriptPromise;
}

export async function getYouTubeAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Google Client ID is missing from .env.local.");
  }

  await loadGoogleIdentityScript();

  const oauth = window.google?.accounts?.oauth2;

  if (!oauth) {
    throw new Error("Google authorization service is unavailable.");
  }

  return new Promise((resolve, reject) => {
    const tokenClient = oauth.initTokenClient({
      client_id: clientId,
      scope: YOUTUBE_UPLOAD_SCOPE,

      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(
            new Error(
              response.error_description ||
                response.error ||
                "YouTube authorization failed."
            )
          );
          return;
        }

        resolve(response.access_token);
      },

      error_callback: (error) => {
        reject(
          new Error(
            error.message || `Google popup error: ${error.type}`
          )
        );
      },
    });

    tokenClient.requestAccessToken();
  });
}

type YouTubeUploadOptions = {
  accessToken: string;
  video: Blob;
  title: string;
  description: string;
  privacyStatus: "private" | "unlisted" | "public";
  onProgress?: (percentage: number) => void;
};

export async function uploadYouTubeVideo({
  accessToken,
  video,
  title,
  description,
  privacyStatus,
  onProgress,
}: YouTubeUploadOptions): Promise<string> {
  const endpoint =
    "https://www.googleapis.com/upload/youtube/v3/videos" +
    "?uploadType=resumable&part=snippet,status";

  // Step 1: Initialize resumable upload session
  const initResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(video.size),
      "X-Upload-Content-Type": video.type || "video/mp4",
    },
    body: JSON.stringify({
      snippet: {
        title,
        description,
        categoryId: "22",
      },
      status: {
        privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    }),
  });

 if (!initResponse.ok) {
  const errorBody = await initResponse.text();

  let details = errorBody;

  try {
    const parsed = JSON.parse(errorBody);
    details =
      parsed.error?.message ||
      parsed.error?.errors?.[0]?.reason ||
      errorBody;
  } catch {
    // Keep original response text
  }

  throw new Error(
    `YouTube upload initialization failed (${initResponse.status}): ${details}`
  );
}

  const uploadUrl = initResponse.headers.get("Location");

  if (!uploadUrl) {
    throw new Error("YouTube did not provide an upload session URL.");
  }

  // Step 2: Upload video in 8 MB chunks
  const CHUNK_SIZE = 8 * 1024 * 1024;
  let uploadedBytes = 0;

  while (uploadedBytes < video.size) {
    const end = Math.min(
      uploadedBytes + CHUNK_SIZE,
      video.size
    );

    const chunk = video.slice(uploadedBytes, end);

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": video.type || "video/mp4",
        "Content-Range":
          `bytes ${uploadedBytes}-${end - 1}/${video.size}`,
      },
      body: chunk,
    });

    if (response.status === 308) {
      uploadedBytes = end;

      onProgress?.(
        Math.round((uploadedBytes / video.size) * 100)
      );

      continue;
    }

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      onProgress?.(100);

      if (!result.id) {
        throw new Error("Upload completed, but YouTube returned no video ID.");
      }

      return result.id as string;
    }

    throw new Error(
      `YouTube upload failed (${response.status}).`
    );
  }

  throw new Error("Upload ended without a YouTube video confirmation.");
}
