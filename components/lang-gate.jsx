// LANGUAGE GATE — Full-height bilingual entry screen
// Franco-Georgian mariage. Subtle vine patterns, Chokha-inspired ornaments,
// flags woven in discreetly. Three languages: FR / GE / DE.

const LangGate = ({ onSelect }) => {
  const [hovered, setHovered] = React.useState(null);
  const [exiting, setExiting] = React.useState(false);
  const [chosen, setChosen] = React.useState(null);

  const handle = (lang) => {
    if (exiting) return;
    setChosen(lang);
    setExiting(true);
    // wait for exit animation
    setTimeout(() => onSelect(lang), 900);
  };

  const langs = [
    {
      code: 'fr',
      label: 'Français',
      native: 'Bienvenue',
      flag: 'fr',
      tagline: 'Le mariage de Justine & Levani',
    },
    {
      code: 'ge',
      label: 'ქართული',
      native: 'მოგესალმებით',
      flag: 'ge',
      tagline: 'ჟუსტინ და ლევანის ქორწილი',
    },
    {
      code: 'de',
      label: 'Deutsch',
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
          background: var(--cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 36px 24px 32px;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.6s ease;
          max-width: 480px;
          margin: 0 auto;
        }
        .gate.exit {
          opacity: 0;
          pointer-events: none;
        }

        /* === Background pattern: vines + Chokha ornaments === */
        .gate-pattern {
          position: absolute; inset: 0;
          pointer-events: none;
          opacity: 0.28;
          z-index: 0;
        }
        .gate-pattern svg {
          position: absolute;
          color: var(--sage-deep);
        }

        /* Tile vine pattern */
        .vine-bg {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><g fill='none' stroke='%235c6e54' stroke-width='0.8' stroke-linecap='round' opacity='0.35'><path d='M60 0 C 50 20, 70 40, 60 60 C 50 80, 70 100, 60 120'/><path d='M60 20 C 70 18, 78 22, 80 30 C 78 24, 72 22, 66 26'/><path d='M60 40 C 50 38, 42 42, 40 50 C 42 44, 48 42, 54 46'/><path d='M60 60 C 70 58, 78 62, 80 70 C 78 64, 72 62, 66 66'/><path d='M60 80 C 50 78, 42 82, 40 90 C 42 84, 48 82, 54 86'/><path d='M60 100 C 70 98, 78 102, 80 110'/><circle cx='80' cy='30' r='2' fill='%235c6e54'/><circle cx='40' cy='50' r='2' fill='%235c6e54'/><circle cx='80' cy='70' r='2' fill='%235c6e54'/><circle cx='40' cy='90' r='2' fill='%235c6e54'/></g></svg>");
          background-size: 120px 120px;
          opacity: 0.45;
        }

        /* Chokha-inspired ornament — repeating diamond chain at top & bottom */
        .chokha-band {
          position: absolute; left: 0; right: 0;
          height: 28px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 28' width='80' height='28'><g fill='none' stroke='%233d4a36' stroke-width='1' stroke-linecap='round'><path d='M0 14 L80 14' opacity='0.4'/><path d='M40 4 L50 14 L40 24 L30 14 Z'/><path d='M40 8 L46 14 L40 20 L34 14 Z' opacity='0.5'/><circle cx='40' cy='14' r='1.5' fill='%233d4a36'/><path d='M5 14 L15 14 M65 14 L75 14' opacity='0.5'/><circle cx='10' cy='14' r='1' fill='%233d4a36' opacity='0.6'/><circle cx='70' cy='14' r='1' fill='%233d4a36' opacity='0.6'/></g></svg>");
          background-size: 80px 28px;
          opacity: 0.7;
        }
        .chokha-top { top: 0; }
        .chokha-bottom { bottom: 0; transform: scaleY(-1); }

        .gate > * { position: relative; z-index: 1; }

        /* === Header === */
        .gate-head {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          padding-top: 36px;
          opacity: 0;
          animation: g-fade 1.2s 0.2s forwards cubic-bezier(.4,0,.2,1);
        }
        .gate-monogram {
          width: 88px; height: 88px;
          border-radius: 50%;
          border: 1px solid var(--sage-deep);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--display);
          font-size: 32px;
          color: var(--sage-deep);
          position: relative;
        }
        .gate-monogram::before, .gate-monogram::after {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-top: 1px solid var(--sage-deep);
          border-right: 1px solid var(--sage-deep);
        }
        .gate-monogram::before { top: -1px; right: -1px; }
        .gate-monogram::after { bottom: -1px; left: -1px; transform: rotate(180deg); }

        .gate-monogram .amp {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 22px;
          color: var(--sage);
          margin: 0 2px;
          align-self: end;
          padding-bottom: 6px;
        }

        .gate-meta {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.8;
          display: flex; align-items: center; gap: 10px;
        }
        .gate-meta .dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: var(--sage-deep);
          opacity: 0.6;
        }

        /* === Center prompt === */
        .gate-prompt {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          width: 100%;
          padding: 16px 0;
          opacity: 0;
          animation: g-fade 1.2s 0.5s forwards cubic-bezier(.4,0,.2,1);
        }
        .gate-script {
          font-family: var(--script);
          font-size: 36px;
          color: var(--sage-deep);
          line-height: 1;
        }
        .gate-title-row {
          display: flex; align-items: center; gap: 12px;
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .gate-title-row::before, .gate-title-row::after {
          content: ''; width: 24px; height: 1px;
          background: var(--sage-deep); opacity: 0.4;
        }

        /* === Language list === */
        .gate-langs {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 10px;
        }
        .lang-btn {
          appearance: none;
          background: rgba(247, 242, 230, 0.6);
          border: 1px solid var(--rule);
          padding: 18px 20px;
          display: grid;
          grid-template-columns: 36px 1fr auto;
          gap: 16px;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: background 0.4s ease, border-color 0.4s ease, transform 0.4s cubic-bezier(.4,0,.2,1);
          opacity: 0;
          transform: translateY(20px);
          animation: g-up 0.9s forwards cubic-bezier(.2,.8,.2,1);
          position: relative;
          overflow: hidden;
        }
        .lang-btn::before {
          /* subtle vine corner ornament */
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 40px; height: 40px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none' stroke='%235c6e54' stroke-width='0.6' stroke-linecap='round' opacity='0.3'><path d='M40 0 C 32 4, 28 12, 30 20'/><circle cx='30' cy='20' r='1.2' fill='%235c6e54'/><path d='M40 8 C 36 8, 34 12, 36 16'/></svg>");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.6;
        }
        .lang-btn:nth-child(1) { animation-delay: 0.7s; }
        .lang-btn:nth-child(2) { animation-delay: 0.85s; }
        .lang-btn:nth-child(3) { animation-delay: 1.0s; }

        .lang-btn:hover, .lang-btn.hovered {
          background: var(--beige-light);
          border-color: var(--sage-deep);
        }
        .lang-btn.chosen {
          background: var(--sage-deep);
          border-color: var(--sage-deep);
          color: var(--cream);
        }
        .lang-btn.chosen .lang-native, .lang-btn.chosen .lang-tag, .lang-btn.chosen .arrow {
          color: var(--cream);
        }
        .lang-btn.chosen .lang-flag-mark {
          background: var(--cream);
        }

        .lang-flag-mark {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1px solid var(--sage-deep);
          display: flex; align-items: center; justify-content: center;
          background: var(--cream);
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .lang-flag-mark svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .lang-info {
          display: flex; flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .lang-native {
          font-family: var(--display);
          font-size: 26px;
          line-height: 1;
          color: var(--ink);
          letter-spacing: 0.01em;
        }
        .lang-tag {
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.32em;
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
        .lang-btn:hover .arrow, .lang-btn.hovered .arrow {
          transform: translateX(4px);
        }

        /* === Foot === */
        .gate-foot {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          padding-top: 24px;
          opacity: 0;
          animation: g-fade 1.2s 1.3s forwards cubic-bezier(.4,0,.2,1);
        }
        .gate-flags {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.7;
        }
        .mini-flag {
          width: 18px; height: 12px;
          border: 1px solid var(--sage-deep);
          opacity: 0.7;
          overflow: hidden;
          position: relative;
        }
        .gate-foot .date {
          font-family: var(--display);
          font-size: 16px;
          color: var(--ink);
          letter-spacing: 0.06em;
        }

        /* === Animations === */
        @keyframes g-fade { to { opacity: 1; } }
        @keyframes g-up { to { opacity: 1; transform: translateY(0); } }

        .gate.exit .gate-langs { transform: translateY(-12px); transition: transform 0.7s ease, opacity 0.6s ease; opacity: 0.4; }
        .gate.exit .lang-btn.chosen { opacity: 1; transform: scale(1.02); }
      `}</style>

      {/* Background patterns */}
      <div className="vine-bg" />
      <div className="chokha-band chokha-top" />
      <div className="chokha-band chokha-bottom" />

      <div className="gate-head">
        <div className="gate-monogram">
          J<span className="amp">&amp;</span>L
        </div>
        <div className="gate-meta">
          <span>Paris</span>
          <span className="dot" />
          <span>Tbilisi</span>
        </div>
      </div>

      <div className="gate-prompt">
        <div className="gate-script">Bienvenue · მოგესალმებით</div>
        <div className="gate-title-row">
          <span>Choisissez votre langue</span>
        </div>

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
        <div className="gate-flags" aria-hidden="true">
          <FlagFR />
          <span>Franco · Géorgien</span>
          <FlagGE />
        </div>
        <div className="date">05 · 09 · 2026</div>
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
          <rect x="0" y="0" width="10" height="30" fill="#7a8b6f" />
          <rect x="10" y="0" width="10" height="30" fill="#f7f2e6" />
          <rect x="20" y="0" width="10" height="30" fill="#a8826b" />
        </g>
      </svg>
    );
  }
  if (code === 'ge') {
    return (
      <svg viewBox="0 0 30 30">
        <clipPath id={`c-${code}`}><circle cx="15" cy="15" r="14" /></clipPath>
        <g clipPath={`url(#c-${code})`}>
          <rect x="0" y="0" width="30" height="30" fill="#f7f2e6" />
          <rect x="13" y="0" width="4" height="30" fill="#a8826b" opacity="0.85" />
          <rect x="0" y="13" width="30" height="4" fill="#a8826b" opacity="0.85" />
          {/* small Bolnisi crosses in 4 quadrants */}
          {[[7,7],[23,7],[7,23],[23,23]].map(([x,y],i)=>(
            <g key={i} transform={`translate(${x} ${y})`} stroke="#a8826b" strokeWidth="0.8" fill="none">
              <path d="M-2 0 L2 0 M0 -2 L0 2" />
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
          <rect x="0" y="0" width="30" height="10" fill="#3d4a36" />
          <rect x="0" y="10" width="30" height="10" fill="#a8826b" />
          <rect x="0" y="20" width="30" height="10" fill="#d4c4a3" />
        </g>
      </svg>
    );
  }
  return null;
};

const FlagFR = () => (
  <svg width="18" height="12" viewBox="0 0 18 12">
    <rect x="0" y="0" width="6" height="12" fill="#7a8b6f" />
    <rect x="6" y="0" width="6" height="12" fill="#f7f2e6" />
    <rect x="12" y="0" width="6" height="12" fill="#a8826b" />
  </svg>
);
const FlagGE = () => (
  <svg width="18" height="12" viewBox="0 0 18 12">
    <rect width="18" height="12" fill="#f7f2e6" />
    <rect x="8" y="0" width="2" height="12" fill="#a8826b" opacity="0.85" />
    <rect x="0" y="5" width="18" height="2" fill="#a8826b" opacity="0.85" />
  </svg>
);

window.LangGate = LangGate;
