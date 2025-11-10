import React, { useState, useMemo, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import StartScreen from './components/StartScreen';
import DashboardScreen from './components/DashboardScreen';
import EndScreen from './components/EndScreen';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import GrowthScreen from './components/GrowthScreen';
import WithdrawalSimulator from './components/WithdrawalSimulator';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import LoginScreen from './components/LoginScreen';
import { DailyPlan, HistoryEntry, RiskProfile } from './types';
import { MOTIVATIONAL_QUOTES, RISK_PROFILES, SAFE_WITHDRAWAL_PERCENTAGES } from './constants';

type Screen = 'splash' | 'login' | 'welcome' | 'mode_selection' | 'start' | 'dashboard' | 'end_win' | 'end_loss' | 'growth' | 'simulator';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentBankroll, setCurrentBankroll] = useState<number>(0);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [dailyProfitLoss, setDailyProfitLoss] = useState<number>(0);
  const [tradingHistory, setTradingHistory] = useState<HistoryEntry[]>([]);
  const [withdrawalGoal, setWithdrawalGoal] = useState<number>(0);
  const [lockoutTimestamp, setLockoutTimestamp] = useState<number | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [sessionPayout, setSessionPayout] = useState<number>(87);
  
  // Effect for handling auth state and loading initial data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // User is signed in, load their data
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTradingHistory(data.tradingHistory || []);
          setWithdrawalGoal(data.withdrawalGoal || 0);
          setLockoutTimestamp(data.lockoutTimestamp || null);

          if (data.lockoutTimestamp && Date.now() < data.lockoutTimestamp) {
            const lastBankroll = data.tradingHistory?.length > 0 ? data.tradingHistory[data.tradingHistory.length - 1].bankroll : 0;
            setCurrentBankroll(lastBankroll);
            setScreen('growth');
          } else {
             // Returning user, send them directly to mode selection
             setScreen('mode_selection');
          }
        } else {
          // New user, doc doesn't exist yet. Show welcome screen once.
          setScreen('welcome');
        }
      } else {
        // User is signed out
        setUser(null);
        setScreen('login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const saveDataToFirestore = async (dataToSave: object) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, dataToSave, { merge: true });
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
    }
  };

  const motivationalQuote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const handleStartWelcome = () => setScreen('mode_selection');
  const handleSelectProfile = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setScreen('start');
  };

  const handleStartSession = (bankroll: number, payout: number) => {
    if (!riskProfile) return;

    const riskPerTrade = RISK_PROFILES[riskProfile].value;
    const safeWithdrawalPercent = SAFE_WITHDRAWAL_PERCENTAGES[riskProfile].value;

    const entryValue = parseFloat((bankroll * riskPerTrade).toFixed(2));
    const safeDailyGoal = parseFloat((bankroll * safeWithdrawalPercent).toFixed(2));
    const stopLossValue = parseFloat((entryValue * 2).toFixed(2));
    
    const plan: DailyPlan = { entryValue, stopWin: safeDailyGoal, stopLoss: stopLossValue };

    setCurrentBankroll(bankroll);
    setDailyPlan(plan);
    setDailyProfitLoss(0);
    setSessionPayout(payout);
    setWithdrawalGoal(safeDailyGoal);
    saveDataToFirestore({ withdrawalGoal: safeDailyGoal });
    setScreen('dashboard');
  };

  const handleTradeResult = (result: 'win' | 'loss') => {
    if (!dailyPlan) return;

    let tradeResultValue = 0;
    if (result === 'win') {
      tradeResultValue = parseFloat((dailyPlan.entryValue * (sessionPayout / 100)).toFixed(2));
    } else {
      tradeResultValue = -dailyPlan.entryValue;
    }

    const newProfitLoss = parseFloat((dailyProfitLoss + tradeResultValue).toFixed(2));
    const newBankroll = parseFloat((currentBankroll + tradeResultValue).toFixed(2));

    setCurrentBankroll(newBankroll);
    setDailyProfitLoss(newProfitLoss);

    if (newProfitLoss >= dailyPlan.stopWin) setScreen('end_win');
    else if (newProfitLoss <= -dailyPlan.stopLoss) setScreen('end_loss');
  };

  const handleEndSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const newHistoryEntry: HistoryEntry = { date: today, bankroll: currentBankroll };
    const updatedHistory = [...tradingHistory.filter(h => h.date !== today), newHistoryEntry];
    setTradingHistory(updatedHistory);

    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const tomorrowTime = tomorrow.getTime();
    setLockoutTimestamp(tomorrowTime);
    
    saveDataToFirestore({ 
      tradingHistory: updatedHistory,
      lockoutTimestamp: tomorrowTime 
    });
    
    setDailyPlan(null);
    setScreen('growth');
  };
  
  const handleSetWithdrawalGoal = (goal: number) => {
    const newGoal = Math.max(0, goal);
    setWithdrawalGoal(newGoal);
    saveDataToFirestore({ withdrawalGoal: newGoal });
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
    if (isLoading || screen === 'splash') {
      return <SplashScreen />;
    }

    if (!user) {
      return <LoginScreen />;
    }

    switch (screen) {
      case 'login':
        return <LoginScreen />;
      case 'welcome':
        return <WelcomeScreen onStart={handleStartWelcome} />;
      case 'mode_selection':
        return <ModeSelectionScreen onSelectProfile={handleSelectProfile} />;
      case 'start':
        if (riskProfile) {
          const lastBankroll = hasHistory ? tradingHistory[tradingHistory.length - 1].bankroll : 0;
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
              onTrade={handleTradeResult}
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
                  onSetWithdrawalGoal={handleSetWithdrawalGoal}
                />;
      case 'simulator':
        return <WithdrawalSimulator onBack={() => setScreen('start')} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;