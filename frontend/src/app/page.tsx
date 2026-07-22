'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { MapPin, Phone, Mail, Calendar, Globe, ArrowRight, Building2, Wrench, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { data: projects, isLoading, isError } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeColor = (st: string) => {
    switch (st) {
      case 'Completed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800/50';
      case 'In-Progress':
        return 'bg-amber-950 text-amber-400 border-amber-800/50';
      default:
        return 'bg-cyan-950 text-cyan-400 border-cyan-800/50';
    }
  };

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
                  — la maison c'est nous —
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
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

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Structural Engineering & Architectural Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Building Your Vision With Precision
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
              Professional residential, commercial, and industrial engineering solutions. Explore our comprehensive services, book a rendezvous, and discover our premier work portfolio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#rendezvous"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book a Rendezvous
              </a>
              <a
                href="#services"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                Our Services <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-6 py-16 border-b border-slate-900">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-2">Services Offered</h3>
            <p className="text-slate-400 text-sm">Comprehensive engineering expertise tailored to modern construction demands.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-lg flex items-center justify-center text-red-500 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Structural Architecture</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complete structural layout designs, blueprints, and load calculations for residential and commercial constructions.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-cyan-950/60 border border-cyan-800/50 rounded-lg flex items-center justify-center text-cyan-400 mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Site Supervision & Execution</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                On-site engineering oversight, quality assessment, and project management from foundation to final finish.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-sm hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/50 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Consultation & Audits</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Structural integrity audits, technical evaluations, material consultation, and regulatory compliance advice.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Portfolio Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-white">Featured Projects</h3>
              <p className="text-slate-400 text-sm mt-1">Explore our latest engineering accomplishments.</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 flex-grow md:w-64"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="All">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-cyan-400 font-medium py-12 text-center">Loading engineering portfolio...</div>
          )}

          {isError && (
            <div className="p-4 bg-red-950/60 text-red-300 rounded-lg border border-red-800/50">
              Unable to load projects at the moment. Please verify backend connectivity.
            </div>
          )}

          {filteredProjects && filteredProjects.length === 0 && (
            <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
              <p className="text-slate-400 text-lg">No projects found matching your criteria.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project: any) => (
              <div
                key={project.id}
                className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-slate-700 transition-all"
              >
                {project.imageUrl && (
                  <img
                    src={
                      project.imageUrl.startsWith('http')
                        ? project.imageUrl
                        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${project.imageUrl}`
                    }
                    alt={project.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-slate-950 text-cyan-400 border border-cyan-900/50 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {project.category || 'Residential'}
                      </span>
                      <span
                        className={`border text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusBadgeColor(
                          project.status
                        )}`}
                      >
                        {project.status || 'Planning'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rendezvous / Appointment Section */}
        <section id="rendezvous" className="bg-slate-900 border-t border-b border-slate-800 py-16 px-6">
          <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Schedule a Meeting
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Book a Rendezvous</h3>
              <p className="text-slate-400 text-sm mt-2">
                Discuss your architectural plans and engineering requirements directly with our lead specialist.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Rendezvous request submitted successfully!'); }} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Date & Time</label>
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
                Confirm Rendezvous Request
              </button>
            </form>
          </div>
        </section>

        {/* Engineer Contact & Location Info Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-red-500 text-xs uppercase tracking-widest font-bold bg-red-950/60 border border-red-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Lead Engineer Contact
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Eng. Lead Specialist</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Reach out directly via phone or email for immediate structural inquiries, consultations, or direct site visits.
              </p>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Location</p>
                    <p className="font-medium text-white">Yaoundé, Centre Region, Cameroon</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone Number</p>
                    <p className="font-medium text-white">+237 600 000 000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</p>
                    <p className="font-medium text-white">contact@housedesign.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl">
              <h4 className="text-lg font-bold text-white mb-4">Connect Socially</h4>
              <p className="text-slate-400 text-sm mb-6">Follow our professional networks and online portals for daily updates and structural showcases.</p>
              
              <div className="flex flex-col gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white hover:border-slate-700 transition-colors">
                  <span className="font-medium">LinkedIn Network</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white hover:border-slate-700 transition-colors">
                  <span className="font-medium">GitHub Repository</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}