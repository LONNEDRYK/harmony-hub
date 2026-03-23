import { useNavigate } from 'react-router-dom';
import { Bell, Play, Pause, Heart, Music, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, playlists, userProfile } = useMusic();

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="px-5 pt-14 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border/40">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <div>
            <p className="text-[11px] text-muted-foreground">Bonjour 👋</p>
            <h1 className="text-sm font-bold leading-tight">{userProfile.name}</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center relative"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </header>

      {/* Featured Section */}
      {tracks.length > 0 && (
        <section className="px-5 mb-5">
          <button
            onClick={() => handleTrackPlay(tracks[0])}
            className="relative w-full h-44 rounded-2xl overflow-hidden"
          >
            <img src={tracks[0].cover} alt={tracks[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-white text-lg font-bold">{tracks[0].title}</p>
                <p className="text-white/60 text-xs">{tracks[0].artist}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
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
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Écoute rapide</h2>
            <button onClick={() => navigate('/library')} className="text-[11px] text-muted-foreground">
              Voir tout
            </button>
          </div>
          <div className="space-y-1">
            {tracks.slice(0, 5).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isActive ? 'bg-card' : ''}`}
                >
                  <img src={track.cover} alt={track.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-xs font-semibold truncate ${isActive ? 'text-foreground' : ''}`}>{track.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {track.isFavorite && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <Pause className="w-3 h-3" fill="currentColor" />
                      ) : (
                        <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
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
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Tes playlists</h2>
            <button onClick={() => navigate('/library')} className="text-[11px] text-muted-foreground">
              Voir tout
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-28"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-2 bg-card border border-border/20">
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
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Favoris</h2>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {favorites.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="flex-shrink-0 w-28"
              >
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-2">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center">
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

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-card border border-border/30 flex items-center justify-center mx-auto mb-5">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Ta bibliothèque est vide</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-[240px] mx-auto">
            Importe tes morceaux préférés pour commencer
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
