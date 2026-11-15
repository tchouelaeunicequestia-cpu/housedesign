'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTranslator } from '@/lib/translations';
import { ShieldCheck, Award, HardHat, Building2, Compass, Cpu, User } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import api from '@/lib/api';

interface EngineerProfile {
  name: string;
  title: string;
  bio: string;
  history: string;
  experienceYears: number;
  completedProjectsCount: number;
  photoUrl?: string;
}

export default function AboutPage() {
  const t = getTranslator('AboutPage');
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/engineer-profile')
      .then((res) => {
        if (res.data && res.data.name) {
          setProfile(res.data);
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">House Design</h1>
                <p className="text-[10px] text-blue-700 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
              <Link href="/" className="hover:text-slate-900 transition-colors">{t('nav.home')}</Link>
              <Link href="/portfolio" className="hover:text-slate-900 transition-colors">{t('nav.portfolio')}</Link>
              <Link href="/about" className="text-blue-700 font-bold">{t('nav.about')}</Link>
              <Link href="/marketplace" className="hover:text-slate-900 transition-colors">{t('nav.marketplace')}</Link>
            </nav>

            <div className="flex items-center gap-3">
              <GoogleTranslate />
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="bg-slate-50 text-slate-900 py-16 px-6 text-center border-b border-slate-200">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-blue-700 text-xs uppercase tracking-widest font-bold bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block">
              {t('hero.eyebrow')}
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900">{t('hero.title')}</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">

          {/* Principal Engineer Spotlight Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col items-center text-center space-y-4 lg:border-r lg:border-slate-200 lg:pr-10">
              <div className="w-40 h-40 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{profile?.name || t('defaults.engineerName')}</h3>
                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mt-1">
                  {profile?.title || t('defaults.engineerTitle')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <span className="text-blue-700 text-xs uppercase tracking-widest font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                {t('background.eyebrow')}
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                — La Maison C'est Nous —
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {profile?.bio || t('defaults.bio')}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {profile?.history || t('defaults.history')}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center shadow-lg">
              <Building2 className="w-8 h-8 text-blue-700 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-slate-900 mb-1">{profile?.completedProjectsCount || 50}+</h4>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">{t('stats.completedProjects')}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center shadow-lg">
              <HardHat className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-slate-900 mb-1">{profile?.experienceYears || 10}+</h4>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">{t('stats.yearsExperience')}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-emerald-700 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-slate-900 mb-1">100%</h4>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">{t('stats.codeCompliance')}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center shadow-lg">
              <Award className="w-8 h-8 text-amber-700 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-slate-900 mb-1">A+</h4>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">{t('stats.structuralGrade')}</p>
            </div>
          </div>

          {/* Core Engineering Pillars */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">{t('pillars.title')}</h3>
              <p className="text-slate-600 text-sm">{t('pillars.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{t('pillars.precision.title')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('pillars.precision.description')}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{t('pillars.safety.title')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('pillars.safety.description')}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{t('pillars.marketplace.title')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('pillars.marketplace.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-700 to-blue-900 border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">{t('cta.title')}</h3>
              <p className="text-blue-100 text-sm">{t('cta.description')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/portfolio"
                className="px-5 py-2.5 bg-white hover:bg-blue-50 border border-white text-blue-700 font-medium text-sm rounded-xl transition-colors"
              >
                {t('cta.viewPortfolio')}
              </Link>
              <Link
                href="/marketplace"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                {t('cta.exploreMarketplace')}
              </Link>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}