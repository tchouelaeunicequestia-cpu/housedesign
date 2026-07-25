'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Calendar, Globe, ArrowRight, Building2, Wrench, ShieldCheck } from 'lucide-react';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Header */}
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="House Design Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
                  {t('tagline')}
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">{t('nav.portfolio')}</Link>
              <Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">{t('nav.marketplace')}</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                {t('nav.engineerLogin')}
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-4">
              {t('hero.eyebrow')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              {t('hero.title')}
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#rendezvous"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> {t('hero.bookButton')}
              </a>
              <a
                href="#services"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                {t('hero.servicesButton')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-6 py-16 border-b border-slate-900">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-2">{t('services.title')}</h3>
            <p className="text-slate-400 text-sm">{t('services.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-lg flex items-center justify-center text-red-500 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('services.structural.title')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('services.structural.description')}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-cyan-950/60 border border-cyan-800/50 rounded-lg flex items-center justify-center text-cyan-400 mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('services.supervision.title')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('services.supervision.description')}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/50 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('services.consultation.title')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('services.consultation.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Rendezvous / Appointment Section */}
        <section id="rendezvous" className="bg-slate-900 border-b border-slate-800 py-16 px-6">
          <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {t('rendezvous.eyebrow')}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{t('rendezvous.title')}</h3>
              <p className="text-slate-400 text-sm mt-2">
                {t('rendezvous.description')}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert(t('rendezvous.successAlert')); }} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('rendezvous.nameLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('rendezvous.namePlaceholder')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('rendezvous.emailLabel')}</label>
                <input
                  type="email"
                  required
                  placeholder={t('rendezvous.emailPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('rendezvous.dateLabel')}</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                {t('rendezvous.submitButton')}
              </button>
            </form>
          </div>
        </section>

        {/* Engineer Contact & Location Info Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-950/60 border border-red-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {t('contact.eyebrow')}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('contact.title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {t('contact.description')}
              </p>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.locationLabel')}</p>
                    <a
                      href="https://maps.google.com/?q=WG3W%2B2F4+Rte+de+Ngousso+Yaounde"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-cyan-400 transition-colors"
                    >
                      WG3W+2F4, Rte de Ngousso, Yaoundé
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.phoneLabel')}</p>
                    <p className="font-medium text-white">+237 6999788704  +237 [EMAIL_ADDRESS]</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.emailLabel')}</p>
                    <p className="font-medium text-white">[EMAIL_ADDRESS]</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl">
              <h4 className="text-lg font-bold text-white mb-4">{t('social.title')}</h4>
              <p className="text-slate-400 text-sm mb-6">{t('social.description')}</p>

              <div className="flex flex-col gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white hover:border-slate-700 transition-colors">
                  <span className="font-medium">Facebook</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white hover:border-slate-700 transition-colors">
                  <span className="font-medium">TikTok</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white hover:border-slate-700 transition-colors">
                  <span className="font-medium">Instagram</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}