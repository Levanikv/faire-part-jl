// PRACTICAL — Transport, hébergement, enfants
// Updated: 1 chambre par invité au château, navettes Paris ↔ Auxerre ↔ Chaumont

const Practical = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);

  const items = [
    {
      tag: 'IV', label: 'Transport', icon: '🚐',
      title: 'Navettes',
      body: 'Liaison entre la cathédrale et le domaine.',
      detail: 'Départ après l\'office · retour Paris dimanche en fin de journée'
    },
    {
      tag: 'V', label: 'Hébergement', icon: '🛏',
      title: 'Sur place',
      body: 'Une chambre attribuée à chaque invité au château.',
      detail: 'Affectation communiquée à l\'arrivée · clés remises au check-in'
    },
    {
      tag: 'VI', label: 'Enfants', icon: '✧',
      title: 'Babysitter',
      body: 'Disponible sur place toute la soirée.',
      detail: 'Coin enfants aménagé · espace nuit calme'
    },
  ];

  return (
    <section className="scene practical" ref={ref} data-screen-label="06 Pratique">
      <style>{`
        .practical {
          background: var(--cream);
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
          padding: 24px 22px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 18px;
          align-items: start;
          transition: background .4s;
        }
        .prac-card:hover { background: var(--beige); }
        .prac-card .num {
          font-family: var(--display);
          font-size: 32px;
          color: var(--sage-deep);
          line-height: 1;
          padding-top: 4px;
          border-right: 1px solid var(--rule);
          padding-right: 18px;
          min-width: 42px;
          letter-spacing: -0.01em;
        }
        .prac-card .lbl {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--sage-deep); opacity: 0.85;
          margin-bottom: 5px;
        }
        .prac-card .ttl {
          font-family: var(--display);
          font-size: 26px;
          color: var(--ink);
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .prac-card .body {
          font-family: var(--serif);
          font-size: 16px;
          color: var(--ink);
          line-height: 1.45;
        }
        .prac-card .detail {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 13px; color: var(--ink-soft);
          margin-top: 8px;
          line-height: 1.5;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span>Informations</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        Le <span className="em">pratique</span>
        <span className="it">tout est prévu pour vous</span>
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

  // Color palette swatches showing what to favor (muted) vs avoid (vivid)
  const favored = ['#3d4a36', '#5c6e54', '#a8b89a', '#c8b890', '#d4c4a3', '#3a3e35', '#5a4a36', '#7d6e54'];
  const avoided = ['#e8334d', '#ff6e1f', '#ffd91a', '#22c55e', '#0ea5e9', '#a855f7', '#ec4899'];

  return (
    <section className="scene dress" ref={ref} data-screen-label="07 Dress Code">
      <style>{`
        .dress {
          background: linear-gradient(180deg, var(--cream) 0%, var(--beige) 60%, var(--cream) 100%);
          padding: 96px 28px 120px;
          gap: 28px;
          align-items: center;
        }
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
          gap: 16px; width: 100%;
        }
        .fig-card {
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 24px 14px 18px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          aspect-ratio: 1 / 1.32;
        }
        .fig-card .silh { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; }
        .fig-card .lbl {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--sage-deep);
        }
        .fig-card .req {
          font-family: var(--display); font-size: 22px; color: var(--ink);
          text-align: center; line-height: 1.1;
        }
        /* Color palette block */
        .palette {
          width: 100%;
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 20px 20px 22px;
        }
        .palette .h {
          font-family: var(--sans); font-size: 9px;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--sage-deep); margin-bottom: 12px;
        }
        .palette .row {
          display: flex; gap: 6px;
          margin-bottom: 8px;
        }
        .swatch {
          flex: 1; aspect-ratio: 1 / 1; border-radius: 50%;
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
        <span className="num">VII</span>
        <span>Dress Code</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        Chic <span className="em">&</span><br/>élégant
        <span className="it">pas de thème · couleurs douces</span>
      </h2>

      <p className={`dress-intro blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        Aucun thème particulier — laissez parler votre élégance.<br/>
        Évitez simplement les couleurs trop vives.
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
          <span className="lbl">Messieurs</span>
          <span className="req">Costume<br/>sombre</span>
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
          <span className="lbl">Mesdames</span>
          <span className="req">Robe<br/>longue</span>
        </div>
      </div>

      <div className={`palette blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.5s' }}>
        <div className="h">À favoriser · tons doux</div>
        <div className="row">
          {favored.map((c, i) => <span key={i} className="swatch" style={{ background: c }} />)}
        </div>
        <div className="cap">Sauge, terre, ivoire, marine, ardoise…</div>
      </div>

      <div className={`palette blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.6s' }}>
        <div className="h">À éviter · couleurs vives</div>
        <div className="row">
          {avoided.map((c, i) => <span key={i} className="swatch crossed" style={{ background: c }} />)}
        </div>
        <div className="cap">Rouges éclatants, néons, fluos.<br/>Évitez aussi le blanc &amp; l'ivoire pur.</div>
      </div>
    </section>
  );
};

window.Practical = Practical;
window.DressCode = DressCode;
