// HERO — Photo grid backdrop + auto entrance + scroll-driven exit.
// Sequence on mount:
//   1) 12 photos cascade in (alternating columns, top/bot stagger)
//   2) Grid settles (scale 0.96) and a cream veil thickens
//   3) Countdown → Names → Date reveal in blur cascade
// Then on scroll (pinned for 110% of viewport):
//   - Cols 0/2 disperse outward, col 1 splits up/down
//   - Whole grid scales 1.5, blurs, fades
//   - Overlay text drifts up + blurs out

const { useState, useEffect, useRef } = React;

// Hook: track if element is in viewport (with progress 0-1) — used by other scenes
function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.15, ...options });
    obs.observe(el);

    const onScroll = () => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const seen = vh - r.top;
      const p = Math.max(0, Math.min(1, seen / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  return [inView, progress];
}
window.useInView = useInView;

function useCountdown(targetDate) {
  const [tl, setTl] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) { setTl({ d: 0, h: 0, m: 0, s: 0 }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff % 86400000 / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      const s = Math.floor(diff % 60000 / 1000);
      setTl({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return tl;
}

// Photo data lives in i18n.jsx (per-language labels). Aspect-ratios + tones
// stay identical across languages so the visual rhythm is preserved.

const Hero = () => {
  const ref = useRef(null);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const centerRef = useRef(null);
  const titleRef = useRef(null);   // wrapper that gets the yPercent recenter
  const logoRef = useRef(null);
  const eyebrowRef = useRef(null); // "Le mariage de"
  const namesRef = useRef(null);   // Justine & Levani
  const gridRef = useRef(null);
  const cdRowRef = useRef(null);
  const dateRef = useRef(null);
  const cd = useCountdown(new Date('2026-09-05T15:00:00+02:00'));
  const t = window.useT();
  const tc = t.common;
  const th = t.hero;

  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const ST = window.ScrollTrigger;

    const block   = ref.current;
    const wrapper = wrapperRef.current;
    const center  = centerRef.current;
    const title   = titleRef.current;
    const grid    = gridRef.current;
    // Title (centered) — eyebrow + names blur in inside the title wrapper.
    // Sub elements (top cluster: logo + countdown, bottom: date) fade in around it.
    const titleEls = [eyebrowRef.current, namesRef.current].filter(Boolean);
    const subEls  = [logoRef.current, cdRowRef.current, dateRef.current].filter(Boolean);
    if (!block || !grid || !title || !center) return;

    // Lenis smooth scroll (shared across the page)
    if (window.Lenis && !window.__lenis) {
      const lenis = new window.Lenis({ lerp: 0.08, wheelMultiplier: 1.1 });
      window.__lenis = lenis;
      lenis.on('scroll', ST.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Group photos by their column wrapper.
    const colWrappers = Array.from(grid.querySelectorAll('.hp-col'));
    const cols = colWrappers.map((c) => Array.from(c.querySelectorAll('.hp-item')));
    const items = cols.flat();

    // Initial state — every text hidden + blurred. The title wrapper does NOT
    // get a yPercent offset: it sits at its true center so each child blurs in
    // exactly where it'll live, no slide.
    gsap.set(subEls,   { opacity: 0, filter: 'blur(18px)', pointerEvents: 'none' });
    gsap.set(titleEls, { opacity: 0, filter: 'blur(18px)' });

    // Lock scroll during the auto-play — released on master complete.
    const prevOverflow = document.body.style.overflow;
    if (window.__lenis) window.__lenis.stop();
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // ---- gridReveal — prolonged for a smoother, more deliberate cascade ----
    const gridReveal = () => {
      const tl = gsap.timeline();
      const wh = window.innerHeight;
      const dy = wh - (wh - grid.offsetHeight) / 2;
      cols.forEach((col, i) => {
        const fromTop = i % 2 === 0;
        tl.from(col, {
          y: dy * (fromTop ? -1 : 1),
          duration: 1.6,
          stagger: { each: 0.08, from: fromTop ? 'end' : 'start' },
          ease: 'power1.inOut',
        }, 'reveal');
      });
      return tl;
    };

    // ---- gridZoom — prolonged so the separation has more presence ----
    const gridZoom = () => {
      const tl = gsap.timeline({ defaults: { duration: 1.6, ease: 'power3.inOut' } });
      tl.to(grid, { scale: 1.85 });
      tl.to(cols[0], { xPercent: -38 }, '<');
      tl.to(cols[2], { xPercent:  38 }, '<');
      tl.to(cols[1], {
        yPercent: (idx) => (idx < Math.floor(cols[1].length / 2) ? -1 : 1) * 36,
        duration: 0.85, ease: 'power1.inOut',
      }, '-=0.85');
      return tl;
    };

    // ---- toggleContent — pure blur-out reveal in place (no slide).
    //      Each title child blurs in with a light stagger; sub elements (countdown,
    //      date) blur in too. Fires during the last stretch of gridZoom so the texts
    //      land exactly as the photos finish their separation. ----
    const toggleContent = () => {
      const tl = gsap.timeline({ defaults: { overwrite: true } });
      tl.to(titleEls, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.14,
        ease: 'power2.out',
      }, 0);
      tl.to(subEls, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power2.out',
        pointerEvents: 'all',
      }, 0.05);
      return tl;
    };

    // ---- Master — prolonged photo timing, texts join during the spread's tail ----
    const master = gsap.timeline({
      delay: 0.35,
      onComplete: () => {
        document.body.style.overflow = prevOverflow;
        if (window.__lenis) window.__lenis.start();
      },
    });
    master
      .add(gridReveal())
      .add(gridZoom(),       '-=0.85')
      .add(toggleContent(),  '-=0.95')   // texts begin blur-out as photos are separating
      .to(grid, { opacity: 0.2, duration: 1.0, ease: 'power2.inOut' }, '-=0.4');

    return () => {
      master.kill();
      document.body.style.overflow = prevOverflow;
      if (window.__lenis) window.__lenis.start();
      gsap.set(
        [grid, wrapper, title, ...titleEls, ...subEls, ...items],
        { clearProps: 'all' }
      );
    };
  }, []);

  return (
    <section className="scene hero" ref={ref} data-screen-label="01 Hero">
      <style>{`
        /* Single-viewport hero — animation is auto-played on mount. */
        .hero {
          background: var(--cream);
          padding: 0 !important;
          gap: 0;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          min-height: 100vh !important;
          min-height: 100svh !important;
          min-height: 100dvh !important;
          display: block !important;
          overflow: visible;
          position: relative;
        }
        .hero-wrapper {
          position: relative;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          width: 100%;
          padding: 0 20px;
          overflow: hidden;
          background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 65%, var(--beige) 100%);
        }

        /* Centered text content layer — top cluster (logo + countdown),
           title group (names) absolutely centered, date pinned to the bottom. */
        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          text-align: center;
          pointer-events: none;
        }
        .hero-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
        }
        .hero-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          will-change: transform;
        }
        .hero-eyebrow {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--sage-deep);
          padding-left: 0.5em;
          will-change: opacity, filter, transform;
        }

        /* Photo grid — uniform 3 columns (matches the gallery), masonry comes
           from per-photo aspect ratios. Absolutely centered so GSAP can scale/spread. */
        .hero-grid-abs {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: min(360px, calc(100vw - 40px));
          z-index: 1;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 10px;
          align-items: start;
          will-change: transform, filter, opacity;
        }
        .hp-col {
          display: flex;
          flex-direction: column;
          row-gap: 12px;
          will-change: transform;
        }

        .hp-item {
          position: relative;
          width: 100%;
          /* aspect-ratio applied per-photo via inline style */
          overflow: hidden;
          border-radius: 2px;
          background: var(--beige-deep);
          border: 1px solid var(--rule);
          will-change: transform, opacity;
        }
        /* Tone fallback shown while the JPEG loads */
        .hp-fill {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 28% 32%, rgba(255,255,255,0.55) 0%, transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.10) 0%, transparent 55%),
            linear-gradient(135deg, var(--ph-tone) 0%, var(--beige-deep) 100%);
          z-index: 0;
        }
        .hp-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          z-index: 1;
          /* Subtle warm grade so the masonry feels cohesive */
          filter: saturate(0.95) contrast(1.02);
        }
        .hp-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='1'/><feColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.43 0 0 0 0 0.33 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          mix-blend-mode: multiply;
          opacity: 0.32;
          z-index: 2;
          pointer-events: none;
        }
        .hp-tag {
          position: absolute;
          left: 6px; right: 6px; bottom: 6px;
          display: flex; justify-content: space-between; align-items: baseline; gap: 6px;
          font-family: var(--sans);
          font-size: 6px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(247, 242, 230, 0.95);
          text-shadow: 0 1px 4px rgba(31, 36, 25, 0.5);
          z-index: 3;
        }
        .hp-tag .hp-lbl {
          font-family: var(--serif);
          font-style: italic;
          text-transform: none;
          letter-spacing: 0.01em;
          font-size: 8px;
        }

        /* Top cluster — JL monogram stacked above the countdown, absolutely
           pinned to the top of the viewport with safe-area padding. */
        .hero-top {
          position: absolute;
          top: max(40px, env(safe-area-inset-top));
          left: 0; right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          will-change: opacity, transform, filter;
        }
        .hero-logo {
          display: flex; align-items: center; justify-content: center;
        }
        .hero-logo svg {
          filter: drop-shadow(0 1px 12px rgba(247, 242, 230, 0.6));
        }

        .hero-cd-row {
          display: flex; align-items: baseline; justify-content: center;
          gap: 16px;
          font-family: var(--sans);
          font-size: 11px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--sage-deep);
        }
        .hero-cd-row .cd-pair { display: inline-flex; align-items: baseline; gap: 5px; }
        .hero-cd-row .num {
          font-family: var(--display);
          font-size: 18px;
          letter-spacing: 0;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .hero-cd-row .dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--sage-deep);
          opacity: 0.5;
          align-self: center;
          transform: translateY(-2px);
        }

        /* Names block — animates blur-in independently of the eyebrow above */
        .hero-names {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          margin: 0;
          text-shadow: 0 1px 0 rgba(247, 242, 230, 0.4);
          will-change: opacity, filter, transform;
        }
        .hero-names .names-display {
          font-family: var(--display);
          font-weight: 400;
          color: var(--ink);
          line-height: 0.92;
          letter-spacing: -0.01em;
          display: flex; flex-direction: column; align-items: center;
          gap: 2px;
        }
        .hero-names .first,
        .hero-names .second {
          font-size: clamp(64px, 17vw, 96px);
        }
        .hero-names .et {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(32px, 9vw, 50px);
          color: var(--sage-deep);
          line-height: 1;
          margin: 2px 0;
        }

        /* Date — absolutely pinned to the bottom of the viewport, slightly larger */
        .hero-date {
          position: absolute;
          bottom: max(40px, env(safe-area-inset-bottom));
          left: 0; right: 0;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          will-change: opacity;
        }
        .hero-date .date-row {
          display: flex; align-items: center; justify-content: center;
          gap: 16px;
          font-family: var(--serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(26px, 6.8vw, 34px);
          color: var(--ink-soft);
          letter-spacing: 0.01em;
        }
        .hero-date .date-row .num {
          font-family: var(--display);
          font-style: normal;
          font-size: 1.08em;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .hero-date .date-row .dash {
          width: 22px; height: 1px;
          background: var(--sage-deep);
          opacity: 0.5;
        }
        .hero-date .place {
          font-family: var(--sans);
          font-size: 11px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.85;
          padding-left: 0.42em;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-grid { will-change: auto; }
        }
      `}</style>

      <div className="hero-wrapper" ref={wrapperRef}>
        <div className="hero-content" ref={contentRef}>
          <div className="hero-top">
            <div className="hero-logo" ref={logoRef} aria-label={tc.a11y_couple}>
              {window.MonoLogo && <window.MonoLogo size={68} ink="var(--ink)" accent="var(--sage-deep)" />}
            </div>
            <div className="hero-cd-row" ref={cdRowRef} aria-label={tc.a11y_countdown}>
              <span className="cd-pair"><span className="num">{String(cd.d).padStart(2,'0')}</span>{th.cd_d}</span>
              <span className="dot" />
              <span className="cd-pair"><span className="num">{String(cd.h).padStart(2,'0')}</span>{th.cd_h}</span>
              <span className="dot" />
              <span className="cd-pair"><span className="num">{String(cd.m).padStart(2,'0')}</span>{th.cd_m}</span>
              <span className="dot" />
              <span className="cd-pair"><span className="num">{String(cd.s).padStart(2,'0')}</span>{th.cd_s}</span>
            </div>
          </div>

          <div className="hero-center" ref={centerRef}>
            <div className="hero-title" ref={titleRef}>
              <div className="hero-eyebrow" ref={eyebrowRef}>{th.eyebrow}</div>
              <div className="hero-names" ref={namesRef}>
                <div className="names-display">
                  <span className="first">{tc.bride}</span>
                  <span className="et">&amp;</span>
                  <span className="second">{tc.groom}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-date" ref={dateRef}>
            <div className="date-row">
              <span className="num">{tc.date_day}</span>
              <span>{tc.date_month}</span>
              <span className="dash" />
              <span className="num">{tc.date_year}</span>
            </div>
            <div className="place">{tc.place}</div>
          </div>
        </div>

        <div className="hero-grid-abs">
          <div className="hero-grid" ref={gridRef}>
            {[0, 1, 2].map((ci) => (
              <div key={ci} className="hp-col">
                {th.photos.filter((_, i) => i % 3 === ci).map((p, j) => (
                  <div
                    key={`${ci}-${j}`}
                    className="hp-item"
                    style={{ '--ph-tone': p.tone, aspectRatio: p.ar }}
                  >
                    <span className="hp-fill" />
                    {p.src && (
                      <img
                        className="hp-img"
                        src={p.src}
                        alt={`${p.lbl} — ${p.d}`}
                        loading="eager"
                        decoding="async"
                        draggable="false"
                      />
                    )}
                    <span className="hp-grain" />
                    <div className="hp-tag">
                      <span className="hp-lbl">{p.lbl}</span>
                      <span>{p.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

window.Hero = Hero;
