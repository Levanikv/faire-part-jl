// HERO — Opening scene
// Editorial date treatment inspired by didone display layouts:
// "RETENEZ LA DATE" → "05 / Septembre / 26" stacked, then names + countdown.

const { useState, useEffect, useRef } = React;

// Hook: track if element is in viewport (with progress 0-1)
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

    return () => {obs.disconnect();window.removeEventListener('scroll', onScroll);};
  }, []);

  return [inView, progress];
}

window.useInView = useInView;

function useCountdown(targetDate) {
  const [tl, setTl] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) {setTl({ d: 0, h: 0, m: 0, s: 0 });return;}
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

const Hero = () => {
  const ref = useRef(null);
  const cd = useCountdown(new Date('2026-09-05T15:00:00+02:00'));

  return (
    <section className="scene hero" ref={ref} data-screen-label="01 Hero">
      <style>{`
        .hero {
          background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 60%, var(--beige) 100%);
          align-items: stretch;
          justify-content: space-between;
          padding-top: 36px;
          padding-bottom: 56px;
          overflow: hidden;
          gap: 0;
          position: relative;
        }

        /* Top band — subtle countdown strip --------------------------------- */
        .hero-top {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          opacity: 0; transform: translateY(-8px);
          animation: heroFadeDown 1.2s 0.1s forwards cubic-bezier(.4,0,.2,1);
        }
        .hero-cd-strip {
          display: flex; align-items: baseline; justify-content: center;
          gap: 14px;
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.7;
        }
        .hero-cd-strip .cd-pair { display: inline-flex; align-items: baseline; gap: 5px; }
        .hero-cd-strip .num {
          font-family: var(--display);
          font-size: 16px;
          letter-spacing: 0;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          opacity: 0.85;
        }
        .hero-cd-strip .dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--sage-deep);
          opacity: 0.4;
          align-self: center;
          transform: translateY(-2px);
        }

        /* Names — primary focus -------------------------------------------- */
        .hero-names-primary {
          display: flex; flex-direction: column; align-items: center;
          width: 100%;
          padding: 24px 0 22px;
          position: relative;
          gap: 10px;
        }
        .hero-names-primary .who {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0;
          animation: heroFadeUp 1s 0.3s forwards;
          padding-left: 0.5em;
        }
        .hero-names-primary .names-display {
          font-family: var(--display);
          font-weight: 400;
          color: var(--ink);
          line-height: 0.92;
          text-align: center;
          letter-spacing: -0.01em;
          display: flex; flex-direction: column; align-items: center;
          gap: 2px;
        }
        .hero-names-primary .names-display .first {
          font-size: clamp(72px, 20vw, 108px);
          opacity: 0;
          transform: translateY(18px);
          animation: heroRise 1.4s 0.55s forwards cubic-bezier(.2,.8,.2,1);
        }
        .hero-names-primary .names-display .et {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 10vw, 56px);
          color: var(--sage-deep);
          line-height: 1;
          margin: 4px 0;
          opacity: 0;
          animation: heroFadeIn 1.2s 0.95s forwards;
        }
        .hero-names-primary .names-display .second {
          font-size: clamp(72px, 20vw, 108px);
          opacity: 0;
          transform: translateY(18px);
          animation: heroRise 1.4s 1.15s forwards cubic-bezier(.2,.8,.2,1);
        }

        /* Date — softer, secondary ----------------------------------------- */
        .hero-datemark {
          display: flex; flex-direction: column; align-items: center;
          width: 100%;
          padding: 18px 0 8px;
          position: relative;
          opacity: 0;
          animation: heroFadeUp 1.2s 1.6s forwards;
        }
        .hero-datemark .date-row {
          display: flex; align-items: center; justify-content: center;
          gap: 14px;
          font-family: var(--serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(20px, 5.4vw, 26px);
          color: var(--ink-soft);
          letter-spacing: 0.01em;
        }
        .hero-datemark .date-row .num {
          font-family: var(--display);
          font-style: normal;
          font-size: 1.05em;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .hero-datemark .date-row .dash {
          width: 18px; height: 1px;
          background: var(--sage-deep);
          opacity: 0.5;
        }
        .hero-datemark .place {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.7;
          margin-top: 12px;
          padding-left: 0.4em;
        }



        /* Animations -------------------------------------------------------- */
        @keyframes heroRise   { to { opacity: 1; transform: translateY(0); } }
        @keyframes heroFadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes heroFadeDown { to { opacity: 1; transform: translateY(0); } }
        @keyframes heroFadeIn { to { opacity: 1; } }

        .hero-petal {
          position: absolute;
          color: var(--sage-deep);
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>

      <div className="hero-top">
        <div className="hero-cd-strip" aria-label="Compte à rebours">
          <span className="cd-pair"><span className="num">{String(cd.d).padStart(2,'0')}</span>j</span>
          <span className="dot" />
          <span className="cd-pair"><span className="num">{String(cd.h).padStart(2,'0')}</span>h</span>
          <span className="dot" />
          <span className="cd-pair"><span className="num">{String(cd.m).padStart(2,'0')}</span>m</span>
          <span className="dot" />
          <span className="cd-pair"><span className="num">{String(cd.s).padStart(2,'0')}</span>s</span>
        </div>
        <RingsLogo size={56} />
      </div>

      <Sprig size={28} color="var(--sage-deep)" className="hero-petal" style={{ top: '18%', left: '6%', transform: 'rotate(-22deg)', opacity: 0.28 }} />
      <Sprig size={32} color="var(--sage-deep)" className="hero-petal" style={{ top: '22%', right: '4%', transform: 'rotate(28deg) scaleX(-1)', opacity: 0.22 }} />

      <div className="hero-names-primary">
        <div className="who">Le mariage de</div>
        <div className="names-display">
          <span className="first">Justine</span>
          <span className="et">&amp;</span>
          <span className="second">Levani</span>
        </div>
      </div>

      <div className="hero-datemark">
        <div className="date-row">
          <span className="num">05</span>
          <span>septembre</span>
          <span className="dash" />
          <span className="num">2026</span>
        </div>
        <div className="place">Paris · Chaumont-sur-Yonne</div>
      </div>
    </section>);

};

window.Hero = Hero;