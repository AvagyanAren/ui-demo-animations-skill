// Extracted from the landing project. Needs: ProductShot (assets/ProductShot.tsx), your own html strings.
import { useEffect, useRef, useState } from "react";
import { ProductShot } from "./ProductShot";
declare const ANALYTICS_APP: string; declare const CONTRACT_1: string; declare const CONTRACT_2: string; declare const CONTRACT_3: string;

/** Numbers in the analytics screen count up from zero when it scrolls into view, like the real page does on open. */
function AnalyticsShot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items: { n: Text; src: string; v: number; pre: string; suf: string; dec: number }[] = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const src = n.nodeValue ?? "";
      const m = src.trim().match(/^([+\u2212-]?)(\d+(?:,\d+)?)(\s?%)?$/);
      if (!m || Number(m[2].replace(",", ".")) === 0) continue;
      items.push({ n: n as Text, src, v: Number(m[2].replace(",", ".")), pre: m[1], suf: m[3] ?? "", dec: m[2].includes(",") ? m[2].split(",")[1].length : 0 });
    }
    let raf = 0;
    const set = (k: number) => {
      for (const it of items) it.n.nodeValue = it.pre + (it.v * k).toFixed(it.dec).replace(".", ",") + it.suf;
    };
    set(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          set(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
          else for (const it of items) it.n.nodeValue = it.src;
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      for (const it of items) it.n.nodeValue = it.src;
    };
  }, []);
  return (
    <div ref={ref}>
      <ProductShot title="Аналитика" label="Показатели закупок: процедуры, индекс эффективности, экономия." nw={1920} nh={1080} html={ANALYTICS_APP} />
    </div>
  );
}

const CONTRACT_STEPS = [
  { html: CONTRACT_1, name: "Согласование", label: "Ожидание согласующих 0/3" },
  { html: CONTRACT_2, name: "Одобрено", label: "Договор одобрен всеми участниками" },
  { html: CONTRACT_3, name: "Отправлен", label: "Договор отправлен поставщику" },
] as const;

/** Contract flow: three real screens cross-fade while the section is on screen; chips show the step. */
function ContractShot() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(id);
        if (e.isIntersecting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          id = window.setInterval(() => setStep((s) => (s + 1) % CONTRACT_STEPS.length), 3200);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);
  return (
    <div className="cflow" ref={ref}>
      <div className="cflow__stack">
        {CONTRACT_STEPS.map((s, i) => (
          <div key={s.name} className={`cflow__layer${i === step ? " is-on" : ""}`} aria-hidden={i !== step}>
            <ProductShot title="Договор Д-26-000001" label={s.label} nw={1920} nh={1080} html={s.html} />
          </div>
        ))}
      </div>
      <div className="cflow__chips">
        {CONTRACT_STEPS.map((s, i) => (
          <button key={s.name} type="button" className={i === step ? "is-on" : ""} onClick={() => setStep(i)}>
            <i>{i + 1}</i>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
