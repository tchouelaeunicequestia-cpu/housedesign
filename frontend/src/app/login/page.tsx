'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        toast.success('Successfully authenticated as Engineer.');
        router.push('/admin');
      } else {
        toast.error('Please enter valid credentials.');
      }
    }, 800);
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
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16 w-full flex-grow flex items-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-950/60 border border-red-800/50 px-3 py-1 rounded-full">
              Restricted Area
            </span>
            <h2 className="text-2xl font-bold text-white mt-4">Engineer Portal</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage structural records and layouts.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Engineer Email</label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Access Passcode</label>
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
              className="w-full mt-2 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}