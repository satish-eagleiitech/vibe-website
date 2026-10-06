"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Gift, Sparkles } from "lucide-react";
import type { ScratchCard as ScratchCardData } from "@/lib/rewards/scratch";

const BRUSH = 22;
const REVEAL_AT = 0.45;

function paintFoil(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#ff005b");
  gradient.addColorStop(0.55, "#ff4d8d");
  gradient.addColorStop(1, "#c8004a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let y = 10; y < rect.height; y += 18) {
    for (let x = (y / 18) % 2 ? 6 : 14; x < rect.width; x += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 15px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2 - 8);
  ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("to reveal your reward", rect.width / 2, rect.height / 2 + 12);
}

type ScratchCardProps = {
  card: ScratchCardData;
  revealed: boolean;
  onReveal: () => void;
};

export function ScratchCard({ card, revealed, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [fading, setFading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintFoil(canvas);
    const observer = new ResizeObserver(() => paintFoil(canvas));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [revealed]);

  const finish = useCallback(() => {
    if (fading) return;
    setFading(true);
    window.setTimeout(onReveal, 350);
  }, [fading, onReveal]);

  function clearedRatio(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total += 1;
      if (data[i] === 0) clear += 1;
    }
    return total ? clear / total : 0;
  }

  function scratchAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? x, last.current?.y ?? y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };

    strokes.current += 1;
    if (strokes.current % 8 === 0 && clearedRatio(canvas) >= REVEAL_AT) finish();
  }

  async function copy() {
    if (!card.code) return;
    try {
      await navigator.clipboard.writeText(card.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const won = Boolean(card.code);

  return (
    <article className="relative flex min-h-[230px] flex-col overflow-hidden rounded-[22px] border border-border bg-surface sm:min-h-[250px]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-5 text-center">
        <span
          className={`inline-flex size-12 items-center justify-center rounded-2xl ${
            won ? "bg-accent text-white" : "bg-surface-muted text-text-muted"
          }`}
        >
          {won ? <Gift className="size-6" /> : <Sparkles className="size-6" />}
        </span>
        <p className="mt-3 text-[10px] font-extrabold tracking-[0.16em] text-accent uppercase">
          {card.category}
        </p>
        <p className="mt-1 text-[20px] leading-tight font-extrabold text-text sm:text-[22px]">
          {card.reward}
        </p>
        <p className="mt-1 text-[12px] text-text-secondary">{card.detail}</p>
      </div>

      {won ? (
        <div className="border-t border-dashed border-border px-3 py-3">
          <button
            type="button"
            onClick={copy}
            disabled={!revealed}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-accent-soft px-3 py-2 text-left"
          >
            <span className="truncate font-mono text-[13px] font-bold tracking-wider text-accent">
              {card.code}
            </span>
            {copied ? (
              <Check className="size-4 shrink-0 text-accent" />
            ) : (
              <Copy className="size-4 shrink-0 text-accent" />
            )}
          </button>
          <p className="mt-1.5 text-center text-[10px] font-semibold text-text-muted">
            {card.expires}
          </p>
        </div>
      ) : null}

      {!revealed ? (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            fading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <canvas
            ref={canvasRef}
            aria-hidden
            className="size-full cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={(event) => {
              drawing.current = true;
              last.current = null;
              try {
                event.currentTarget.setPointerCapture(event.pointerId);
              } catch {
                // Synthetic or already-released pointers can't be captured; scratching still works.
              }
              scratchAt(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (drawing.current) scratchAt(event.clientX, event.clientY);
            }}
            onPointerUp={() => {
              drawing.current = false;
              last.current = null;
              const canvas = canvasRef.current;
              if (canvas && clearedRatio(canvas) >= REVEAL_AT) finish();
            }}
            onPointerCancel={() => {
              drawing.current = false;
              last.current = null;
            }}
          />
          <button
            type="button"
            onClick={finish}
            className="absolute right-3 bottom-3 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/35"
          >
            Reveal
          </button>
        </div>
      ) : null}
    </article>
  );
}
