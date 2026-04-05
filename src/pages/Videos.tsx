import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Film } from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';

const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const Videos = () => {
  const navigate = useNavigate();
  const { videos, addVideo, removeVideo } = useVideo();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImporting(true);
    for (let i = 0; i < files.length; i++) {
      await addVideo(files[i]);
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="px-4 pt-11">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-base font-bold text-foreground">Mes Vidéos</h1>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium text-xs"
          >
            <Plus className="w-4 h-4" />
            {importing ? 'Import...' : 'Importer'}
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="video/*" multiple className="hidden" onChange={handleImport} />

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-16">
          <Film className="w-14 h-14 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground mb-1.5">Aucune vidéo</p>
          <p className="text-xs text-muted-foreground/70 text-center mb-5">
            Importez vos vidéos locales pour les regarder ici
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
          >
            Importer des vidéos
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-2 rounded-xl bg-card/50 active:bg-card/80 transition-colors"
            >
              <button
                onClick={() => navigate(`/video-player?id=${video.id}`)}
                className="relative flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-muted"
              >
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <span className="absolute bottom-0.5 right-0.5 text-[10px] bg-black/70 text-white px-1 rounded">
                  {formatDuration(video.duration)}
                </span>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                <p className="text-xs text-muted-foreground">{formatSize(video.size)}</p>
              </div>
              <button
                onClick={() => removeVideo(video.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
