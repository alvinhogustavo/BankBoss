import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
} from 'firebase/auth';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Firebase Auth Error:", err); // Improved debugging
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-8 rounded-xl shadow-2xl text-center animate-fade-in bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">BankBoss</h1>
        <p className="text-slate-300 mt-2 text-lg">
          {isLogin ? 'Acesse sua conta para continuar' : 'Crie uma conta para salvar seu progresso'}
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleAuthAction}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:opacity-50"
      >
        {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
      </button>

      <button onClick={() => setIsLogin(!isLogin)} className="text-amber-400 hover:underline text-sm">
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
      </button>
    </div>
  );
};

export default LoginScreen;