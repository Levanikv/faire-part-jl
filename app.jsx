// Main App — assembles all scenes + tweaks panel for palette variations.

const { useState: useStateApp, useEffect: useEffectApp } = React;

// Tweakable palette defaults
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sage-deep"
}/*EDITMODE-END*/;

const palettes = {
  'sage-light': {
    '--sage-deep': '#7a8b6f',
    '--sage': '#9aab8f',
    '--sage-light': '#c8d2bd',
    '--sage-mist': '#dde4d2',
    '--beige-deep': '#e0d4b8',
    '--beige': '#efe7d4',
    '--beige-light': '#f5efe0',
    '--cream': '#faf6ec',
    '--ink': '#3a3e35',
    '--ink-soft': '#5a5e54',
    '--rule': 'rgba(122, 139, 111, 0.22)',
  },
  'sage-medium': {
    '--sage-deep': '#5c6e54',
    '--sage': '#7a8b6f',
    '--sage-light': '#a8b89a',
    '--sage-mist': '#c8d2bd',
    '--beige-deep': '#d4c4a3',
    '--beige': '#e8dfc9',
    '--beige-light': '#f1ead8',
    '--cream': '#f7f2e6',
    '--ink': '#2a2e25',
    '--ink-soft': '#4a4e44',
    '--rule': 'rgba(92, 110, 84, 0.22)',
  },
  'sage-deep': {
    '--sage-deep': '#3d4a36',
    '--sage': '#5c6e54',
    '--sage-light': '#8a9b80',
    '--sage-mist': '#b8c4ac',
    '--beige-deep': '#c8b890',
    '--beige': '#dcd0b0',
    '--beige-light': '#ebe2c8',
    '--cream': '#f3ecd8',
    '--ink': '#1f2419',
    '--ink-soft': '#3a4032',
    '--rule': 'rgba(61, 74, 54, 0.28)',
  },
  'olive': {
    '--sage-deep': '#4a5236',
    '--sage': '#6b754f',
    '--sage-light': '#94a06d',
    '--sage-mist': '#c0c89c',
    '--beige-deep': '#cab983',
    '--beige': '#dccda3',
    '--beige-light': '#ebe1bb',
    '--cream': '#f4ecca',
    '--ink': '#262a18',
    '--ink-soft': '#42482c',
    '--rule': 'rgba(74, 82, 54, 0.28)',
  },
};

const App = () => {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useStateApp(null);

  useEffectApp(() => {
    const p = palettes[tweaks.palette] || palettes['sage-medium'];
    Object.entries(p).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [tweaks.palette]);

  useEffectApp(() => {
    document.body.classList.toggle('has-lang', !!lang);
    if (lang) {
      document.documentElement.setAttribute('lang', lang === 'ge' ? 'ka' : lang);
      // smooth-scroll back to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [lang]);

  // Hide the floating top-bar widgets (language switcher + audio button)
  // when the user scrolls down, reveal them again on scroll-up or near top.
  useEffectApp(() => {
    if (!lang) return;
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 60) {
          document.body.classList.remove('fabs-hidden');
        } else if (delta > 4) {
          document.body.classList.add('fabs-hidden');
        } else if (delta < -4) {
          document.body.classList.remove('fabs-hidden');
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('fabs-hidden');
    };
  }, [lang]);

  // AudioBackground stays mounted from the very first paint so the <audio>
  // ref exists when LangGate fires its click handler — iOS Safari only
  // permits play() inside the originating user gesture.
  return (
    <window.LangContext.Provider value={lang || 'fr'}>
      <window.AudioBackground />
      {!lang ? (
        <window.LangGate onSelect={setLang} />
      ) : (
        <>
          <window.LangSwitcher lang={lang} onSelect={setLang} />
          <Hero />
          <Ceremony />
          <Journey />
          <Reception />
          <Timeline />
          <Practical />
          <DressCode />
          <Weather />
          <BrunchScene />
          <Closing />

          <window.TweaksPanel title="Tweaks">
            <window.TweakSection label="Palette" />
            <window.TweakRadio
              label="Ambiance"
              value={tweaks.palette}
              onChange={(v) => setTweak('palette', v)}
              options={[
                { value: 'sage-light', label: 'Clair' },
                { value: 'sage-medium', label: 'Sauge' },
                { value: 'sage-deep', label: 'Profond' },
                { value: 'olive', label: 'Olive' },
              ]}
            />
          </window.TweaksPanel>
        </>
      )}
    </window.LangContext.Provider>
  );
};

const renderApp = () => {
  const el = document.getElementById('app');
  if (!el) return;
  if (el._reactRoot) {
    el._reactRoot.render(<App />);
  } else {
    el._reactRoot = ReactDOM.createRoot(el);
    el._reactRoot.render(<App />);
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
