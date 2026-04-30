// PRACTICAL — Hébergement, parking, enfants

const Practical = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);
  const t = window.useT().practical;
  const items = t.items;

  return (
    <section className="scene practical" ref={ref} data-screen-label="06 Pratique">
      <style>{`
        /* Top fades in from beige (continuing the timeline section's bottom)
           so the seam between sections feels stitched together. */
        .practical {
          background: linear-gradient(180deg, #d8c8a4 0%, var(--beige) 14%, var(--cream) 38%);
          padding: 96px 28px;
          gap: 28px;
        }
        .prac-grid {
          display: flex; flex-direction: column; gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
        }
        .prac-card {
          background: var(--beige-light);
          padding: 28px 24px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: start;
          transition: background .4s;
        }
        .prac-card:hover { background: var(--beige); }
        .prac-card .num {
          font-family: var(--display);
          font-size: 36px;
          color: var(--sage-deep);
          line-height: 1;
          padding-top: 4px;
          border-right: 1px solid var(--rule);
          padding-right: 20px;
          min-width: 46px;
          letter-spacing: -0.01em;
        }
        .prac-card .lbl {
          font-family: var(--sans); font-size: 10px;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--sage-deep);
          margin-bottom: 6px;
        }
        .prac-card .ttl {
          font-family: var(--display);
          font-size: 30px;
          color: var(--sage-deep);
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .prac-card .body {
          font-family: var(--serif);
          font-size: 18px;
          color: var(--sage-deep);
          line-height: 1.5;
        }
        .prac-card .detail {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 15px; color: var(--sage-deep);
          opacity: 0.85;
          margin-top: 10px;
          line-height: 1.55;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span>{t.eyebrow}</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        {t.title_main} <span className="em">{t.title_em}</span>
        <span className="it">{t.subtitle}</span>
      </h2>

      <div className={`prac-grid blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        {items.map((it, i) => (
          <div key={i} className="prac-card">
            <div className="num">{it.tag}</div>
            <div>
              <div className="lbl">{it.label}</div>
              <div className="ttl">{it.title}</div>
              <div className="body">{it.body}</div>
              <div className="detail">{it.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// DRESS CODE — pas de couleurs vives, chic et élégant
const DressCode = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);
  const t = window.useT().dress;

  // Color palette swatches showing what to favor (muted) vs avoid (vivid)
  const favored = ['#3d4a36', '#5c6e54', '#a8b89a', '#c8b890', '#d4c4a3', '#3a3e35', '#5a4a36', '#7d6e54'];
  const avoided = ['#e8334d', '#ff6e1f', '#ffd91a', '#22c55e', '#0ea5e9', '#a855f7', '#ec4899'];

  return (
    <section className="scene dress" ref={ref} data-screen-label="07 Dress Code">
      <style>{`
        .dress {
          background: linear-gradient(180deg, var(--cream) 0%, var(--beige) 60%, var(--cream) 100%);
          padding: 96px clamp(20px, 5vw, 28px) 120px;
          gap: 28px;
          align-items: center;
          overflow-x: clip;
          width: 100%;
          max-width: 100%;
        }
        .dress > * { max-width: 100%; }
        .dress-intro {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.6;
          color: var(--sage-deep);
          text-align: center;
          max-width: 320px;
        }
        .dress-fig {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; width: 100%;
          min-width: 0;
        }
        .fig-card {
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 22px 12px 18px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          aspect-ratio: 1 / 1.32;
          min-width: 0;
          overflow: hidden;
        }
        .fig-card .silh {
          flex: 1; display: flex; align-items: center; justify-content: center;
          width: 100%; min-width: 0;
        }
        .fig-card .silh svg {
          max-width: 100%; height: auto;
        }
        .fig-card .lbl {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--sage-deep);
          text-align: center;
        }
        .fig-card .req {
          font-family: var(--display); font-size: clamp(18px, 5vw, 22px);
          color: var(--ink);
          text-align: center; line-height: 1.15;
          overflow-wrap: break-word; hyphens: auto;
        }
        /* Color palette block */
        .palette {
          width: 100%;
          max-width: 100%;
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 20px 18px 22px;
          min-width: 0;
        }
        .palette .h {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--sage-deep); margin-bottom: 12px;
        }
        .palette .row {
          display: flex; gap: 6px;
          margin-bottom: 8px;
          min-width: 0;
        }
        .swatch {
          flex: 1 1 0;
          min-width: 0;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
        }
        .swatch.crossed {
          position: relative;
          opacity: 0.85;
        }
        .swatch.crossed::after {
          content: ''; position: absolute; inset: 4px;
          background: linear-gradient(45deg, transparent calc(50% - 1px), rgba(31,36,25,0.7) 50%, transparent calc(50% + 1px));
          border-radius: 50%;
        }
        .palette .cap {
          font-family: var(--serif); font-style: italic; font-size: 13px;
          color: var(--ink-soft); margin-top: 6px; line-height: 1.4;
          text-align: center;
        }
        .palette + .palette { margin-top: 4px; }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">{t.eyebrow_num}</span>
        <span>{t.eyebrow}</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        {t.title_main} <span className="em">{t.title_em}</span><br/>{t.title_extra}
        <span className="it">{t.subtitle}</span>
      </h2>

      <p className={`dress-intro blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        {t.intro.map((line, i) => (
          <React.Fragment key={i}>{line}{i < t.intro.length - 1 && <br/>}</React.Fragment>
        ))}
      </p>

      <div className={`dress-fig blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <div className="fig-card">
          <div className="silh">
            <svg viewBox="0 0 80 120" width="80" height="120" fill="none" stroke="var(--sage-deep)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="40" cy="20" r="9" />
              <path d="M28 32 Q40 38 52 32" />
              <path d="M28 32 L20 70 L26 70 L28 110" />
              <path d="M52 32 L60 70 L54 70 L52 110" />
              <path d="M28 32 L40 38 L52 32" />
              <path d="M40 38 L40 90" />
              <path d="M34 50 L40 48 L46 50" />
              <path d="M28 110 L26 118 L32 118 L34 110" />
              <path d="M52 110 L54 118 L48 118 L46 110" />
            </svg>
          </div>
          <span className="lbl">{t.lbl_men}</span>
          <span className="req">{t.req_men[0]}<br/>{t.req_men[1]}</span>
        </div>
        <div className="fig-card">
          <div className="silh">
            <svg viewBox="0 0 80 120" width="80" height="120" fill="none" stroke="var(--sage-deep)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="40" cy="18" r="8" />
              <path d="M32 30 Q40 34 48 30" />
              <path d="M32 30 L24 50 Q22 56 24 60" />
              <path d="M48 30 L56 50 Q58 56 56 60" />
              <path d="M28 50 L26 64 L20 110 L60 110 L54 64 L52 50" />
              <path d="M40 50 L40 110" opacity="0.4" />
              <path d="M30 80 Q40 84 50 80" opacity="0.4" />
            </svg>
          </div>
          <span className="lbl">{t.lbl_women}</span>
          <span className="req">{t.req_women[0]}<br/>{t.req_women[1]}</span>
        </div>
      </div>

      <div className={`palette blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.5s' }}>
        <div className="h">{t.pal_fav_h}</div>
        <div className="row">
          {favored.map((c, i) => <span key={i} className="swatch" style={{ background: c }} />)}
        </div>
        <div className="cap">{t.pal_fav_cap}</div>
      </div>

      <div className={`palette blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.6s' }}>
        <div className="h">{t.pal_avoid_h}</div>
        <div className="row">
          {avoided.map((c, i) => <span key={i} className="swatch crossed" style={{ background: c }} />)}
        </div>
        <div className="cap">
          {t.pal_avoid_cap.map((line, i) => (
            <React.Fragment key={i}>{line}{i < t.pal_avoid_cap.length - 1 && <br/>}</React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

window.Practical = Practical;
window.DressCode = DressCode;
