export const PAYOUT_RATE = 0.87;

export const MOTIVATIONAL_QUOTES: string[] = [
  "A disciplina é a ponte entre metas e realizações.",
  "O sucesso no trading vem da excelente gestão de risco, não de prever o futuro.",
  "Paciência e disciplina são as virtudes mais importantes para um trader.",
  "Um plano de trading sem disciplina é apenas um desejo.",
  "Não foque em fazer dinheiro, foque em proteger o que você tem."
];

export const RISK_PROFILES = {
  conservative: { label: 'Conservador', value: 0.02 },
  moderate: { label: 'Moderado', value: 0.05 },
  aggressive: { label: 'Agressivo', value: 0.10 },
};

// Based on the new user request for calculating a safe daily goal.
export const SAFE_WITHDRAWAL_PERCENTAGES = {
  conservative: { label: 'Conservador', value: 0.02 }, // Using 2% from the 1-2% range
  moderate: { label: 'Moderado', value: 0.05 },     // Using 5% from the 3-5% range
  aggressive: { label: 'Agressivo', value: 0.10 },    // Using 10% from the 7-10% range
};
