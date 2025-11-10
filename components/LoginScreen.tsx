import React, { useState } from 'react';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const LoginScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in App.tsx will handle navigation
    } catch (error: any) {
      console.error("Error during Google sign in: ", error);
      setError("Não foi possível entrar com o Google. Tente novamente.");
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in App.tsx will handle navigation
    } catch (error: any) {
      console.error("Email/Password auth error:", error.code);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Nenhum usuário encontrado com este e-mail.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Tente novamente.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso por outra conta.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
           setError('O formato do e-mail é inválido.');
          break;
        default:
          setError('Ocorreu um erro. Tente novamente.');
          break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in space-y-6 p-8 bg-zinc-900/60 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl">
      <div className="w-24 h-24 rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 overflow-hidden">
        <img 
          src="https://i.imgur.com/3wZqSVv.jpeg" 
          alt="BankBoss Lion" 
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 20%' }}
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
          BankBoss
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          {isLogin ? 'Bem-vindo de volta, trader!' : 'Crie sua conta para começar.'}
        </p>
      </div>

      <form onSubmit={handleEmailPasswordSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider"
        >
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </button>
      </form>

       <div className="flex items-center w-full max-w-xs">
        <hr className="w-full border-zinc-700" />
        <span className="px-2 text-zinc-500 text-sm">OU</span>
        <hr className="w-full border-zinc-700" />
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full max-w-xs bg-white/10 hover:bg-white/20 border border-slate-500 text-slate-100 font-semibold py-3 px-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center space-x-3"
      >
        <svg className="w-6 h-6" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.317-11.284-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        <span>Entrar com Google</span>
      </button>

      <p className="text-slate-400 text-sm">
        {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-amber-400 hover:text-amber-300 ml-2 focus:outline-none">
          {isLogin ? "Crie uma" : "Entre"}
        </button>
      </p>
    </div>
  );
};

export default LoginScreen;