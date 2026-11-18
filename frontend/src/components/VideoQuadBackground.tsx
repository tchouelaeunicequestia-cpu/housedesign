'use client';

import { useEffect, useRef, useState } from 'react';
import { HERO_VIDEOS, HERO_VIDEO_INTERVAL_MS } from '@/lib/heroVideos';
import { createRotation, stepRotation, type RotationState } from '@/lib/videoRotation';

const PANELS = 4;
const FADE_MS = 1500;

/** Abstract blue base for each panel. It shows while a video loads, or if no videos are available. */
const PANEL_BASES = [
  'from-blue-950 via-blue-800 to-blue-600',
  'from-blue-700 via-blue-600 to-sky-500',
  'from-blue-900 via-blue-700 to-indigo-600',
  'from-blue-800 via-blue-950 to-blue-700',
];

interface Layer {
  id: number;
  src: string;
}

function LayerVideo({ src, onError }: { src: string; onError: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reliably set the muted attribute, and browsers only autoplay muted video.
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className="absolute inset-0 h-full w-full object-cover animate-[hvfade_1500ms_ease-out_both]"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      onError={onError}
    />
  );
}

function Panel({ src, index }: { src: string | null; index: number }) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (!src) {
      setLayers([]);
      return;
    }
    const id = ++counter.current;
    // Keep the previous video underneath while the new one fades in.
    setLayers((prev) => [...prev.slice(-1), { id, src }]);
    const timer = setTimeout(() => {
      setLayers((prev) => prev.filter((layer) => layer.id === id));
    }, FADE_MS + 200);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className="relative overflow-hidden" data-panel={index}>
      <div className={`absolute inset-0 bg-gradient-to-br ${PANEL_BASES[index % PANEL_BASES.length]}`} />
      <div
        className={`absolute -inset-1/4 rounded-full blur-3xl opacity-40 motion-safe:animate-[hvdrift_18s_ease-in-out_infinite_alternate] ${
          index === 2 ? 'bg-red-500/60' : 'bg-white/40'
        }`}
        style={{ width: '60%', height: '60%', animationDelay: `${index * -4}s` }}
      />
      {layers.map((layer) => (
        <LayerVideo
          key={layer.id}
          src={layer.src}
          onError={() => setLayers((prev) => prev.filter((l) => l.id !== layer.id))}
        />
      ))}
    </div>
  );
}

/**
 * A hero background split into four panels. Each panel plays a different muted video,
 * and the videos change one panel at a time without repeating on screen.
 * Falls back to an abstract blue background when there are no videos, when the visitor
 * prefers reduced motion, or when data saver is on.
 */
export default function VideoQuadBackground() {
  const [panels, setPanels] = useState<(string | null)[]>(() => Array(PANELS).fill(null));
  const stateRef = useRef<RotationState | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );
    if (reduceMotion || saveData || HERO_VIDEOS.length === 0) return;

    stateRef.current = createRotation(HERO_VIDEOS, PANELS);
    setPanels(stateRef.current.panels);

    const timer = setInterval(() => {
      if (document.hidden || !stateRef.current) return;
      const next = stepRotation(stateRef.current);
      if (next === stateRef.current) return;
      stateRef.current = next;
      setPanels(next.panels);
    }, HERO_VIDEO_INTERVAL_MS / PANELS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px] bg-white/30">
        {panels.map((src, index) => (
          <Panel key={index} src={src} index={index} />
        ))}
      </div>
      {/* Blue tint keeps the text readable and ties the videos to the brand colors. */}
      <div className="absolute inset-0 bg-blue-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-transparent to-blue-950/60" />
    </div>
  );
}
