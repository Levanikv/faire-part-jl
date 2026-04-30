// Floating language switcher — top-left pill that mirrors the audio FAB
// at top-right. Shows all three locales; clicking a non-active code swaps
// the lang context.

const LangSwitcher = ({ lang, onSelect }) => {
  const codes = ['fr', 'ge', 'de'];
  return (
    <>
      <style>{`
        .lang-switcher {
          position: fixed;
          top: max(18px, env(safe-area-inset-top));
          left: max(18px, env(safe-area-inset-left));
          z-index: 100;
          display: flex;
          gap: 2px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(243, 236, 216, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--rule);
          box-shadow: 0 4px 18px rgba(31, 36, 25, 0.08);
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          transition:
            opacity 0.9s cubic-bezier(.2,.8,.2,1) 0.6s,
            transform 0.9s cubic-bezier(.2,.8,.2,1) 0.6s;
        }
        body.has-lang .lang-switcher {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .lang-switcher button {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 0;
          background: transparent;
          color: var(--sage-deep);
          font-family: var(--sans);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s, color 0.25s;
        }
        .lang-switcher button:hover { background: rgba(122, 139, 111, 0.12); }
        .lang-switcher button.active {
          background: var(--sage-deep);
          color: var(--cream);
          cursor: default;
        }
      `}</style>
      <div className="lang-switcher" role="group" aria-label="Language">
        {codes.map((c) => (
          <button
            key={c}
            type="button"
            className={c === lang ? 'active' : ''}
            onClick={() => c !== lang && onSelect(c)}
            aria-pressed={c === lang}
            aria-label={c.toUpperCase()}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
};

window.LangSwitcher = LangSwitcher;
