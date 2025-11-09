import React, { useState, useMemo } from 'react';
import { RISK_PROFILES, SAFE_WITHDRAWAL_PERCENTAGES } from '../constants';

interface WithdrawalSimulatorProps {
  onBack: () => void;
}

const formatCurrency = (value: number) => {
  if (isNaN(value) || !isFinite(value) || value === 0) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const WithdrawalSimulator: React.FC<WithdrawalSimulatorProps> = ({ onBack }) => {
  const [desiredWithdrawal, setDesiredWithdrawal] = useState('');
  const [payout, setPayout] = useState('87');

  const results = useMemo(() => {
    const goal = parseFloat(desiredWithdrawal);
    const payoutRate = parseFloat(payout) / 100;
    
    if (isNaN(goal) || goal <= 0 || isNaN(payoutRate) || payoutRate <= 0) {
      return {
        conservative: { bankroll: 0, trades: 0 },
        moderate: { bankroll: 0, trades: 0 },
        aggressive: { bankroll: 0, trades: 0 },
      };
    }

    const calculateForProfile = (profileKey: keyof typeof RISK_PROFILES) => {
      const riskPerTrade = RISK_PROFILES[profileKey].value;
      const safeWithdrawalPercent = SAFE_WITHDRAWAL_PERCENTAGES[profileKey].value;

      if (safeWithdrawalPercent <= 0) return { bankroll: 0, trades: 0 };
      
      const requiredBankroll = goal / safeWithdrawalPercent;
      const profitPerTrade = requiredBankroll * riskPerTrade * payoutRate;

      if (profitPerTrade <= 0) return { bankroll: requiredBankroll, trades: 0 };

      const numberOfTrades = Math.ceil(goal / profitPerTrade);
      return { bankroll: requiredBankroll, trades: numberOfTrades };
    };

    return {
      conservative: calculateForProfile('conservative'),
      moderate: calculateForProfile('moderate'),
      aggressive: calculateForProfile('aggressive'),
    };
  }, [desiredWithdrawal, payout]);


  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 space-y-6">
      <div>
        <h1 
          className="text-3xl font-bold tracking-wider text-amber-500" 
          style={{ textShadow: `0 0 15px rgba(217, 119, 6, 0.4)` }}
        >
          Simulador de Estratégia
        </h1>
        <p className="text-slate-300 mt-2 text-md">
          Calcule a banca e o esforço necessários para sua meta.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="desiredWithdrawal" className="block text-slate-300 text-sm font-medium mb-2 tracking-wider">Meta de Saque Diário (R$)</label>
          <input
            id="desiredWithdrawal" type="number" value={desiredWithdrawal} onChange={(e) => setDesiredWithdrawal(e.target.value)}
            placeholder="Ex: 200.00"
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-xl p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
            autoComplete="off"
          />
        </div>
         <div>
          <label htmlFor="payout" className="block text-slate-300 text-sm font-medium mb-2 tracking-wider">Payout da Corretora (%)</label>
          <input
            id="payout" type="number" value={payout} onChange={(e) => setPayout(e.target.value)}
            placeholder="Ex: 87"
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-xl p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
            autoComplete="off"
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-xs font-semibold text-center mb-3 text-slate-300 tracking-[0.2em] uppercase">Resultados por Perfil</h2>
        <div className="space-y-3">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 text-left">
              <h4 className="font-semibold text-lg text-amber-500 mb-2">{RISK_PROFILES[key as keyof typeof RISK_PROFILES].label}</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-400 tracking-wider">Banca Necessária</p>
                    <div className="overflow-x-auto no-scrollbar">
                      <p className="font-semibold text-2xl text-white tracking-wider whitespace-nowrap px-1">{formatCurrency(value.bankroll)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 tracking-wider">Nº de Operações</p>
                    <p className="font-semibold text-2xl text-white tracking-wider">{value.trades > 0 ? value.trades : '-'}</p>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-md tracking-wider"
      >
        Voltar
      </button>
    </div>
  );
};

export default WithdrawalSimulator;