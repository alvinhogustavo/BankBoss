import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup
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
      console.error("Firebase Email/Password Auth Error:", err);
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Firebase Google Auth Error:", err);
      // Handle specific errors for popup closed, etc.
      if (err.code === 'auth/popup-closed-by-user') {
         setError('A janela de login foi fechada. Tente novamente.');
      } else {
         setError('Não foi possível entrar com o Google. Tente novamente.');
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

      <div className="space-y-3">
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

      <div className="flex items-center">
        <div className="flex-grow border-t border-zinc-700"></div>
        <span className="flex-shrink mx-4 text-zinc-500 text-sm">OU</span>
        <div className="flex-grow border-t border-zinc-700"></div>
      </div>
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-md flex items-center justify-center disabled:opacity-50"
      >
        <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        Entrar com Google
      </button>

    </div>
  );
};

export default LoginScreen;