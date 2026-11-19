'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Publication {
  id: string;
  kind: 'project_story' | 'design_concept' | 'news';
  title: string;
  body: string;
  imageUrl?: string | null;
  aiGenerated: boolean;
  publishedAt?: string | null;
}

const KIND_LABELS: Record<Publication['kind'], string> = {
  project_story: 'Project story',
  design_concept: 'Design concept',
  news: 'News',
};

function mediaUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

/** Latest approved posts (project stories and new design concepts). Shows nothing when there are none. */
export default function LatestPublications({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<Publication[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/publication?limit=${limit}`)
      .then((response) => {
        if (!cancelled && Array.isArray(response.data)) setItems(response.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="news">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Latest from House Design</h3>
        <p className="mt-1 text-sm text-slate-600">New project stories and house design ideas.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => {
          const expanded = open === item.id;
          return (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
            >
              {item.imageUrl ? (
                <img src={mediaUrl(item.imageUrl)} alt={item.title} className="h-44 w-full object-cover" />
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="w-fit rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  {KIND_LABELS[item.kind] ?? 'News'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className={`whitespace-pre-line text-sm leading-relaxed text-slate-600 ${expanded ? '' : 'line-clamp-5'}`}>
                  {item.body}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : item.id)}
                    className="cursor-pointer font-medium text-blue-700 hover:underline"
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                  {item.aiGenerated ? <span>Written with AI assistance</span> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
