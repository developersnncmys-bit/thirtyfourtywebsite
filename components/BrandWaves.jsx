"use client";
import { useEffect, useRef } from "react";

// Port of the app's BrandWaves widget (Custom_Widgets/brand_waves.dart):
// green and gold ribbons with a glowing line, looping every 8 seconds.
// Pauses while off screen and stays still for reduced-motion users.
export default function BrandWaves({ dark = true, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const y = (t, x, base, amp, freq, speed, shift) =>
      h * base +
      amp * Math.sin((2 * Math.PI * freq * x) / w + speed * t + shift) +
      amp * 0.35 * Math.sin((2 * Math.PI * freq * 2.1 * x) / w - speed * t + shift * 1.7);

    const trace = (t, base, amp, freq, speed, shift, closed) => {
      ctx.beginPath();
      if (closed) ctx.moveTo(0, h);
      for (let x = 0; x <= w + 6; x += 6) {
        const yy = y(t, x, base, amp, freq, speed, shift);
        if (x === 0 && !closed) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      if (closed) {
        ctx.lineTo(w, h);
        ctx.closePath();
      }
    };

    const draw = (now) => {
      const t = (((now - start) / 8000) % 1) * 2 * Math.PI;
      const a = dark ? 1 : 0.32;
      const amp = Math.max(1, h / 220); // the app draws on a phone; scale up for wide screens
      ctx.clearRect(0, 0, w, h);

      let g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgba(47,180,99,${0.35 * a})`);
      g.addColorStop(1, `rgba(14,122,58,${0.15 * a})`);
      trace(t, 0.3, 18 * amp, 0.9, 1, 0, true);
      ctx.fillStyle = g;
      ctx.fill();

      g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, `rgba(155,212,58,${0.45 * a})`);
      g.addColorStop(0.5, `rgba(253,208,2,${0.6 * a})`);
      g.addColorStop(1, `rgba(184,224,74,${0.45 * a})`);
      trace(t, 0.46, 22 * amp, 0.75, -1, 1.4, true);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = dark ? `rgba(233,247,176,${0.35 * a})` : `rgba(78,138,46,${0.5 * a})`;
      for (let i = 0; i < 6; i++) {
        trace(t, 0.36 + i * 0.04, (16 + i * 2) * amp, 0.8, i % 2 ? -1 : 1, 0.5 + i * 0.45, false);
        ctx.stroke();
      }

      trace(t, 0.5, 20 * amp, 0.75, -1, 1.4, false);
      ctx.save();
      ctx.shadowColor = `rgba(253,208,2,${0.8 * a})`;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(253,208,2,${0.55 * a})`;
      ctx.stroke();
      ctx.restore();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(255,243,160,${0.9 * a})`;
      ctx.stroke();

      if (dark) {
        g = ctx.createLinearGradient(0, h * 0.6, 0, h);
        g.addColorStop(0, "#0B6B33");
        g.addColorStop(1, "#013516");
      } else {
        g = ctx.createLinearGradient(0, h * 0.6, 0, h);
        g.addColorStop(0, "rgba(125,186,90,.35)");
        g.addColorStop(1, "rgba(201,220,134,.45)");
      }
      trace(t, 0.68, 16 * amp, 1.1, 1, 3, true);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const loop = (now) => {
      draw(now);
      if (visible && !still) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(start);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [dark]);

  return <canvas ref={ref} className={`brand-waves ${className}`} aria-hidden="true" />;
}
