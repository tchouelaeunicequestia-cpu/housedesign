'use client';

import Link from 'next/link';
import { ShieldCheck, Award, Users, HardHat, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
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

        <section className="bg-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
              About House Design
            </span>
            <h2 className="text-4xl font-extrabold mb-3 text-white">Engineering Excellence & Structural Innovation</h2>
            <p className="text-slate-400 text-base">
              Dedicated to designing durable, eco-friendly, and modern residential and commercial architectures in Cameroon and beyond.
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-950/60 border border-red-800/50 px-3 py-1 rounded-full inline-block mb-4">
                Our Vision
              </span>
              <h3 className="text-3xl font-extrabold text-white mb-4 leading-snug">
                — La Maison C'est Nous —
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                At House Design, we believe every structure should harmonize strength, safety, and modern aesthetic elegance. From initial blueprint layout to foundation pouring and final finishing, our certified structural engineers manage every step with extreme technical rigor.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether creating bespoke luxury residential villas or large-scale industrial complexes, we bring innovation and sustainable engineering practices to every site.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
                <Building2 className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-1">50+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Completed Projects</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
                <HardHat className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-1">15+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Lead Engineers</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-1">100%</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Code Compliance</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-1">10+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Years Experience</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}
