import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Pause, Play, User } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const MOOD_TAGS = [
  { id: 1, name: 'Joyeux', gradientVar: '--gradient-orange' },
  { id: 2, name: 'Énergique', gradientVar: '--gradient-purple' },
  { id: 3, name: 'Relaxant', gradientVar: '--gradient-teal' },
  { id: 4, name: 'Focus', gradientVar: '--gradient-purple' },
  { id: 5, name: 'Sport', gradientVar: '--gradient-orange' },
];

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, playlists } = useMusic();

  const dailyPlaylists = [
    {
      id: 'daily-1',
      name: 'Toujours OK',
      cover:
        tracks[0]?.cover ||
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      artists: tracks.slice(0, 3).map((t) => t.artist).join(', ') || 'Artistes variés',
    },
    {
      id: 'daily-2',
      name: 'Nouveautés',
      cover:
        tracks[1]?.cover ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
      artists: tracks.slice(2, 5).map((t) => t.artist).join(', ') || 'Découvertes',
    },
    {
      id: 'daily-3',
      name: 'Chill Vibes',
      cover:
        tracks[2]?.cover ||
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      artists: 'Ambiance détente',
    },
    {
      id: 'daily-4',
      name: 'Top Hits',
      cover:
        tracks[3]?.cover ||
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
      artists: 'Les plus écoutés',
    },
  ];

  return (
    <div className="min-h-screen pb-40 bg-background">
      {/* Header */}
      <header className="px-5 pt-safe pt-10 pb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-none">Accueil</h1>
          <p className="text-sm text-muted-foreground mt-2">Du son, rien que pour vous</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 rounded-full bg-card/60 border border-border/40 flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-card/60 border border-border/40 flex items-center justify-center"
            aria-label="Profil"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Quick picks */}
      {tracks.length > 0 && (
        <section className="px-5">
          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  playTrack(track);
                  navigate('/player');
                }}
                className="flex items-center gap-3 rounded-2xl bg-card/60 border border-border/40 overflow-hidden"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  loading="lazy"
                  className="w-14 h-14 object-cover"
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

      {/* Mood Tags */}
      <section className="py-6">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-lg font-semibold">Humeurs</h2>
          <button className="text-muted-foreground" aria-label="Voir plus">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
          {MOOD_TAGS.map((mood) => (
            <button key={mood.id} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full border border-border/30 shadow-lg"
                style={{ backgroundImage: `var(${mood.gradientVar})` }}
              />
              <span className="text-xs text-muted-foreground">{mood.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Mix du jour (hero) */}
      <section className="px-5 pb-2">
        <button
          onClick={() => {
            if (tracks[0]) {
              playTrack(tracks[0]);
              navigate('/player');
            }
          }}
          className="relative w-full overflow-hidden rounded-3xl border border-border/40 bg-card/50 p-5"
        >
          {tracks[0]?.cover && (
            <div className="absolute inset-0 opacity-40">
              <img
                src={tracks[0].cover}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover blur-2xl scale-110"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

          <div className="relative flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Mix du jour</p>
              <h2 className="text-xl font-semibold mt-1">{dailyPlaylists[0].name}</h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{dailyPlaylists[0].artists}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            </div>
          </div>
        </button>
      </section>

      {/* Playlists du jour */}
      <section className="py-6">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-lg font-semibold">Playlists du jour</h2>
          <button className="text-muted-foreground" aria-label="Voir plus">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5">
          {dailyPlaylists.map((playlist, index) => (
            <button
              key={playlist.id}
              onClick={() => {
                if (tracks.length > index) {
                  playTrack(tracks[index]);
                  navigate('/player');
                }
              }}
              className="relative overflow-hidden rounded-3xl aspect-square border border-border/40 bg-card"
            >
              <img
                src={playlist.cover}
                alt={playlist.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-background/30 backdrop-blur-sm text-foreground text-xs font-medium mb-2 border border-border/40">
                  {playlist.name}
                </span>
                <p className="text-muted-foreground text-xs truncate">{playlist.artists}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Récemment écoutés */}
      {tracks.length > 0 && (
        <section className="py-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-semibold">Récemment écoutés</h2>
            <button onClick={() => navigate('/library')} className="text-muted-foreground" aria-label="Aller à la bibliothèque">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar">
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

      {/* Vos playlists */}
      {playlists.length > 0 && (
        <section className="py-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-semibold">Vos playlists</h2>
            <button onClick={() => navigate('/library')} className="text-muted-foreground" aria-label="Voir la bibliothèque">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar">
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
                <p className="text-xs text-muted-foreground text-left">{playlist.trackIds.length} titres</p>
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
          <h3 className="text-xl font-semibold mb-2">Commencez votre aventure</h3>
          <p className="text-muted-foreground mb-6">Importez vos morceaux préférés</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
