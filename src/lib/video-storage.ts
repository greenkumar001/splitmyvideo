
export type StoredClip = {
  id: string;
  name: string;
  size: number;
  type: string;
};

const FOLDER_NAME = "splitmyvideo-clips";
const METADATA_FILE = "metadata.json";

async function getClipDirectory(): Promise<FileSystemDirectoryHandle> {
  if (
    typeof navigator === "undefined" ||
    !navigator.storage ||
    typeof navigator.storage.getDirectory !== "function"
  ) {
    throw new Error(
      "OPFS is not supported. Please use the latest Google Chrome."
    );
  }

  const root = await navigator.storage.getDirectory();

  return root.getDirectoryHandle(FOLDER_NAME, {
    create: true,
  });
}

async function readMetadata(
  directory: FileSystemDirectoryHandle
): Promise<StoredClip[]> {
  try {
    const handle = await directory.getFileHandle(METADATA_FILE);
    const file = await handle.getFile();
    const data: unknown = JSON.parse(await file.text());

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(
      (item): item is StoredClip =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.size === "number" &&
        typeof item.type === "string"
    );
  } catch {
    return [];
  }
}

async function writeMetadata(
  directory: FileSystemDirectoryHandle,
  clips: StoredClip[]
): Promise<void> {
  const handle = await directory.getFileHandle(METADATA_FILE, {
    create: true,
  });

  const writable = await handle.createWritable();

  try {
    await writable.write(JSON.stringify(clips, null, 2));
    await writable.close();
  } catch (error) {
    await writable.abort().catch(() => {});
    throw error;
  }
}

export async function checkOPFSSupport(): Promise<boolean> {
  try {
    await getClipDirectory();
    return true;
  } catch (error) {
    console.error("OPFS check failed:", error);
    return false;
  }
}

export async function getStorageInfo() {
  if (!navigator.storage?.estimate) {
    return null;
  }

  const estimate = await navigator.storage.estimate();

  return {
    usage: estimate.usage ?? 0,
    quota: estimate.quota ?? 0,
    available: Math.max(
      0,
      (estimate.quota ?? 0) - (estimate.usage ?? 0)
    ),
  };
}

export async function saveClip(
  blob: Blob,
  name: string
): Promise<StoredClip> {
  
  const directory = await getClipDirectory();
  const id = crypto.randomUUID();
const storageInfo = await getStorageInfo();

if (
  storageInfo &&
  storageInfo.available < blob.size
) {
  throw new Error(
    "Not enough browser storage space to save this clip. " +
    "Please delete old clips or free up storage."
  );
}
  const clip: StoredClip = {
    id,
    name,
    size: blob.size,
    type: blob.type || "video/mp4",
  };

  const fileHandle = await directory.getFileHandle(id, {
    create: true,
  });

  const writable = await fileHandle.createWritable();

  try {
    await writable.write(blob);
    await writable.close();

    const clips = await readMetadata(directory);
    clips.push(clip);

    await writeMetadata(directory, clips);

    return clip;
  } catch (error) {
    await writable.abort().catch(() => {});
    await directory.removeEntry(id).catch(() => {});

    throw new Error(
  error instanceof Error
    ? error.message
    : "Could not save clip to browser storage."
);
  }
}
/*export async function saveClipFromStream(
  stream: ReadableStream<Uint8Array>,
  name: string,
  size: number
): Promise<StoredClip> {
  const directory = await getClipDirectory();
  const id = crypto.randomUUID();

  const storageInfo = await getStorageInfo();

  if (storageInfo && storageInfo.available < size) {
    throw new Error("Not enough browser storage space to save this clip.");
  }

  const clip: StoredClip = {
    id,
    name,
    size,
    type: "video/mp4",
  };

  const fileHandle = await directory.getFileHandle(id, {
    create: true,
  });

  const writable = await fileHandle.createWritable();

  try {
    await stream.pipeTo(writable);

    const clips = await readMetadata(directory);
    clips.push(clip);
    await writeMetadata(directory, clips);

    return clip;
  } catch (error) {
    await directory.removeEntry(id).catch(() => {});
    throw error;
  }
}*/
export async function getStoredClips(): Promise<StoredClip[]> {
  const directory = await getClipDirectory();
  const clips = await readMetadata(directory);

  const validClips: StoredClip[] = [];

  for (const clip of clips) {
    try {
      await directory.getFileHandle(clip.id);
      validClips.push(clip);
    } catch {
      // Ignore metadata entries whose video file no longer exists.
    }
  }

  if (validClips.length !== clips.length) {
    await writeMetadata(directory, validClips);
  }

  return validClips;
}

export async function readClip(
  clip: StoredClip
): Promise<Blob> {
  const directory = await getClipDirectory();
  const fileHandle = await directory.getFileHandle(clip.id);

  return fileHandle.getFile();
}

export async function deleteClip(
  clip: StoredClip
): Promise<void> {
  const directory = await getClipDirectory();

  await directory.removeEntry(clip.id);

  const clips = await readMetadata(directory);
  const updatedClips = clips.filter(
    (item) => item.id !== clip.id
  );

  await writeMetadata(directory, updatedClips);
}



export async function clearAllClips(): Promise<void> {
  const directory = await getClipDirectory();
  const clips = await readMetadata(directory);

  for (const clip of clips) {
    await directory.removeEntry(clip.id).catch(() => {});
  }

  await writeMetadata(directory, []);
}

