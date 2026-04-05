import { useNavigate } from 'react-router-dom';
import { Bell, Play, Pause, Heart, Music, Film, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
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

  const featuredTrack = tracks[0];

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Hero Banner - artist style */}
      {featuredTrack ? (
        <div className="relative">
          <div className="h-52 w-full overflow-hidden">
            <img src={featuredTrack.cover} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />

          {/* Nav over banner */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10">
            <button onClick={() => navigate('/profile')} className="w-7 h-7 rounded-full overflow-hidden ring-1.5 ring-white/30">
              <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="w-7 h-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center relative"
            >
              <Bell className="w-3.5 h-3.5 text-white" />
              {(tracks.length > 0 || videos.length > 0) && (
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          </div>

          {/* Artist-style info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                <Music className="w-2.5 h-2.5 text-background" />
              </div>
              <span className="text-white text-[10px] font-medium">LumyVortex Music</span>
            </div>
            <h1 className="text-white text-lg font-bold">{userProfile.name}</h1>
            <p className="text-white/60 text-[10px]">{tracks.length} tracks · {playlists.length} albums</p>
          </div>
        </div>
      ) : (
        <header className="px-4 pt-10 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/profile')} className="w-7 h-7 rounded-full overflow-hidden ring-1.5 ring-border/40">
              <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
            </button>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Bonjour 👋</p>
              <h1 className="text-xs font-bold leading-none">{userProfile.name}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="w-7 h-7 rounded-full bg-card border border-border/20 flex items-center justify-center"
          >
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </header>
      )}

      {/* New Releases / Recent */}
      {tracks.length > 0 && (
        <section className="px-4 mt-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold">New releases</h2>
            <button onClick={() => navigate('/library')} className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border/20">
              View All
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {tracks.slice(0, 8).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className="flex-shrink-0 w-28"
                >
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden mb-1 bg-card">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    {isActive && isPlaying && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <Pause className="w-2.5 h-2.5 text-background" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold truncate">{track.title}</p>
                  <p className="text-[9px] text-muted-foreground truncate">{track.artist}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Picks */}
      {tracks.length > 1 && (
        <section className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold">Écoute rapide</h2>
          </div>
          <div className="space-y-0.5">
            {tracks.slice(0, 4).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${isActive ? 'bg-card' : ''}`}
                >
                  <img src={track.cover} alt={track.title} className="w-9 h-9 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[10px] font-semibold truncate">{track.title}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {track.isFavorite && <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />}
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <Pause className="w-2.5 h-2.5" fill="currentColor" />
                      ) : (
                        <Play className="w-2.5 h-2.5 ml-px" fill="currentColor" />
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
        <section className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold">Mes Vidéos</h2>
            <button onClick={() => navigate('/videos')} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {videos.slice(0, 6).map((video) => (
              <button
                key={video.id}
                onClick={() => navigate(`/video-player?id=${video.id}`)}
                className="flex-shrink-0 w-32"
              >
                <div className="relative w-32 h-18 rounded-lg overflow-hidden mb-1 bg-card">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center h-[72px]">
                      <Film className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/70 text-white px-1 rounded">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[10px] font-medium truncate">{video.title}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <section className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold">Tes playlists</h2>
            <button onClick={() => navigate('/library')} className="text-[10px] text-muted-foreground">Voir tout</button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-24"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden mb-1 bg-card border border-border/10">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-semibold truncate">{playlist.name}</p>
                <p className="text-[9px] text-muted-foreground">{playlist.trackIds.length} titres</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold">Favoris</h2>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {favorites.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="flex-shrink-0 w-24"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden mb-1">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-semibold truncate">{track.title}</p>
                <p className="text-[9px] text-muted-foreground truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {tracks.length === 0 && videos.length === 0 && (
        <section className="px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-card border border-border/20 flex items-center justify-center mx-auto mb-3">
            <Music className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-bold mb-1">Ta bibliothèque est vide</h3>
          <p className="text-muted-foreground text-[10px] mb-4 max-w-[220px] mx-auto">
            Importe tes morceaux ou vidéos pour commencer
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-5 py-2 rounded-full bg-foreground text-background font-semibold text-xs"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
