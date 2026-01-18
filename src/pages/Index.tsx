import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Pause, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, playlists, userProfile } = useMusic();

  const dailyPlaylists = [
    {
      id: 'daily-1',
      name: 'Always ok',
      cover: tracks[0]?.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      artists: tracks.slice(0, 3).map((t) => t.artist).join(', ') || 'Artistes variés',
      gradient: 'from-blue-600/80 via-purple-600/60 to-transparent',
    },
    {
      id: 'daily-2',
      name: 'New',
      cover: tracks[1]?.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
      artists: tracks.slice(2, 5).map((t) => t.artist).join(', ') || 'Découvertes',
      gradient: 'from-orange-500/80 via-pink-500/60 to-transparent',
    },
    {
      id: 'daily-3',
      name: 'Chill Vibes',
      cover: tracks[2]?.cover || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      artists: 'Ambiance détente',
      gradient: 'from-teal-500/80 via-cyan-500/60 to-transparent',
    },
    {
      id: 'daily-4',
      name: 'Top Hits',
      cover: tracks[3]?.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
      artists: 'Les plus écoutés',
      gradient: 'from-rose-500/80 via-amber-500/60 to-transparent',
    },
  ];

  const moodTags = [
    { id: 1, name: 'Cheerful', color: 'bg-gradient-to-br from-orange-500 to-pink-500' },
    { id: 2, name: 'Energetic', color: 'bg-gradient-to-br from-purple-500 to-blue-500' },
    { id: 3, name: 'Relaxing', color: 'bg-gradient-to-br from-teal-500 to-cyan-500' },
    { id: 4, name: 'Focus', color: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen pb-40 bg-background">
      {/* Header */}
      <header className="px-5 pt-safe pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border/30">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-lg font-semibold">{userProfile.name}</h1>
          </div>
        </div>

        <button
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-card/60 border border-border/40 flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Mood Tags */}
      <section className="px-5 mb-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {moodTags.map((mood) => (
            <button
              key={mood.id}
              className={`${mood.color} px-5 py-2 rounded-full text-white text-sm font-medium flex-shrink-0 shadow-lg`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </section>

      {/* Playlists of the day */}
      <section className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Playlists of the day</h2>
          <button className="text-muted-foreground flex items-center gap-1 text-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {dailyPlaylists.slice(0, 2).map((playlist, index) => (
            <button
              key={playlist.id}
              onClick={() => {
                if (tracks.length > index) {
                  playTrack(tracks[index]);
                  navigate('/player');
                }
              }}
              className="relative overflow-hidden rounded-3xl aspect-square group"
            >
              <img
                src={playlist.cover}
                alt={playlist.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${playlist.gradient}`} />
              
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-white text-lg font-bold drop-shadow-lg">
                  {playlist.name}
                </span>
                <p className="text-white/70 text-xs truncate mt-0.5">{playlist.artists}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick picks */}
      {tracks.length > 0 && (
        <section className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick picks</h2>
            <button onClick={() => navigate('/library')} className="text-muted-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  playTrack(track);
                  navigate('/player');
                }}
                className="flex items-center gap-3 rounded-xl bg-card/60 border border-border/40 overflow-hidden"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  loading="lazy"
                  className="w-12 h-12 object-cover"
                />
                <div className="flex-1 min-w-0 pr-2 text-left">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="pr-3">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-4 h-4 text-foreground/70" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 text-foreground/50" fill="currentColor" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recently played */}
      {tracks.length > 0 && (
        <section className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recently played</h2>
            <button onClick={() => navigate('/library')} className="text-muted-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {tracks.slice(0, 8).map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  playTrack(track);
                  navigate('/player');
                }}
                className="flex-shrink-0 w-32"
              >
                <div className="relative mb-2">
                  <img
                    src={track.cover}
                    alt={track.title}
                    loading="lazy"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Pause className="w-4 h-4" fill="currentColor" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium truncate text-left">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate text-left">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Your playlists */}
      {playlists.length > 0 && (
        <section className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your playlists</h2>
            <button onClick={() => navigate('/library')} className="text-muted-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-36"
              >
                <div className="w-36 h-36 rounded-2xl bg-card/60 border border-border/40 flex items-center justify-center mb-2 overflow-hidden">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/35 via-background/40 to-primary/10 flex items-center justify-center">
                      <Play className="w-9 h-9 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium truncate text-left">{playlist.name}</p>
                <p className="text-xs text-muted-foreground text-left">{playlist.trackIds.length} tracks</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/45 via-background/30 to-primary/15 border border-border/30 flex items-center justify-center mx-auto mb-6">
            <Play className="w-8 h-8 text-foreground" fill="currentColor" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start your journey</h3>
          <p className="text-muted-foreground mb-6">Import your favorite tracks</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Import music
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
