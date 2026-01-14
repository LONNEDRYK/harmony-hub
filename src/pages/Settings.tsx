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
  CreditCard,
  Crown,
  LogOut
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { volume, setVolume, tracks, removeTrack } = useMusic();
  const [notifications, setNotifications] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [gapless, setGapless] = useState(true);
  const [normalize, setNormalize] = useState(false);

  const clearLibrary = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toute votre bibliothèque ?')) {
      tracks.forEach((t) => removeTrack(t.id));
    }
  };

  const settingsSections = [
    {
      title: 'Compte',
      items: [
        {
          icon: Crown,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          label: 'Abonnement',
          value: 'Gratuit',
          action: () => navigate('/subscription'),
        },
        {
          icon: CreditCard,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Paiement',
          value: '',
          action: () => {},
        },
      ],
    },
    {
      title: 'Audio',
      items: [
        {
          icon: Volume2,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Qualité haute',
          value: '',
          toggle: true,
          checked: highQuality,
          onToggle: setHighQuality,
        },
        {
          icon: Music,
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          label: 'Lecture sans coupure',
          value: '',
          toggle: true,
          checked: gapless,
          onToggle: setGapless,
        },
        {
          icon: Volume2,
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'Normaliser le volume',
          value: '',
          toggle: true,
          checked: normalize,
          onToggle: setNormalize,
        },
      ],
    },
    {
      title: 'Lecture',
      items: [
        {
          icon: Wifi,
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-500',
          label: 'Wi-Fi uniquement',
          value: '',
          toggle: true,
          checked: wifiOnly,
          onToggle: setWifiOnly,
        },
        {
          icon: Music,
          iconBg: 'bg-pink-500/20',
          iconColor: 'text-pink-500',
          label: 'Lecture automatique',
          value: '',
          toggle: true,
          checked: autoPlay,
          onToggle: setAutoPlay,
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
          value: '',
          toggle: true,
          checked: notifications,
          onToggle: setNotifications,
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
          value: 'Or',
          action: () => {},
        },
        {
          icon: Globe,
          iconBg: 'bg-teal-500/20',
          iconColor: 'text-teal-500',
          label: 'Langue',
          value: 'Français',
          action: () => {},
        },
      ],
    },
    {
      title: 'Données',
      items: [
        {
          icon: Smartphone,
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'Morceaux importés',
          value: `${tracks.length} fichiers`,
        },
        {
          icon: Download,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Téléchargements',
          value: '0 MB',
          action: () => {},
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
      title: 'Sécurité',
      items: [
        {
          icon: Lock,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Verrouillage app',
          value: 'Désactivé',
          action: () => {},
        },
        {
          icon: Shield,
          iconBg: 'bg-emerald-500/20',
          iconColor: 'text-emerald-500',
          label: 'Confidentialité',
          value: '',
          action: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          label: 'Aide & Support',
          value: '',
          action: () => {},
        },
        {
          icon: Star,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          label: 'Noter l\'application',
          value: '',
          action: () => {},
        },
        {
          icon: Info,
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          label: 'Version',
          value: '2.0.0',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      <header className="p-5 pt-safe flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Paramètres</h1>
      </header>

      <div className="px-5 space-y-5">
        {settingsSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-white/5 rounded-2xl overflow-hidden">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-3.5 ${
                    index !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  } ${item.action && !item.toggle ? 'cursor-pointer active:bg-white/5' : ''}`}
                  onClick={item.action && !item.toggle ? item.action : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <p className={`text-sm font-medium ${item.destructive ? 'text-red-500' : ''}`}>
                      {item.label}
                    </p>
                  </div>
                  
                  {item.toggle ? (
                    <Switch 
                      checked={item.checked} 
                      onCheckedChange={item.onToggle}
                      disabled={item.disabled}
                    />
                  ) : item.value ? (
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  ) : item.action ? (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <button className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-500 font-medium text-sm flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            MusicFlow
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Votre musique, votre style
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
