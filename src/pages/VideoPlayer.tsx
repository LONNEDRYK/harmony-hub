import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Maximize, Volume2, VolumeX } from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';

const formatTime = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  const { videos, getVideoUrl } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const currentVideo = videos.find(v => v.id === videoId);
  const currentIndex = videos.findIndex(v => v.id === videoId);

  useEffect(() => {
    if (!videoId) return;
    getVideoUrl(videoId).then(url => {
      setVideoUrl(url);
    });
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoId]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => { setIsPlaying(false); playNext(); };
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnd);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const playNext = () => {
    if (currentIndex < videos.length - 1) {
      navigate(`/video-player?id=${videos[currentIndex + 1].id}`, { replace: true });
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      navigate(`/video-player?id=${videos[currentIndex - 1].id}`, { replace: true });
    }
  };

  const handleTap = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const toggleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  if (!currentVideo || !videoUrl) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">Chargement...</p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-screen bg-black flex flex-col relative" onClick={handleTap}>
      {/* Video */}
      <div className="flex-1 flex items-center justify-center relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
        />

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Top */}
          <div className="flex items-center gap-3 px-5 py-4 pt-safe bg-gradient-to-b from-black/60 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{currentVideo.title}</p>
            </div>
          </div>

          {/* Center play controls */}
          <div className="flex items-center justify-center gap-12" onClick={(e) => e.stopPropagation()}>
            <button onClick={playPrev} className="w-12 h-12 flex items-center justify-center">
              <SkipBack className="w-8 h-8 text-white" fill="currentColor" />
            </button>
            <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" fill="currentColor" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
              )}
            </button>
            <button onClick={playNext} className="w-12 h-12 flex items-center justify-center">
              <SkipForward className="w-8 h-8 text-white" fill="currentColor" />
            </button>
          </div>

          {/* Bottom */}
          <div className="px-5 pb-6 pb-safe bg-gradient-to-t from-black/60 to-transparent" onClick={(e) => e.stopPropagation()}>
            <div className="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden mb-2" onClick={handleSeek}>
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">{formatTime(currentTime)} / {formatTime(duration)}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setMuted(!muted)}>
                  {muted ? <VolumeX className="w-5 h-5 text-white/60" /> : <Volume2 className="w-5 h-5 text-white/60" />}
                </button>
                <button onClick={toggleFullscreen}>
                  <Maximize className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
