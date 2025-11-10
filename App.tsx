
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from './firebase';

import { DailyPlan, HistoryEntry, RiskProfile } from './types';
import { MOTIVATIONAL_QUOTES, PAYOUT_RATE, RISK_PROFILES } from './constants';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import StartScreen from './components/StartScreen';
import DashboardScreen from './components/DashboardScreen';
import EndScreen from './components/EndScreen';
import WithdrawalSimulator from './components/WithdrawalSimulator';
import GrowthScreen from './components/GrowthScreen';
import WelcomeScreen from './components/WelcomeScreen';

type Screen = 'splash' | 'welcome' | 'login' | 'modeSelection' | 'start' | 'dashboard' | 'end' | 'simulator' | 'growth';

const App: React.FC = () => {
  // Authentication & Loading
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // App State
  const [screen, setScreen] = useState<Screen>('splash');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  
  // User Data
  const [initialBankroll, setInitialBankroll] = useState(0);
  const [currentBankroll, setCurrentBankroll] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [withdrawalGoal, setWithdrawalGoal] = useState(0);

  // Session State
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [dailyProfitLoss, setDailyProfitLoss] = useState(0);
  const [payout, setPayout] = useState(PAYOUT_RATE);
  const [sessionEndedType, setSessionEndedType] = useState<'win' | 'loss'>('win');

  const motivationalQuote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  // --- Data Fetching and Persistence ---

  const loadUserData = useCallback(async (firebaseUser: User) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastBankroll = data.history?.length > 0 ? data.history[data.history.length - 1].bankroll : data.bankroll || 0;
      setCurrentBankroll(lastBankroll);
      setInitialBankroll(lastBankroll);
      setHistory(data.history || []);
      setLockoutUntil(data.lockoutUntil || null);
      setWithdrawalGoal(data.withdrawalGoal || 0);
    } else {
      await setDoc(userRef, { 
        email: firebaseUser.email,
        bankroll: 0,
        history: [],
        lockoutUntil: null,
        withdrawalGoal: 0
      });
    }
  }, []);

  const saveSessionData = useCallback(async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const newHistoryEntry: HistoryEntry = { date: new Date().toISOString(), bankroll: currentBankroll };
    
    // Create a new history array that doesn't rely on the previous state
    const updatedHistory = [...history, newHistoryEntry];

    await setDoc(userRef, {
        history: updatedHistory,
        lockoutUntil: lockoutUntil,
        // Persist other fields to avoid them being overwritten
        bankroll: currentBankroll,
        email: user.email,
        withdrawalGoal: withdrawalGoal,
    }, { merge: true });

    setHistory(updatedHistory);
  }, [user, currentBankroll, lockoutUntil, history, withdrawalGoal]);

  const saveWithdrawalGoal = useCallback(async (goal: number) => {
    if (!user) return;
    setWithdrawalGoal(goal);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { withdrawalGoal: goal });
  }, [user]);

  // --- Auth Effect ---

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
        setUser(firebaseUser);
        setScreen('modeSelection');
      } else {
        setUser(null);
        setScreen('welcome');
      }
      setTimeout(() => setIsLoading(false), 1500); // splash screen duration
    });
    return () => unsubscribe();
  }, [loadUserData]);


  // --- Handlers ---

  const handleSelectProfile = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setScreen('start');
  };
  
  const handleStart = (bankroll: number, payoutPercentage: number) => {
    const payoutRate = payoutPercentage / 100;
    const profile = RISK_PROFILES[riskProfile];
    const entryValue = bankroll * profile.value;
    const stopWin = entryValue * payoutRate; // 1 win
    const stopLoss = entryValue * -2; // 2 losses

    setInitialBankroll(bankroll);
    setCurrentBankroll(bankroll);
    setPayout(payoutRate);
    setDailyPlan({ entryValue, stopWin, stopLoss });
    setDailyProfitLoss(0);
    setScreen('dashboard');
  };

  const handleTrade = (result: 'win' | 'loss') => {
    if (!dailyPlan) return;

    let profitLossChange = 0;
    if (result === 'win') {
      profitLossChange = dailyPlan.entryValue * payout;
    } else {
      profitLossChange = -dailyPlan.entryValue;
    }

    const newProfitLoss = dailyProfitLoss + profitLossChange;
    const newBankroll = currentBankroll + profitLossChange;
    
    setDailyProfitLoss(newProfitLoss);
    setCurrentBankroll(newBankroll);

    if (newProfitLoss >= dailyPlan.stopWin) {
      setSessionEndedType('win');
      setScreen('end');
    } else if (newProfitLoss <= dailyPlan.stopLoss) {
      setSessionEndedType('loss');
      setScreen('end');
    }
  };

  const handleEndSession = () => {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const newLockoutUntil = Date.now() + twentyFourHours;
    setLockoutUntil(newLockoutUntil);
  };

  useEffect(() => {
    if (lockoutUntil && screen === 'end') {
        saveSessionData().then(() => {
            if (history.length > 0 || currentBankroll > 0) {
              setScreen('growth');
            } else {
              setScreen('start');
            }
        });
    }
  }, [lockoutUntil, screen]);


  // --- Navigation ---
  const navigateBackToStart = () => {
    setInitialBankroll(currentBankroll); // Update for next session
    setScreen('modeSelection');
  };

  const renderContent = () => {
    if (isLoading) {
      return <SplashScreen />;
    }
    
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setScreen('login')} />;
      case 'login':
        return <LoginScreen />;
      case 'modeSelection':
        return <ModeSelectionScreen onSelectProfile={handleSelectProfile} />;
      case 'start':
        return (
          <StartScreen
            riskProfile={riskProfile}
            onStart={handleStart}
            onNavigateToSimulator={() => setScreen('simulator')}
            onNavigateToGrowth={() => setScreen('growth')}
            onBack={() => setScreen('modeSelection')}
            hasHistory={history.length > 0}
            lockoutUntil={lockoutUntil}
            lastBankroll={initialBankroll}
          />
        );
      case 'dashboard':
        if (!dailyPlan) return <SplashScreen />; // Should not happen
        return (
          <DashboardScreen
            plan={dailyPlan}
            currentBankroll={currentBankroll}
            dailyProfitLoss={dailyProfitLoss}
            onTrade={handleTrade}
            motivationalQuote={motivationalQuote}
          />
        );
      case 'end':
        return <EndScreen type={sessionEndedType} onEndSession={handleEndSession} />;
      case 'simulator':
        return <WithdrawalSimulator onBack={() => setScreen('start')} />;
      case 'growth':
         return (
            <GrowthScreen 
              history={history}
              currentBankroll={currentBankroll}
              withdrawalGoal={withdrawalGoal}
              onBackToStart={navigateBackToStart}
              onSetWithdrawalGoal={saveWithdrawalGoal}
            />
         );
      default:
        return <SplashScreen />;
    }
  };

  return (
    <main className="bg-zinc-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
        <div className="relative z-10 w-full max-w-md">
           {renderContent()}
        </div>
    </main>
  );
};

export default App;
