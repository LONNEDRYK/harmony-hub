import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Pause, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, playlists, userProfile } = useMusic();

  const moodTags = [
    { id: 1, name: 'Joyeux', color: 'bg-gradient-to-r from-orange-500 to-pink-500' },
    { id: 2, name: 'Énergique', color: 'bg-gradient-to-r from-purple-500 to-blue-500' },
    { id: 3, name: 'Relaxant', color: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
    { id: 4, name: 'Focus', color: 'bg-gradient-to-r from-indigo-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen pb-40 bg-background">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border/30">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">Bienvenue</p>
            <h1 className="text-base font-bold">{userProfile.name}</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Mood Tags */}
      <section className="px-5 mb-5">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          {moodTags.map((mood) => (
            <button
              key={mood.id}
              className={`${mood.color} px-4 py-2 rounded-full text-white text-xs font-semibold flex-shrink-0`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Playlists - Large cards */}
      {tracks.length > 0 && (
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Playlists du jour</h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 4).map((track, i) => (
              <button
                key={track.id}
                onClick={() => { playTrack(track); navigate('/player'); }}
                className="relative overflow-hidden rounded-2xl aspect-square group"
              >
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-bold truncate">{track.title}</p>
                  <p className="text-white/60 text-xs truncate">{track.artist}</p>
                </div>
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                    <Pause className="w-3.5 h-3.5 text-background" fill="currentColor" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick picks - compact rows */}
      {tracks.length > 0 && (
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Écoute rapide</h2>
            <button onClick={() => navigate('/library')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tracks.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => { playTrack(track); navigate('/player'); }}
                className="flex items-center gap-2.5 rounded-xl bg-card/60 border border-border/30 overflow-hidden pr-2"
              >
                <img src={track.cover} alt={track.title} className="w-11 h-11 object-cover" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold truncate">{track.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                </div>
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="currentColor" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="currentColor" />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recently played - horizontal scroll */}
      {tracks.length > 0 && (
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Récemment écoutés</h2>
            <button onClick={() => navigate('/library')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {tracks.slice(0, 8).map((track) => (
              <button
                key={track.id}
                onClick={() => { playTrack(track); navigate('/player'); }}
                className="flex-shrink-0 w-28"
              >
                <div className="relative mb-1.5">
                  <img src={track.cover} alt={track.title} className="w-28 h-28 rounded-xl object-cover" />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                      <Pause className="w-3 h-3 text-background" fill="currentColor" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold truncate text-left">{track.title}</p>
                <p className="text-[10px] text-muted-foreground truncate text-left">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Your playlists */}
      {playlists.length > 0 && (
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Tes playlists</h2>
            <button onClick={() => navigate('/library')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-32"
              >
                <div className="w-32 h-32 rounded-xl bg-card border border-border/30 flex items-center justify-center mb-1.5 overflow-hidden">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs font-semibold truncate text-left">{playlist.name}</p>
                <p className="text-[10px] text-muted-foreground text-left">{playlist.trackIds.length} titres</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-card border border-border/30 flex items-center justify-center mx-auto mb-5">
            <Play className="w-7 h-7 text-foreground" fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold mb-2">Commence ton aventure</h3>
          <p className="text-muted-foreground text-sm mb-5">Importe tes morceaux préférés</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm"
          >
            Importer
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
