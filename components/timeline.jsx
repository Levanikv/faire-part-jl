// TIMELINE — Soirée from cocktail to dance, vertical line fills as you scroll
// Updated: cocktail 18h, dîner 20h (buffet géorgien), bal 23h, fête jusqu'au bout

const Timeline = () => {
  const ref = React.useRef(null);
  const [inView, progress] = window.useInView(ref);
  const fill = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
  const t = window.useT().timeline;
  const events = t.events;

  return (
    <section className="scene timeline-scene" ref={ref} data-screen-label="05 Soirée">
      <style>{`
        .timeline-scene {
          background: linear-gradient(180deg, var(--beige) 0%, #d8c8a4 100%);
          padding: 96px 28px;
          gap: 32px;
          color: var(--sage-deep);
          position: relative;
          overflow: hidden;
        }
        .timeline-scene > * { position: relative; }

        .tl-list {
          position: relative;
          padding: 12px 0 12px 56px;
          width: 100%;
        }
        /* Vertical line: bg + fg are perfectly co-located at left: 22px */
        .tl-line-bg {
          position: absolute; left: 22px; top: 0; bottom: 0;
          width: 1px; background: rgba(61, 74, 54, 0.22);
        }
        .tl-line-fg {
          position: absolute; left: 22px; top: 0;
          width: 1px; background: var(--sage-deep);
          transform-origin: top;
        }
        .tl-item {
          position: relative;
          padding: 22px 0;
          border-bottom: 1px solid rgba(61, 74, 54, 0.16);
          transition: transform .8s cubic-bezier(.2,.8,.2,1), opacity .8s;
        }
        .tl-item:last-child { border-bottom: none; }
        /* Marker is centered ON the line: list pad-left 56 + marker left -45 + half width 11 = 22 */
        .tl-item .marker {
          position: absolute;
          left: -45px; top: 26px;
          width: 22px; height: 22px;
          background: var(--cream);
          border: 1px solid var(--sage-deep);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          color: var(--sage-deep);
          transition: background 0.4s, color 0.4s, transform 0.5s;
        }
        .tl-item.reached .marker {
          background: var(--sage-deep);
          color: var(--cream);
          transform: scale(1.1);
        }
        .tl-item .time {
          font-family: var(--display); font-size: 20px;
          color: var(--sage-deep);
          letter-spacing: 0.04em;
          opacity: 0.85;
        }
        .tl-item .ttl {
          font-family: var(--display);
          font-size: 36px;
          color: var(--sage-deep);
          line-height: 1.05;
          margin-top: 4px;
          letter-spacing: -0.005em;
        }
        .tl-item .sub {
          font-family: var(--serif); font-style: italic; font-weight: 300;
          font-size: 17px; color: var(--sage-deep); margin-top: 6px;
          line-height: 1.45;
          opacity: 0.85;
        }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">{t.eyebrow_num}</span>
        <span>{t.eyebrow}</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        {t.title_main}<br/><span className="em">{t.title_em}</span>
        <span className="it">{t.subtitle}</span>
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
