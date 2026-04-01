import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  url: string;
  isFavorite: boolean;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  trackIds: string[];
  createdAt: Date;
}

export interface UserProfile {
  name: string;
  avatar: string;
  banner: string;
}

interface MusicContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  playlists: Playlist[];
  userProfile: UserProfile;
  addTrack: (file: File) => Promise<void>;
  removeTrack: (id: string) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (id: string) => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateTrackCover: (trackId: string, coverUrl: string) => void;
  updatePlaylistCover: (playlistId: string, coverUrl: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const defaultCovers = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
];

const defaultProfile: UserProfile = {
  name: 'User',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
};

// IndexedDB helpers for audio persistence
const AUDIO_DB = 'lumyvortex_audio_db';
const AUDIO_STORE = 'audio_files';

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AUDIO_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveAudioBlob(id: string, blob: Blob) {
  const db = await openAudioDB();
  const tx = db.transaction(AUDIO_STORE, 'readwrite');
  tx.objectStore(AUDIO_STORE).put(blob, id);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAudioBlob(id: string): Promise<Blob | null> {
  const db = await openAudioDB();
  const tx = db.transaction(AUDIO_STORE, 'readonly');
  const request = tx.objectStore(AUDIO_STORE).get(id);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function deleteAudioBlob(id: string) {
  const db = await openAudioDB();
  const tx = db.transaction(AUDIO_STORE, 'readwrite');
  tx.objectStore(AUDIO_STORE).delete(id);
}

const STORAGE_KEYS = {
  TRACKS: 'music_app_tracks',
  PLAYLISTS: 'music_app_playlists',
  PROFILE: 'music_app_profile',
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // In-memory blob URL cache
  const blobUrlCache = useRef<Record<string, string>>({});
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeat, currentTrack, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Get a playable URL for a track (from cache or IndexedDB)
  const getTrackUrl = async (trackId: string): Promise<string> => {
    if (blobUrlCache.current[trackId]) return blobUrlCache.current[trackId];
    const blob = await getAudioBlob(trackId);
    if (blob) {
      const url = URL.createObjectURL(blob);
      blobUrlCache.current[trackId] = url;
      return url;
    }
    return '';
  };

  const addTrack = async (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    const audio = new Audio(tempUrl);
    
    await new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', resolve);
    });

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const parts = fileName.split(' - ');
    const trackId = Date.now().toString();

    // Save audio file to IndexedDB for persistence
    await saveAudioBlob(trackId, file);

    const blobUrl = URL.createObjectURL(file);
    blobUrlCache.current[trackId] = blobUrl;
    URL.revokeObjectURL(tempUrl);
    
    const newTrack: Track = {
      id: trackId,
      title: parts.length > 1 ? parts[1] : fileName,
      artist: parts.length > 1 ? parts[0] : 'Artiste inconnu',
      album: 'Album inconnu',
      duration: audio.duration,
      cover: defaultCovers[Math.floor(Math.random() * defaultCovers.length)],
      url: '', // URL is resolved dynamically from IndexedDB
      isFavorite: false,
    };

    setTracks((prev) => [...prev, newTrack]);
  };

  const removeTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
    deleteAudioBlob(id);
    if (blobUrlCache.current[id]) {
      URL.revokeObjectURL(blobUrlCache.current[id]);
      delete blobUrlCache.current[id];
    }
  };

  const playTrack = async (track: Track) => {
    const url = await getTrackUrl(track.id);
    if (!url) return;
    const trackWithUrl = { ...track, url };
    setCurrentTrack(trackWithUrl);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getNextIndex = () => {
    if (!currentTrack || tracks.length === 0) return 0;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (randomIndex === currentIndex && tracks.length > 1);
      return randomIndex;
    }
    return (currentIndex + 1) % tracks.length;
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const nextIndex = getNextIndex();
    playTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (tracks.length === 0 || !currentTrack) return;
    if (currentTime > 3) {
      seek(0);
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => setVolumeState(vol);
  const toggleShuffle = () => setShuffle(!shuffle);

  const toggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    setRepeat(modes[(currentIndex + 1) % modes.length]);
  };

  const toggleFavorite = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      cover: defaultCovers[Math.floor(Math.random() * defaultCovers.length)],
      trackIds: [],
      createdAt: new Date(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const addToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      )
    );
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
          : p
      )
    );
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateTrackCover = (trackId: string, coverUrl: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, cover: coverUrl } : t))
    );
    if (currentTrack?.id === trackId) {
      setCurrentTrack(prev => prev ? { ...prev, cover: coverUrl } : null);
    }
  };

  const updatePlaylistCover = (playlistId: string, coverUrl: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, cover: coverUrl } : p))
    );
  };

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        currentTime,
        volume,
        shuffle,
        repeat,
        playlists,
        userProfile,
        addTrack,
        removeTrack,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        updateUserProfile,
        updateTrackCover,
        updatePlaylistCover,
        audioRef,
      }}
    >
      <audio ref={audioRef} src={currentTrack?.url} />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
