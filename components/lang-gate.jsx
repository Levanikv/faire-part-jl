// LANGUAGE GATE — Full-height bilingual entry screen
// Franco-Georgian mariage. Subtle vine patterns, Chokha-inspired ornaments,
// flags woven in discreetly. Three languages: FR / GE / DE.

// Auto-cycling welcome line — fades the chars of the current language out,
// then fades the next language's chars in with a left-to-right stagger.
const WELCOME_WORDS = ['Bienvenue', 'მოგესალმებით', 'Willkommen'];
const WelcomeCycler = () => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % WELCOME_WORDS.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="welcome-cycler" aria-live="polite">
      {WELCOME_WORDS.map((word, i) => (
        <span key={i} className={`welcome-word ${i === idx ? 'active' : ''}`}>
          {[...word].map((ch, j) => (
            <span key={j} className="ch" style={{ '--i': j }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

const LangGate = ({ onSelect }) => {
  const [hovered, setHovered] = React.useState(null);
  const [exiting, setExiting] = React.useState(false);
  const [chosen, setChosen] = React.useState(null);

  const handle = (lang) => {
    if (exiting) return;
    // Start the panduri loop right inside the click handler so iOS Safari
    // counts it as a user-gesture-initiated playback.
    if (window.__startBgAudio) {
      try { window.__startBgAudio(); } catch (e) { /* ignore */ }
    }
    setChosen(lang);
    setExiting(true);
    // wait for exit animation
    setTimeout(() => onSelect(lang), 900);
  };

  const langs = [
    {
      code: 'fr',
      label: 'Choisissez',
      native: 'Bienvenue',
      flag: 'fr',
      tagline: 'Le mariage de Justine & Levani',
    },
    {
      code: 'ge',
      label: 'აირჩიეთ',
      native: 'მოგესალმებით',
      flag: 'ge',
      tagline: 'ჟუსტინ და ლევანის ქორწილი',
    },
    {
      code: 'de',
      label: 'Wählen',
      native: 'Willkommen',
      flag: 'de',
      tagline: 'Die Hochzeit von Justine & Levani',
    },
  ];

  return (
    <div className={`gate ${exiting ? 'exit' : ''}`} data-screen-label="00 Lang Gate">
      <style>{`
        .gate {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background:
            radial-gradient(ellipse at 50% 0%, var(--beige-light) 0%, var(--cream) 60%),
            var(--cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding:
            max(28px, env(safe-area-inset-top))
            max(20px, env(safe-area-inset-right))
            max(28px, env(safe-area-inset-bottom))
            max(20px, env(safe-area-inset-left));
          overflow: auto;
          opacity: 1;
          transition: opacity 0.6s ease;
          max-width: 480px;
          margin: 0 auto;
          gap: clamp(24px, 6vh, 44px);
        }
        .gate.exit { opacity: 0; pointer-events: none; }
        .gate > * { position: relative; z-index: 1; }

        /* === Header === */
        .gate-head {
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(12px, 2.4vh, 18px);
          margin-top: clamp(16px, 4vh, 36px);
          opacity: 0;
          animation: g-fade 1.2s 0.2s forwards cubic-bezier(.4,0,.2,1);
        }
        .gate-monogram {
          display: flex; align-items: center; justify-content: center;
          position: relative;
          padding: 6px 22px;
        }
        .gate-monogram svg {
          filter: drop-shadow(0 1px 14px rgba(247, 242, 230, 0.55));
          width: clamp(96px, 28vw, 140px);
          height: auto;
        }
        .gate-monogram::before, .gate-monogram::after {
          content: '';
          position: absolute;
          width: 14px; height: 14px;
          border-top: 1px solid var(--sage-deep);
          border-right: 1px solid var(--sage-deep);
          opacity: 0.55;
        }
        .gate-monogram::before { top: 0; right: 0; }
        .gate-monogram::after { bottom: 0; left: 0; transform: rotate(180deg); }

        .gate-meta {
          font-family: var(--sans);
          font-size: clamp(10px, 2.6vw, 11px);
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--sage-deep);
          display: flex; align-items: center; gap: 12px;
        }
        .gate-meta .dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--sage-deep); opacity: 0.6;
        }

        /* === Center prompt === */
        .gate-prompt {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(20px, 4vh, 32px);
          width: 100%;
          opacity: 0;
          animation: g-fade 1.2s 0.5s forwards cubic-bezier(.4,0,.2,1);
        }
        /* Auto-cycling Welcome — three languages overlay each other, only
           the .active one is visible; chars fade in left-to-right (stagger),
           and fade out together when becoming inactive. */
        .welcome-cycler {
          position: relative;
          width: 100%;
          height: 1.4em;
          font-family: var(--script);
          font-size: clamp(34px, 9.5vw, 46px);
          color: var(--sage-deep);
          line-height: 1.1;
          text-align: center;
          overflow: visible;
        }
        .welcome-word {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
        }
        .welcome-word .ch {
          display: inline-block;
          opacity: 0;
          transform: translateY(0.45em);
          filter: blur(8px);
          transition:
            opacity 0.55s cubic-bezier(.2,.8,.2,1),
            transform 0.55s cubic-bezier(.2,.8,.2,1),
            filter 0.55s cubic-bezier(.2,.8,.2,1);
          /* default delay = 0 so OUT fades all chars together */
          transition-delay: 0s;
        }
        .welcome-word.active .ch {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          /* IN gets a left-to-right stagger */
          transition-delay: calc(var(--i, 0) * 0.045s);
        }
        @media (prefers-reduced-motion: reduce) {
          .welcome-word .ch { transition: opacity 0.2s; transform: none; filter: none; transition-delay: 0s; }
          .welcome-word .ch { transform: none; filter: none; }
        }
        .gate-title-row {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--sans);
          font-size: clamp(9px, 2.4vw, 10px);
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.85;
        }
        .gate-title-row::before, .gate-title-row::after {
          content: ''; width: 28px; height: 1px;
          background: var(--sage-deep); opacity: 0.42;
        }

        /* === Language buttons === */
        .gate-langs {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 12px;
        }
        .lang-btn {
          appearance: none;
          background: rgba(247, 242, 230, 0.7);
          border: 1px solid var(--rule);
          border-radius: 6px;
          padding: 16px 18px;
          min-height: 64px;
          display: grid;
          grid-template-columns: 36px 1fr auto;
          gap: 16px;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: background .35s ease, border-color .35s ease, transform .35s cubic-bezier(.4,0,.2,1);
          opacity: 0;
          transform: translateY(18px);
          animation: g-up 0.85s forwards cubic-bezier(.2,.8,.2,1);
        }
        .lang-btn:nth-child(1) { animation-delay: 0.7s; }
        .lang-btn:nth-child(2) { animation-delay: 0.83s; }
        .lang-btn:nth-child(3) { animation-delay: 0.96s; }

        .lang-btn:active {
          transform: scale(0.985);
          background: var(--beige-light);
        }
        @media (hover: hover) {
          .lang-btn:hover {
            background: var(--beige-light);
            border-color: var(--sage-deep);
          }
          .lang-btn:hover .arrow { transform: translateX(4px); }
        }

        .lang-btn.chosen {
          background: var(--sage-deep);
          border-color: var(--sage-deep);
          color: var(--cream);
        }
        .lang-btn.chosen .lang-native,
        .lang-btn.chosen .lang-tag,
        .lang-btn.chosen .arrow { color: var(--cream); }

        .lang-flag-mark {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid var(--sage-deep);
          display: flex; align-items: center; justify-content: center;
          background: var(--cream);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(31, 36, 25, 0.08);
        }
        .lang-flag-mark svg { width: 100%; height: 100%; display: block; }

        .lang-info {
          display: flex; flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .lang-native {
          font-family: var(--display);
          font-size: clamp(22px, 6vw, 26px);
          line-height: 1.05;
          color: var(--ink);
          letter-spacing: 0.01em;
        }
        .lang-tag {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.85;
        }
        .arrow {
          font-family: var(--display);
          font-size: 22px;
          color: var(--sage-deep);
          transition: transform 0.4s ease;
        }

        /* === Foot === */
        .gate-foot {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px;
          margin-bottom: 4px;
          opacity: 0;
          animation: g-fade 1.2s 1.2s forwards cubic-bezier(.4,0,.2,1);
        }
        .gate-flags {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--sans);
          font-size: clamp(9px, 2.4vw, 10px);
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--sage-deep);
        }
        .gate-flags svg {
          width: 28px; height: 19px;
          display: block;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(31, 36, 25, 0.18);
        }
        .gate-foot .date {
          font-family: var(--display);
          font-size: clamp(15px, 4.2vw, 17px);
          color: var(--ink);
          letter-spacing: 0.08em;
        }

        @keyframes g-fade { to { opacity: 1; } }
        @keyframes g-up   { to { opacity: 1; transform: translateY(0); } }

        .gate.exit .gate-langs { transform: translateY(-10px); transition: transform 0.7s ease, opacity 0.6s ease; opacity: 0.4; }
        .gate.exit .lang-btn.chosen { opacity: 1; transform: scale(1.015); }

        /* Honour reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .gate-head, .gate-prompt, .gate-foot, .lang-btn { animation: none !important; opacity: 1 !important; transform: none !important; }
          .lang-btn { transition: background 0.2s, border-color 0.2s; }
        }
      `}</style>

      <div className="gate-head">
        <div className="gate-monogram" aria-label="Justine et Levani">
          {window.MonoLogo && <window.MonoLogo size={120} ink="var(--ink)" accent="var(--sage-deep)" />}
        </div>
      </div>

      <div className="gate-prompt">
        <WelcomeCycler />

        <div className="gate-langs">
          {langs.map((l) => (
            <button
              key={l.code}
              className={`lang-btn ${chosen === l.code ? 'chosen' : ''}`}
              onClick={() => handle(l.code)}
              onMouseEnter={() => setHovered(l.code)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Choisir ${l.label}`}
            >
              <span className="lang-flag-mark">
                <FlagDisc code={l.flag} />
              </span>
              <span className="lang-info">
                <span className="lang-native">{l.native}</span>
                <span className="lang-tag">{l.label}</span>
              </span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="gate-foot">
        <div className="gate-flags">
          <span>Franco · Géorgien</span>
        </div>
        <div className="date">05-06 septembre 2026</div>
      </div>
    </div>
  );
};

// Tiny flag components — sage-tinted to fit palette
const FlagDisc = ({ code }) => {
  if (code === 'fr') {
    return (
      <svg viewBox="0 0 30 30">
        <clipPath id={`c-${code}`}><circle cx="15" cy="15" r="14" /></clipPath>
        <g clipPath={`url(#c-${code})`}>
          <rect x="0"  y="0" width="10" height="30" fill="#0055A4" />
          <rect x="10" y="0" width="10" height="30" fill="#FFFFFF" />
          <rect x="20" y="0" width="10" height="30" fill="#EF4135" />
        </g>
      </svg>
    );
  }
  if (code === 'ge') {
    return (
      <svg viewBox="0 0 30 30">
        <clipPath id={`c-${code}`}><circle cx="15" cy="15" r="14" /></clipPath>
        <g clipPath={`url(#c-${code})`}>
          <rect x="0" y="0" width="30" height="30" fill="#FFFFFF" />
          {/* Saint George cross — central red bands */}
          <rect x="13" y="0"  width="4"  height="30" fill="#FF0000" />
          <rect x="0"  y="13" width="30" height="4"  fill="#FF0000" />
          {/* 4 Bolnisi crosses in the quadrants */}
          {[[7.5,7.5],[22.5,7.5],[7.5,22.5],[22.5,22.5]].map(([x,y],i)=>(
            <g key={i} transform={`translate(${x} ${y})`} stroke="#FF0000" strokeWidth="0.9" fill="none" strokeLinecap="square">
              <path d="M-2.4 0 L-0.9 0 M0.9 0 L2.4 0 M0 -2.4 L0 -0.9 M0 0.9 L0 2.4" />
              <path d="M-0.9 -0.9 L0.9 -0.9 M-0.9 0.9 L0.9 0.9 M-0.9 -0.9 L-0.9 0.9 M0.9 -0.9 L0.9 0.9" />
            </g>
          ))}
        </g>
      </svg>
    );
  }
  if (code === 'de') {
    return (
      <svg viewBox="0 0 30 30">
        <clipPath id={`c-${code}`}><circle cx="15" cy="15" r="14" /></clipPath>
        <g clipPath={`url(#c-${code})`}>
          <rect x="0" y="0"  width="30" height="10" fill="#000000" />
          <rect x="0" y="10" width="30" height="10" fill="#DD0000" />
          <rect x="0" y="20" width="30" height="10" fill="#FFCE00" />
        </g>
      </svg>
    );
  }
  return null;
};

const FlagFR = () => (
  <svg width="26" height="18" viewBox="0 0 18 12">
    <rect x="0"  y="0" width="6" height="12" fill="#0055A4" />
    <rect x="6"  y="0" width="6" height="12" fill="#FFFFFF" />
    <rect x="12" y="0" width="6" height="12" fill="#EF4135" />
  </svg>
);
const FlagGE = () => (
  <svg width="26" height="18" viewBox="0 0 18 12">
    <rect width="18" height="12" fill="#FFFFFF" />
    <rect x="8" y="0" width="2"  height="12" fill="#FF0000" />
    <rect x="0" y="5" width="18" height="2"  fill="#FF0000" />
    {/* 4 small Bolnisi crosses */}
    {[[4.5,2.5],[13.5,2.5],[4.5,9.5],[13.5,9.5]].map(([x,y],i)=>(
      <g key={i} transform={`translate(${x} ${y})`} stroke="#FF0000" strokeWidth="0.5" fill="none">
        <path d="M-1.4 0 L-0.5 0 M0.5 0 L1.4 0 M0 -1.4 L0 -0.5 M0 0.5 L0 1.4" />
      </g>
    ))}
  </svg>
);

window.LangGate = LangGate;
