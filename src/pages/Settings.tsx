import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Volume2, 
  Trash2, 
  Info, 
  Moon, 
  Bell,
  Smartphone,
  Globe,
  Shield,
  HelpCircle,
  Star,
  Palette,
  Wifi,
  Music,
  Download,
  Lock,
  LogOut,
  User,
  Mail,
  Key,
  Database,
  Zap,
  Eye,
  Vibrate,
  Clock,
  RefreshCw,
  Share2,
  MessageCircle,
  FileText,
  Heart
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { volume, setVolume, tracks, removeTrack } = useMusic();
  const [notifications, setNotifications] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [gapless, setGapless] = useState(true);
  const [normalize, setNormalize] = useState(false);
  const [crossfade, setCrossfade] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(false);
  const [vibration, setVibration] = useState(true);
  const [showLyrics, setShowLyrics] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [privateSession, setPrivateSession] = useState(false);

  const clearLibrary = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toute votre bibliothèque ?')) {
      tracks.forEach((t) => removeTrack(t.id));
      toast.success('Bibliothèque vidée');
    }
  };

  const clearCache = () => {
    toast.success('Cache vidé avec succès');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MusicFlow',
        text: 'Découvrez MusicFlow, votre lecteur de musique préféré !',
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Lien copié !');
    }
  };

  const settingsSections = [
    {
      title: 'Mon compte',
      items: [
        {
          icon: User,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Profil',
          value: 'Modifier',
          action: () => navigate('/profile'),
        },
        {
          icon: Mail,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Email',
          value: 'user@email.com',
          action: () => toast.info('Fonctionnalité à venir'),
        },
        {
          icon: Key,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          label: 'Mot de passe',
          value: '••••••••',
          action: () => toast.info('Fonctionnalité à venir'),
        },
      ],
    },
    {
      title: 'Audio & Lecture',
      items: [
        {
          icon: Volume2,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Qualité audio HD',
          description: 'Streaming haute qualité',
          toggle: true,
          checked: highQuality,
          onToggle: setHighQuality,
        },
        {
          icon: Music,
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          label: 'Lecture sans coupure',
          description: 'Enchaînement fluide',
          toggle: true,
          checked: gapless,
          onToggle: setGapless,
        },
        {
          icon: Volume2,
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'Normaliser le volume',
          description: 'Volume uniforme',
          toggle: true,
          checked: normalize,
          onToggle: setNormalize,
        },
        {
          icon: RefreshCw,
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-500',
          label: 'Crossfade',
          description: 'Transition douce entre morceaux',
          toggle: true,
          checked: crossfade,
          onToggle: setCrossfade,
        },
        {
          icon: Eye,
          iconBg: 'bg-pink-500/20',
          iconColor: 'text-pink-500',
          label: 'Afficher les paroles',
          description: 'Karaoké automatique',
          toggle: true,
          checked: showLyrics,
          onToggle: setShowLyrics,
        },
      ],
    },
    {
      title: 'Lecture automatique',
      items: [
        {
          icon: Zap,
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          label: 'Lecture automatique',
          description: 'Continuer après la fin',
          toggle: true,
          checked: autoPlay,
          onToggle: setAutoPlay,
        },
        {
          icon: Clock,
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-500',
          label: 'Timer de sommeil',
          description: 'Arrêt automatique',
          toggle: true,
          checked: sleepTimer,
          onToggle: setSleepTimer,
        },
      ],
    },
    {
      title: 'Téléchargements',
      items: [
        {
          icon: Wifi,
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-500',
          label: 'Wi-Fi uniquement',
          description: 'Économiser les données',
          toggle: true,
          checked: wifiOnly,
          onToggle: setWifiOnly,
        },
        {
          icon: Download,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Téléchargement auto',
          description: 'Favoris en hors-ligne',
          toggle: true,
          checked: autoDownload,
          onToggle: setAutoDownload,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-500',
          label: 'Notifications push',
          description: 'Nouvelles sorties',
          toggle: true,
          checked: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Vibrate,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-500',
          label: 'Vibrations',
          description: 'Retour haptique',
          toggle: true,
          checked: vibration,
          onToggle: setVibration,
        },
      ],
    },
    {
      title: 'Apparence',
      items: [
        {
          icon: Moon,
          iconBg: 'bg-slate-500/20',
          iconColor: 'text-slate-400',
          label: 'Thème sombre',
          value: 'Activé',
          toggle: true,
          checked: true,
          disabled: true,
        },
        {
          icon: Palette,
          iconBg: 'bg-pink-500/20',
          iconColor: 'text-pink-500',
          label: 'Couleur d\'accent',
          value: 'Blanc',
          action: () => toast.info('Bientôt disponible'),
        },
        {
          icon: Globe,
          iconBg: 'bg-teal-500/20',
          iconColor: 'text-teal-500',
          label: 'Langue',
          value: 'Français',
          action: () => toast.info('Bientôt disponible'),
        },
      ],
    },
    {
      title: 'Confidentialité',
      items: [
        {
          icon: Lock,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Session privée',
          description: 'Historique masqué',
          toggle: true,
          checked: privateSession,
          onToggle: setPrivateSession,
        },
        {
          icon: Shield,
          iconBg: 'bg-emerald-500/20',
          iconColor: 'text-emerald-500',
          label: 'Politique de confidentialité',
          value: '',
          action: () => toast.info('Ouvre la politique'),
        },
        {
          icon: FileText,
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          label: 'Conditions d\'utilisation',
          value: '',
          action: () => toast.info('Ouvre les CGU'),
        },
      ],
    },
    {
      title: 'Stockage & données',
      items: [
        {
          icon: Smartphone,
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'Morceaux importés',
          value: `${tracks.length} fichiers`,
        },
        {
          icon: Database,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Vider le cache',
          value: '',
          action: clearCache,
        },
        {
          icon: Trash2,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-500',
          label: 'Vider la bibliothèque',
          value: '',
          action: clearLibrary,
          destructive: true,
        },
      ],
    },
    {
      title: 'Support & aide',
      items: [
        {
          icon: HelpCircle,
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          label: 'Centre d\'aide',
          value: '',
          action: () => toast.info('Ouvre le centre d\'aide'),
        },
        {
          icon: MessageCircle,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Nous contacter',
          value: '',
          action: () => toast.info('Ouvre le support'),
        },
        {
          icon: Star,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          label: 'Noter l\'application',
          value: '',
          action: () => toast.success('Merci pour votre soutien !'),
        },
        {
          icon: Share2,
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          label: 'Partager l\'app',
          value: '',
          action: handleShare,
        },
        {
          icon: Heart,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-500',
          label: 'Crédits & remerciements',
          value: '',
          action: () => toast.info('Made with ❤️'),
        },
      ],
    },
    {
      title: 'À propos',
      items: [
        {
          icon: Info,
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          label: 'Version',
          value: '2.1.0',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      <header className="sticky top-0 z-10 p-4 pt-safe bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Paramètres</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {settingsSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-white/5 rounded-xl overflow-hidden">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-3 ${
                    index !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  } ${item.action && !item.toggle ? 'cursor-pointer active:bg-white/5' : ''}`}
                  onClick={item.action && !item.toggle ? item.action : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.destructive ? 'text-red-500' : ''}`}>
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {item.toggle ? (
                    <Switch 
                      checked={item.checked} 
                      onCheckedChange={item.onToggle}
                      disabled={item.disabled}
                    />
                  ) : item.value ? (
                    <span className="text-[11px] text-muted-foreground">{item.value}</span>
                  ) : item.action ? (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <button 
          onClick={() => toast.info('Déconnexion...')}
          className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            MusicFlow
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Votre musique, votre style
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
