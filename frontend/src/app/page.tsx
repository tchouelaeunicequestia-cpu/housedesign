'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTranslator } from '@/lib/translations';
import { MapPin, Phone, Mail, Calendar, ArrowRight, Building2, Wrench, ShieldCheck, Loader2 } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import VideoQuadBackground from '@/components/VideoQuadBackground';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Home() {
  const t = getTranslator('HomePage');

  // Appointment Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/appointment', {
        name,
        email,
        phone,
        appointmentDate,
        serviceType,
        notes,
      });

      toast.success(t('rendezvous.successAlert'));
      setName('');
      setEmail('');
      setPhone('');
      setAppointmentDate('');
      setServiceType('');
      setNotes('');
    } catch (error: any) {
      console.error('Failed to book appointment:', error);
      toast.error(t('rendezvous.errorAlert'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="House Design Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">House Design</h1>
                <p className="text-[10px] text-blue-700 font-semibold tracking-widest uppercase">
                  {t('tagline')}
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
              <Link href="/" className="text-blue-700 font-bold transition-colors">{t('nav.home')}</Link>
              <Link href="/portfolio" className="hover:text-slate-900 transition-colors">{t('nav.portfolio')}</Link>
              <Link href="/about" className="hover:text-slate-900 transition-colors">{t('nav.about')}</Link>
              <Link href="/marketplace" className="hover:text-slate-900 transition-colors">{t('nav.marketplace')}</Link>
            </nav>

            <div className="flex items-center gap-3">
              <GoogleTranslate />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden text-white py-24 px-6 text-center border-b border-slate-200">
          <VideoQuadBackground />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-blue-700 text-xs uppercase tracking-widest font-bold bg-white/90 border border-white px-3.5 py-1.5 rounded-full inline-block mb-4">
              {t('hero.eyebrow')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
              {t('hero.title')}
            </h2>
            <p className="text-blue-50 text-base md:text-lg mb-8 leading-relaxed drop-shadow">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#rendezvous"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> {t('hero.bookButton')}
              </a>
              <a
                href="#services"
                className="bg-white hover:bg-blue-50 border border-white text-blue-700 text-sm font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                {t('hero.servicesButton')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-6 py-16 border-b border-slate-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{t('services.title')}</h3>
            <p className="text-slate-600 text-sm">{t('services.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-500 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('services.structural.title')}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('services.structural.description')}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-700 mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('services.supervision.title')}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('services.supervision.description')}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-center text-emerald-700 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('services.consultation.title')}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('services.consultation.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Rendezvous / Appointment Section */}
        <section id="rendezvous" className="bg-white border-b border-slate-200 py-16 px-6">
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-blue-700 text-xs uppercase tracking-widest font-bold bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {t('rendezvous.eyebrow')}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{t('rendezvous.title')}</h3>
              <p className="text-slate-600 text-sm mt-2">
                {t('rendezvous.description')}
              </p>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.nameLabel')} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('rendezvous.namePlaceholder')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.emailLabel')} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('rendezvous.emailPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.phoneLabel')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('rendezvous.phonePlaceholder')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.dateLabel')} *</label>
                  <input
                    type="datetime-local"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.serviceTypeLabel')}</label>
                  <input
                    type="text"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder={t('rendezvous.serviceTypePlaceholder')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('rendezvous.notesLabel')}</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('rendezvous.notesPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('rendezvous.submitting')}</span>
                  </>
                ) : (
                  <span>{t('rendezvous.submitButton')}</span>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Engineer Contact & Location Info Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {t('contact.eyebrow')}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{t('contact.title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {t('contact.description')}
              </p>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.locationLabel')}</p>
                    <a
                      href="https://maps.google.com/?q=WG3W%2B2F4+Rte+de+Ngousso+Yaounde"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-blue-700 transition-colors"
                    >
                      Yaoundé, Centre Region, Cameroon
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.phoneLabel')}</p>
                    <p className="font-medium text-slate-900">+237 6999788704 / +237 671234567</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('contact.emailLabel')}</p>
                    <p className="font-medium text-slate-900">contact@housedesign.cm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-xl">
              <h4 className="text-lg font-bold text-slate-900 mb-4">{t('social.title')}</h4>
              <p className="text-slate-600 text-sm mb-6">{t('social.description')}</p>

              <div className="flex flex-col gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 hover:border-slate-300 transition-colors">
                  <span className="font-medium">Facebook</span>
                  <span className="text-xs text-blue-700 font-semibold">House Design CM ↗</span>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 hover:border-slate-300 transition-colors">
                  <span className="font-medium">TikTok</span>
                  <span className="text-xs text-blue-700 font-semibold">@housedesign_cm ↗</span>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 hover:border-slate-300 transition-colors">
                  <span className="font-medium">Instagram</span>
                  <span className="text-xs text-blue-700 font-semibold">@housedesign_structures ↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <Link href="/login" className="inline-block mt-3 text-[11px] text-slate-400 hover:text-blue-700 transition-colors">
          {t('nav.engineerLogin')}
        </Link>
      </footer>
    </div>
  );
}