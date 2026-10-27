"use client";

import { useEffect, useRef, type PointerEvent } from "react";

type SignaturePadProps = {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
};

export function SignaturePad({ onClose, onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    drawing.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-[24px] bg-surface p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold tracking-wide text-text">VYBE</p>
          <button type="button" onClick={onClose} className="text-[13px] font-bold text-text-secondary">
            Close
          </button>
        </div>
        <h2 className="mt-4 text-[26px] font-extrabold tracking-tight text-text">
          Create your signature
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          Creating a digital signature is a one-time exercise. From the next contract, your signature will be reused.
        </p>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-text">Draw your signature in the box below.</p>
          <button type="button" onClick={clear} className="text-[13px] font-extrabold text-accent">
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="mt-2 h-40 w-full touch-none rounded-xl border border-border bg-white"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        <p className="mt-3 text-center text-[12px] leading-relaxed text-text-secondary">
          All the information will be used to create your digital signature on VYBE, against your VYBE account.
        </p>
        <button
          type="button"
          onClick={save}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-[15px] font-extrabold text-white"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}
