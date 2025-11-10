import React, { useState } from 'react';
import { 
  signInWithRedirect, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const LoginScreen: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Erro na autenticação com Google:", error);
      setError(`Não foi possível entrar com o Google. Erro: ${error.code}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/wrong-password':
          setError('Senha incorreta. Por favor, tente novamente.');
          break;
        case 'auth/user-not-found':
          setError('Nenhum usuário encontrado com este e-mail.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está sendo usado por outra conta.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        default:
          setError('Ocorreu um erro. Verifique suas credenciais.');
          break;
      }
      console.error("Erro na autenticação com Email/Senha:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center animate-fade-in border border-zinc-800 space-y-6 w-full max-w-sm">
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
          BankBoss
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          {isLoginMode ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </p>
      </div>

      <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="w-full bg-zinc-800 text-white placeholder-slate-500 text-center text-lg p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
        />
        {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Aguarde...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
        </button>
      </form>

      <p className="text-sm text-slate-400">
        {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} className="font-semibold text-amber-400 hover:text-amber-300 ml-2">
          {isLoginMode ? 'Crie uma agora' : 'Faça login'}
        </button>
      </p>
      
      <div className="flex items-center">
        <hr className="w-full border-zinc-700" />
        <span className="px-2 text-xs font-semibold text-zinc-500">OU</span>
        <hr className="w-full border-zinc-700" />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-white/10 hover:bg-white/20 text-slate-100 font-semibold py-3 px-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        Entrar com Google
      </button>
    </div>
  );
};

export default LoginScreen;
