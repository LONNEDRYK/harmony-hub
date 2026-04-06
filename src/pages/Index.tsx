import { useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, Music, Search } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import lumyLogo from '@/assets/lumyvortex-logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, userProfile } = useMusic();

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Header */}
      <header className="px-4 pt-11 pb-2">
        <div className="flex items-center justify-between mb-5">
          {/* Logo only */}
          <img src={lumyLogo} alt="LumyVortex" className="h-8 w-auto" />
          {/* Icons - no background, just SVG outlines */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
            <button onClick={() => navigate('/settings')}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/>
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
                <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-xl font-bold">Salut, {userProfile.name}</h1>
          <p className="text-sm text-muted-foreground">Quelle audio allez-vous écouter ?</p>
        </div>

        {/* Search bar */}
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/20 mb-5"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Recherche un fichier local (son)</span>
        </button>
      </header>

      {/* Recommander */}
      {tracks.length > 0 && (
        <section className="px-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold">Recommander</h2>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {tracks.slice(0, 10).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className="flex flex-col items-start"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1 bg-card">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    {isActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Pause className="w-4 h-4 text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate w-full text-left">{track.title}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Favoris */}
      {favorites.length > 0 && (
        <section className="px-4 mb-5">
          <h2 className="text-base font-bold mb-3">Favoris</h2>
          <div className="grid grid-cols-5 gap-2">
            {favorites.slice(0, 10).map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className="flex flex-col items-start"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1 bg-card">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    {isActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Pause className="w-4 h-4 text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate w-full text-left">{track.title}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty */}
      {tracks.length === 0 && (
        <section className="px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-card border border-border/20 flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-bold mb-1.5">Ta bibliothèque est vide</h3>
          <p className="text-muted-foreground text-xs mb-5 max-w-[240px] mx-auto">
            Importe tes morceaux pour commencer
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
