import React from 'react';

interface InfoModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl p-6 max-w-lg w-full text-left space-y-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-bold text-amber-500">{title}</h2>
        <p className="text-slate-200 whitespace-pre-line leading-relaxed">{content}</p>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default InfoModal;