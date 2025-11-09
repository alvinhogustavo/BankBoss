import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in space-y-10 p-8">
      <div className="w-32 h-32 rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 overflow-hidden animate-icon-glow">
         <img 
           src="https://i.imgur.com/3wZqSVv.jpeg" 
           alt="BankBoss Lion" 
           className="w-full h-full object-cover"
           style={{ objectPosition: '50% 20%' }}
         />
      </div>
      <div>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
          BankBoss
        </h1>
        <p className="text-slate-300 mt-4 text-lg max-w-xs mx-auto">
          Sua jornada para a disciplina e consistência começa aqui.
        </p>
      </div>
      <button
        onClick={onStart}
        className="w-full max-w-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider"
      >
        Começar 🚀
      </button>
    </div>
  );
};

export default WelcomeScreen;
