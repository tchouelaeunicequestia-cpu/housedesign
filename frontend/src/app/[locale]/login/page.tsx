'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email,
        username: email,
        password: password,
      });

      const { access_token, user } = response.data;
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        if (user) {
          localStorage.setItem('user_info', JSON.stringify(user));
        }
        toast.success(t('loginSuccess'));
        router.push('/admin');
      } else {
        toast.error(t('noTokenError'));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const apiMessage = err.response?.data?.message;
      const message = Array.isArray(apiMessage)
        ? apiMessage.join(', ')
        : apiMessage || t('genericError');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link className="flex items-center gap-3" href="/">
            <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
            </div>
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/">
            {t('backToHome')}
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16 w-full flex-grow flex items-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-950/60 border border-red-800/50 px-3 py-1 rounded-full">
              {t('restrictedArea')}
            </span>
            <h2 className="text-2xl font-bold text-white mt-4">{t('portalTitle')}</h2>
            <p className="text-slate-400 text-sm mt-1">{t('portalSubtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('emailLabel')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@housedesign.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('passwordLabel')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {isLoading ? t('verifying') : t('signIn')}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {t('needAccount')}{' '}
            <Link href="/register" className="text-cyan-400 hover:underline font-medium">
              {t('registerHere')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}