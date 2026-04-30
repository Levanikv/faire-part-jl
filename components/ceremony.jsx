// CEREMONY — Cathédrale Saint-Stéphane (Métropole Grec-Orthodoxe de France) · Paris 16ᵉ
// Eyebrow + unified display H2 with blur-in. Orthodox cathedral SVG draws itself.
// Three info rows (arrivée 13h30 · office 14h · transport).

const Ceremony = () => {
  const ref = React.useRef(null);
  const [inView, progress] = window.useInView(ref);
  const drawn = Math.max(0, Math.min(1, (progress - 0.05) / 0.22));

  return (
    <section className="scene ceremony" ref={ref} data-screen-label="02 Cérémonie">
      <style>{`
        .ceremony {
          /* Top picks up where the hero ended (--beige), fades into cream */
          background: linear-gradient(180deg, var(--beige) 0%, var(--beige-light) 12%, var(--cream) 32%);
          padding-top: 92px;
          padding-bottom: 92px;
          align-items: center;
          gap: 28px;
        }
        .ceremony-intro {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.6;
          color: var(--sage-deep);
          text-align: center;
          max-width: 320px;
          margin-top: 22px;
        }
        .ceremony-illust {
          padding: 22px 0 6px;
          position: relative;
        }
        .ceremony-illust::before {
          content: ''; position: absolute; left: 50%; top: -2px; transform: translateX(-50%);
          width: 1px; height: 36px;
          background: linear-gradient(180deg, transparent, var(--sage-deep) 60%, var(--sage-deep));
          opacity: 0.4;
        }
        .ceremony-card {
          width: 100%;
          background: var(--beige-light);
          border: 1px solid var(--rule);
          padding: 28px 22px;
          display: flex; flex-direction: column; gap: 18px;
          position: relative;
          box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;
        }
        .card-row {
          display: flex; align-items: flex-start; gap: 14px;
        }
        .card-row .pin {
          flex-shrink: 0;
          width: 30px; height: 30px;
          border: 1px solid var(--sage-deep);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--display);
          font-size: 11px;
          color: var(--sage-deep);
          margin-top: 1px;
          letter-spacing: 0;
        }
        .card-row .pin.solid {
          background: var(--sage-deep); color: var(--cream); border-color: var(--sage-deep);
        }
        .card-row .body { flex: 1; padding-top: 2px; }
        .card-row .lbl {
          font-family: var(--sans); font-size: 10px;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--sage-deep);
          margin-bottom: 6px;
        }
        .card-row .val {
          font-family: var(--display);
          font-size: 24px;
          line-height: 1.25;
          color: var(--sage-deep);
          letter-spacing: -0.005em;
        }
        .card-row .val em {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          color: var(--sage-deep);
          opacity: 0.78;
          font-size: 16px;
          display: block;
          margin-top: 4px;
          letter-spacing: 0.02em;
        }
        .card-rule { height: 1px; background: var(--rule); }

        .ceremony-quote {
          font-family: var(--serif);
          font-style: italic;
          font-size: 15px;
          color: var(--sage-deep);
          text-align: center;
          line-height: 1.6;
          max-width: 320px;
          opacity: ${drawn};
          transform: translateY(${(1 - drawn) * 8}px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .ceremony-quote::before, .ceremony-quote::after {
          content: '·';
          color: var(--sage); margin: 0 10px; opacity: 0.6;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">I</span>
        <span>Cérémonie</span>
      </div>

      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        Cathédrale<br/>
        <span className="em">Saint-Stéphane</span>
        <span className="it">Paris · 16ᵉ arrondissement</span>
      </h2>

      <p className={`ceremony-intro blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        Sous les coupoles byzantines<br/>de la Métropole grecque-orthodoxe de France,<br/>nous échangerons nos vœux.
      </p>

      <div className="ceremony-illust">
        <Cathedral width={280} drawn={drawn} />
      </div>

      <div className={`ceremony-card blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <div className="card-row">
          <div className="pin">◇</div>
          <div className="body">
            <div className="lbl">Adresse</div>
            <div className="val">7 Rue Georges Bizet<br/>75016 Paris</div>
          </div>
        </div>
        <div className="card-rule" />
        <div className="card-row">
          <div className="pin">13<sup style={{fontSize:'0.6em',marginLeft:'1px'}}>30</sup></div>
          <div className="body">
            <div className="lbl">Accueil</div>
            <div className="val">13h30 <em>Arrivée des invités</em></div>
          </div>
        </div>
        <div className="card-rule" />
        <div className="card-row">
          <div className="pin solid">14</div>
          <div className="body">
            <div className="lbl">Office</div>
            <div className="val">14h00 <em>Cérémonie religieuse</em></div>
          </div>
        </div>
        <div className="card-rule" />
        <div className="card-row">
          <div className="pin" style={{borderStyle:'dashed'}}>M</div>
          <div className="body">
            <div className="lbl">Métro</div>
            <div className="val">Iéna <em>L9 · 4 min à pied</em><br/>Alma-Marceau <em>L9 · 6 min à pied</em></div>
          </div>
        </div>
      </div>

      <p className="ceremony-quote">
        Et de deux cœurs, un seul
      </p>
    </section>
  );
};

window.Ceremony = Ceremony;
