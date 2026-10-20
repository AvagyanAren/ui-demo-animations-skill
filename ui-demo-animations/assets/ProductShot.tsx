import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  html: string;
  /** natural width of the markup */
  nw: number;
  /** natural height; measured from the markup when omitted */
  nh?: number;
  title?: string;
  label: string;
  bare?: boolean;
};

/** A static, scaled copy of a real product screen. */
export function ProductShot({ html, nw, nh, title, label, bare }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.5);
  const [h, setH] = useState(nh ?? 400);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    const layer = layerRef.current;
    if (!el || !layer) return;
    const fit = () => {
      setK(el.clientWidth / nw);
      if (!nh) setH(layer.offsetHeight);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    if (!nh) ro.observe(layer);
    return () => ro.disconnect();
  }, [nw, nh]);

  return (
    <div className={`shot${bare ? " shot--bare" : ""}`} role="img" aria-label={label}>
      {!bare && (
        <div className="shot__bar" aria-hidden>
          <span className="shot__dots">
            <i />
            <i />
            <i />
          </span>
          {title && <span className="shot__title">{title}</span>}
        </div>
      )}
      <div className="shot__body" ref={bodyRef} style={{ height: h * k }} aria-hidden>
        <div
          className="shot__layer"
          ref={layerRef}
          style={{ width: nw, height: nh, transform: `scale(${k})` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
