// CLOSING — Brunch (with hand-drawn coffee+croissant) + final monogram

const Brunch = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);

  return (
    <section className="scene brunch" ref={ref} data-screen-label="11 Brunch">
      <style>{`
        .brunch {
          background: linear-gradient(180deg, var(--beige-light) 0%, var(--cream) 25%, var(--beige) 60%, var(--beige-light) 100%);
          padding: 96px 28px;
          gap: 24px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        /* Soft sun/morning light */
        .brunch::before {
          content: '';
          position: absolute; top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(252,224,148,0.35) 0%, rgba(252,224,148,0) 70%);
          pointer-events: none;
        }
        .brunch > * { position: relative; }

        .br-script {
          font-family: var(--display);
          font-style: italic;
          font-size: 32px;
          color: var(--sage-deep);
          line-height: 1;
          letter-spacing: 0.01em;
        }
        .br-icon {
          padding: 8px 0;
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.8,.2,1);
          transition-delay: 0.4s;
        }
        .br-icon.in { opacity: 1; transform: translateY(0) scale(1); }

        .br-card {
          width: 100%;
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 26px 22px;
          display: flex; flex-direction: column; gap: 18px;
          text-align: center;
        }
        .br-card .ttl {
          font-family: var(--display);
          font-size: 26px;
          color: var(--sage-deep);
          letter-spacing: 0.01em;
        }
        .br-card .lbl {
          font-family: var(--sans); font-size: 10px;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--sage-deep);
          margin-bottom: 6px;
        }
        .br-time-row {
          display: flex; align-items: center; justify-content: center; gap: 18px;
          font-family: var(--display);
          font-size: 36px;
          color: var(--sage-deep);
          letter-spacing: -0.005em;
        }
        .br-time-row .arrow {
          color: var(--sage-deep); font-size: 22px;
          font-family: var(--serif); font-style: italic;
          opacity: 0.7;
        }
        .br-rule { height: 1px; background: var(--rule); }
        .br-meta {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 16px; color: var(--sage-deep); line-height: 1.6;
          opacity: 0.85;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">IV</span>
        <span>Le lendemain</span>
      </div>

      <div className={`br-script blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        Dimanche
      </div>

      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.2s' }}>
        Brunch <span className="em">&</span><br/>journée chill
        <span className="it">06 · 09 · 2026</span>
      </h2>

      <div className={`br-icon ${inView ? 'in' : ''}`}>
        <BrunchIcon size={120} />
      </div>

      <div className={`br-card blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <div>
          <div className="lbl">Heure</div>
          <div className="br-time-row">
            <span>11h</span>
            <span className="arrow">jusqu'à</span>
            <span>18h</span>
          </div>
        </div>
        <div className="br-rule" />
        <div>
          <div className="lbl">Lieu</div>
          <div className="ttl">Au domaine, sur l'herbe</div>
        </div>
        <div className="br-rule" />
        <p className="br-meta">
          Buffet matinal, café et retrouvailles.<br/>
          Une journée tranquille pour prolonger la fête,<br/>
          jusqu'au coucher du soleil.
        </p>
      </div>
    </section>
  );
};

// Use the SVG icon (window.Brunch is set on the icon — but we also need to expose
// the section component. Rename icon usage to avoid collision.

const Closing = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);

  return (
    <section className="scene closing" ref={ref} data-screen-label="12 Closing">
      <style>{`
        .closing {
          background: linear-gradient(180deg, var(--beige-light) 0%, #d8c8a4 100%);
          padding: 100px 28px 60px;
          gap: 28px;
          align-items: center;
          justify-content: center;
          color: var(--cream);
          text-align: center;
          min-height: 100svh;
        }
        .cl-script {
          font-family: var(--display);
          font-style: italic;
          font-size: 32px;
          color: var(--sage-deep);
          letter-spacing: 0.01em;
        }
        .cl-mono {
          font-family: var(--display);
          font-size: 96px;
          line-height: 0.95;
          color: var(--ink);
        }
        .cl-mono .amp {
          display: block;
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 0.5em;
          color: var(--sage-deep);
          padding: 12px 0;
        }
        .cl-rule { width: 60px; height: 1px; background: var(--sage-deep); opacity: 0.5; }
        .cl-date {
          font-family: var(--display);
          font-size: 24px;
          color: var(--ink);
          letter-spacing: 0.02em;
        }
        .cl-message {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 18px;
          color: var(--ink-soft);
          line-height: 1.55;
          max-width: 320px;
        }
        .cl-langs {
          display: flex; flex-direction: column; gap: 6px;
          font-family: var(--serif); font-style: italic; font-weight: 300;
          color: var(--cream);
          font-size: 16px;
          line-height: 1.5;
          padding-top: 20px;
          border-top: 1px solid rgba(247,242,230,0.3);
          width: 80%;
          text-align: center;
        }
        .cl-langs .lang { display: flex; align-items: baseline; justify-content: center; gap: 10px; opacity: 0.95; }
        .cl-langs .lang .tag {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--sage-mist); opacity: 0.8; min-width: 24px; text-align: right;
        }
        .cl-foot {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--sage-mist); opacity: 0.7;
          margin-top: 24px;
        }
      `}</style>

      <div className={`cl-script blur-in ${inView ? 'in' : ''}`}>À très bientôt</div>
      <h2 className={`cl-mono blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.2s' }}>
        Justine
        <span className="amp">&amp;</span>
        Levani
      </h2>
      <span className={`cl-rule blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.45s' }} />
      <div className={`cl-date blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.55s' }}>05 · 09 · 2026</div>
      <p className={`cl-message blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.7s' }}>
        Nous serions honorés de vous compter<br/>parmi nous pour célébrer notre union.
      </p>

      <div className={`cl-langs blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.9s' }}>
        <div className="lang"><span className="tag">FR</span><span>Avec amour</span></div>
        <div className="lang"><span className="tag">GE</span><span>სიყვარულით</span></div>
        <div className="lang"><span className="tag">DE</span><span>Mit Liebe</span></div>
      </div>

      <div className={`cl-foot blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '1.1s' }}>— Save the Date —</div>
    </section>
  );
};

window.BrunchScene = Brunch;
window.Closing = Closing;
