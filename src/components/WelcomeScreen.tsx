import { useState, useEffect } from 'react';
import { Music2, Headphones, Heart, Sparkles } from 'lucide-react';

const WELCOME_KEY = 'musicflow_welcome_seen';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(1);

  useEffect(() => {
    // Check if user has seen the welcome screen
    const hasSeen = localStorage.getItem(WELCOME_KEY);
    if (!hasSeen) {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleContinue = () => {
    localStorage.setItem(WELCOME_KEY, 'true');
    setIsVisible(false);
    onComplete();
  };

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev === 2 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const cards = [
    {
      icon: Music2,
      title: "Votre Musique",
      subtitle: "Bibliothèque locale",
      gradient: "from-violet-500 to-purple-600",
      rotation: "-12deg",
    },
    {
      icon: Headphones,
      title: "Expérience",
      subtitle: "Audio Premium",
      gradient: "from-primary to-amber-500",
      rotation: "0deg",
    },
    {
      icon: Heart,
      title: "Favoris",
      subtitle: "Collection personnelle",
      gradient: "from-emerald-500 to-teal-600",
      rotation: "12deg",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />

      {/* Cards Carousel */}
      <div className="relative w-full h-[45vh] flex items-center justify-center mb-8">
        {cards.map((card, index) => {
          const isActive = index === activeCard;
          const offset = (index - activeCard) * 120;
          const scale = isActive ? 1 : 0.85;
          const opacity = isActive ? 1 : 0.6;
          const zIndex = isActive ? 10 : 5 - Math.abs(index - activeCard);
          
          return (
            <div
              key={index}
              onClick={() => setActiveCard(index)}
              className="absolute w-52 h-72 cursor-pointer transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${offset}px) scale(${scale}) rotate(${isActive ? '0deg' : card.rotation})`,
                opacity,
                zIndex,
              }}
            >
              <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${card.gradient} p-1 shadow-2xl`}>
                <div className="w-full h-full rounded-[22px] bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <card.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-sm text-white/60">{card.subtitle}</p>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-[10px] text-white font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative text-center px-8 max-w-md">
        <p className="text-white/60 text-sm mb-2">Bienvenue sur</p>
        <h1 className="text-4xl font-bold text-white mb-4">MusicFlow</h1>
        <p className="text-white/60 text-base leading-relaxed mb-8">
          Importez votre musique locale et profitez d'une expérience d'écoute premium avec paroles, playlists et bien plus.
        </p>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeCard ? 'w-6 bg-primary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-lg shadow-xl shadow-white/10 active:scale-[0.98] transition-transform"
        >
          Commencer
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
