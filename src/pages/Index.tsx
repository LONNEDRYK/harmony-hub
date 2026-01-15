import { useNavigate } from 'react-router-dom';
import { Play, Bell, Music2, Heart, Clock, Disc3, Sparkles, TrendingUp } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, togglePlay, playTrack, userProfile, playlists } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const recentTracks = tracks.slice(0, 8);
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const stats = [
    { icon: Music2, value: tracks.length, label: 'Titres' },
    { icon: Heart, value: favorites.length, label: 'Favoris' },
    { icon: Disc3, value: playlists.length, label: 'Playlists' },
    { icon: Clock, value: `${hours}h${minutes}`, label: 'Durée' },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-5 pt-safe">
        <button 
          onClick={() => navigate('/profile')}
          className="relative"
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-primary/30 shadow-lg shadow-primary/20">
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </div>
        </button>
        
        <img 
          src={logo} 
          alt="MusicFlow" 
          className="h-9 w-auto"
        />
        
        <button 
          onClick={() => navigate('/notifications')}
          className="w-12 h-12 rounded-2xl bg-card/60 backdrop-blur-sm border border-white/5 flex items-center justify-center"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative px-5 py-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 rounded-full bg-primary/20 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-1">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            {tracks.length > 0 
              ? `${tracks.length} morceaux vous attendent`
              : 'Commencez votre aventure musicale'
            }
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-2">
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (tracks.length > 0) {
                if (currentTrack) {
                  togglePlay();
                } else {
                  playTrack(tracks[0]);
                }
              } else {
                navigate('/library');
              }
            }}
            className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-2xl font-semibold shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            {tracks.length > 0 
              ? (isPlaying && currentTrack ? 'En lecture' : 'Lecture aléatoire')
              : 'Importer'
            }
          </button>
          <button
            onClick={() => navigate('/library')}
            className="w-14 h-14 rounded-2xl bg-card/60 backdrop-blur border border-white/5 flex items-center justify-center"
          >
            <Music2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Quick Play Grid */}
      {tracks.length > 0 && (
        <section className="px-5 py-5">
          <h2 className="text-lg font-bold mb-4">Lecture rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 4).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur border border-white/5 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3 p-3">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-14 h-14 rounded-xl object-cover shadow-lg"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-5">
          <div className="flex items-center justify-between px-5 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
              <h2 className="text-lg font-bold">Vos favoris</h2>
            </div>
            <button
              onClick={() => navigate('/library?tab=favorites')}
              className="text-primary text-sm font-medium"
            >
              Tout voir
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
            {favorites.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex-shrink-0 w-36 group"
              >
                <div className="relative mb-3">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-36 h-36 rounded-2xl object-cover shadow-xl group-active:scale-95 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                </div>
                <p className="font-semibold text-sm truncate text-left">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate text-left">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recent Section */}
      {recentTracks.length > 0 && (
        <section className="py-5">
          <div className="flex items-center justify-between px-5 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Récemment ajoutés</h2>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="text-primary text-sm font-medium"
            >
              Tout voir
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
            {recentTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex-shrink-0 w-32 group"
              >
                <div className="relative mb-3">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-32 h-32 rounded-2xl object-cover shadow-xl group-active:scale-95 transition-transform"
                  />
                </div>
                <p className="font-semibold text-sm truncate text-left">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate text-left">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-10 text-center">
          <div className="glass-card p-10">
            <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Music2 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Bibliothèque vide</h3>
            <p className="text-muted-foreground mb-8">
              Importez vos morceaux préférés pour commencer votre expérience musicale
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
            >
              Importer de la musique
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
