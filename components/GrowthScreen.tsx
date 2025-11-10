import React, { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import PerformanceChart from './PerformanceChart';
import { SAFE_WITHDRAWAL_PERCENTAGES } from '../constants';
import { supabase } from '../supabase';

interface GrowthScreenProps {
  history: HistoryEntry[];
  currentBankroll: number;
  withdrawalGoal: number;
  onBackToStart: () => void;
  onSetWithdrawalGoal: (goal: number) => void;
}

const formatCurrency = (value: number) => {
  if (isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GrowthScreen: React.FC<GrowthScreenProps> = ({ history, currentBankroll, withdrawalGoal, onBackToStart, onSetWithdrawalGoal }) => {
  const [goalInput, setGoalInput] = useState(withdrawalGoal > 0 ? withdrawalGoal.toString() : '');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    setGoalInput(withdrawalGoal > 0 ? withdrawalGoal.toString() : '');
  }, [withdrawalGoal]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalInput(e.target.value);
  };

  const handleGoalBlur = () => {
    const newGoal = parseFloat(goalInput);
    if (!isNaN(newGoal) && newGoal >= 0) {
      onSetWithdrawalGoal(newGoal);
    } else {
      onSetWithdrawalGoal(0);
      setGoalInput('');
    }
  };
  
  const moderateWithdrawalPercent = SAFE_WITHDRAWAL_PERCENTAGES['moderate'].value; 
  const targetBankroll = withdrawalGoal > 0 ? withdrawalGoal / moderateWithdrawalPercent : 0;
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
          O trabalho de hoje acabou. Acompanhe e planeje seu progresso.
        </p>
      </div>
      
      {/* Current Bankroll Display */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
        <h2 className="text-xs font-semibold text-center mb-2 text-slate-300 tracking-[0.2em] uppercase">Sua Banca Atual</h2>
        <p className="text-4xl font-bold text-white tracking-wider">{formatCurrency(currentBankroll)}</p>
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
        <h2 className="text-xs font-semibold text-center mb-4 text-slate-300 tracking-[0.2em] uppercase">Sua Meta de Saque Diário</h2>
        <div className="mb-4">
          <label htmlFor="withdrawalGoal" className="sr-only">Meta de Saque Diário (R$)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R$</span>
            <input
              id="withdrawalGoal"
              type="number"
              value={goalInput}
              onChange={handleGoalChange}
              onBlur={handleGoalBlur}
              placeholder="Ex: 200"
              className="w-full bg-zinc-900 text-white placeholder-slate-500 text-center text-2xl font-bold p-2 pl-10 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="text-center mb-4 min-h-[40px]">
          {withdrawalGoal > 0 && (
            <p className="text-slate-400 text-sm animate-fade-in">
              Para esta meta, sua banca precisa ser ~<span className="font-semibold text-amber-400">{formatCurrency(targetBankroll)}</span>
              <br/>(cálculo com perfil moderado)
            </p>
          )}
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
      
      <div className="pt-2 space-y-3">
        <button
          onClick={onBackToStart}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-md tracking-wider"
        >
          Próxima Sessão
        </button>
         <button
          onClick={handleLogout}
          className="w-full bg-red-900/40 hover:bg-red-800/50 text-red-400 font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-sm"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default GrowthScreen;