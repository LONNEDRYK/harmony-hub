import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocalVideo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  size: number;
  addedAt: number;
}

interface VideoContextType {
  videos: LocalVideo[];
  addVideo: (file: File) => Promise<void>;
  removeVideo: (id: string) => void;
  getVideoUrl: (id: string) => Promise<string | null>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const DB_NAME = 'lumyvortex_db';
const DB_VERSION = 1;
const VIDEO_STORE = 'videos';
const VIDEO_META_STORE = 'video_meta';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE);
      }
      if (!db.objectStoreNames.contains(VIDEO_META_STORE)) {
        db.createObjectStore(VIDEO_META_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveBlob(id: string, blob: Blob) {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, 'readwrite');
  tx.objectStore(VIDEO_STORE).put(blob, id);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, 'readonly');
  const request = tx.objectStore(VIDEO_STORE).get(id);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function deleteBlob(id: string) {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, 'readwrite');
  tx.objectStore(VIDEO_STORE).delete(id);
}

function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 4);
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, 320, 180);
      const thumb = canvas.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(url);
      resolve(thumb);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('');
    };
  });
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

const VIDEOS_KEY = 'lumyvortex_videos_meta';

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<LocalVideo[]>(() => {
    try {
      const saved = localStorage.getItem(VIDEOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  }, [videos]);

  const addVideo = async (file: File) => {
    const id = `vid_${Date.now()}`;
    const [duration, thumbnail] = await Promise.all([
      getVideoDuration(file),
      generateThumbnail(file),
    ]);

    await saveBlob(id, file);

    const newVideo: LocalVideo = {
      id,
      title: file.name.replace(/\.[^/.]+$/, ''),
      duration,
      thumbnail,
      size: file.size,
      addedAt: Date.now(),
    };

    setVideos(prev => [newVideo, ...prev]);
  };

  const removeVideo = (id: string) => {
    deleteBlob(id);
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const getVideoUrl = async (id: string): Promise<string | null> => {
    const blob = await getBlob(id);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, removeVideo, getVideoUrl }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error('useVideo must be used within VideoProvider');
  return context;
};
