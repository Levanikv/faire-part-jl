// AudioBackground — discreet music control floating top-right.
// UI ready for a Qartuli (Georgian polyphonic) loop. The actual audio file
// must be supplied by the user (see SRC below); when missing we hide the button entirely.

const { useState: useStateAudio, useEffect: useEffectAudio, useRef: useRefAudio } = React;

// Set this to your hosted audio URL (or a local path) when you have the track.
// Examples: "audio/qartuli.mp3"  ·  "https://example.com/qartuli.mp3"
const AUDIO_SRC = null;

const AudioBackground = () => {
  const ref = useRefAudio(null);
  const [muted, setMuted] = useStateAudio(true);
  const [hasInteracted, setHasInteracted] = useStateAudio(false);
  const t = (window.useT && window.useT().audio) || {
    activate: 'Activer la musique', mute: 'Couper la musique',
    tip_off: 'Qartuli ♪', tip_on: 'En cours',
  };

  if (!AUDIO_SRC) return null; // no track configured → don't show the button

  useEffectAudio(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = 0.35;
    a.play().catch(() => {});
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (muted) { a.muted = false; a.play().catch(() => {}); setMuted(false); }
    else { a.muted = true; setMuted(true); }
    setHasInteracted(true);
  };

  return (
    <>
      <style>{`
        .audio-fab {
          position: fixed; top: 18px; right: 18px;
          z-index: 100;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(243, 236, 216, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--rule);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all .3s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 4px 18px rgba(31, 36, 25, 0.08);
          opacity: 0;
          transform: scale(0.8);
          animation: audioFabIn 1s 1.2s forwards cubic-bezier(.2,.8,.2,1);
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
          right: 100%;
          margin-right: 10px;
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

        @keyframes audioFabIn { to { opacity: 1; transform: scale(1); } }
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

      <audio ref={ref} src={AUDIO_SRC} loop muted preload="auto" />

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
