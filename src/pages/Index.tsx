import { useNavigate } from 'react-router-dom';
import { Bell, Play, Pause, Heart, Music, Film, ChevronRight } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useVideo } from '@/contexts/VideoContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, playlists, userProfile } = useMusic();
  const { videos } = useVideo();

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header */}
      <header className="px-4 pt-12 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border/40">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <div>
            <p className="text-[11px] text-muted-foreground leading-none mb-0.5">Bonjour 👋</p>
            <h1 className="text-sm font-bold leading-none">{userProfile.name}</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="w-9 h-9 rounded-full bg-card border border-border/20 flex items-center justify-center relative"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          {(tracks.length > 0 || videos.length > 0) && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-background" />
          )}
        </button>
      </header>

      {/* Featured */}
      {tracks.length > 0 && (
        <section className="px-4 mb-4 mt-1">
          <button
            onClick={() => handleTrackPlay(tracks[0])}
            className="relative w-full h-40 rounded-xl overflow-hidden"
          >
            <img src={tracks[0].cover} alt={tracks[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-white text-base font-bold truncate">{tracks[0].title}</p>
                <p className="text-white/60 text-xs truncate">{tracks[0].artist}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 ml-2">
                {currentTrack?.id === tracks[0].id && isPlaying ? (
                  <Pause className="w-4 h-4 text-background" fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4 text-background ml-0.5" fill="currentColor" />
                )}
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Quick Picks */}
      {tracks.length > 1 && (
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">Écoute rapide</h2>
            <button onClick={() => navigate('/library')} className="text-xs text-muted-foreground">Voir tout</button>
          </div>
          <div className="space-y-0.5">
            {tracks.slice(0, 4).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg transition-colors ${isActive ? 'bg-card' : ''}`}
                >
                  <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold truncate">{track.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {track.isFavorite && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <Pause className="w-3 h-3" fill="currentColor" />
                      ) : (
                        <Play className="w-3 h-3 ml-px" fill="currentColor" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">Mes Vidéos</h2>
            <button onClick={() => navigate('/videos')} className="text-xs text-muted-foreground flex items-center gap-0.5">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4">
            {videos.slice(0, 6).map((video) => (
              <button
                key={video.id}
                onClick={() => navigate(`/video-player?id=${video.id}`)}
                className="flex-shrink-0 w-36"
              >
                <div className="relative w-36 h-20 rounded-lg overflow-hidden mb-1.5 bg-card">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs font-medium truncate">{video.title}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">Tes playlists</h2>
            <button onClick={() => navigate('/library')} className="text-xs text-muted-foreground">Voir tout</button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-28"
              >
                <div className="w-28 h-28 rounded-lg overflow-hidden mb-1.5 bg-card border border-border/10">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold truncate">{playlist.name}</p>
                <p className="text-[10px] text-muted-foreground">{playlist.trackIds.length} titres</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">Favoris</h2>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4">
            {favorites.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="flex-shrink-0 w-28"
              >
                <div className="relative w-28 h-28 rounded-lg overflow-hidden mb-1.5">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <Pause className="w-3 h-3 text-background" fill="currentColor" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold truncate">{track.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {tracks.length === 0 && videos.length === 0 && (
        <section className="px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-card border border-border/20 flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold mb-1.5">Ta bibliothèque est vide</h3>
          <p className="text-muted-foreground text-xs mb-5 max-w-[240px] mx-auto">
            Importe tes morceaux ou vidéos pour commencer
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
