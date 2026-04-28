// TIMELINE — Soirée from cocktail to dance, vertical line fills as you scroll
// Updated: cocktail 18h, dîner 20h (buffet géorgien), bal 23h, fête jusqu'au bout

const Timeline = () => {
  const ref = React.useRef(null);
  const [inView, progress] = window.useInView(ref);
  const fill = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));

  const events = [
    { time: '18h00', title: 'Cocktail', sub: 'Sur la terrasse, au soleil couchant', icon: '✦' },
    { time: '20h00', title: 'Dîner', sub: 'Buffet géorgien — supra & vin de Kakheti', icon: '◇' },
    { time: '23h00', title: 'Ouverture du bal', sub: 'Première danse', icon: '✧' },
    { time: 'Late', title: 'Jusqu\'au bout', sub: 'La fête ne s\'arrête pas', icon: '☾' },
  ];

  return (
    <section className="scene timeline-scene" ref={ref} data-screen-label="05 Soirée">
      <style>{`
        .timeline-scene {
          background: linear-gradient(180deg, #d8c8a4 0%, var(--sage-light) 60%, var(--sage) 100%);
          padding: 96px 28px;
          gap: 32px;
          color: var(--ink);
          position: relative;
          overflow: hidden;
        }
        /* faint stars */
        .timeline-scene::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.7) 50%, transparent),
            radial-gradient(1px 1px at 85% 22%, rgba(255,255,255,0.6) 50%, transparent),
            radial-gradient(1px 1px at 30% 8%, rgba(255,255,255,0.55) 50%, transparent),
            radial-gradient(1.5px 1.5px at 70% 12%, rgba(255,255,255,0.7) 50%, transparent),
            radial-gradient(1px 1px at 55% 28%, rgba(255,255,255,0.5) 50%, transparent);
          opacity: ${Math.min(1, fill * 1.5)};
          transition: opacity 1s ease;
          pointer-events: none;
        }
        .timeline-scene > * { position: relative; }

        .tl-list {
          position: relative;
          padding: 12px 0 12px 56px;
          width: 100%;
        }
        .tl-line-bg {
          position: absolute; left: 22px; top: 0; bottom: 0;
          width: 1px; background: rgba(31, 36, 25, 0.2);
        }
        .tl-line-fg {
          position: absolute; left: 22px; top: 0;
          width: 1px; background: var(--ink);
          transform-origin: top;
        }
        .tl-item {
          position: relative;
          padding: 22px 0;
          border-bottom: 1px solid rgba(31, 36, 25, 0.16);
          transition: transform .8s cubic-bezier(.2,.8,.2,1), opacity .8s;
        }
        .tl-item:last-child { border-bottom: none; }
        .tl-item .marker {
          position: absolute;
          left: -42px; top: 26px;
          width: 22px; height: 22px;
          background: var(--cream);
          border: 1px solid var(--ink);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          color: var(--ink);
          transition: background 0.4s, color 0.4s, transform 0.5s;
        }
        .tl-item.reached .marker {
          background: var(--ink);
          color: var(--cream);
          transform: scale(1.1);
        }
        .tl-item .time {
          font-family: var(--display); font-size: 18px;
          color: var(--ink-soft);
          letter-spacing: 0.04em;
        }
        .tl-item .ttl {
          font-family: var(--display);
          font-size: 32px;
          color: var(--ink);
          line-height: 1.05;
          margin-top: 4px;
          letter-spacing: -0.005em;
        }
        .tl-item .sub {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 15px; color: var(--ink-soft); margin-top: 4px;
          line-height: 1.4;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">III</span>
        <span>La Soirée</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        Au fil<br/><span className="em">des heures</span>
        <span className="it">du crépuscule à l'aube</span>
      </h2>

      <div className="tl-list">
        <div className="tl-line-bg" />
        <div className="tl-line-fg" style={{ height: `${fill * 100}%`, transition: 'height 0.2s linear' }} />
        {events.map((e, i) => {
          const reached = fill > (i / events.length);
          return (
            <div key={i} className={`tl-item ${reached ? 'reached' : ''} blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: `${0.2 + i * 0.1}s` }}>
              <span className="marker">{e.icon}</span>
              <div className="time">{e.time}</div>
              <div className="ttl">{e.title}</div>
              <div className="sub">{e.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

window.Timeline = Timeline;
