import React from 'react';

interface EndScreenProps {
  type: 'win' | 'loss';
  onEndSession: () => void;
}

const messages = {
  win: {
    title: "Meta Batida!",
    text: "Excelente trabalho. A disciplina te leva longe. Hora de descansar e aproveitar seus lucros. Nos vemos amanhã!",
    color: "text-emerald-400",
    shadowColor: "rgba(16, 185, 129, 0.3)"
  },
  loss: {
    title: "Limite Atingido!",
    text: "Um verdadeiro chefe sabe a hora de recuar para lutar amanhã. O mercado estará aí, volte com a mente renovada.",
    color: "text-red-500",
    shadowColor: "rgba(220, 38, 38, 0.3)"
  }
};

const EndScreen: React.FC<EndScreenProps> = ({ type, onEndSession }) => {
  const { title, text, color, shadowColor } = messages[type];

  const imageUrl = type === 'win'
    ? "https://i.imgur.com/o9oVyKD.jpeg"
    // Lost screen
    : "https://i.imgur.com/Pg4VO6O.jpeg";

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800">
      <div className="w-28 h-28 mx-auto mb-4 rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 overflow-hidden">
        <img src={imageUrl} alt={type === 'win' ? "Meta Batida" : "Limite Atingido"} className="w-full h-full object-cover object-top" />
      </div>
      <h1 
        className={`text-4xl font-bold tracking-wider ${color}`} 
        style={{ textShadow: `0 0 15px ${shadowColor}` }}
      >
        {title}
      </h1>
      <p className="text-slate-300 mt-4 mb-8 text-lg leading-relaxed">{text}</p>
      
      <button
        onClick={onEndSession}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider"
      >
        Encerrar Expediente
      </button>
    </div>
  );
};

export default EndScreen;