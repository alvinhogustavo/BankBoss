import React, { useState, useEffect, useMemo } from 'react';
import { RiskProfile } from '../types';
import { RISK_PROFILES, SAFE_WITHDRAWAL_PERCENTAGES } from '../constants';

interface StartScreenProps {
  riskProfile: RiskProfile;
  onStart: (bankroll: number, payout: number) => void;
  onNavigateToSimulator: () => void;
  onNavigateToGrowth: () => void;
  onBack: () => void;
  hasHistory: boolean;
  lockoutUntil: number | null;
  lastBankroll: number;
}

const formatCurrency = (value: number) => {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const StartScreen: React.FC<StartScreenProps> = ({ riskProfile, onStart, onNavigateToSimulator, onNavigateToGrowth, onBack, hasHistory, lockoutUntil, lastBankroll }) => {
  const [bankroll, setBankroll] = useState('');
  const [payout, setPayout] = useState('87');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (lastBankroll > 0) {
      setBankroll(lastBankroll.toString());
    }
  }, [lastBankroll]);

  const isLocked = !!lockoutUntil && Date.now() < lockoutUntil;
  const profileDetails = RISK_PROFILES[riskProfile];
  const safeWithdrawalPercent = SAFE_WITHDRAWAL_PERCENTAGES[riskProfile].value;

  const { safeDailyGoal, suggestedTrades } = useMemo(() => {
    const bankrollValue = parseFloat(bankroll);
    const payoutValue = parseFloat(payout) / 100;
    
    if (isNaN(bankrollValue) || bankrollValue <= 0 || isNaN(payoutValue) || payoutValue <= 0) {
      return { safeDailyGoal: 0, suggestedTrades: 0 };
    }

    const goal = bankrollValue * safeWithdrawalPercent;
    const entryValue = bankrollValue * profileDetails.value;
    const profitPerTrade = entryValue * payoutValue;
    
    if (profitPerTrade <= 0) {
       return { safeDailyGoal: goal, suggestedTrades: 0 };
    }

    const trades = Math.ceil(goal / profitPerTrade);

    return { safeDailyGoal: goal, suggestedTrades: trades };
  }, [bankroll, payout, profileDetails, safeWithdrawalPercent]);

  useEffect(() => {
    if (lockoutUntil) {
      const timerInterval = setInterval(() => {
        const now = Date.now();
        const distance = lockoutUntil - now;

        if (distance < 0) {
          clearInterval(timerInterval);
          setTimeLeft("");
          window.location.reload(); 
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft( `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [lockoutUntil]);

  const handleStart = () => {
    if (isLocked) return;

    const bankrollValue = parseFloat(bankroll);
    const payoutValue = parseFloat(payout);

    if (isNaN(bankrollValue) || bankrollValue <= 0) {
      setError('Por favor, insira uma banca válida.');
      return;
    }
    if (isNaN(payoutValue) || payoutValue <= 0 || payoutValue > 100) {
      setError('Por favor, insira um payout válido (1-100).');
      return;
    }
    setError('');
    onStart(bankrollValue, payoutValue);
  };

  return (
    <div className="p-8 rounded-xl shadow-2xl text-center animate-fade-in bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 relative">
       <button onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-amber-400 transition-colors">
        &larr; Trocar Modo
      </button>

      {isLocked && timeLeft && (
         <div 
           className="p-4 rounded-lg border border-zinc-800 my-6 relative overflow-hidden text-center"
           style={{ backgroundImage: `url('https://i.imgur.com/jjPIw4m.jpeg')`, backgroundSize: 'cover', backgroundPosition: '50% 25%' }}
         >
           <div className="absolute inset-0 bg-black/80 z-0"></div>
           <div className="relative z-10">
             <h2 className="text-xs font-semibold text-center mb-1 text-slate-400 tracking-[0.2em] uppercase">Próxima Sessão em</h2>
             <p className="text-4xl font-bold text-amber-400 tracking-wider font-mono">{timeLeft}</p>
           </div>
         </div>
      )}
      
      <div className="pt-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">BankBoss</h1>
        <p className="text-slate-300 mt-1 mb-6 text-lg">Modo: <span className="font-semibold text-white">{profileDetails.label}</span></p>
      </div>
      
      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="bankroll" className="block text-slate-300 text-sm font-medium mb-2 tracking-wider">Sua Banca Atual (R$)</label>
          <input
            id="bankroll" type="number" value={bankroll} onChange={(e) => setBankroll(e.target.value)}
            placeholder="Ex: 5000.00"
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner disabled:bg-zinc-800/50 disabled:cursor-not-allowed"
            autoComplete="off" disabled={isLocked}
          />
        </div>
         <div>
          <label htmlFor="payout" className="block text-slate-300 text-sm font-medium mb-2 tracking-wider">Payout da Corretora (%)</label>
          <input
            id="payout" type="number" value={payout} onChange={(e) => setPayout(e.target.value)}
            placeholder="Ex: 87"
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner disabled:bg-zinc-800/50 disabled:cursor-not-allowed"
            autoComplete="off" disabled={isLocked}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 mb-6">
        <h2 className="text-xs font-semibold text-center mb-3 text-amber-500 tracking-[0.2em] uppercase">Seu Plano Sugerido</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400 tracking-wider">Meta Diária Segura</p>
              <p className="font-semibold text-2xl text-white tracking-wider">{formatCurrency(safeDailyGoal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 tracking-wider">Nº de Operações</p>
              <p className="font-semibold text-2xl text-white tracking-wider">{suggestedTrades}</p>
            </div>
        </div>
      </div>

      <button
        onClick={handleStart} disabled={isLocked || safeDailyGoal <= 0}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:shadow-none disabled:transform-none"
      >
        {isLocked ? 'Sessão Bloqueada' : 'Começar 🔥'}
      </button>

      <div className="mt-6 text-center flex justify-center items-center space-x-4">
        <button onClick={onNavigateToSimulator} className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-300">
          Simular Estratégia
        </button>
        {hasHistory && (
          <>
            <span className="text-zinc-600">|</span>
            <button onClick={onNavigateToGrowth} className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-300">
              Ver Desempenho
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StartScreen;