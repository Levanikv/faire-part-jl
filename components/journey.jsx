// JOURNEY — Hand-drawn map Paris → Chaumont-sur-Yonne
// Decorative topographic map with hand-drawn rivers, forests, hills, road that draws itself.
// Internal parallax: layers move at different rates relative to scroll progress.

const Journey = () => {
  const ref = React.useRef(null);
  const [inView, progress] = window.useInView(ref);
  const t = window.useT().journey;

  // Route draws from progress 0.18 → 0.75
  const draw = Math.max(0, Math.min(1, (progress - 0.18) / 0.55));
  const carP = draw;

  // Parallax offsets
  const cloudShift = (progress - 0.5) * 60;   // clouds drift across
  const treeShift = (progress - 0.5) * -25;   // foreground trees opposite

  // Stylized hand-drawn route: Paris (top-left) curving through countryside to Chaumont (bottom-right)
  const pathD = "M 56 64 C 84 96, 78 132, 120 156 S 188 200, 196 244 S 234 318, 296 360";
  const pathLength = 580;

  const [carPos, setCarPos] = React.useState({ x: 56, y: 64, angle: 0 });
  const pathRef = React.useRef(null);

  React.useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const pt = pathRef.current.getPointAtLength(len * carP);
    const pt2 = pathRef.current.getPointAtLength(Math.min(len, len * carP + 1));
    const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    setCarPos({ x: pt.x, y: pt.y, angle });
  }, [carP]);

  return (
    <section className="scene journey" ref={ref} data-screen-label="03 Voyage">
      <style>{`
        .journey {
          background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 100%);
          padding-top: 92px;
          padding-bottom: 80px;
          align-items: center;
          gap: 24px;
          overflow: hidden;
        }
        .journey-intro {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.6;
          color: var(--sage-deep);
          text-align: center;
          max-width: 320px;
        }

        /* The map: parchment look with hand-drawn topography */
        .map-frame {
          width: 100%;
          aspect-ratio: 360 / 460;
          position: relative;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(243,236,216,0.9), rgba(232,223,201,0.5) 60%),
            linear-gradient(135deg, #ebe2c8 0%, #d8c8a4 100%);
          border: 1px solid var(--rule);
          box-shadow:
            inset 0 0 0 6px rgba(243,236,216,0.6),
            inset 0 0 0 7px var(--rule),
            0 1px 0 rgba(255,255,255,0.4);
          overflow: hidden;
        }
        /* Subtle parchment grain */
        .map-frame::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.43 0 0 0 0 0.33 0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          opacity: 0.5;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .map-svg { position: absolute; inset: 0; width: 100%; height: 100%; }

        /* Decorative corner ornament — compass + scale */
        .compass-rose {
          position: absolute; top: 18px; right: 18px;
          color: var(--sage-deep); opacity: 0.7;
        }
        .map-scale {
          position: absolute; bottom: 16px; left: 18px;
          font-family: var(--sans); font-size: 8px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--sage-deep); opacity: 0.75;
          display: flex; flex-direction: column; gap: 4px;
        }
        .map-scale .bar {
          display: flex; align-items: center; gap: 0;
        }
        .map-scale .bar span {
          width: 14px; height: 4px; background: var(--sage-deep); opacity: 0.7;
        }
        .map-scale .bar span:nth-child(even) { background: transparent; border: 1px solid var(--sage-deep); }

        /* City pins */
        .city-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center;
          gap: 8px;
          z-index: 4;
        }
        .city-pin .dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--cream);
          border: 1.5px solid var(--ink);
          position: relative;
          box-shadow: 0 0 0 4px rgba(247, 242, 230, 0.85);
        }
        .city-pin .dot.active::after {
          content: ''; position: absolute; inset: 3px;
          border-radius: 50%; background: var(--ink);
        }
        .city-pin .pulse {
          position: absolute; top: 0; left: 50%;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 1.5px solid var(--ink);
          transform: translate(-50%, 0);
          animation: jpulse 2.4s ease-out infinite;
        }
        @keyframes jpulse {
          0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, 0) scale(3); }
        }
        .city-label {
          font-family: var(--display);
          font-size: 17px;
          color: var(--ink);
          white-space: nowrap;
          background: rgba(243,236,216,0.92);
          padding: 5px 10px;
          border: 1px solid var(--rule);
          letter-spacing: 0.01em;
        }
        .city-label .sub {
          display: block;
          font-family: var(--serif);
          font-style: italic;
          font-size: 11px;
          letter-spacing: 0.02em;
          text-transform: none;
          color: var(--sage-deep);
          margin-top: 2px;
        }

        .stat-row {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          width: 100%;
          padding-top: 16px;
        }
        .stat {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 0 8px;
          border-right: 1px solid var(--rule);
        }
        .stat:last-child { border-right: none; }
        .stat .v { font-family: var(--display); font-size: 28px; color: var(--sage-deep); letter-spacing: -0.01em; }
        .stat .l { font-family: var(--sans); font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--ink-soft); opacity: 0.85; }
      `}</style>

      <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
        <span className="num">·</span>
        <span>{t.eyebrow}</span>
      </div>
      <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        {window.dashy(t.title_main)}<br/>
        <span className="em">{window.dashy(t.title_em)}</span> {window.dashy(t.title_to)}
        <span className="it">{window.dashy(t.subtitle)}</span>
      </h2>

      <p className={`journey-intro blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        {t.intro.map((line, i) => (
          <React.Fragment key={i}>{line}{i < t.intro.length - 1 && <br/>}</React.Fragment>
        ))}
      </p>

      <div className={`map-frame blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <svg className="map-svg" viewBox="0 0 360 460" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" />
              <feDisplacementMap in="SourceGraphic" scale="1.5" />
            </filter>
          </defs>

          {/* ---------- TERRAIN: hand-drawn rivers, forests, hills ---------- */}

          {/* Rivers (Seine + Yonne) — flowing curves with subtle parallax */}
          <g transform={`translate(0, ${cloudShift * 0.3})`} stroke="var(--sage-deep)" strokeWidth="1" fill="none" opacity="0.32" filter="url(#rough)">
            <path d="M 0 110 Q 80 100, 140 130 T 280 180 T 360 230" />
            <path d="M 0 115 Q 80 105, 140 135 T 280 185 T 360 235" opacity="0.5" />
            <text x="86" y="98" fontSize="7" fontFamily="var(--serif)" fontStyle="italic" fill="var(--sage-deep)" opacity="0.7">la Seine</text>
            <path d="M 200 380 Q 240 340, 280 360 T 360 320" />
            <text x="220" y="372" fontSize="7" fontFamily="var(--serif)" fontStyle="italic" fill="var(--sage-deep)" opacity="0.7">l'Yonne</text>
          </g>

          {/* Hills (concentric arcs, contour-like) */}
          <g stroke="var(--sage-deep)" strokeWidth="0.6" fill="none" opacity="0.25">
            <path d="M 60 200 Q 90 180, 120 200" />
            <path d="M 64 204 Q 90 188, 116 204" opacity="0.7" />
            <path d="M 220 280 Q 250 260, 280 280" />
            <path d="M 224 284 Q 250 268, 276 284" opacity="0.7" />
            <path d="M 110 320 Q 140 305, 170 320" />
          </g>

          {/* Forests — clusters of tiny tree dots */}
          <g fill="var(--sage-deep)" opacity="0.45">
            {/* forest 1 */}
            <circle cx="160" cy="180" r="2.4" />
            <circle cx="166" cy="178" r="2" />
            <circle cx="170" cy="184" r="2.2" />
            <circle cx="174" cy="180" r="1.8" />
            <circle cx="162" cy="188" r="2" />
            {/* forest 2 */}
            <circle cx="240" cy="260" r="2.4" />
            <circle cx="246" cy="258" r="2" />
            <circle cx="250" cy="264" r="2.2" />
            <circle cx="254" cy="260" r="1.8" />
            <circle cx="244" cy="266" r="2" />
            {/* forest 3 */}
            <circle cx="80" cy="320" r="2.2" />
            <circle cx="86" cy="318" r="1.8" />
            <circle cx="90" cy="324" r="2" />
            <circle cx="84" cy="328" r="1.8" />
          </g>

          {/* Tiny villages (squares) */}
          <g stroke="var(--sage-deep)" strokeWidth="0.7" fill="var(--cream)" opacity="0.55">
            <rect x="135" y="142" width="3" height="3" />
            <rect x="138" y="139" width="3" height="3" />
            <rect x="225" y="232" width="3" height="3" />
            <rect x="228" y="229" width="3" height="3" />
          </g>

          {/* Small italic place names */}
          <g fontFamily="var(--serif)" fontStyle="italic" fontSize="8" fill="var(--ink-soft)" opacity="0.6">
            <text x="146" y="150">Fontainebleau</text>
            <text x="232" y="240">Sens</text>
            <text x="252" y="312">Joigny</text>
          </g>

          {/* ---------- ROUTE ---------- */}

          {/* Dotted shadow underlay */}
          <path d={pathD} fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="2 5" opacity="0.2" />

          {/* Main animated route */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength * (1 - draw),
              transition: 'stroke-dashoffset 0.1s linear',
              filter: 'url(#rough)'
            }}
          />

          {/* Tick marks at intervals along route */}
          {draw > 0.4 && (
            <g stroke="var(--ink)" strokeWidth="1" opacity="0.5">
              <line x1="118" y1="150" x2="124" y2="162" />
              <line x1="186" y1="216" x2="194" y2="226" />
              <line x1="232" y1="294" x2="240" y2="304" />
            </g>
          )}

          {/* Moving carriage */}
          {draw > 0.02 && draw < 0.99 && (
            <g transform={`translate(${carPos.x}, ${carPos.y})`}>
              {/* Subtle trail */}
              <circle r="14" fill="var(--ink)" opacity="0.06" />
              <g transform={`rotate(${carPos.angle})`}>
                <circle r="6" fill="var(--cream)" stroke="var(--ink)" strokeWidth="1.4" />
                <circle r="2.2" fill="var(--ink)" />
                {/* Tiny direction arrow */}
                <path d="M 4 0 L 8 -2 L 8 2 Z" fill="var(--ink)" opacity="0.7" />
              </g>
            </g>
          )}
        </svg>

        {/* Compass */}
        <div className="compass-rose">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="19" cy="19" r="17" />
            <circle cx="19" cy="19" r="13" opacity="0.4" />
            <path d="M19 4 L21 19 L19 34 L17 19 Z" fill="currentColor" opacity="0.7" />
            <path d="M4 19 L19 17 L34 19 L19 21 Z" fill="currentColor" opacity="0.3" />
            <text x="19" y="9" fontSize="6" textAnchor="middle" fontFamily="var(--sans)" fill="currentColor">N</text>
          </svg>
        </div>

        {/* Scale */}
        <div className="map-scale">
          <div className="bar">
            <span/><span/><span/><span/>
          </div>
          <div>0  ·  50  ·  100 km</div>
        </div>

        {/* City pins */}
        <div className="city-pin" style={{ left: '15.5%', top: '14%' }}>
          <span className={`dot ${draw > 0.02 ? 'active' : ''}`}>
            {draw > 0.02 && draw < 0.1 && <span className="pulse" />}
          </span>
          <span className="city-label" style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s 0.5s' }}>
            {t.pin_paris}
            <span className="sub">{t.pin_paris_sub}</span>
          </span>
        </div>

        {/* Mid-waypoint: Sens (cathédrale + landmark sur l'A6) */}
        <div className="city-pin" style={{ left: '54%', top: '52%' }}>
          <span className={`dot ${draw > 0.45 ? 'active' : ''}`} />
          <span className="city-label" style={{ opacity: draw > 0.4 ? 1 : 0, transition: 'opacity 0.6s', fontSize: '14px' }}>
            {t.pin_sens}
            <span className="sub">{t.pin_sens_sub}</span>
          </span>
        </div>

        <div className="city-pin" style={{ left: '82%', top: '80%' }}>
          <span className={`dot ${draw > 0.95 ? 'active' : ''}`}>
            {draw > 0.95 && <span className="pulse" />}
          </span>
          <span className="city-label" style={{ opacity: draw > 0.7 ? 1 : 0, transition: 'opacity 0.6s' }}>
            {t.pin_chaumont}
            <span className="sub">{t.pin_chaumont_sub}</span>
          </span>
        </div>
      </div>

      <div className={`stat-row blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.55s' }}>
        <div className="stat">
          <span className="v">130</span>
          <span className="l">{t.stat_km}</span>
        </div>
        <div className="stat">
          <span className="v">1h45</span>
          <span className="l">{t.stat_duration_label}</span>
        </div>
        <div className="stat">
          <span className="v">A6</span>
          <span className="l">{t.stat_highway_label}</span>
        </div>
      </div>
    </section>
  );
};

window.Journey = Journey;
