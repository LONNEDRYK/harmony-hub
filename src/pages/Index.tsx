import { useNavigate } from 'react-router-dom';
import { Bell, Play, Pause, Heart, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, playlists, userProfile } = useMusic();

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="px-5 pt-14 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border/40">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground leading-none mb-1">Bonjour 👋</p>
            <h1 className="text-base font-bold leading-none">{userProfile.name}</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-card border border-border/20 flex items-center justify-center relative"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background" />
        </button>
      </header>

      {/* Featured */}
      {tracks.length > 0 && (
        <section className="px-5 mb-5 mt-2">
          <button
            onClick={() => handleTrackPlay(tracks[0])}
            className="relative w-full h-48 rounded-2xl overflow-hidden"
          >
            <img src={tracks[0].cover} alt={tracks[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-white text-lg font-bold truncate">{tracks[0].title}</p>
                <p className="text-white/60 text-sm truncate">{tracks[0].artist}</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 ml-3">
                {currentTrack?.id === tracks[0].id && isPlaying ? (
                  <Pause className="w-5 h-5 text-background" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-background ml-0.5" fill="currentColor" />
                )}
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Quick Picks */}
      {tracks.length > 1 && (
        <section className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Écoute rapide</h2>
            <button onClick={() => navigate('/library')} className="text-sm text-muted-foreground">Voir tout</button>
          </div>
          <div className="space-y-1">
            {tracks.slice(0, 4).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors ${isActive ? 'bg-card' : ''}`}
                >
                  <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {track.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <Pause className="w-3.5 h-3.5" fill="currentColor" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-px" fill="currentColor" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <section className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Tes playlists</h2>
            <button onClick={() => navigate('/library')} className="text-sm text-muted-foreground">Voir tout</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-32"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden mb-2 bg-card border border-border/10">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold truncate">{playlist.name}</p>
                <p className="text-xs text-muted-foreground">{playlist.trackIds.length} titres</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Favoris</h2>
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {favorites.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="flex-shrink-0 w-32"
              >
                <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-2">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <Pause className="w-3.5 h-3.5 text-background" fill="currentColor" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {tracks.length === 0 && (
        <section className="px-5 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-card border border-border/20 flex items-center justify-center mx-auto mb-5">
            <Music className="w-9 h-9 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Ta bibliothèque est vide</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-[260px] mx-auto">
            Importe tes morceaux préférés pour commencer
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-base"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
