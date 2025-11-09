import React from 'react';
import { HistoryEntry } from '../types';
import PerformanceChart from './PerformanceChart';

interface GrowthScreenProps {
  history: HistoryEntry[];
  currentBankroll: number;
  withdrawalGoal: number;
  onBackToStart: () => void;
}

const formatCurrency = (value: number) => {
  if (isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GrowthScreen: React.FC<GrowthScreenProps> = ({ history, currentBankroll, withdrawalGoal, onBackToStart }) => {
  const targetBankroll = withdrawalGoal * 10;
  const progress = targetBankroll > 0 ? Math.min((currentBankroll / targetBankroll) * 100, 100) : 0;
  const recentHistory = history.slice(-7);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 space-y-6">
      <div>
        <h1 
          className="text-3xl font-bold tracking-wider text-amber-500" 
          style={{ textShadow: `0 0 15px rgba(217, 119, 6, 0.4)` }}
        >
          Análise de Crescimento
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          O trabalho de hoje acabou. Acompanhe seu progresso.
        </p>
      </div>

      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
        <h2 className="text-xs font-semibold text-center mb-3 text-amber-500 tracking-[0.2em] uppercase">Desempenho (Últimos 7 Dias)</h2>
        {recentHistory.length > 1 ? (
          <PerformanceChart data={recentHistory} />
        ) : (
          <p className="text-slate-400 text-sm h-[150px] flex items-center justify-center">Ainda não há histórico suficiente para exibir o gráfico. Volte amanhã!</p>
        )}
      </div>

      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
        <h2 className="text-xs font-semibold text-center mb-4 text-slate-300 tracking-[0.2em] uppercase">Meta de Saque Diário</h2>
        <div className="text-center mb-4">
          <p className="text-slate-400">Para sacar <span className="font-semibold text-amber-400">{formatCurrency(withdrawalGoal)}</span> por dia, sua banca precisa ser <span className="font-semibold text-amber-400">{formatCurrency(targetBankroll)}</span>.</p>
        </div>
        
        <div className="w-full bg-zinc-700 rounded-full h-4 mb-2 overflow-hidden border border-zinc-600">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">{formatCurrency(currentBankroll)}</span>
          <span className="text-amber-400">{progress.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="pt-2">
        <button
          onClick={onBackToStart}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-md tracking-wider"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default GrowthScreen;