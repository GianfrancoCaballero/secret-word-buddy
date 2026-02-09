import { RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/i18n/LanguageContext';

interface GamePlayingProps {
  playerCount: number;
  impostorCount: number;
  onNewRound: () => void;
  onReset: () => void;
}

export function GamePlaying({ playerCount, impostorCount, onNewRound, onReset }: GamePlayingProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full"><Home className="h-5 w-5" /></Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t.setup.backToHome}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.playing.exitGame}</AlertDialogTitle>
                <AlertDialogDescription>{t.playing.exitGameDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.playing.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>{t.playing.exit}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="text-8xl animate-bounce-in">🎭</div>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full"><HelpCircle className="h-5 w-5" /></Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t.setup.help}</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{t.playing.gameTips}</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-4 pt-4 text-left">
                    <div><h4 className="font-medium text-foreground">{t.playing.forInnocents}</h4><p className="text-sm text-muted-foreground">{t.playing.forInnocentsDesc}</p></div>
                    <div><h4 className="font-medium text-foreground">{t.playing.forImpostors}</h4><p className="text-sm text-muted-foreground">{t.playing.forImpostorsDesc}</p></div>
                    <div><h4 className="font-medium text-foreground">{t.playing.voting}</h4><p className="text-sm text-muted-foreground">{t.playing.votingDesc}</p></div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary">{t.playing.letsPlay}</h1>
          <p className="text-xl text-muted-foreground">{t.playing.findImpostor}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-success">{playerCount - impostorCount}</p>
              <p className="text-sm text-muted-foreground">{t.playing.innocents}</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-impostor">{impostorCount}</p>
              <p className="text-sm text-muted-foreground">{t.playing.impostorLabel(impostorCount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
          <p className="font-display font-medium text-sm">{t.playing.howToPlayTitle}</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>{t.playing.tip1}</li>
            <li>{t.playing.tip2}</li>
            <li>{t.playing.tip3}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full h-14 text-lg font-display font-semibold rounded-xl" size="lg">
                <RefreshCw className="h-5 w-5 mr-2" />{t.playing.newRound}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.playing.newRoundConfirm}</AlertDialogTitle>
                <AlertDialogDescription>{t.playing.newRoundDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.playing.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onNewRound}>{t.playing.newRound}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full h-12 font-display rounded-xl">
                <Home className="h-4 w-4 mr-2" />{t.playing.backToSetup}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.playing.backToSetupConfirm}</AlertDialogTitle>
                <AlertDialogDescription>{t.playing.backToSetupDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.playing.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>{t.playing.goToSetup}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
