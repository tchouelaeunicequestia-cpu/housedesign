'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Check, Edit3, FileText, Loader2, Save, Trash2, X } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import api from '@/lib/api';
import { ACCENT_COLORS, TINT_COLORS, toSafeTheme } from '@/lib/theme';

interface Publication {
  id: string;
  kind: 'project_story' | 'design_concept' | 'news';
  title: string;
  body: string;
  imageUrl?: string | null;
  status: 'draft' | 'published' | 'rejected';
  aiGenerated: boolean;
  createdAt: string;
}

interface ThemeRow {
  id: string;
  name: string;
  season: string;
  tint: string;
  tintOpacity: number;
  accent: string;
  banner: string;
  status: 'draft' | 'active' | 'archived' | 'rejected';
  aiGenerated: boolean;
}

interface AiStatus {
  enabled: boolean;
  provider: string | null;
  imageEnabled: boolean;
  autoPublish: boolean;
  season: string;
}

interface ProjectOption {
  id: number | string;
  title: string;
}

const KIND_LABELS = { project_story: 'Project story', design_concept: 'Design concept', news: 'News' } as const;

function mediaUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

function errorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  return typeof message === 'string' ? message : fallback;
}

export default function AdminAiPage() {
  const router = useRouter();
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [tab, setTab] = useState<'draft' | 'published' | 'rejected'>('draft');
  const [projectId, setProjectId] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; title: string; body: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, p, pr, t] = await Promise.all([
        api.get('/ai-content/status'),
        api.get('/ai-content/publications'),
        api.get('/project'),
        api.get('/ai-content/themes'),
      ]);
      setStatus(s.data);
      setPublications(p.data);
      setProjects(pr.data);
      setThemes(t.data);
    } catch (error) {
      if ((error as { response?: { status?: number } })?.response?.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
        return;
      }
      toast.error(errorMessage(error, 'Could not load the AI assistant.'));
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/login');
      return;
    }
    load();
  }, [router, load]);

  const run = async (key: string, action: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await action();
      toast.success(success);
      await load();
    } catch (error) {
      toast.error(errorMessage(error, 'Something went wrong. Please try again.'));
    } finally {
      setBusy(null);
    }
  };

  const visible = publications.filter((p) => p.status === tab);
  const counts = {
    draft: publications.filter((p) => p.status === 'draft').length,
    published: publications.filter((p) => p.status === 'published').length,
    rejected: publications.filter((p) => p.status === 'rejected').length,
  };

  const actionButton =
    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer';

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xl flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-200/30 rounded-xl text-blue-700">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI assistant</h1>
              <p className="text-sm text-slate-600">
                Writes posts and design ideas from your projects. Nothing goes live until you approve it.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GoogleTranslate />
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to dashboard</span>
            </Link>
          </div>
        </header>

        {status && !status.enabled ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            The AI is switched off. Add <code className="font-mono">ANTHROPIC_API_KEY</code> or{' '}
            <code className="font-mono">OPENAI_API_KEY</code> to the backend <code className="font-mono">.env</code> file
            and restart the backend. You can still propose seasonal looks without it.
          </div>
        ) : status ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            AI ready ({status.provider}).{' '}
            {status.autoPublish
              ? 'Auto-publish is ON: new posts go live without approval.'
              : 'New posts wait here for your approval.'}{' '}
            Current season: {status.season}.
          </div>
        ) : null}

        {/* Create new content */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Create new content</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600" htmlFor="project">
                Write a post about a project
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 min-w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Choose a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={!projectId || !status?.enabled || busy !== null}
              onClick={() =>
                run('story', () => api.post('/ai-content/generate/story', { projectId: Number(projectId) }), 'Draft post created.')
              }
              className={`${actionButton} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              {busy === 'story' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Write post
            </button>
            <button
              disabled={!status?.enabled || busy !== null}
              onClick={() => run('design', () => api.post('/ai-content/generate/design'), 'Draft design concept created.')}
              className={`${actionButton} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              {busy === 'design' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              New house design idea
            </button>
            <button
              disabled={busy !== null}
              onClick={() => run('theme', () => api.post('/ai-content/generate/theme'), 'Seasonal look proposed.')}
              className={`${actionButton} bg-white hover:bg-slate-100 border border-slate-300 text-slate-800`}
            >
              {busy === 'theme' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Propose seasonal look
            </button>
          </div>
          {busy ? <p className="text-xs text-slate-500">The AI is working. This can take up to a minute.</p> : null}
        </section>

        {/* Publications */}
        <section className="space-y-4">
          <div className="flex gap-2 border-b border-slate-200">
            {(['draft', 'published', 'rejected'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px cursor-pointer ${
                  tab === key ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {key === 'draft' ? 'Waiting for approval' : key === 'published' ? 'Published' : 'Rejected'} ({counts[key]})
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Nothing here yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visible.map((item) => {
                const isEditing = editing?.id === item.id;
                return (
                  <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    {item.imageUrl ? (
                      <img src={mediaUrl(item.imageUrl)} alt="" className="h-40 w-full rounded-lg object-cover" />
                    ) : null}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        {KIND_LABELS[item.kind] ?? 'News'}
                      </span>
                      {item.aiGenerated ? <span className="text-xs text-slate-500">AI draft</span> : null}
                    </div>

                    {isEditing && editing ? (
                      <div className="space-y-2">
                        <input
                          value={editing.title}
                          onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <textarea
                          value={editing.body}
                          onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                          rows={8}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{item.body}</p>
                      </>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {isEditing && editing ? (
                        <>
                          <button
                            disabled={busy !== null}
                            onClick={() =>
                              run(
                                `save-${item.id}`,
                                () => api.patch(`/ai-content/publications/${item.id}`, { title: editing.title, body: editing.body }),
                                'Saved.',
                              ).then(() => setEditing(null))
                            }
                            className={`${actionButton} bg-blue-600 hover:bg-blue-700 text-white`}
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className={`${actionButton} bg-white border border-slate-300 text-slate-800 hover:bg-slate-100`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {item.status !== 'published' ? (
                            <button
                              disabled={busy !== null}
                              onClick={() => run(`pub-${item.id}`, () => api.post(`/ai-content/publications/${item.id}/publish`), 'Published.')}
                              className={`${actionButton} bg-blue-600 hover:bg-blue-700 text-white`}
                            >
                              <Check className="w-4 h-4" /> Publish
                            </button>
                          ) : null}
                          <button
                            onClick={() => setEditing({ id: item.id, title: item.title, body: item.body })}
                            className={`${actionButton} bg-white border border-slate-300 text-slate-800 hover:bg-slate-100`}
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          {item.status === 'draft' ? (
                            <button
                              disabled={busy !== null}
                              onClick={() => run(`rej-${item.id}`, () => api.post(`/ai-content/publications/${item.id}/reject`), 'Rejected.')}
                              className={`${actionButton} bg-white border border-slate-300 text-slate-800 hover:bg-slate-100`}
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          ) : null}
                          <button
                            disabled={busy !== null}
                            onClick={() => {
                              if (window.confirm('Delete this post for good?')) {
                                run(`del-${item.id}`, () => api.delete(`/ai-content/publications/${item.id}`), 'Deleted.');
                              }
                            }}
                            className={`${actionButton} bg-red-50 border border-red-200 text-red-600 hover:bg-red-100`}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Seasonal looks */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Seasonal looks</h2>
          <p className="text-sm text-slate-600">
            The look of the home page header changes with the season. Until you activate one, the site follows the
            calendar by itself.
          </p>
          {themes.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">No proposals yet. Click “Propose seasonal look”.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {themes.map((theme) => {
                const safe = toSafeTheme(theme);
                return (
                  <article key={theme.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{theme.name}</h3>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          theme.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {theme.status}
                      </span>
                    </div>
                    {safe ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-24 rounded-lg border border-slate-200"
                          style={{ backgroundColor: TINT_COLORS[safe.tint], opacity: safe.tintOpacity + 0.25 }}
                          title="Header tint"
                        />
                        <div
                          className="h-10 w-10 rounded-lg border border-slate-200"
                          style={{ backgroundColor: ACCENT_COLORS[safe.accent].base }}
                          title="Button colour"
                        />
                      </div>
                    ) : null}
                    <p className="text-sm text-slate-600">“{theme.banner}”</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {theme.status !== 'active' ? (
                        <button
                          disabled={busy !== null}
                          onClick={() => run(`act-${theme.id}`, () => api.post(`/ai-content/themes/${theme.id}/activate`), 'Theme is now live.')}
                          className={`${actionButton} bg-blue-600 hover:bg-blue-700 text-white`}
                        >
                          <Check className="w-4 h-4" /> Activate
                        </button>
                      ) : null}
                      {theme.status === 'draft' ? (
                        <button
                          disabled={busy !== null}
                          onClick={() => run(`rt-${theme.id}`, () => api.post(`/ai-content/themes/${theme.id}/reject`), 'Rejected.')}
                          className={`${actionButton} bg-white border border-slate-300 text-slate-800 hover:bg-slate-100`}
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      ) : null}
                      {theme.status !== 'active' ? (
                        <button
                          disabled={busy !== null}
                          onClick={() => run(`dt-${theme.id}`, () => api.delete(`/ai-content/themes/${theme.id}`), 'Deleted.')}
                          className={`${actionButton} bg-red-50 border border-red-200 text-red-600 hover:bg-red-100`}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
