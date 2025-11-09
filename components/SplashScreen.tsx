import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in">
      <div className="w-40 h-40 rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 overflow-hidden animate-icon-glow">
         <img 
           src="https://i.imgur.com/3wZqSVv.jpeg" 
           alt="BankBoss Lion" 
           className="w-full h-full object-cover"
           style={{ objectPosition: '50% 20%' }}
         />
      </div>
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 mt-6 tracking-widest uppercase">
        BankBoss
      </h1>
      <p className="text-slate-300 mt-2 tracking-[0.2em] font-light uppercase text-sm">
        Risk & Discipline Manager
      </p>
    </div>
  );
};

export default SplashScreen;