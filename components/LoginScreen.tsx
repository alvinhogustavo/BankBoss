import React, { useState } from 'react';
import { supabase } from '../supabase';
import BankBossIcon from './BankBossIcon';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      setMessage('Verifique seu e-mail para o link de login!');
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.error_description || error.message || 'Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <BankBossIcon />
      </div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
        BankBoss
      </h1>
      <p className="text-slate-300 mt-2 mb-8 text-lg">
        Controle sua disciplina, domine o mercado.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:shadow-none disabled:transform-none"
        >
          {loading ? 'Enviando...' : 'Entrar com E-mail'}
        </button>
      </form>
      
      {message && <p className="text-emerald-400 text-sm mt-4 animate-fade-in">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-4 animate-fade-in">{error}</p>}
      
      <p className="text-zinc-500 text-xs mt-6">
        Você receberá um link mágico no seu e-mail para fazer login de forma segura.
      </p>
    </div>
  );
};

export default LoginScreen;
