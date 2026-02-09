import { useState } from 'react';
import { Plus, X, Users, UserX, Play, Home, HelpCircle, FileSpreadsheet, FolderOpen, Loader2 } from 'lucide-react';
import { useExcelImport } from '@/hooks/useExcelImport';
import { useWordCategories } from '@/hooks/useWordCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface GameSetupProps {
  words: string[];
  playerCount: number;
  impostorCount: number;
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onPlayerCountChange: (count: number) => void;
  onImpostorCountChange: (count: number) => void;
  onStartGame: () => void;
  onGoHome: () => void;
  canStart: boolean;
}

export function GameSetup({
  words, playerCount, impostorCount, onAddWord, onRemoveWord,
  onPlayerCountChange, onImpostorCountChange, onStartGame, onGoHome, canStart,
}: GameSetupProps) {
  const [newWord, setNewWord] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { t } = useLanguage();

  const { fileInputRef, handleFileChange, triggerFileSelect } = useExcelImport((importedWords) => {
    importedWords.forEach(word => onAddWord(word));
  });

  const { categories, loading: loadingCategories, selectCategory } = useWordCategories((categoryWords) => {
    categoryWords.forEach(word => onAddWord(word));
    setCategoryOpen(false);
  });

  const handleAddWord = () => {
    if (newWord.trim()) { onAddWord(newWord); setNewWord(''); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddWord();
  };

  const maxImpostors = Math.max(1, Math.floor(playerCount / 2));

  const getValidationMessage = () => {
    if (words.length === 0) return t.setup.validationNoWords;
    if (playerCount < 2) return t.setup.validationMinPlayers;
    if (impostorCount >= playerCount) return t.setup.validationTooManyImpostors;
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onGoHome} className="rounded-full">
                <Home className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.setup.backToHome}</TooltipContent>
          </Tooltip>

          <div className="text-center flex-1">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary">{t.setup.title}</h1>
          </div>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{t.setup.help}</TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">{t.setup.howToPlay}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4 pt-4 text-left">
                      <div><h4 className="font-medium text-foreground">{t.setup.step1Title}</h4><p className="text-sm text-muted-foreground">{t.setup.step1Desc}</p></div>
                      <div><h4 className="font-medium text-foreground">{t.setup.step2Title}</h4><p className="text-sm text-muted-foreground">{t.setup.step2Desc}</p></div>
                      <div><h4 className="font-medium text-foreground">{t.setup.step3Title}</h4><p className="text-sm text-muted-foreground">{t.setup.step3Desc}</p></div>
                      <div><h4 className="font-medium text-foreground">{t.setup.step4Title}</h4><p className="text-sm text-muted-foreground">{t.setup.step4Desc}</p></div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <p className="text-center text-muted-foreground -mt-4">{t.setup.subtitle}</p>

        {/* Word Input */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border space-y-4">
          <h2 className="font-display font-semibold text-lg">{t.setup.words}</h2>
          <div className="flex gap-2">
            <Input value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyPress={handleKeyPress} placeholder={t.setup.writeWord} className="flex-1" />
            <Button onClick={handleAddWord} size="icon" className="shrink-0"><Plus className="h-5 w-5" /></Button>
            <Button onClick={triggerFileSelect} size="icon" variant="outline" className="shrink-0" title={t.setup.importExcel}><FileSpreadsheet className="h-5 w-5" /></Button>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="shrink-0" title={t.setup.chooseCategory}><FolderOpen className="h-5 w-5" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="space-y-1">
                  <p className="text-sm font-medium px-2 py-1">{t.setup.categories}</p>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
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
          <div className="min-h-[80px] flex flex-wrap gap-2">
            {words.length === 0 ? (
              <p className="text-muted-foreground text-sm w-full text-center py-4">{t.setup.addWordsToPlay}</p>
            ) : (
              words.map((word) => (
                <Badge key={word} variant="secondary" className="text-sm py-1.5 px-3 flex items-center gap-2 animate-bounce-in">
                  {word}
                  <button onClick={() => onRemoveWord(word)} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Player Settings */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><span className="font-display font-medium">{t.setup.players}</span></div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => onPlayerCountChange(Math.max(2, playerCount - 1))} disabled={playerCount <= 2}>-</Button>
              <span className="text-3xl font-display font-bold w-12 text-center">{playerCount}</span>
              <Button variant="outline" size="icon" onClick={() => onPlayerCountChange(playerCount + 1)}>+</Button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2"><UserX className="h-5 w-5 text-impostor" /><span className="font-display font-medium">{t.setup.impostors}</span></div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => onImpostorCountChange(Math.max(1, impostorCount - 1))} disabled={impostorCount <= 1}>-</Button>
              <span className="text-3xl font-display font-bold w-12 text-center text-impostor">{impostorCount}</span>
              <Button variant="outline" size="icon" onClick={() => onImpostorCountChange(Math.min(maxImpostors, impostorCount + 1))} disabled={impostorCount >= maxImpostors}>+</Button>
            </div>
            <p className="text-xs text-muted-foreground">{t.setup.maxImpostors(maxImpostors, playerCount)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={onStartGame} disabled={!canStart} className="w-full h-14 text-lg font-display font-semibold rounded-xl shadow-lg" size="lg">
            <Play className="h-5 w-5 mr-2" />{t.setup.startGame}
          </Button>
          {validationMessage && <p className="text-center text-sm text-muted-foreground">⚠️ {validationMessage}</p>}
        </div>
      </div>
    </div>
  );
}
