// AudioBackground — discreet music control floating top-right.
// The Georgian panduri loop auto-starts (faded in) when the user picks a
// language in LangGate (window.__startBgAudio fires inside that gesture so
// iOS Safari permits playback). The FAB then toggles play/mute manually.

const { useState: useStateAudio, useEffect: useEffectAudio, useRef: useRefAudio } = React;

// Soft Georgian panduri loop (Rustavi — Mtis Melodiebi, 36s segment with
// fade-in/out for clean looping). Mono 80 kbps mp3 ≈ 350 KB.
const AUDIO_SRC = 'audio/panduri.mp3';
const TARGET_VOLUME = 0.32;

const AudioBackground = () => {
  const ref = useRefAudio(null);
  const [muted, setMuted] = useStateAudio(true);
  const [hasInteracted, setHasInteracted] = useStateAudio(false);
  const t = (window.useT && window.useT().audio) || {
    activate: 'Activer la musique', mute: 'Couper la musique',
    tip_off: 'Qartuli ♪', tip_on: 'En cours',
  };

  // Smooth volume ramp — used on play (fade in) and on mute (fade out).
  const fadeTo = useRefAudio(null);
  const fade = (target, ms = 900) => {
    const a = ref.current;
    if (!a) return;
    if (fadeTo.current) cancelAnimationFrame(fadeTo.current);
    const start = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = start + (target - start) * k;
      if (k < 1) fadeTo.current = requestAnimationFrame(step);
    };
    fadeTo.current = requestAnimationFrame(step);
  };

  // Expose a play hook so the LangGate can start the track during the
  // user gesture that selected a language (iOS Safari requires that).
  useEffectAudio(() => {
    window.__startBgAudio = () => {
      const a = ref.current;
      if (!a) return;
      a.muted = false;
      a.volume = 0;
      a.play().then(() => fade(TARGET_VOLUME, 1400)).catch(() => {});
      setMuted(false);
      setHasInteracted(true);
    };
    return () => { delete window.__startBgAudio; };
  }, []);

  // Stop the music when the user leaves the page (tab switch, app
  // background, lock screen, navigation away). Resume on return only if
  // the track was actively playing before the page was hidden.
  useEffectAudio(() => {
    let wasPlaying = false;
    const onVisibility = () => {
      const a = ref.current;
      if (!a) return;
      if (document.hidden) {
        wasPlaying = !a.paused && !a.muted;
        if (wasPlaying) a.pause();
      } else if (wasPlaying) {
        a.play().catch(() => {});
      }
    };
    const onPageHide = () => {
      const a = ref.current;
      if (a) a.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  const toggle = () => {
    setHasInteracted(true);
    const a = ref.current;
    if (a) {
      if (muted) {
        a.muted = false;
        if (a.paused) a.play().catch(() => {});
        fade(TARGET_VOLUME, 700);
      } else {
        fade(0, 500);
        setTimeout(() => { if (ref.current) ref.current.muted = true; }, 520);
      }
    }
    setMuted((m) => !m);
  };

  return (
    <>
      <style>{`
        .audio-fab {
          position: fixed;
          top: max(18px, env(safe-area-inset-top));
          left: max(18px, env(safe-area-inset-left));
          z-index: 100;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(243, 236, 216, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--rule);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          padding: 0;
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          box-shadow: 0 4px 18px rgba(31, 36, 25, 0.08);
          transition:
            opacity 0.9s cubic-bezier(.2,.8,.2,1) 0.6s,
            transform 0.9s cubic-bezier(.2,.8,.2,1) 0.6s,
            background 0.3s;
        }
        body.has-lang .audio-fab {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        body.has-lang.fabs-hidden .audio-fab {
          opacity: 0;
          transform: translateY(-12px) scale(0.92);
          pointer-events: none;
          transition:
            opacity 0.35s cubic-bezier(.2,.8,.2,1),
            transform 0.35s cubic-bezier(.2,.8,.2,1);
        }
        .audio-fab:hover { transform: scale(1.05); background: rgba(243, 236, 216, 0.95); }
        .audio-fab .ico { color: var(--sage-deep); display: block; }
        .audio-fab.playing .wave {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid var(--sage-deep);
          opacity: 0.6;
          animation: audioWave 2s infinite ease-out;
        }
        .audio-fab .label-tip {
          position: absolute;
          left: 100%;
          margin-left: 10px;
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--sage-deep);
          opacity: 0;
          transition: opacity .3s;
          pointer-events: none;
        }
        .audio-fab:hover .label-tip { opacity: 0.85; }

        .audio-fab.invite-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid var(--sage-deep);
          opacity: 0;
          animation: audioInvite 2.6s 2s infinite ease-out;
        }

        @keyframes audioWave  {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @keyframes audioInvite {
          0% { transform: scale(0.9); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>

      <audio ref={ref} src={AUDIO_SRC} loop muted preload="auto" playsInline />

      <button
        className={`audio-fab ${!muted ? 'playing' : ''} ${!hasInteracted ? 'invite-pulse' : ''}`}
        onClick={toggle}
        aria-label={muted ? t.activate : t.mute}
        title={muted ? t.activate : t.mute}
      >
        <span className="label-tip">{muted ? t.tip_off : t.tip_on}</span>
        {!muted && <span className="wave" />}
        <svg className="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {muted ? (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </>
          ) : (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 010 7" />
              <path d="M19 5a9 9 0 010 14" />
            </>
          )}
        </svg>
      </button>
    </>
  );
};

window.AudioBackground = AudioBackground;
