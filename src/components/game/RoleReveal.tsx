import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

interface RoleRevealProps {
  playerIndex: number;
  totalPlayers: number;
  role: 'player' | 'impostor';
  word: string;
  onNext: () => void;
}

export function RoleReveal({ playerIndex, totalPlayers, role, word, onNext }: RoleRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { t } = useLanguage();
  const isImpostor = role === 'impostor';

  const handleHideAndPass = () => { setIsRevealed(false); onNext(); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">{t.reveal.playerOf(playerIndex + 1, totalPlayers)}</p>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((playerIndex + 1) / totalPlayers) * 100}%` }} />
          </div>
        </div>

        <div className={cn(
          "relative rounded-3xl p-8 shadow-xl border-2 transition-all duration-500",
          isRevealed && isImpostor ? "bg-impostor/10 border-impostor" : isRevealed ? "bg-success/10 border-success" : "bg-card border-border"
        )}>
          {!isRevealed ? (
            <div className="text-center space-y-6 py-8">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center"><EyeOff className="h-12 w-12 text-muted-foreground" /></div>
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold">{t.reveal.player(playerIndex + 1)}</h2>
                <p className="text-muted-foreground">{t.reveal.tapToReveal}</p>
              </div>
              <Button onClick={() => setIsRevealed(true)} className="w-full h-14 text-lg font-display rounded-xl animate-pulse-glow" size="lg">
                <Eye className="h-5 w-5 mr-2" />{t.reveal.reveal}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4 animate-bounce-in">
              <div className={cn("w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl", isImpostor ? "bg-impostor" : "bg-success")}>
                {isImpostor ? "🎭" : "✓"}
              </div>
              <div className="space-y-2">
                <h2 className={cn("text-3xl font-display font-bold", isImpostor ? "text-impostor" : "text-success")}>
                  {isImpostor ? t.reveal.impostor : t.reveal.innocent}
                </h2>
                {isImpostor ? (
                  <p className="text-lg text-muted-foreground">{t.reveal.impostorDesc}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t.reveal.yourWord}</p>
                    <p className="text-4xl font-display font-bold text-foreground">{word}</p>
                  </div>
                )}
              </div>
              <Button onClick={handleHideAndPass} variant="outline" className="w-full h-14 text-lg font-display rounded-xl" size="lg">
                {t.reveal.hideAndPass}<ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">{t.reveal.dontShowWarning}</p>
      </div>
    </div>
  );
}
