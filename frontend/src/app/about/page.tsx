'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Users, HardHat, Building2, Compass, Cpu, User } from 'lucide-react';

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
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/engineer-profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setProfile(data);
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-cyan-400 font-bold">About Us</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Engineer Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="bg-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block">
              About House Design
            </span>
            <h2 className="text-4xl font-extrabold text-white">Engineering Excellence & Structural Innovation</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Dedicated to designing durable, eco-friendly, and modern residential and commercial architectures in Cameroon and beyond.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
          
          {/* Principal Engineer Spotlight Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col items-center text-center space-y-4 lg:border-r lg:border-slate-800 lg:pr-10">
              <div className="w-40 h-40 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{profile?.name || 'Lead Engineer'}</h3>
                <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mt-1">
                  {profile?.title || 'Principal Structural Engineer'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full inline-block">
                Professional Background
              </span>
              <h4 className="text-2xl font-extrabold text-white">
                — La Maison C'est Nous —
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {profile?.bio || 'At House Design, we believe every structure should harmonize strength, safety, and modern aesthetic elegance. From initial blueprint layout to foundation pouring and final finishing, every project is managed with extreme technical rigor.'}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {profile?.history || 'With years of rigorous practice in structural calculations, building code compliance, and site execution, our practice leads the standard for dependable architectural delivery across the region.'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <Building2 className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">{profile?.completedProjectsCount || 50}+</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Completed Projects</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <HardHat className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">{profile?.experienceYears || 10}+</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Years Experience</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">100%</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Code Compliance</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">A+</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Structural Grade</p>
            </div>
          </div>

          {/* Core Engineering Pillars */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-white">Our Core Engineering Pillars</h3>
              <p className="text-slate-400 text-sm">The technical standards and methodologies driving every blueprint.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-cyan-950 border border-cyan-800/50 rounded-xl flex items-center justify-center text-cyan-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Precision Architecture</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Advanced spatial layout and load simulation ensuring zero discrepancies during construction.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-950 border border-emerald-800/50 rounded-xl flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Safety & Compliance</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Rigorous adherence to structural safety codes, soil metrics, and regional environmental standards.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-amber-950 border border-amber-800/50 rounded-xl flex items-center justify-center text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Digital Marketplace</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Seamless procurement of verified land plots, building materials, and pre-engineered blueprints.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Ready to start your construction project?</h3>
              <p className="text-slate-400 text-sm">Explore our blueprint inventory or check out completed developments in our portfolio.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/portfolio"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm rounded-xl transition-colors"
              >
                View Portfolio
              </Link>
              <Link
                href="/marketplace"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}