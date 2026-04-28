// Reusable inline SVG illustrations (line-art, sauge stroke)

const Sprig = ({ size = 32, color = 'currentColor', className = '' }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M32 4 C32 22, 32 44, 32 60" />
    <path d="M32 14 C24 14, 18 18, 14 24" />
    <path d="M32 14 C40 14, 46 18, 50 24" />
    <path d="M32 24 C25 24, 20 28, 17 34" />
    <path d="M32 24 C39 24, 44 28, 47 34" />
    <path d="M32 34 C26 34, 22 38, 20 44" />
    <path d="M32 34 C38 34, 42 38, 44 44" />
    <path d="M32 44 C28 44, 25 48, 24 53" />
    <path d="M32 44 C36 44, 39 48, 40 53" />
  </svg>
);

const Olive = ({ size = 36, color = 'currentColor' }) => (
  <svg viewBox="0 0 80 40" width={size} height={size * 0.5} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
    <path d="M40 20 C30 16, 20 14, 8 14" />
    <ellipse cx="14" cy="13" rx="5" ry="2.2" transform="rotate(-15 14 13)" />
    <ellipse cx="22" cy="11" rx="5" ry="2.2" transform="rotate(-12 22 11)" />
    <ellipse cx="30" cy="13" rx="5" ry="2.2" transform="rotate(-8 30 13)" />
    <path d="M40 20 C50 16, 60 14, 72 14" />
    <ellipse cx="66" cy="13" rx="5" ry="2.2" transform="rotate(15 66 13)" />
    <ellipse cx="58" cy="11" rx="5" ry="2.2" transform="rotate(12 58 11)" />
    <ellipse cx="50" cy="13" rx="5" ry="2.2" transform="rotate(8 50 13)" />
  </svg>
);

const Church = ({ width = 280, drawn = 0 }) => {
  // drawn: 0 → 1, controls path stroke-dashoffset for "drawing" effect
  const offset = (1 - drawn) * 1200;
  return (
    <svg viewBox="0 0 280 240" width={width} height={width * (240/280)} fill="none" stroke="var(--sage-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
      <g style={{ strokeDasharray: 1200, strokeDashoffset: offset, transition: 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)' }}>
        {/* Ground line */}
        <path d="M10 220 L270 220" opacity="0.5" />
        {/* Main body */}
        <path d="M70 220 L70 130 L140 90 L210 130 L210 220" />
        {/* Door */}
        <path d="M125 220 L125 175 Q140 160 155 175 L155 220" />
        <path d="M140 175 L140 220" opacity="0.5" />
        {/* Windows */}
        <path d="M88 155 L88 170 Q95 162 102 170 L102 155 Z" opacity="0.7" />
        <path d="M178 155 L178 170 Q185 162 192 170 L192 155 Z" opacity="0.7" />
        {/* Tower */}
        <path d="M125 90 L125 50 L155 50 L155 90" />
        <path d="M120 50 L140 20 L160 50" />
        {/* Cross */}
        <path d="M140 20 L140 4 M134 10 L146 10" />
        {/* Bell window */}
        <path d="M134 65 L134 78 Q140 72 146 78 L146 65 Z" opacity="0.7" />
        {/* Roof line */}
        <path d="M70 130 L65 135 M210 130 L215 135" opacity="0.4" />
      </g>
    </svg>
  );
};

const Chateau = ({ width = 320, drawn = 0 }) => {
  const offset = (1 - drawn) * 1800;
  return (
    <svg viewBox="0 0 320 220" width={width} height={width * (220/320)} fill="none" stroke="var(--sage-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
      <g style={{ strokeDasharray: 1800, strokeDashoffset: offset, transition: 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)' }}>
        <path d="M5 200 L315 200" opacity="0.5" />
        {/* Left tower */}
        <path d="M30 200 L30 110 L70 110 L70 200" />
        <path d="M25 110 L50 80 L75 110" />
        <path d="M50 80 L50 65" />
        <circle cx="50" cy="62" r="2" />
        {/* Main body */}
        <path d="M70 200 L70 130 L250 130 L250 200" />
        {/* Central entrance */}
        <path d="M145 200 L145 165 Q160 145 175 165 L175 200" />
        {/* Windows row */}
        <path d="M88 160 L88 178 L102 178 L102 160 Z" opacity="0.6" />
        <path d="M115 160 L115 178 L129 178 L129 160 Z" opacity="0.6" />
        <path d="M191 160 L191 178 L205 178 L205 160 Z" opacity="0.6" />
        <path d="M218 160 L218 178 L232 178 L232 160 Z" opacity="0.6" />
        {/* Upper windows */}
        <path d="M100 142 L108 142 M132 142 L140 142 M180 142 L188 142 M212 142 L220 142" opacity="0.5" />
        {/* Right tower */}
        <path d="M250 200 L250 100 L290 100 L290 200" />
        <path d="M245 100 L270 70 L295 100" />
        <path d="M270 70 L270 55" />
        <circle cx="270" cy="52" r="2" />
        {/* Mansard roof */}
        <path d="M70 130 L80 115 L240 115 L250 130" />
        <path d="M155 115 L160 100 L165 115" />
        {/* Trees flanking */}
        <path d="M10 200 Q4 185 10 175 Q16 185 10 200" opacity="0.7" />
        <path d="M310 200 Q304 185 310 175 Q316 185 310 200" opacity="0.7" />
        <path d="M10 175 L10 200 M310 175 L310 200" opacity="0.5" />
      </g>
    </svg>
  );
};

// J&L monogram — Cormorant Garamond serif for J and L, calligraphic ampersand,
// sage arabesque loop swooping under both letters. Mirrors classic wedding monograms.
const MonoLogo = ({ size = 110, ink = 'var(--ink)', accent = 'var(--sage-light)' }) => (
  <svg
    viewBox="0 0 220 180"
    width={size}
    height={size * (180/220)}
    fill="none"
    style={{ overflow: 'visible' }}
    aria-label="J et L"
  >
    {/* Sage arabesque — sweeping loop that goes under the J, around the L, and curls back */}
    <g stroke={accent} strokeWidth="1.4" strokeLinecap="round" fill="none">
      {/* Main flowing curve: starts top-left, dips under both letters, swoops up around L, curls back */}
      <path d="M 28 96
               C 24 70, 50 50, 72 64
               C 90 76, 86 100, 70 116
               C 50 134, 28 142, 60 156
               C 100 170, 158 168, 188 144
               C 212 124, 212 92, 192 80
               C 174 70, 152 84, 152 102" />
      {/* Tiny end-curl on the left */}
      <path d="M 28 96 C 24 92, 24 86, 30 86" opacity="0.7" />
    </g>

    {/* J — Cormorant italic */}
    <text
      x="78" y="120"
      fill={ink}
      fontFamily="'Cormorant Garamond', 'Italiana', serif"
      fontStyle="italic"
      fontWeight="400"
      fontSize="118"
      letterSpacing="-2"
    >J</text>

    {/* Calligraphic ampersand — Pinyon Script for the script feel */}
    <text
      x="100" y="100"
      fill={ink}
      fontFamily="'Pinyon Script', 'Cormorant Garamond', cursive"
      fontWeight="400"
      fontSize="58"
    >&amp;</text>

    {/* L — Cormorant italic, mirrored placement */}
    <text
      x="138" y="120"
      fill={ink}
      fontFamily="'Cormorant Garamond', 'Italiana', serif"
      fontStyle="italic"
      fontWeight="400"
      fontSize="118"
      letterSpacing="-2"
    >L</text>
  </svg>
);

const Compass = ({ size = 24, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8 L11 11 L8 16 L13 13 Z" fill={color} fillOpacity="0.3" />
  </svg>
);

// Saint-Stéphane (Paris) — cathédrale grecque-orthodoxe, style néo-byzantin
// Façade en pierre claire : fronton triangulaire central avec icône, deux campaniles
// latéraux sobres, grande coupole byzantine derrière, croix orthodoxes à trois barres.
const Cathedral = ({ width = 300, drawn = 0 }) => {
  const offset = (1 - drawn) * 2400;
  return (
    <svg viewBox="0 0 300 260" width={width} height={width * (260/300)} fill="none" stroke="var(--sage-deep)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
      <line x1="14" y1="244" x2="286" y2="244" strokeDasharray="2 4" opacity="0.35" />

      <g style={{ strokeDasharray: 2400, strokeDashoffset: offset, transition: 'stroke-dashoffset 1.8s ease-out' }}>

        {/* ============ MAIN BYZANTINE DOME (large, behind) ============ */}
        {/* Drum */}
        <path d="M118 130 L118 100 L182 100 L182 130" />
        {/* Dome — half-circle, slightly raised (byzantine half-onion) */}
        <path d="M114 100 Q114 56 150 54 Q186 56 186 100" />
        {/* Dome ribs */}
        <path d="M150 54 L150 100" opacity="0.35" />
        <path d="M126 70 Q138 60 150 58" opacity="0.3" />
        <path d="M174 70 Q162 60 150 58" opacity="0.3" />
        {/* Drum windows (arched, vertical) */}
        <path d="M126 124 L126 110 Q126 106 130 106 Q134 106 134 110 L134 124" opacity="0.6" />
        <path d="M146 124 L146 108 Q146 104 150 104 Q154 104 154 108 L154 124" opacity="0.6" />
        <path d="M166 124 L166 110 Q166 106 170 106 Q174 106 174 110 L174 124" opacity="0.6" />
        {/* Cross atop dome — orthodox 3-bar */}
        <path d="M150 54 L150 30" />
        <path d="M144 36 L156 36" />
        <path d="M142 42 L158 42" />
        <path d="M147 48 L153 48" opacity="0.7" />

        {/* ============ LEFT CAMPANILE (smaller, square tower) ============ */}
        <path d="M44 244 L44 110 L84 110 L84 244" />
        {/* Belfry roof — flat pitched */}
        <path d="M40 110 L64 88 L88 110" />
        {/* Small dome on belfry */}
        <path d="M58 88 Q58 80 64 78 Q70 80 70 88" />
        <path d="M64 78 L64 70" />
        <path d="M61 73 L67 73" />
        <path d="M60 76 L68 76" opacity="0.7" />
        {/* Belfry openings */}
        <path d="M52 100 L52 92 Q52 88 56 88 Q60 88 60 92 L60 100" opacity="0.6" />
        <path d="M68 100 L68 92 Q68 88 72 88 Q76 88 76 92 L76 100" opacity="0.6" />
        {/* Window rows */}
        <path d="M54 150 L54 134 Q54 128 64 128 Q74 128 74 134 L74 150 Z" opacity="0.55" />
        <path d="M54 188 L54 172 Q54 166 64 166 Q74 166 74 172 L74 188 Z" opacity="0.55" />

        {/* ============ RIGHT CAMPANILE (mirror) ============ */}
        <path d="M216 244 L216 110 L256 110 L256 244" />
        <path d="M212 110 L236 88 L260 110" />
        <path d="M230 88 Q230 80 236 78 Q242 80 242 88" />
        <path d="M236 78 L236 70" />
        <path d="M233 73 L239 73" />
        <path d="M232 76 L240 76" opacity="0.7" />
        <path d="M224 100 L224 92 Q224 88 228 88 Q232 88 232 92 L232 100" opacity="0.6" />
        <path d="M240 100 L240 92 Q240 88 244 88 Q248 88 248 92 L248 100" opacity="0.6" />
        <path d="M226 150 L226 134 Q226 128 236 128 Q246 128 246 134 L246 150 Z" opacity="0.55" />
        <path d="M226 188 L226 172 Q226 166 236 166 Q246 166 246 172 L246 188 Z" opacity="0.55" />

        {/* ============ CENTRAL FACADE between campaniles ============ */}
        <path d="M84 244 L84 130 L216 130 L216 244" />

        {/* Triangular pediment with icon niche */}
        <path d="M84 130 L150 96 L216 130" />
        {/* Icon niche in pediment */}
        <path d="M138 122 L138 108 Q138 104 150 104 Q162 104 162 108 L162 122 Z" opacity="0.5" />
        <path d="M150 104 L150 122" opacity="0.3" />
        {/* Pediment cross */}
        <path d="M150 96 L150 80" />
        <path d="M144 86 L156 86" />
        <path d="M142 91 L158 91" opacity="0.7" />

        {/* ============ MAIN ARCHED ENTRANCE (rounded — byzantine) ============ */}
        <path d="M120 244 L120 200 Q120 174 150 174 Q180 174 180 200 L180 244" />
        <path d="M150 174 L150 244" opacity="0.4" />
        {/* Arch decorative inner ring */}
        <path d="M126 200 Q150 180 174 200" opacity="0.4" />

        {/* Two side windows — large rounded arches */}
        <path d="M94 200 L94 168 Q94 152 104 152 Q114 152 114 168 L114 200 Z" opacity="0.55" />
        <path d="M104 152 L104 200" opacity="0.3" />
        <path d="M186 200 L186 168 Q186 152 196 152 Q206 152 206 168 L206 200 Z" opacity="0.55" />
        <path d="M196 152 L196 200" opacity="0.3" />

        {/* Steps */}
        <path d="M104 244 L104 240 L196 240 L196 244" opacity="0.6" />
        <path d="M110 240 L110 236 L190 236 L190 240" opacity="0.5" />
      </g>
    </svg>
  );
};

// Brunch — coffee cup + croissant
const BrunchIcon = ({ size = 72, color = 'var(--sage-deep)' }) => (
  <svg viewBox="0 0 120 80" width={size} height={size * (80/120)} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Cup */}
    <path d="M14 30 L14 56 Q14 64 22 64 L52 64 Q60 64 60 56 L60 30 Z" />
    <path d="M14 30 L60 30" />
    <path d="M60 36 Q72 36 72 46 Q72 56 60 56" />
    {/* Steam */}
    <path d="M26 24 Q22 18 26 12 Q30 6 26 0" opacity="0.6" />
    <path d="M37 24 Q33 18 37 12 Q41 6 37 0" opacity="0.4" />
    <path d="M48 24 Q44 18 48 12 Q52 6 48 0" opacity="0.6" />
    {/* Croissant */}
    <path d="M76 56 Q82 38 100 38 Q118 38 112 56 Q108 64 100 64 Q82 64 76 56 Z" />
    <path d="M82 52 L88 56" opacity="0.5" />
    <path d="M92 48 L96 54" opacity="0.5" />
    <path d="M102 48 L106 54" opacity="0.5" />
  </svg>
);

Object.assign(window, { Sprig, Olive, Church, Cathedral, Chateau, MonoLogo, RingsLogo: MonoLogo, Compass, BrunchIcon });
