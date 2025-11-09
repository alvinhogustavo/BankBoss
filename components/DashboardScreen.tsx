import React from 'react';
import { DailyPlan } from '../types';

interface DashboardScreenProps {
  plan: DailyPlan;
  currentBankroll: number;
  dailyProfitLoss: number;
  onTrade: (result: 'win' | 'loss') => void;
  motivationalQuote: string;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  plan,
  currentBankroll,
  dailyProfitLoss,
  onTrade,
  motivationalQuote,
}) => {
  const profitLossColor = dailyProfitLoss > 0 ? 'text-emerald-400' : dailyProfitLoss < 0 ? 'text-red-500' : 'text-slate-300';

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in space-y-5 border border-zinc-800">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50">
           <img src="https://i.imgur.com/NeDT6d0.jpeg" alt="Painel do Trader" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">BankBoss</h2>
          <p className="text-sm text-slate-400 font-light tracking-wide">no comando!</p>
        </div>
         <p className="text-sm text-slate-400 font-light tracking-wide pt-1">"Bem-vindo ao seu dia de trabalho, trader!"</p>
      </div>

      <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
        <p className="text-sm italic text-slate-400">"{motivationalQuote}"</p>
      </div>

      <div className="space-y-4">
        {/* Plano do Dia */}
        <div className="bg-zinc-800/50 p-4 rounded-lg shadow-md border-t-2 border-amber-600 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-center mb-3 text-amber-500 tracking-[0.2em] uppercase">Plano do Dia</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-slate-400 tracking-wider">Entrada</p>
              <div className="overflow-x-auto no-scrollbar">
                <p className="font-semibold text-xl text-white tracking-wider whitespace-nowrap px-1">{formatCurrency(plan.entryValue)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 tracking-wider">Stop Win</p>
               <div className="overflow-x-auto no-scrollbar">
                <p className="font-semibold text-xl text-emerald-400 tracking-wider whitespace-nowrap px-1">{formatCurrency(plan.stopWin)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 tracking-wider">Stop Loss</p>
              <div className="overflow-x-auto no-scrollbar">
                <p className="font-semibold text-xl text-red-500 tracking-wider whitespace-nowrap px-1">{formatCurrency(plan.stopLoss)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Atual */}
        <div className="bg-zinc-800/50 p-4 rounded-lg shadow-md border-t-2 border-zinc-500 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-center mb-3 text-slate-300 tracking-[0.2em] uppercase">Status Atual</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-400 tracking-wider">Banca</p>
              <div className="overflow-x-auto no-scrollbar">
                <p className="font-semibold text-3xl text-white tracking-wider whitespace-nowrap px-1">{formatCurrency(currentBankroll)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 tracking-wider">Resultado</p>
              <div className="overflow-x-auto no-scrollbar">
                <p className={`font-semibold text-3xl ${profitLossColor} tracking-wider whitespace-nowrap px-1`}>{formatCurrency(dailyProfitLoss)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Operação */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => onTrade('win')}
          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold py-4 rounded-lg text-xl transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-500/80 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-widest"
        >
          WIN
        </button>
        <button
          onClick={() => onTrade('loss')}
          className="bg-red-600/10 text-red-500 border border-red-600/30 font-bold py-4 rounded-lg text-xl transition-all duration-300 hover:bg-red-600/20 hover:border-red-600/80 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] tracking-widest"
        >
          LOSS
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;