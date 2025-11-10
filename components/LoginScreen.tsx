
import React, { useState } from 'react';
import { supabase } from '../supabase';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
          BankBoss
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Welcome back, boss.
        </p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-2 tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
      {message && <p className="text-slate-300 mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default LoginScreen;
