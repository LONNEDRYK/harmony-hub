import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ChevronLeft, 
  Crown,
  Check,
  Sparkles,
  Music,
  Download,
  Headphones,
  Zap,
  Shield,
  Star,
  X
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  color: string;
  savings?: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    period: 'Pour toujours',
    color: 'from-gray-500 to-gray-600',
    features: [
      'Importation de musique locale',
      'Lecture de base',
      'Créer des playlists',
      'Qualité audio standard',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '9,99€',
    period: '/mois',
    popular: true,
    color: 'from-primary to-amber-500',
    features: [
      'Tout le gratuit inclus',
      'Qualité audio Hi-Fi',
      'Téléchargement hors ligne',
      'Pas de publicités',
      'Égaliseur avancé',
      'Paroles synchronisées',
    ],
  },
  {
    id: 'family',
    name: 'Famille',
    price: '14,99€',
    period: '/mois',
    savings: 'Économisez 50%',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Tout Premium inclus',
      'Jusqu\'à 6 comptes',
      'Contrôle parental',
      'Mix famille personnalisé',
      'Partage de playlists',
    ],
  },
];

const premiumFeatures = [
  {
    icon: Headphones,
    title: 'Audio Hi-Fi',
    description: 'Qualité studio sans perte',
    color: 'text-blue-500',
    bg: 'bg-blue-500/20',
  },
  {
    icon: Download,
    title: 'Mode hors ligne',
    description: 'Téléchargez et écoutez partout',
    color: 'text-green-500',
    bg: 'bg-green-500/20',
  },
  {
    icon: Zap,
    title: 'Sans publicités',
    description: 'Musique sans interruption',
    color: 'text-amber-500',
    bg: 'bg-amber-500/20',
  },
  {
    icon: Shield,
    title: 'Écoute protégée',
    description: 'Vos données sont sécurisées',
    color: 'text-purple-500',
    bg: 'bg-purple-500/20',
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubscribe = () => {
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent h-80" />
        
        <div className="relative p-5 pt-safe">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Passez Premium</h1>
            <p className="text-muted-foreground">
              Débloquez toutes les fonctionnalités
            </p>
          </div>
        </div>
      </header>

      {/* Premium Features */}
      <section className="px-5 mb-8">
        <div className="grid grid-cols-2 gap-3">
          {premiumFeatures.map((feature) => (
            <div 
              key={feature.title}
              className="bg-white/5 rounded-2xl p-4"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-3`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="px-5 pb-32">
        <h2 className="text-lg font-bold mb-4">Choisissez votre offre</h2>
        <div className="space-y-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-5 rounded-2xl transition-all ${
                selectedPlan === plan.id 
                  ? 'bg-gradient-to-r ' + plan.color + ' ring-2 ring-white/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                        Populaire
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-white/60">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className="inline-block mt-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                      {plan.savings}
                    </span>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id 
                    ? 'border-white bg-white' 
                    : 'border-white/40'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className={selectedPlan === plan.id ? 'text-white' : 'text-muted-foreground'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Subscribe Button */}
        {selectedPlan !== 'free' && (
          <button
            onClick={handleSubscribe}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            S'abonner maintenant
          </button>
        )}

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Annulation possible à tout moment. En vous abonnant, vous acceptez nos conditions d'utilisation.
        </p>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-zinc-900 rounded-3xl p-6 w-full max-w-sm animate-scale-in">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prêt à commencer ?</h3>
              <p className="text-muted-foreground mb-6">
                Votre abonnement {plans.find(p => p.id === selectedPlan)?.name} commencera immédiatement.
              </p>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  navigate('/profile');
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold"
              >
                Confirmer l'abonnement
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full mt-3 py-3 text-muted-foreground font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
