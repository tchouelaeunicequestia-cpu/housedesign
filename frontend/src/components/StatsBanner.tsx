interface StatsBannerProps {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
}

export default function StatsBanner({ total, planning, inProgress, completed }: StatsBannerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Projects</p>
        <p className="text-3xl font-extrabold text-white mt-2">{total}</p>
      </div>
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Planning</p>
        <p className="text-3xl font-extrabold text-cyan-300 mt-2">{planning}</p>
      </div>
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">In-Progress</p>
        <p className="text-3xl font-extrabold text-amber-300 mt-2">{inProgress}</p>
      </div>
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Completed</p>
        <p className="text-3xl font-extrabold text-emerald-300 mt-2">{completed}</p>
      </div>
    </div>
  );
}