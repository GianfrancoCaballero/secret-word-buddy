import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Users, Copy, Check, Crown, Play, HelpCircle, FileSpreadsheet, FolderOpen, Loader2, RefreshCw, UserX } from 'lucide-react';
import { useExcelImport } from '@/hooks/useExcelImport';
import { useWordCategories } from '@/hooks/useWordCategories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Player } from '@/hooks/useOnlineGame';

interface WaitingRoomProps {
  roomCode: string;
  players: Player[];
  words: string[];
  impostorCount: number;
  isHost: boolean;
  canStart: boolean;
  onAddWord: (word: string) => void;
  onAddWords: (words: string[]) => void;
  onRemoveWord: (word: string) => void;
  onSetImpostorCount: (count: number) => void;
  onStartGame: () => Promise<{ error?: string; success?: boolean }>;
  onLeaveRoom: () => void;
  onRefreshPlayers: () => void;
  onKickPlayer: (targetPlayerId: string) => void;
}

export default function WaitingRoom({
  roomCode, players, words, impostorCount, isHost, canStart,
  onAddWord, onAddWords, onRemoveWord, onSetImpostorCount, onStartGame, onLeaveRoom, onRefreshPlayers, onKickPlayer,
}: WaitingRoomProps) {
  const [newWord, setNewWord] = useState('');
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const { fileInputRef, handleFileChange, triggerFileSelect } = useExcelImport((importedWords) => { onAddWords(importedWords); });
  const { categories, loading: loadingCategories, selectCategory } = useWordCategories((categoryWords) => { onAddWords(categoryWords); setCategoryOpen(false); });

  const maxImpostors = Math.max(1, Math.floor(players.length / 2));

  const handleAddWord = () => { if (newWord.trim()) { onAddWord(newWord.trim()); setNewWord(''); } };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast({ title: t.waiting.codeCopied, description: t.waiting.codeCopiedDesc });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = async () => {
    setIsStarting(true);
    const result = await onStartGame();
    setIsStarting(false);
    if (result.error) toast({ title: t.common.error, description: result.error, variant: 'destructive' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" />{t.waiting.exit}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.waiting.exitRoom}</AlertDialogTitle>
                <AlertDialogDescription>{isHost ? t.waiting.exitHostDesc : t.waiting.exitPlayerDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.waiting.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onLeaveRoom}>{t.waiting.exit}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="icon"><HelpCircle className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t.waiting.howToPlay}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>1.</strong> {t.waiting.step1}</p>
                <p><strong>2.</strong> {t.waiting.step2}</p>
                <p><strong>3.</strong> {t.waiting.step3}</p>
                <p><strong>4.</strong> {t.waiting.step4}</p>
                <p><strong>5.</strong> {t.waiting.step5}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t.waiting.roomCode}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">{roomCode}</span>
                <Button variant="outline" size="icon" onClick={copyRoomCode}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
              </div>
              <p className="text-xs text-muted-foreground">{t.waiting.shareCode}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Users className="w-5 h-5" />{t.waiting.players} ({players.length})</div>
              <Button variant="ghost" size="icon" onClick={onRefreshPlayers} title={t.waiting.refreshList}><RefreshCw className="w-4 h-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <Badge key={player.player_id} variant={player.is_host ? 'default' : 'secondary'} className="text-sm py-1 px-3 flex items-center gap-1">
                  {player.is_host && <Crown className="w-3 h-3 mr-1" />}{player.player_name}
                  {isHost && !player.is_host && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="ml-1 hover:text-destructive" title={t.waiting.kickPlayer}>
                          <UserX className="w-3 h-3" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.waiting.kickConfirm}</AlertDialogTitle>
                          <AlertDialogDescription>{t.waiting.kickDesc(player.player_name)}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.waiting.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onKickPlayer(player.player_id)}>{t.waiting.kickPlayer}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </Badge>
              ))}
            </div>
            {players.length < 2 && <p className="text-sm text-muted-foreground mt-4">{t.waiting.waitingPlayers}</p>}
          </CardContent>
        </Card>

        {isHost && (
          <>
            <Card>
              <CardHeader><CardTitle>{t.waiting.wordBank}</CardTitle><CardDescription>{t.waiting.wordBankDesc}</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder={t.waiting.newWord} value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddWord()} />
                  <Button onClick={handleAddWord} disabled={!newWord.trim()}><Plus className="w-4 h-4" /></Button>
                  <Button onClick={triggerFileSelect} variant="outline" title={t.setup.importExcel}><FileSpreadsheet className="w-4 h-4" /></Button>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild><Button variant="outline" title={t.setup.chooseCategory}><FolderOpen className="w-4 h-4" /></Button></PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="end">
                      <div className="space-y-1">
                        <p className="text-sm font-medium px-2 py-1">{t.setup.categories}</p>
                        {loadingCategories ? (
                          <div className="flex items-center justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                        ) : (
                          categories.map((cat) => (
                            <Button key={cat.id} variant="ghost" className="w-full justify-start text-left" onClick={() => selectCategory(cat)}>
                              <span className="mr-2">{cat.icon}</span>{cat.name}
                              <span className="ml-auto text-xs text-muted-foreground">{cat.words.length}</span>
                            </Button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
                </div>
                {words.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {words.map((word) => (
                      <Badge key={word} variant="outline" className="text-sm py-1 px-3">
                        {word}<button onClick={() => onRemoveWord(word)} className="ml-2 hover:text-destructive"><X className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t.waiting.addWord}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t.waiting.impostorCount}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => onSetImpostorCount(Math.max(1, impostorCount - 1))} disabled={impostorCount <= 1}>-</Button>
                  <span className="text-3xl font-bold w-12 text-center">{impostorCount}</span>
                  <Button variant="outline" size="icon" onClick={() => onSetImpostorCount(Math.min(maxImpostors, impostorCount + 1))} disabled={impostorCount >= maxImpostors}>+</Button>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">{t.waiting.maxImpostors(maxImpostors, players.length)}</p>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handleStartGame} disabled={!canStart || isStarting}>
              <Play className="w-5 h-5 mr-2" />{isStarting ? t.waiting.starting : t.waiting.startGame}
            </Button>
          </>
        )}

        {!isHost && (
          <Card><CardContent className="py-8 text-center"><p className="text-muted-foreground">{t.waiting.waitingHost}</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
