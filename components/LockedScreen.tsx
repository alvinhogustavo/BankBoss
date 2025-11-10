import React from 'react';

interface LockedScreenProps {
    timeLeft: string;
}

const LockedScreen: React.FC<LockedScreenProps> = ({ timeLeft }) => {
  return (
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
  );
};

export default LockedScreen;