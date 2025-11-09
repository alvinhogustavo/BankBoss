import React, { useState, useMemo, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import DashboardScreen from './components/DashboardScreen';
import EndScreen from './components/EndScreen';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import GrowthScreen from './components/GrowthScreen';
import WithdrawalSimulator from './components/WithdrawalSimulator';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import { DailyPlan, HistoryEntry, RiskProfile } from './types';
import { MOTIVATIONAL_QUOTES, RISK_PROFILES, SAFE_WITHDRAWAL_PERCENTAGES } from './constants';

type Screen = 'splash' | 'welcome' | 'mode_selection' | 'start' | 'dashboard' | 'end_win' | 'end_loss' | 'growth' | 'simulator';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [currentBankroll, setCurrentBankroll] = useState<number>(0);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [dailyProfitLoss, setDailyProfitLoss] = useState<number>(0);
  const [tradingHistory, setTradingHistory] = useState<HistoryEntry[]>([]);
  const [withdrawalGoal, setWithdrawalGoal] = useState<number>(0);
  const [lockoutTimestamp, setLockoutTimestamp] = useState<number | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);

  useEffect(() => {
    // This effect runs only ONCE on mount to initialize the app state.
    const savedHistory = localStorage.getItem('tradingHistory');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    if (history.length > 0) {
      setTradingHistory(history);
    }
  
    const savedGoal = localStorage.getItem('withdrawalGoal');
    if (savedGoal) {
      setWithdrawalGoal(parseFloat(savedGoal));
    }
  
    const lockoutUntil = localStorage.getItem('lockoutUntil');
    const lockoutTime = lockoutUntil ? parseInt(lockoutUntil, 10) : null;
  
    if (lockoutTime && Date.now() < lockoutTime) {
      // If locked out, go directly to the growth/locked screen
      setLockoutTimestamp(lockoutTime);
      if (history.length > 0) {
        setCurrentBankroll(history[history.length - 1].bankroll);
      }
      setScreen('growth');
    } else {
      // If not locked out, start with the splash screen and then move on to the welcome screen
      const timer = setTimeout(() => {
        setScreen('welcome');
      }, 3000); // 3-second splash screen
      
      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const motivationalQuote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const handleStartWelcome = () => {
    setScreen('mode_selection');
  };

  const handleSelectProfile = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setScreen('start');
  };

  const handleStartSession = (bankroll: number) => {
    if (!riskProfile) return;

    const riskPerTrade = RISK_PROFILES[riskProfile].value;
    const safeWithdrawalPercent = SAFE_WITHDRAWAL_PERCENTAGES[riskProfile].value;

    const safeDailyGoal = bankroll * safeWithdrawalPercent;
    const entryValue = bankroll * riskPerTrade;
    
    const plan: DailyPlan = {
      entryValue,
      stopWin: safeDailyGoal,
      stopLoss: entryValue * 2,
    };

    setCurrentBankroll(bankroll);
    setDailyPlan(plan);
    setDailyProfitLoss(0);
    setWithdrawalGoal(safeDailyGoal);
    localStorage.setItem('withdrawalGoal', safeDailyGoal.toString());
    setScreen('dashboard');
  };

  const handleTradeResult = (result: 'win' | 'loss', payout: number) => {
    if (!dailyPlan) return;

    let tradeResultValue = 0;
    if (result === 'win') {
      tradeResultValue = dailyPlan.entryValue * (payout / 100);
    } else {
      tradeResultValue = -dailyPlan.entryValue;
    }

    const newProfitLoss = dailyProfitLoss + tradeResultValue;
    setCurrentBankroll(currentBankroll + tradeResultValue);
    setDailyProfitLoss(newProfitLoss);

    if (newProfitLoss >= dailyPlan.stopWin) {
      setScreen('end_win');
    } else if (newProfitLoss <= -dailyPlan.stopLoss) {
      setScreen('end_loss');
    }
  };

  const handleEndSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const newHistoryEntry: HistoryEntry = { date: today, bankroll: currentBankroll };
    const updatedHistory = [...tradingHistory.filter(h => h.date !== today), newHistoryEntry];
    setTradingHistory(updatedHistory);
    localStorage.setItem('tradingHistory', JSON.stringify(updatedHistory));

    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const tomorrowTime = tomorrow.getTime();
    localStorage.setItem('lockoutUntil', tomorrowTime.toString());
    setLockoutTimestamp(tomorrowTime);
    
    setDailyPlan(null);
    setScreen('growth');
  };
  
  const handleNavigateToGrowth = () => {
    if (tradingHistory.length > 0) {
      setCurrentBankroll(tradingHistory[tradingHistory.length - 1].bankroll);
      setScreen('growth');
    }
  };

  const handleBackToModeSelection = () => {
    setRiskProfile(null);
    setScreen('mode_selection');
  };

  const hasHistory = tradingHistory.length > 0;

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen onStart={handleStartWelcome} />;
      case 'mode_selection':
        return <ModeSelectionScreen onSelectProfile={handleSelectProfile} />;
      case 'start':
        if (riskProfile) {
          const lastBankroll = tradingHistory.length > 0 ? tradingHistory[tradingHistory.length - 1].bankroll : 0;
          return <StartScreen 
                    riskProfile={riskProfile}
                    onStart={handleStartSession} 
                    onNavigateToSimulator={() => setScreen('simulator')} 
                    onNavigateToGrowth={handleNavigateToGrowth}
                    onBack={handleBackToModeSelection}
                    hasHistory={hasHistory}
                    lockoutUntil={lockoutTimestamp}
                    lastBankroll={lastBankroll}
                  />;
        }
        return null;
      case 'dashboard':
        if (dailyPlan) {
          return (
            <DashboardScreen
              plan={dailyPlan}
              currentBankroll={currentBankroll}
              dailyProfitLoss={dailyProfitLoss}
              onTrade={(result) => handleTradeResult(result, 87)} // Assuming 87% payout for now
              motivationalQuote={motivationalQuote}
            />
          );
        }
        return null; 
      case 'end_win':
        return <EndScreen type="win" onEndSession={handleEndSession} />;
      case 'end_loss':
        return <EndScreen type="loss" onEndSession={handleEndSession} />;
      case 'growth':
        return <GrowthScreen 
                  history={tradingHistory} 
                  currentBankroll={currentBankroll} 
                  withdrawalGoal={withdrawalGoal}
                  onBackToStart={() => setScreen('mode_selection')}
                />;
      case 'simulator':
        return <WithdrawalSimulator onBack={() => setScreen('start')} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
    >
      <div className="w-full max-w-md mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;