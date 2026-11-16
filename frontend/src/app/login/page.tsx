'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getTranslator } from '@/lib/translations';
import GoogleTranslate from '@/components/GoogleTranslate';

export default function LoginPage() {
  const t = getTranslator('LoginPage');
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <header className="bg-white border-b border-slate-200 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link className="flex items-center gap-3" href="/">
            <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">House Design</h1>
              <p className="text-[10px] text-blue-700 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <GoogleTranslate />
            <Link className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors" href="/">
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16 w-full flex-grow flex items-center">
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {t('restrictedArea')}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-4">{t('portalTitle')}</h2>
            <p className="text-slate-600 text-sm mt-1">{t('portalSubtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t('emailLabel')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@housedesign.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t('passwordLabel')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
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
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}