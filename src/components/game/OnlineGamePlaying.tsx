import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ArrowLeft, HelpCircle, Users, Crown, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Player } from '@/hooks/useOnlineGame';

interface OnlineGamePlayingProps {
  players: Player[];
  myRole: 'player' | 'impostor';
  word: string | null;
  isHost: boolean;
  onNewRound: () => void;
  onLeaveRoom: () => void;
}

export default function OnlineGamePlaying({ players, myRole, word, isHost, onNewRound, onLeaveRoom }: OnlineGamePlayingProps) {
  const isImpostor = myRole === 'impostor';
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" />{t.onlinePlaying.exit}</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.onlinePlaying.exitRoom}</AlertDialogTitle>
                <AlertDialogDescription>{isHost ? t.onlinePlaying.exitHostDesc : t.onlinePlaying.exitPlayerDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.onlinePlaying.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onLeaveRoom}>{t.onlinePlaying.exit}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="icon"><HelpCircle className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t.onlinePlaying.howToPlay}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>{t.onlinePlaying.howToPlay}:</strong> {t.onlinePlaying.objective}</p>
                <p><strong>{t.onlinePlaying.players}:</strong> {t.onlinePlaying.playersHint}</p>
                <p><strong>Impostors:</strong> {t.onlinePlaying.impostorsHint}</p>
                <p><strong>Tip:</strong> {t.onlinePlaying.advice}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className={`border-2 ${isImpostor ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
          <CardContent className="py-8 text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isImpostor ? 'bg-destructive/20' : 'bg-primary/20'}`}>
              {isImpostor ? <EyeOff className="w-8 h-8 text-destructive" /> : <Eye className="w-8 h-8 text-primary" />}
            </div>
            {isImpostor ? (
              <div><h2 className="text-2xl font-bold text-destructive mb-2">{t.onlinePlaying.youAreImpostor}</h2><p className="text-muted-foreground">{t.onlinePlaying.dontKnowWord}</p></div>
            ) : (
              <div><p className="text-sm text-muted-foreground mb-1">{t.onlinePlaying.secretWordIs}</p><h2 className="text-3xl font-bold text-primary">{word}</h2></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />{t.onlinePlaying.players} ({players.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <Badge key={player.player_id} variant="secondary" className="text-sm py-1 px-3">
                  {player.is_host && <Crown className="w-3 h-3 mr-1" />}{player.player_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {isHost && (
          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild><Button className="w-full" variant="default"><RotateCcw className="w-4 h-4 mr-2" />{t.onlinePlaying.newRound}</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.onlinePlaying.newRoundConfirm}</AlertDialogTitle>
                  <AlertDialogDescription>{t.onlinePlaying.newRoundDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.onlinePlaying.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={onNewRound}>{t.onlinePlaying.newRound}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {!isHost && (
          <Card><CardContent className="py-4 text-center"><p className="text-sm text-muted-foreground">{t.onlinePlaying.hostCanStart}</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
