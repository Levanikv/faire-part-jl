// RECEPTION — Château Chaumont-sur-Yonne
// Animated chateau drawing + sunset glow + window lights flickering on.
// Storytelling intro + addr + quote (timeline lives in its own scene).

const Reception = () => {
  const ref = React.useRef(null);
  const [inView, progress] = window.useInView(ref);
  const drawn = Math.max(0, Math.min(1, (progress - 0.05) / 0.25));
  const dusk = Math.max(0, Math.min(1, (progress - 0.15) / 0.3));
  const t = window.useT().reception;

  return (
    <section className="scene reception" ref={ref} data-screen-label="04 Réception">
      <style>{`
        .reception {
          background: linear-gradient(180deg, var(--beige-light) 0%, var(--cream) 38%, var(--beige) 100%);
          padding-top: 96px;
          padding-bottom: 80px;
          align-items: center;
          gap: 26px;
          position: relative;
          overflow: hidden;
        }
        .reception::before {
          content: '';
          position: absolute; top: 36%; left: 50%; transform: translate(-50%, -50%);
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(228,188,124,0.65) 0%, rgba(228,188,124,0) 70%);
          opacity: ${dusk};
          transition: opacity 1.8s ease;
          pointer-events: none;
        }
        /* (sage tree silhouette removed — kept the section beige-only) */
        .reception > * { position: relative; }

        .recep-intro {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.65;
          color: var(--sage-deep);
          text-align: center;
          max-width: 320px;
        }
        .chateau-illust { position: relative; padding: 16px 0 4px; }
        .chateau-illust .windows { position: absolute; inset: 0; pointer-events: none; }
        .window-light {
          position: absolute;
          background: radial-gradient(circle, rgba(252, 224, 148, 0.85) 0%, rgba(252, 224, 148, 0) 70%);
          width: 26px; height: 26px;
          border-radius: 50%;
          opacity: 0;
          animation: glow 3.4s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .recep-addr {
          padding: 22px 24px;
          border: 1px solid var(--rule);
          background: rgba(247, 242, 230, 0.85);
          backdrop-filter: blur(3px);
          text-align: center;
          width: 100%;
        }
        .recep-addr .lbl {
          font-family: var(--sans); font-size: 10px;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--sage-deep);
          margin-bottom: 10px;
        }
        .recep-addr .v {
          font-family: var(--display);
          font-size: 26px;
          color: var(--sage-deep);
          line-height: 1.25;
        }
        .recep-addr .v em {
          display: block;
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 16px; color: var(--sage-deep); opacity: 0.82; margin-top: 6px;
        }
        .recep-quote {
          font-family: var(--serif);
          font-style: italic;
          font-size: 17px;
          color: var(--ink-soft);
          text-align: center;
          line-height: 1.6;
          max-width: 320px;
          letter-spacing: 0.01em;
        }
        .recep-quote::before, .recep-quote::after {
          content: '·'; color: var(--sage); margin: 0 8px; opacity: 0.6;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">{t.eyebrow_num}</span>
        <span>{t.eyebrow}</span>
      </div>

      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        {window.dashy(t.title_main)}<br/>
        <span className="em">{window.dashy(t.title_em)}</span>
        <span className="it">{window.dashy(t.subtitle)}</span>
      </h2>

      <p className={`recep-intro blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        {t.intro.map((line, i) => (
          <React.Fragment key={i}>{line}{i < t.intro.length - 1 && <br/>}</React.Fragment>
        ))}
      </p>

      <div className="chateau-illust">
        <Chateau width={320} drawn={drawn} />
        {drawn > 0.7 && (
          <div className="windows">
            <span className="window-light" style={{ left: '24%', top: '60%', animationDelay: '0.0s' }} />
            <span className="window-light" style={{ left: '36%', top: '60%', animationDelay: '0.7s' }} />
            <span className="window-light" style={{ left: '48%', top: '54%', animationDelay: '0.3s' }} />
            <span className="window-light" style={{ left: '60%', top: '60%', animationDelay: '1.1s' }} />
            <span className="window-light" style={{ left: '72%', top: '60%', animationDelay: '0.5s' }} />
            <span className="window-light" style={{ left: '30%', top: '74%', animationDelay: '1.4s' }} />
            <span className="window-light" style={{ left: '66%', top: '74%', animationDelay: '1.8s' }} />
          </div>
        )}
      </div>

      <div className={`recep-addr blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <div className="lbl">{t.lbl_address}</div>
        <div className="v">{t.val_address}<em>{window.dashy(t.val_address_em)}</em></div>
      </div>

      <p className={`recep-quote blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.5s' }}>
        {window.dashy(t.quote)}
      </p>
    </section>
  );
};

window.Reception = Reception;
