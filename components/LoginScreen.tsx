import React, { useState } from 'react';
import { signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const LoginScreen: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (error) {
          console.error("Error during sign-in redirect:", error);
          setError("Não foi possível entrar com o Google. Tente novamente.");
        }
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
          setError("Por favor, preencha email e senha.");
          return;
        }
        setIsLoading(true);
        setError('');
        try {
          if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
          } else {
            if (password.length < 6) {
              setError("A senha deve ter pelo menos 6 caracteres.");
              setIsLoading(false);
              return;
            }
            await createUserWithEmailAndPassword(auth, email, password);
          }
        } catch (err: any) {
          if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError('Email ou senha incorretos.');
          } else if (err.code === 'auth/user-not-found') {
            setError('Nenhuma conta encontrada com este email.');
          } else if (err.code === 'auth/email-already-in-use') {
            setError('Este email já está em uso.');
          } else {
            setError('Ocorreu um erro. Tente novamente.');
            console.error("Firebase auth error:", err);
          }
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <div className="w-full max-w-sm mx-auto animate-fade-in p-8">
            <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 overflow-hidden">
                    <img 
                        src="https://i.imgur.com/3wZqSVv.jpeg" 
                        alt="BankBoss Lion" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '50% 20%' }}
                    />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-400 to-yellow-500 tracking-wider">
                    BankBoss
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    {isLoginMode ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                </p>
            </div>
            
            <form onSubmit={handleAuthAction} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-zinc-800 text-white placeholder-slate-500 p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full bg-zinc-800 text-white placeholder-slate-500 p-3 rounded-lg border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-300 shadow-inner"
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-zinc-900 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md tracking-wider disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
                </button>
            </form>
            
            <div className="text-center mt-4">
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {isLoginMode ? 'Não tem uma conta? Crie uma' : 'Já tem uma conta? Entre'}
                </button>
            </div>
            
            <div className="flex items-center my-6">
                <hr className="w-full border-zinc-700" />
                <span className="px-2 text-xs font-semibold text-zinc-500">OU</span>
                <hr className="w-full border-zinc-700" />
            </div>

            <button
                onClick={handleGoogleLogin}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-md transition-all duration-300 shadow-md flex items-center justify-center space-x-3"
            >
                <svg className="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.999,35.536,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                <span>Entrar com Google</span>
            </button>
        </div>
    );
};

export default LoginScreen;