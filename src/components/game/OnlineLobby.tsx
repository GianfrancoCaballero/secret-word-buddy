import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';

interface OnlineLobbyProps {
  playerName: string;
  onSetPlayerName: (name: string) => void;
  onCreateRoom: () => Promise<{ error?: string; success?: boolean; roomCode?: string }>;
  onJoinRoom: (code: string) => Promise<{ error?: string; success?: boolean }>;
  onGoHome: () => void;
}

export default function OnlineLobby({ playerName, onSetPlayerName, onCreateRoom, onJoinRoom, onGoHome }: OnlineLobbyProps) {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCreateRoom = async () => {
    if (!playerName.trim()) { toast({ title: t.common.error, description: t.online.errorEnterName, variant: 'destructive' }); return; }
    setIsLoading(true);
    const result = await onCreateRoom();
    setIsLoading(false);
    if (result.error) toast({ title: t.common.error, description: result.error, variant: 'destructive' });
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) { toast({ title: t.common.error, description: t.online.errorEnterName, variant: 'destructive' }); return; }
    if (!roomCode.trim()) { toast({ title: t.common.error, description: t.online.errorEnterCode, variant: 'destructive' }); return; }
    setIsLoading(true);
    const result = await onJoinRoom(roomCode);
    setIsLoading(false);
    if (result.error) toast({ title: t.common.error, description: result.error, variant: 'destructive' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onGoHome} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />{t.online.backToHome}
          </Button>
          <LanguageSwitcher />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t.online.onlineMode}</h1>
          <p className="text-muted-foreground">{t.online.playRealtime}</p>
        </div>

        <Card>
          <CardHeader><CardTitle>{t.online.yourName}</CardTitle><CardDescription>{t.online.enterName}</CardDescription></CardHeader>
          <CardContent>
            <Input placeholder={t.online.namePlaceholder} value={playerName} onChange={(e) => onSetPlayerName(e.target.value)} maxLength={20} />
          </CardContent>
        </Card>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create"><Users className="w-4 h-4 mr-2" />{t.online.createRoom}</TabsTrigger>
            <TabsTrigger value="join"><UserPlus className="w-4 h-4 mr-2" />{t.online.joinRoom}</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card>
              <CardHeader><CardTitle>{t.online.createNewRoom}</CardTitle><CardDescription>{t.online.createDesc}</CardDescription></CardHeader>
              <CardContent>
                <Button onClick={handleCreateRoom} className="w-full" disabled={isLoading || !playerName.trim()}>
                  {isLoading ? t.online.creating : t.online.createRoom}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="join">
            <Card>
              <CardHeader><CardTitle>{t.online.joinRoomTitle}</CardTitle><CardDescription>{t.online.joinDesc}</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomCode">{t.online.roomCodeLabel}</Label>
                  <Input id="roomCode" placeholder="ABC123" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={6} className="text-center text-2xl tracking-widest font-mono" />
                </div>
                <Button onClick={handleJoinRoom} className="w-full" disabled={isLoading || !playerName.trim() || !roomCode.trim()}>
                  {isLoading ? t.online.joining : t.online.joinRoom}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
