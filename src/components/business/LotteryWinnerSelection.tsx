import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Trophy, Shuffle, UserCheck, Search, CheckCircle2, Send,
  Star, Phone, User, Sparkles, Crown, PartyPopper, X, Clock
} from 'lucide-react';

export interface LotteryWinner {
  participantId: string;
  userName: string;
  userPhone: string;
  userTrustScore: number;
  selectedAt: string;
  selectionMethod: 'random' | 'manual';
  status: 'selected' | 'notified' | 'booked' | 'completed';
}

interface Participant {
  id: string;
  user_name: string;
  user_phone: string;
  user_trust_score: number;
  registered_at: string;
  status: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotionId: string;
  promotionName: string;
  totalWinners: number;
  participants: Participant[];
}

// localStorage helpers
const getWinners = (promoId: string): LotteryWinner[] => {
  try {
    return JSON.parse(localStorage.getItem(`lottery_winners_${promoId}`) || '[]');
  } catch { return []; }
};
const saveWinners = (promoId: string, winners: LotteryWinner[]) => {
  localStorage.setItem(`lottery_winners_${promoId}`, JSON.stringify(winners));
};

export function LotteryWinnerSelection({ open, onOpenChange, promotionId, promotionName, totalWinners, participants }: Props) {
  const [mode, setMode] = useState<'choose' | 'random' | 'manual' | 'results'>('choose');
  const [winners, setWinners] = useState<LotteryWinner[]>([]);
  const [manualSelected, setManualSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [revealedWinners, setRevealedWinners] = useState<number>(0);
  const spinRef = useRef<NodeJS.Timeout | null>(null);

  const eligible = participants.filter(p => p.status === 'registered' || p.status === 'used');

  useEffect(() => {
    if (open) {
      const saved = getWinners(promotionId);
      if (saved.length > 0) {
        setWinners(saved);
        setMode('results');
      } else {
        setMode('choose');
        setManualSelected(new Set());
        setRevealedWinners(0);
      }
    }
  }, [open, promotionId]);

  // Random spin animation
  const startRandomDraw = useCallback(() => {
    if (eligible.length === 0) { toast.error("Ishtirokchilar yo'q"); return; }
    if (eligible.length < totalWinners) { toast.error(`Kamida ${totalWinners} ta ishtirokchi kerak`); return; }

    setIsSpinning(true);
    setRevealedWinners(0);
    const selected: LotteryWinner[] = [];
    const pool = [...eligible];
    let count = 0;
    const needed = Math.min(totalWinners, pool.length);

    const pickNext = () => {
      // Spin animation — cycle through names fast then slow
      let cycles = 0;
      const maxCycles = 20 + Math.random() * 15;
      const spin = () => {
        cycles++;
        setSpinIndex(Math.floor(Math.random() * pool.length));
        if (cycles < maxCycles) {
          spinRef.current = setTimeout(spin, 50 + cycles * 15);
        } else {
          // Pick winner
          const winnerIdx = Math.floor(Math.random() * pool.length);
          const winner = pool[winnerIdx];
          pool.splice(winnerIdx, 1);
          selected.push({
            participantId: winner.id,
            userName: winner.user_name,
            userPhone: winner.user_phone,
            userTrustScore: winner.user_trust_score,
            selectedAt: new Date().toISOString(),
            selectionMethod: 'random',
            status: 'selected'
          });
          count++;
          setRevealedWinners(count);
          setWinners([...selected]);

          if (count < needed) {
            setTimeout(pickNext, 1200);
          } else {
            setIsSpinning(false);
          }
        }
      };
      spin();
    };
    pickNext();
  }, [eligible, totalWinners]);

  useEffect(() => {
    return () => { if (spinRef.current) clearTimeout(spinRef.current); };
  }, []);

  const confirmWinners = () => {
    saveWinners(promotionId, winners);
    toast.success(`${winners.length} ta g'olib tanlandi va xabar yuborildi!`);
    const updated = winners.map(w => ({ ...w, status: 'notified' as const }));
    setWinners(updated);
    saveWinners(promotionId, updated);
    setMode('results');
  };

  const handleManualConfirm = () => {
    const selected: LotteryWinner[] = [];
    manualSelected.forEach(id => {
      const p = eligible.find(e => e.id === id);
      if (p) {
        selected.push({
          participantId: p.id, userName: p.user_name, userPhone: p.user_phone,
          userTrustScore: p.user_trust_score, selectedAt: new Date().toISOString(),
          selectionMethod: 'manual', status: 'selected'
        });
      }
    });
    setWinners(selected);
    setMode('random'); // reuse results view
    setTimeout(() => setMode('results'), 0);
    saveWinners(promotionId, selected);
    toast.success(`${selected.length} ta g'olib qo'lda tanlandi!`);
  };

  const resetWinners = () => {
    if (confirm("G'oliblarni qayta tanlashni xohlaysizmi? Eski natijalar o'chib ketadi.")) {
      localStorage.removeItem(`lottery_winners_${promotionId}`);
      setWinners([]);
      setMode('choose');
      setManualSelected(new Set());
      setRevealedWinners(0);
    }
  };

  const filteredEligible = eligible.filter(p =>
    p.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.user_phone.includes(searchQuery)
  );

  const winnerStatusLabel: Record<string, string> = {
    selected: "Tanlandi", notified: "Xabar yuborildi", booked: "Yozildi", completed: "Bajarildi"
  };
  const winnerStatusColor: Record<string, string> = {
    selected: "bg-amber-100 text-amber-800", notified: "bg-blue-100 text-blue-800",
    booked: "bg-purple-100 text-purple-800", completed: "bg-green-100 text-green-800"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" /> G'oliblarni tanlash
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/80 text-sm mt-1">{promotionName}</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-2xl font-black">{eligible.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/70">Ishtirokchi</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-2xl font-black">{totalWinners}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/70">G'olib kerak</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-2xl font-black">{winners.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/70">Tanlandi</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Mode: Choose */}
          {mode === 'choose' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-2">
                G'oliblarni qanday tanlashni xohlaysiz?
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="p-5 cursor-pointer border-2 hover:border-purple-400 transition-all group"
                  onClick={() => setMode('random')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-200 transition-shadow">
                      <Shuffle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">🎲 Tasodifiy tanlash</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tizim avtomatik ravishda tasodifiy g'oliblarni tanlaydi
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="p-5 cursor-pointer border-2 hover:border-blue-400 transition-all group"
                  onClick={() => setMode('manual')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-shadow">
                      <UserCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">✋ Qo'lda tanlash</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ishtirokchilar ro'yxatidan o'zingiz tanlang
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Mode: Random Draw */}
          {mode === 'random' && winners.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Spinning display */}
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 min-h-[180px] flex flex-col items-center justify-center overflow-hidden">
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="mb-3"
                    >
                      <Sparkles className="w-10 h-10 text-purple-500" />
                    </motion.div>
                    <motion.div
                      key={spinIndex}
                      initial={{ y: -30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-center"
                    >
                      <p className="text-xl font-black text-purple-900">
                        {eligible[spinIndex % eligible.length]?.user_name || '...'}
                      </p>
                      <p className="text-sm text-purple-600">
                        {eligible[spinIndex % eligible.length]?.user_phone || ''}
                      </p>
                    </motion.div>
                    <p className="text-xs text-purple-500 mt-3 animate-pulse">Tanlanmoqda...</p>
                  </>
                ) : revealedWinners === 0 ? (
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-sm text-purple-700 font-medium">
                      {totalWinners} ta g'olibni tasodifiy tanlash
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      {eligible.length} ta ishtirokchidan
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Revealed winners so far */}
              {revealedWinners > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Tanlangan g'oliblar ({revealedWinners}/{totalWinners})
                  </p>
                  {winners.map((w, i) => (
                    <motion.div
                      key={w.participantId}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="p-3 border-purple-200 bg-purple-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-purple-900">{w.userName}</p>
                            <p className="text-xs text-purple-600">{w.userPhone}</p>
                          </div>
                          <Crown className="w-5 h-5 text-amber-500" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {!isSpinning && revealedWinners === 0 && (
                <Button
                  onClick={startRandomDraw}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-base"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Boshlash
                </Button>
              )}

              {!isSpinning && revealedWinners > 0 && revealedWinners >= Math.min(totalWinners, eligible.length) && (
                <div className="space-y-2">
                  <Button onClick={confirmWinners} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5">
                    <Send className="w-5 h-5 mr-2" />
                    Tasdiqlash va xabar yuborish
                  </Button>
                  <Button variant="ghost" onClick={() => { setWinners([]); setRevealedWinners(0); }} className="w-full text-muted-foreground">
                    Qayta tanlash
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="sm" onClick={() => { setMode('choose'); setWinners([]); setRevealedWinners(0); }} className="w-full">
                ← Orqaga
              </Button>
            </motion.div>
          )}

          {/* Mode: Manual */}
          {mode === 'manual' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Tanlangan: <span className="text-primary">{manualSelected.size}</span> / {totalWinners}
                </p>
                {manualSelected.size > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setManualSelected(new Set())}>
                    <X className="w-3 h-3 mr-1" /> Tozalash
                  </Button>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                {filteredEligible.map(p => {
                  const isSelected = manualSelected.has(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const next = new Set(manualSelected);
                        if (isSelected) { next.delete(p.id); }
                        else if (next.size < totalWinners) { next.add(p.id); }
                        else { toast.error(`Maksimum ${totalWinners} ta g'olib tanlash mumkin`); return; }
                        setManualSelected(next);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-transparent bg-muted/40 hover:bg-muted/70'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.user_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />{p.user_phone}
                          <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">⭐{p.user_trust_score}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {filteredEligible.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Ishtirokchi topilmadi
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setMode('choose')} className="flex-1">
                  ← Orqaga
                </Button>
                <Button
                  onClick={handleManualConfirm}
                  disabled={manualSelected.size === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Tasdiqlash ({manualSelected.size})
                </Button>
              </div>
            </motion.div>
          )}

          {/* Mode: Results */}
          {mode === 'results' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <PartyPopper className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">G'oliblar tanlandi!</h3>
                <p className="text-sm text-muted-foreground">{winners.length} ta g'olib</p>
              </div>

              <div className="space-y-2">
                {winners.map((w, i) => (
                  <motion.div
                    key={w.participantId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-3 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{w.userName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />{w.userPhone}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${winnerStatusColor[w.status]}`}>
                            {winnerStatusLabel[w.status]}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {w.selectionMethod === 'random' ? '🎲' : '✋'} {w.selectionMethod === 'random' ? 'Tasodifiy' : "Qo'lda"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {winners.some(w => w.status === 'selected') && (
                <Button onClick={confirmWinners} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                  <Send className="w-4 h-4 mr-2" />
                  G'oliblarga xabar yuborish
                </Button>
              )}

              <Button variant="outline" onClick={resetWinners} className="w-full text-destructive border-destructive/30 hover:bg-destructive/5">
                Qayta tanlash
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
