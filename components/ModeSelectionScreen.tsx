import React, { useState } from 'react';
import { RiskProfile } from '../types';
import { RISK_PROFILES } from '../constants';
import InfoModal from './InfoModal';

interface ModeSelectionScreenProps {
  onSelectProfile: (profile: RiskProfile) => void;
}

const PROFILE_DESCRIPTIONS = {
  conservative: `Esse modo é ideal para quem está começando ou tem uma banca pequena. Aqui, você arrisca pouco a cada operação, protegendo seu dinheiro.
  
É perfeito para aprender a operar com segurança e ganhar experiência sem se preocupar em perder tudo. Recomendado para bancas de até R$5.000. O crescimento é mais lento, mas sua banca fica segura!`,
  moderate: `Se você já entende um pouco das operações e quer ver sua banca crescer mais rápido, esse é o modo certo. Aqui, você arrisca um pouco mais a cada operação, mas ainda mantém um nível de segurança.
  
Ideal para bancas entre R$2.000 e R$15.000. Um bom equilíbrio entre segurança e crescimento!`,
  aggressive: `Esse modo é para quem já tem experiência e quer acelerar os ganhos. Você arrisca mais a cada operação, podendo aumentar sua banca rapidamente.
  
Recomendado para bancas maiores, acima de R$5.000. Lembre-se: maior risco também significa que perdas podem ser maiores. Use com atenção e controle emocional!`
};

const ProfileCard: React.FC<{
  label: string;
  percentage: string;
  description: string;
  onClick: () => void;
  onInfoClick: () => void;
}> = ({ label, percentage, description, onClick, onInfoClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-zinc-900 p-5 rounded-xl border border-zinc-800 text-left transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-800/50 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-amber-500">{label}</h3>
        <p className="text-lg font-medium text-slate-100 bg-zinc-700/50 px-3 py-1 rounded-md inline-block mt-1">{percentage}</p>
      </div>
       <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          onInfoClick();
        }}
        className="p-2 -mr-2 -mt-2 rounded-full text-slate-400 hover:bg-zinc-700/50 hover:text-white transition-colors"
        aria-label={`Mais informações sobre o perfil ${label}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
    <p className="text-slate-400 mt-3 text-sm">{description}</p>
  </button>
);

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectProfile }) => {
  const [infoFor, setInfoFor] = useState<RiskProfile | null>(null);

  return (
    <>
      <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">BankBoss</h1>
          <p className="text-slate-300 mt-2 text-lg">
            Selecione seu perfil de risco para hoje.
          </p>
        </div>

        <div className="space-y-4">
          <ProfileCard 
            label="Conservador"
            percentage="2% Risco"
            description="Máxima segurança. Protege sua banca com perdas mínimas."
            onClick={() => onSelectProfile('conservative')}
            onInfoClick={() => setInfoFor('conservative')}
          />
          <ProfileCard 
            label="Moderado"
            percentage="5% Risco"
            description="Equilíbrio entre segurança e agressividade. Bom potencial de lucro."
            onClick={() => onSelectProfile('moderate')}
            onInfoClick={() => setInfoFor('moderate')}
          />
          <ProfileCard 
            label="Agressivo"
            percentage="10% Risco"
            description="Maior risco para maior potencial de retorno. Exige mais atenção."
            onClick={() => onSelectProfile('aggressive')}
            onInfoClick={() => setInfoFor('aggressive')}
          />
        </div>

        <p className="text-zinc-500 text-xs pt-4">
          Sua disciplina é seu maior ativo. Opere com consciência.
        </p>
      </div>

      {infoFor && (
        <InfoModal 
          title={`Perfil ${RISK_PROFILES[infoFor].label}`}
          content={PROFILE_DESCRIPTIONS[infoFor]}
          onClose={() => setInfoFor(null)}
        />
      )}
    </>
  );
};

export default ModeSelectionScreen;