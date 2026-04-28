// GALLERY — Sticky Grid Scroll (full Codrops technique)
// 425vh container · sticky wrapper · 12 photos in 3 cols.
// Timeline: gridReveal (alternating top/bottom stagger) → gridZoom (scale + spread)
// → toggleContent (description + CTA fade-in, title recenters).
// Lenis smooth-scroll powers it all.

const Gallery = () => {
  const sectionRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const descRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const ST = window.ScrollTrigger;

    const block   = sectionRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const title   = titleRef.current;
    const desc    = descRef.current;
    const button  = buttonRef.current;
    const grid    = gridRef.current;
    if (!block || !grid) return;

    // ---- Lenis smooth scroll (window-driven) ----
    let lenis = null;
    if (window.Lenis && !window.__lenis) {
      lenis = new window.Lenis({ lerp: 0.08, wheelMultiplier: 1.1 });
      window.__lenis = lenis;
      lenis.on('scroll', ST.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // ---- Group items by column (3 columns, round-robin) ----
    const items = grid.querySelectorAll('.gal-item');
    const numCols = 3;
    const columns = Array.from({ length: numCols }, () => []);
    items.forEach((item, i) => columns[i % numCols].push(item));

    // ---- Initial state for content ----
    gsap.set([desc, button], { opacity: 0, pointerEvents: 'none' });
    let titleOffsetY = 0;
    if (content && title) {
      const dy = (content.offsetHeight - title.offsetHeight) / 2;
      titleOffsetY = (dy / content.offsetHeight) * 100;
      gsap.set(title, { yPercent: titleOffsetY });
    }

    // ---- Reveal timeline (alternating columns) ----
    const gridReveal = () => {
      const tl = gsap.timeline();
      const wh = window.innerHeight;
      const dy = wh - (wh - grid.offsetHeight) / 2;
      columns.forEach((col, i) => {
        const fromTop = i % 2 === 0;
        tl.from(col, {
          y: dy * (fromTop ? -1 : 1),
          stagger: { each: 0.06, from: fromTop ? 'end' : 'start' },
          ease: 'power1.inOut',
        }, 'reveal');
      });
      return tl;
    };

    // ---- Zoom + spread timeline ----
    const gridZoom = () => {
      const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });
      tl.to(grid, { scale: 1.85 });
      tl.to(columns[0], { xPercent: -38 }, '<');
      tl.to(columns[2], { xPercent: 38 }, '<');
      tl.to(columns[1], {
        yPercent: (idx) => (idx < Math.floor(columns[1].length / 2) ? -1 : 1) * 36,
        duration: 0.5, ease: 'power1.inOut',
      }, '-=0.5');
      return tl;
    };

    // ---- Content reveal/hide ----
    const toggleContent = (visible) => {
      if (!title || !desc || !button) return;
      gsap.timeline({ defaults: { overwrite: true } })
        .to(title, { yPercent: visible ? 0 : titleOffsetY, duration: 0.7, ease: 'power2.inOut' })
        .to([desc, button], {
          opacity: visible ? 1 : 0,
          duration: 0.4,
          ease: `power1.${visible ? 'inOut' : 'out'}`,
          pointerEvents: visible ? 'all' : 'none',
        }, visible ? '-=90%' : '<');
    };

    // ---- Master timeline ----
    const masterST = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 25%',
        end: 'bottom bottom',
        scrub: true,
      },
    });
    masterST
      .add(gridReveal())
      .add(gridZoom(), '-=0.6')
      .add(() => toggleContent(masterST.scrollTrigger.direction === 1), '-=0.32');

    // (parallax-on-scroll removed — was bleeding the wrapper into the section above)

    // ---- Title fade-in ----
    const titleST = gsap.from(title, {
      opacity: 0,
      filter: 'blur(18px)',
      yPercent: titleOffsetY + 8,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: block,
        start: 'top 65%',
        toggleActions: 'play none none reset',
      },
    });

    // refresh after layout settles
    requestAnimationFrame(() => ST.refresh());

    return () => {
      masterST.scrollTrigger?.kill();
      masterST.kill();
      titleST.scrollTrigger?.kill();
      titleST.kill();
      gsap.set([desc, button, title, ...items, grid, wrapper], { clearProps: 'all' });
    };
  }, []);

  // 12 souvenirs (3 columns × 4 rows). Color tones rotate sage / cream / beige.
  const photos = [
    { lbl: 'Le premier regard',  d: 'Mai 2019',     tone: '#a8b89a' },
    { lbl: 'Tbilissi',           d: 'Été 2020',     tone: '#c8b890' },
    { lbl: 'Sous la pluie',      d: 'Paris 2021',   tone: '#5c6e54' },
    { lbl: 'Premier voyage',     d: 'Géorgie 2022', tone: '#7a8b6f' },
    { lbl: 'Premier appart',     d: 'Paris 2022',   tone: '#9aab8f' },
    { lbl: 'Vignes de Kakheti',  d: 'Été 2023',     tone: '#d4c4a3' },
    { lbl: "Au bord de l'eau",   d: 'Bretagne 2023',tone: '#7a8b6f' },
    { lbl: 'Hiver',              d: 'Tbilissi 2024',tone: '#3d4a36' },
    { lbl: 'La demande',         d: 'Décembre 2024',tone: '#5c6e54' },
    { lbl: 'Le matin',           d: 'Paris 2025',   tone: '#c8b890' },
    { lbl: 'Au parc',            d: 'Été 2025',     tone: '#a8b89a' },
    { lbl: 'Ensemble',           d: "Aujourd'hui",  tone: '#8a9b80' },
  ];

  return (
    <section className="scene gallery-codrops" ref={sectionRef} data-screen-label="08 Galerie">
      <style>{`
        .gallery-codrops {
          background: var(--cream);
          padding: 0 !important;
          gap: 0;
          height: 425svh; /* the scroll runway */
          min-height: 425svh !important;
          display: block !important;
          overflow: visible;
          position: relative;
        }
        .gal-wrapper {
          position: sticky;
          top: 0;
          height: 100svh;
          width: 100%;
          padding: 0 20px;
          overflow: hidden;
          background: var(--cream);
        }
        /* Centered content layer (always visible — title morphs) */
        .gal-content {
          position: relative;
          z-index: 2;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          width: 100%; height: 100svh;
          text-align: center;
          pointer-events: none;
        }
        .gal-eyebrow {
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0.85;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .gal-eyebrow .num { color: var(--sage); }
        .gal-title {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(54px, 14vw, 84px);
          line-height: 0.95;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin: 0;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4);
        }
        .gal-title em {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          color: var(--sage-deep);
          display: block;
          font-size: 0.42em;
          letter-spacing: 0.02em;
          margin-top: 6px;
        }
        .gal-desc {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          color: var(--sage-deep);
          max-width: 320px;
          margin: 22px 0 0;
          pointer-events: auto;
        }
        .gal-cta {
          margin-top: 24px;
          padding: 13px 26px;
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--cream);
          background: var(--ink);
          border: 1px solid var(--ink);
          border-radius: 999px;
          cursor: pointer;
          pointer-events: auto;
          transition: transform .3s, background .3s;
        }
        .gal-cta:hover { transform: translateY(-1px); background: var(--sage-deep); border-color: var(--sage-deep); }

        /* Gallery grid — absolutely centered, will be transformed by GSAP */
        .gal-grid-abs {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: min(360px, calc(100vw - 40px));
          z-index: 1;
        }
        .gal-grid-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 10px;
          row-gap: 12px;
          margin: 0; padding: 0; list-style: none;
        }
        .gal-item {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          border-radius: 2px;
          position: relative;
          background: var(--beige-deep);
          border: 1px solid var(--rule);
          will-change: transform;
        }
        .gal-fill {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 28% 32%, rgba(255,255,255,0.55) 0%, transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.10) 0%, transparent 55%),
            linear-gradient(135deg, var(--ph-tone) 0%, var(--beige-deep) 100%);
        }
        .gal-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='1'/><feColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.43 0 0 0 0 0.33 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          mix-blend-mode: multiply;
          opacity: 0.55;
        }
        .gal-glyph {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.20;
          color: var(--cream);
        }
        .gal-tag {
          position: absolute;
          left: 6px; right: 6px; bottom: 6px;
          display: flex; justify-content: space-between; align-items: baseline; gap: 6px;
          font-family: var(--sans); font-size: 6.5px;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(247, 242, 230, 0.92);
          z-index: 2;
        }
        .gal-tag .lbl {
          font-family: var(--serif); font-style: italic;
          text-transform: none; letter-spacing: 0.01em;
          font-size: 9.5px;
        }
      `}</style>

      <div className="gal-wrapper" ref={wrapperRef}>
        <div className="gal-content" ref={contentRef}>
          <div className="gal-eyebrow"><span className="num">·</span><span>Notre histoire</span></div>
          <h2 className="gal-title" ref={titleRef}>
            Six ans<em>en images</em>
          </h2>
          <p className="gal-desc" ref={descRef}>
            De Paris à Tbilissi, des vignes de Kakheti<br/>
            aux dimanches au parc — une vie qui s'écrit.
          </p>
          <button className="gal-cta" ref={buttonRef}>
            Voir l'album
          </button>
        </div>

        <div className="gal-grid-abs">
          <ul className="gal-grid-list" ref={gridRef}>
            {photos.map((p, i) => (
              <li key={i} className="gal-item" style={{ '--ph-tone': p.tone }}>
                <span className="gal-fill" />
                <span className="gal-grain" />
                <span className="gal-glyph">
                  <svg width="22" height="22" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <circle cx="18" cy="14" r="6" />
                    <path d="M6 30 Q12 22, 18 22 Q24 22, 30 30" />
                  </svg>
                </span>
                <div className="gal-tag">
                  <span className="lbl">{p.lbl}</span>
                  <span>{p.d}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Weather = () => {
  const ref = React.useRef(null);
  const [inView] = window.useInView(ref);
  return (
    <section className="scene weather" ref={ref} data-screen-label="09 Météo" style={{minHeight: 'auto'}}>
      <style>{`
        .weather { background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 100%); padding: 60px 28px 72px; gap: 16px; align-items: center; }
        :where(.weather) { min-height: auto; }
        .w-card { width: 100%; padding: 22px 24px; border: 1px solid var(--rule); background: var(--beige-light); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .w-card .l { font-family: var(--sans); font-size: 9px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--sage-deep); opacity: 0.8; margin-bottom: 8px; }
        .w-card .v { font-family: var(--display); font-size: 28px; color: var(--ink); letter-spacing: -0.005em; }
        .w-card .v em { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: 14px; color: var(--sage-deep); margin-left: 6px; }
      `}</style>
      <div className={`w-card blur-in ${inView ? 'in' : ''}`}>
        <div>
          <div className="l">Bourgogne · début septembre</div>
          <div className="v">22°<em>doux</em></div>
        </div>
        <span style={{ color: 'var(--sage-deep)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <circle cx="20" cy="20" r="6" />
            <line x1="20" y1="6" x2="20" y2="10" /><line x1="20" y1="30" x2="20" y2="34" />
            <line x1="6" y1="20" x2="10" y2="20" /><line x1="30" y1="20" x2="34" y2="20" />
            <line x1="10" y1="10" x2="13" y2="13" /><line x1="27" y1="27" x2="30" y2="30" />
            <line x1="10" y1="30" x2="13" y2="27" /><line x1="27" y1="13" x2="30" y2="10" />
          </svg>
        </span>
      </div>
    </section>
  );
};

const Playlist = () => null;
window.Gallery = Gallery;
window.Playlist = Playlist;
window.Weather = Weather;
