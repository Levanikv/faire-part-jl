// MY ROOM — Page autonome de recherche de chambre.
// Port du room-finder v4 vers l'architecture du faire-part (i18n + window.*).

(() => {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  /* ─── DONNÉES EXEMPLES (à remplacer par les vrais invités) ───────── */
  // Notes possibles : 'groundfloor' | 'groundfloor_court' | 'dormitory'
  //                   | 'annex' | 'family_room' | null
  const GUESTS = [
    { name: 'Marie Lambert',    room: '210' },
    { name: 'Sophie Lambert',   room: '203', sharedWith: ['Pierre Lambert'] },
    { name: 'Pierre Lambert',   room: '203', sharedWith: ['Sophie Lambert'] },
    { name: 'Tamar Tsiklauri',  room: '328', aliases: ['Tamta'], note: 'dormitory' },
    { name: 'Cousins',          room: '510', sharedWith: ['Léo', 'Mathis', 'Noah'], note: 'annex' },
    { name: 'Grand-père Henri', room: '130', sharedWith: ['Suzanne Lambert'], note: 'groundfloor' },
  ];

  // ROOMS_META : clés stables (wing / view) — traduites au rendu via t.wing_*/t.view_*.
  // floor est numérique : 0/1/2 (annexe = 0 + label spécial).
  const ROOMS_META = {
    '201': { wing: 'south',  floor: 1, view: 'park' },
    '202': { wing: 'south',  floor: 1, view: 'park' },
    '203': { wing: 'south',  floor: 1, view: 'park' },
    '204': { wing: 'south',  floor: 1, view: 'park' },
    '205': { wing: 'south',  floor: 1, view: 'park' },
    '206': { wing: 'center', floor: 1, view: 'court' },
    '207': { wing: 'center', floor: 1, view: 'court' },
    '208': { wing: 'center', floor: 1, view: 'court' },
    '209': { wing: 'center', floor: 1, view: 'court' },
    '210': { wing: 'center', floor: 1, view: 'court' },
    '211': { wing: 'center', floor: 1, view: 'court' },
    '212': { wing: 'center', floor: 1, view: 'court' },
    '214': { wing: 'center', floor: 1, view: 'family' },
    '215': { wing: 'center', floor: 1, view: 'garden' },
    '220': { wing: 'center', floor: 1, view: 'corridor' },
    '221': { wing: 'center', floor: 1, view: 'corridor' },
    '328': { wing: 'center', floor: 2, view: 'dormitory' },
    '329': { wing: 'center', floor: 2, view: 'terrace' },
    '330': { wing: 'center', floor: 2, view: 'terrace' },
    '331': { wing: 'center', floor: 2, view: 'terrace' },
    '332': { wing: 'center', floor: 2, view: 'terrace' },
    '333': { wing: 'center', floor: 2, view: 'terrace' },
    '216': { wing: 'north',  floor: 1, view: 'court' },
    '217': { wing: 'north',  floor: 1, view: 'court' },
    '218': { wing: 'north',  floor: 1, view: 'court' },
    '219': { wing: 'north',  floor: 1, view: 'court' },
    '120': { wing: 'north',  floor: 0, view: 'courtyard' },
    '130': { wing: 'north',  floor: 0, view: 'courtyard' },
    '140': { wing: 'north',  floor: 0, view: 'courtyard' },
    '150': { wing: 'north',  floor: 0, view: 'courtyard' },
    '160': { wing: 'north',  floor: 0, view: 'courtyard' },
    '510': { wing: 'annex',  floor: 0, view: 'oldbuilding', floorKey: 'annex' },
    '520': { wing: 'annex',  floor: 0, view: 'oldbuilding', floorKey: 'annex' },
  };

  // ROOM_RECTS : coordonnées du highlight sur le plan SVG.
  // Identique au room-finder v4.
  const ROOM_RECTS = {
    '334-ext': [115, 100, 60, 35],
    '334':     [179, 114, 41, 17],
    '333':     [201, 84, 39, 21],
    '332':     [240, 84, 38, 21],
    '331':     [220, 114, 60, 17],
    '330':     [280, 114, 60, 17],
    '329':     [378, 84, 36, 21],
    '328':     [491, 79, 60, 57],
    '206':     [179, 169, 41, 18], '207': [220, 169, 38, 18], '208': [258, 169, 38, 18],
    '209':     [296, 169, 44, 18], '210': [340, 169, 45, 18], '211': [385, 169, 40, 18],
    '212':     [425, 169, 36, 18], '214': [481, 164, 50, 26], '215': [481, 190, 50, 26],
    '220':     [265, 196, 80, 15], '221': [179, 196, 86, 15],
    '201':     [99, 244, 47, 41],  '202': [99, 333, 47, 41],  '203': [99, 423, 47, 41],
    '204':     [99, 513, 47, 41],  '205': [99, 603, 47, 41],
    '216':     [554, 244, 47, 41], '217': [554, 287, 47, 47], '218': [554, 342, 47, 47], '219': [554, 394, 47, 42],
    '120':     [554, 464, 47, 36], '130': [554, 503, 47, 41], '140': [554, 548, 47, 41],
    '150':     [554, 598, 47, 49], '160': [554, 665, 47, 43],
    '510':     [609, 644, 57, 46], '520': [609, 690, 57, 46],
  };
  const ROOM_EXTRA = { '334': ['334-ext'] };

  const PLAN_W = 720, PLAN_H = 820;
  const ZOOM_MIN = 1, ZOOM_MAX = 4.5;

  /* ─── UTILS ──────────────────────────────────────────────────────── */
  const normalize = (s) => (s || '')
    .toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').trim();

  const scoreMatch = (query, target) => {
    const q = normalize(query), t = normalize(target);
    if (!q || !t) return 0;
    if (t === q) return 1;
    if (t.startsWith(q)) return 0.95;
    const words = t.split(/\s+/);
    for (const w of words) {
      if (w === q) return 0.92;
      if (w.startsWith(q)) return 0.85;
    }
    if (t.includes(q)) return 0.7;
    for (const w of words) if (w.includes(q)) return 0.55;
    return 0;
  };

  const searchGuests = (query, limit = 5) => {
    if (!query || query.length < 1) return [];
    const seen = new Set();
    const results = [];
    for (const g of GUESTS) {
      const allNames = [g.name, ...(g.aliases || [])];
      let best = 0;
      for (const n of allNames) best = Math.max(best, scoreMatch(query, n));
      if (best > 0.3) {
        const key = `${g.room}::${g.name}`;
        if (!seen.has(key)) { seen.add(key); results.push({ ...g, _score: best }); }
      }
    }
    results.sort((a, b) => b._score - a._score);
    return results.slice(0, limit);
  };

  const HighlightMatch = ({ text, query }) => {
    if (!query) return text;
    const nq = normalize(query);
    const nt = normalize(text);
    const i = nt.indexOf(nq);
    if (i === -1) return text;
    return (<>{text.slice(0, i)}<mark>{text.slice(i, i + nq.length)}</mark>{text.slice(i + nq.length)}</>);
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Helpers de mapping clés → libellés traduits
  const wingLabel = (t, key) => t[`wing_${key}`] || key;
  const viewLabel = (t, key) => t[`view_${key}`] || key;
  const floorShort = (t, n) => t[`floor_short_${n}`] || String(n);
  const floorLong = (t, n, floorKey) => (floorKey && t[`floor_long_${floorKey}`]) || t[`floor_long_${n}`] || String(n);

  /* ─── ICONS ──────────────────────────────────────────────────────── */
  const SearchIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>
    </svg>
  );
  const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  );
  const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const FitIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 9 4 4 9 4"/><polyline points="20 9 20 4 15 4"/>
      <polyline points="20 15 20 20 15 20"/><polyline points="4 15 4 20 9 20"/>
    </svg>
  );
  const TargetIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
    </svg>
  );
  const PinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-7-7.2-7-13a7 7 0 1 1 14 0c0 5.8-7 13-7 13z"/>
      <circle cx="12" cy="9" r="2.4"/>
    </svg>
  );

  // 1-2 initiales en majuscules à partir d'un nom complet
  const getInitials = (name) => (name || '')
    .split(/\s+/).filter(Boolean)
    .map(w => w[0]).join('').slice(0, 2).toUpperCase();

  /* ─── PLAN SVG STATIQUE + halos animés ───────────────────────────── */
  // NB : les libellés gravés dans le SVG (Sud / Centre / Nord / sdb / esc /
  // numéros de chambres) restent en français — ce sont des annotations
  // architecturales du château, pas du chrome UI.
  const PlanBody = ({ activeRoom }) => {
    const highlightIds = activeRoom ? [activeRoom, ...(ROOM_EXTRA[activeRoom] || [])] : [];
    return (
      <>
        {/* 2e étage centre */}
        <path className="wall" d="M 175 80 L 495 80 L 495 75 L 555 75 L 555 140 L 495 140 L 495 135 L 175 135 Z M 179 84 L 491 84 L 491 79 L 551 79 L 551 136 L 491 136 L 491 131 L 179 131 Z"/>
        <path className="wall" d="M 115 100 L 175 100 L 175 135 L 115 135 Z M 119 104 L 171 104 L 171 131 L 119 131 Z"/>
        <rect className="room-fill" x="179" y="84" width="312" height="47"/>
        <rect className="room-fill" x="491" y="79" width="60" height="57"/>
        <rect className="room-fill" x="119" y="104" width="52" height="27"/>
        <rect className="corridor-fill" x="179" y="105" width="312" height="9"/>
        <line className="wall-thin" x1="210" y1="84" x2="210" y2="105"/><line className="wall-thin" x1="244" y1="84" x2="244" y2="105"/>
        <line className="wall-thin" x1="276" y1="84" x2="276" y2="105"/><line className="wall-thin" x1="310" y1="84" x2="310" y2="105"/>
        <line className="wall-thin" x1="342" y1="84" x2="342" y2="105"/><line className="wall-thin" x1="380" y1="84" x2="380" y2="105"/>
        <line className="wall-thin" x1="414" y1="84" x2="414" y2="105"/><line className="wall-thin" x1="450" y1="84" x2="450" y2="105"/>
        <text className="sdb" x="194" y="98">sdb</text><text className="lbl" x="227" y="98">333</text>
        <text className="sdb" x="260" y="98">sdb</text><text className="lbl" x="293" y="98">332</text>
        <text className="sdb" x="326" y="98">sdb</text><text className="sdb" x="361" y="98">asc</text>
        <text className="lbl" x="397" y="98">329</text><text className="sdb" x="432" y="98">sdb</text><text className="sdb" x="470" y="98">esc</text>
        <line className="wall-thin" x1="220" y1="114" x2="220" y2="131"/><line className="wall-thin" x1="280" y1="114" x2="280" y2="131"/>
        <line className="wall-thin" x1="340" y1="114" x2="340" y2="131"/><line className="wall-thin" x1="400" y1="114" x2="400" y2="131"/>
        <line className="wall-thin" x1="450" y1="114" x2="450" y2="131"/>
        <text className="sdb" x="200" y="124">res</text><text className="lbl" x="250" y="124">331</text>
        <text className="lbl" x="310" y="124">330</text><text className="sdb" x="370" y="124">sdb</text>
        <text className="sdb" x="425" y="124">sdb</text><text className="sdb" x="470" y="124">esc</text>
        <text className="lbl" x="145" y="120">334</text>
        <line className="wall-thin" x1="491" y1="108" x2="551" y2="108"/>
        <text className="lbl" x="521" y="100">328</text><text className="sdb" x="521" y="123">dortoir</text>
        <text className="zone" x="335" y="73">2ᵉ ÉTAGE — CENTRE</text>

        {/* 1er étage centre */}
        <path className="wall" d="M 175 165 L 485 165 L 485 160 L 535 160 L 535 220 L 485 220 L 485 215 L 175 215 Z M 179 169 L 481 169 L 481 164 L 531 164 L 531 216 L 481 216 L 481 211 L 179 211 Z"/>
        <rect className="room-fill" x="179" y="169" width="302" height="42"/>
        <rect className="room-fill" x="481" y="164" width="50" height="52"/>
        <rect className="corridor-fill" x="179" y="187" width="302" height="9"/>
        <line className="wall-thin" x1="220" y1="169" x2="220" y2="187"/><line className="wall-thin" x1="258" y1="169" x2="258" y2="187"/>
        <line className="wall-thin" x1="296" y1="169" x2="296" y2="187"/><line className="wall-thin" x1="340" y1="169" x2="340" y2="187"/>
        <line className="wall-thin" x1="385" y1="169" x2="385" y2="187"/><line className="wall-thin" x1="425" y1="169" x2="425" y2="187"/>
        <text className="lbl" x="200" y="181">206</text><text className="lbl" x="239" y="181">207</text>
        <text className="lbl" x="277" y="181">208</text><text className="lbl" x="318" y="181">209</text>
        <text className="lbl" x="362" y="181">210</text><text className="lbl" x="405" y="181">211</text>
        <text className="lbl" x="443" y="181">212</text>
        <line className="wall-thin" x1="265" y1="196" x2="265" y2="211"/><line className="wall-thin" x1="345" y1="196" x2="345" y2="211"/>
        <line className="wall-thin" x1="420" y1="196" x2="420" y2="211"/>
        <text className="lbl" x="222" y="206">221</text><text className="lbl" x="305" y="206">220</text>
        <text className="sdb" x="382" y="205">s.d. bains</text><text className="sdb" x="450" y="205">asc</text>
        <line className="wall-thin" x1="481" y1="190" x2="531" y2="190"/>
        <text className="lbl" x="506" y="180">214</text><text className="lbl" x="506" y="205">215</text>
        <text className="zone" x="335" y="159">1ᵉʳ ÉTAGE — CENTRE</text>

        {/* Aile Sud */}
        <path className="wall" d="M 95 240 L 175 240 L 175 740 L 95 740 Z M 99 244 L 171 244 L 171 736 L 99 736 Z"/>
        <rect className="room-fill" x="99" y="244" width="72" height="492"/>
        <rect className="corridor-fill" x="146" y="244" width="25" height="492"/>
        <line className="wall-thin" x1="146" y1="244" x2="146" y2="736"/>
        <line className="wall-thin" x1="99" y1="290" x2="146" y2="290"/><line className="wall-thin" x1="99" y1="330" x2="146" y2="330"/>
        <text className="lbl" x="122" y="272">201</text><text className="sdb" x="122" y="312">sdb</text>
        <line className="wall-thin" x1="99" y1="380" x2="146" y2="380"/><line className="wall-thin" x1="99" y1="420" x2="146" y2="420"/>
        <text className="lbl" x="122" y="362">202</text><text className="sdb" x="122" y="402">sdb</text>
        <line className="wall-thin" x1="99" y1="470" x2="146" y2="470"/><line className="wall-thin" x1="99" y1="510" x2="146" y2="510"/>
        <text className="lbl" x="122" y="452">203</text><text className="sdb" x="122" y="492">sdb</text>
        <line className="wall-thin" x1="99" y1="560" x2="146" y2="560"/><line className="wall-thin" x1="99" y1="600" x2="146" y2="600"/>
        <text className="lbl" x="122" y="542">204</text><text className="sdb" x="122" y="582">sdb</text>
        <line className="wall-thin" x1="99" y1="650" x2="146" y2="650"/><line className="wall-thin" x1="99" y1="690" x2="146" y2="690"/>
        <text className="lbl" x="122" y="632">205</text><text className="sdb" x="122" y="672">sdb</text>
        <text className="zone" x="133" y="760">AILE SUD</text>

        {/* Cour */}
        <rect className="cour-fill" x="195" y="240" width="305" height="500" stroke="#1a1a1a" strokeWidth="0.6"/>
        <g stroke="#d8d4cb" strokeWidth="0.3" fill="none">
          <line x1="195" y1="320" x2="500" y2="320"/><line x1="195" y1="400" x2="500" y2="400"/>
          <line x1="195" y1="480" x2="500" y2="480"/><line x1="195" y1="560" x2="500" y2="560"/>
          <line x1="195" y1="640" x2="500" y2="640"/><line x1="270" y1="240" x2="270" y2="740"/>
          <line x1="350" y1="240" x2="350" y2="740"/><line x1="425" y1="240" x2="425" y2="740"/>
        </g>
        <text className="lbl-lg" x="347" y="470">COUR D'HONNEUR</text>
        <g transform="translate(347, 540)">
          <polygon points="-22,-9 -9,-22 9,-22 22,-9 22,9 9,22 -9,22 -22,9" fill="#fafaf7" stroke="#1a1a1a" strokeWidth="0.6"/>
          <polygon points="-14,-6 -6,-14 6,-14 14,-6 14,6 6,14 -6,14 -14,6" fill="none" stroke="#999" strokeWidth="0.4"/>
        </g>

        {/* Aile Nord 1er */}
        <path className="wall" d="M 525 240 L 605 240 L 605 440 L 525 440 Z M 529 244 L 601 244 L 601 436 L 529 436 Z"/>
        <rect className="room-fill" x="529" y="244" width="72" height="192"/>
        <rect className="corridor-fill" x="529" y="244" width="25" height="192"/>
        <line className="wall-thin" x1="554" y1="244" x2="554" y2="436"/>
        <line className="wall-thin" x1="554" y1="285" x2="601" y2="285"/>
        <text className="lbl" x="578" y="266">216</text><text className="sdb" x="578" y="305">sdb</text>
        <line className="wall-thin" x1="554" y1="320" x2="601" y2="320"/>
        <text className="lbl" x="578" y="341">217</text><text className="sdb" x="578" y="365">sdb</text>
        <line className="wall-thin" x1="554" y1="380" x2="601" y2="380"/>
        <text className="lbl" x="578" y="400">218</text><text className="sdb" x="578" y="420">sdb</text>
        <text className="lbl" x="578" y="425">219</text>
        <text className="zone" x="567" y="234" textAnchor="middle">NORD — 1ᵉʳ</text>

        {/* Aile Nord RDC + annexe */}
        <path className="wall" d="M 525 460 L 605 460 L 605 740 L 525 740 Z M 529 464 L 601 464 L 601 736 L 529 736 Z"/>
        <rect className="room-fill" x="529" y="464" width="72" height="272"/>
        <rect className="corridor-fill" x="529" y="464" width="25" height="272"/>
        <line className="wall-thin" x1="554" y1="464" x2="554" y2="736"/>
        <line className="wall-thin" x1="554" y1="500" x2="601" y2="500"/>
        <text className="lbl" x="578" y="482">120</text><text className="sdb" x="578" y="518">sdb</text>
        <line className="wall-thin" x1="554" y1="528" x2="601" y2="528"/><line className="wall-thin" x1="554" y1="555" x2="601" y2="555"/>
        <text className="lbl" x="578" y="542">130</text><text className="sdb" x="578" y="572">sdb</text>
        <line className="wall-thin" x1="554" y1="585" x2="601" y2="585"/><line className="wall-thin" x1="554" y1="610" x2="601" y2="610"/>
        <text className="lbl" x="578" y="600">140</text><text className="sdb" x="578" y="624">sdb</text>
        <line className="wall-thin" x1="554" y1="635" x2="601" y2="635"/><line className="wall-thin" x1="554" y1="665" x2="601" y2="665"/>
        <text className="lbl" x="578" y="652">150</text><text className="sdb" x="578" y="681">sdb</text>
        <line className="wall-thin" x1="554" y1="695" x2="601" y2="695"/>
        <text className="lbl" x="578" y="713">160</text><text className="sdb" x="578" y="728">sdb</text>
        <path className="wall" d="M 605 640 L 670 640 L 670 740 L 605 740 Z M 609 644 L 666 644 L 666 736 L 605 736 Z"/>
        <rect className="room-fill" x="609" y="644" width="57" height="92"/>
        <line className="wall-thin" x1="609" y1="690" x2="666" y2="690"/>
        <text className="lbl" x="637" y="670">510</text><text className="lbl" x="637" y="715">520</text>
        <text className="zone" x="567" y="760" textAnchor="middle">NORD — RDC</text>

        {/* Halos + outlines verts qui pulsent */}
        {Object.entries(ROOM_RECTS).map(([id, [x, y, w, h]]) => {
          const isActive = highlightIds.includes(id);
          return (<rect key={`halo-${id}`} className={`room-hl-halo ${isActive ? 'active' : ''}`} x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx="3"/>);
        })}
        {Object.entries(ROOM_RECTS).map(([id, [x, y, w, h]]) => {
          const isActive = highlightIds.includes(id);
          return (<rect key={`hl-${id}`} className={`room-hl ${isActive ? 'active' : ''}`} x={x} y={y} width={w} height={h}/>);
        })}
      </>
    );
  };

  /* ─── PLAN INTERACTIF (pan/zoom/pinch + auto-focus) ──────────────── */
  const InteractivePlan = ({ activeRoom, t }) => {
    const [vb, setVb] = useState({ x: 0, y: 0, w: PLAN_W, h: PLAN_H });
    const wrapRef = useRef(null);
    const svgRef = useRef(null);
    const animRef = useRef(null);
    const ratioRef = useRef(PLAN_W / PLAN_H);

    const pointers = useRef(new Map());
    const dragState = useRef(null);
    const pinchState = useRef(null);

    const zoomLevel = PLAN_W / vb.w;

    const animateTo = useCallback((target, duration = 800, easing = easeInOutCubic) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const start = { ...vb };
      const t0 = performance.now();
      const step = (now) => {
        const tt = clamp((now - t0) / duration, 0, 1);
        const k = easing(tt);
        setVb({
          x: start.x + (target.x - start.x) * k,
          y: start.y + (target.y - start.y) * k,
          w: start.w + (target.w - start.w) * k,
          h: start.h + (target.h - start.h) * k,
        });
        if (tt < 1) animRef.current = requestAnimationFrame(step);
        else animRef.current = null;
      };
      animRef.current = requestAnimationFrame(step);
    }, [vb]);

    const resetView = useCallback(() => {
      animateTo({ x: 0, y: 0, w: PLAN_W, h: PLAN_H }, 700);
    }, [animateTo]);

    const zoomBy = useCallback((factor) => {
      const cx = vb.x + vb.w / 2;
      const cy = vb.y + vb.h / 2;
      const newW = clamp(vb.w / factor, PLAN_W / ZOOM_MAX, PLAN_W / ZOOM_MIN);
      const newH = newW / ratioRef.current;
      const targetX = clamp(cx - newW / 2, 0, PLAN_W - newW);
      const targetY = clamp(cy - newH / 2, 0, PLAN_H - newH);
      animateTo({ x: targetX, y: targetY, w: newW, h: newH }, 350);
    }, [vb, animateTo]);

    // Ref-based focusRoom to keep useEffect stable (sinon redéclenchement à
    // chaque pan/zoom écrasait le zoom-out manuel).
    const focusRoomFn = useRef(null);
    focusRoomFn.current = (roomId, opts = {}) => {
      const rect = ROOM_RECTS[roomId];
      if (!rect) return;
      const [x, y, w, h] = rect;
      const PADDING = 70;
      let targetW = Math.max(w + PADDING * 2, 220);
      targetW = clamp(targetW, PLAN_W / ZOOM_MAX, PLAN_W);
      const targetH = targetW / ratioRef.current;
      const cx = x + w / 2;
      const cy = y + h / 2;
      const targetX = clamp(cx - targetW / 2, 0, PLAN_W - targetW);
      const targetY = clamp(cy - targetH / 2, 0, PLAN_H - targetH);
      animateTo({ x: targetX, y: targetY, w: targetW, h: targetH }, opts.duration ?? 950);
    };

    useEffect(() => {
      if (!activeRoom) return;
      const tm = setTimeout(() => focusRoomFn.current?.(activeRoom, { duration: 950 }), 80);
      return () => clearTimeout(tm);
    }, [activeRoom]);

    const screenToVb = useCallback((sx, sy) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const r = svg.getBoundingClientRect();
      const dx = (sx - r.left) / r.width;
      const dy = (sy - r.top) / r.height;
      return { x: vb.x + dx * vb.w, y: vb.y + dy * vb.h };
    }, [vb]);

    const onWheel = useCallback((e) => {
      e.preventDefault();
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const pt = screenToVb(e.clientX, e.clientY);
      let newW = clamp(vb.w / factor, PLAN_W / ZOOM_MAX, PLAN_W);
      let newH = newW / ratioRef.current;
      const ratio = newW / vb.w;
      let newX = pt.x - (pt.x - vb.x) * ratio;
      let newY = pt.y - (pt.y - vb.y) * ratio;
      newX = clamp(newX, 0, PLAN_W - newW);
      newY = clamp(newY, 0, PLAN_H - newH);
      setVb({ x: newX, y: newY, w: newW, h: newH });
    }, [vb, screenToVb]);

    const onPointerDown = useCallback((e) => {
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
      e.currentTarget.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1) {
        dragState.current = {
          startVb: { ...vb },
          startScreen: { x: e.clientX, y: e.clientY },
        };
        pinchState.current = null;
      } else if (pointers.current.size === 2) {
        const pts = Array.from(pointers.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        const cx = (pts[0].x + pts[1].x) / 2;
        const cy = (pts[0].y + pts[1].y) / 2;
        const center = screenToVb(cx, cy);
        pinchState.current = {
          startDist: dist,
          startVb: { ...vb },
          centerVb: center,
          centerScreen: { x: cx, y: cy },
        };
        dragState.current = null;
      }
    }, [vb, screenToVb]);

    const onPointerMove = useCallback((e) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1 && dragState.current) {
        const svg = svgRef.current;
        const r = svg.getBoundingClientRect();
        const sx = e.clientX, sy = e.clientY;
        const dx = sx - dragState.current.startScreen.x;
        const dy = sy - dragState.current.startScreen.y;
        const vbDx = (dx / r.width) * dragState.current.startVb.w;
        const vbDy = (dy / r.height) * dragState.current.startVb.h;
        const newX = clamp(dragState.current.startVb.x - vbDx, 0, PLAN_W - dragState.current.startVb.w);
        const newY = clamp(dragState.current.startVb.y - vbDy, 0, PLAN_H - dragState.current.startVb.h);
        setVb({ ...dragState.current.startVb, x: newX, y: newY });
      } else if (pointers.current.size === 2 && pinchState.current) {
        const pts = Array.from(pointers.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        const scale = dist / pinchState.current.startDist;
        let newW = clamp(pinchState.current.startVb.w / scale, PLAN_W / ZOOM_MAX, PLAN_W);
        let newH = newW / ratioRef.current;
        const ratio = newW / pinchState.current.startVb.w;
        let newX = pinchState.current.centerVb.x - (pinchState.current.centerVb.x - pinchState.current.startVb.x) * ratio;
        let newY = pinchState.current.centerVb.y - (pinchState.current.centerVb.y - pinchState.current.startVb.y) * ratio;
        newX = clamp(newX, 0, PLAN_W - newW);
        newY = clamp(newY, 0, PLAN_H - newH);
        setVb({ x: newX, y: newY, w: newW, h: newH });
      }
    }, []);

    const onPointerUp = useCallback((e) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinchState.current = null;
      if (pointers.current.size < 1) dragState.current = null;
    }, []);

    const onDoubleClick = useCallback((e) => {
      e.preventDefault();
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
      const pt = screenToVb(e.clientX, e.clientY);
      const isZoomedIn = zoomLevel > 2.5;
      if (isZoomedIn) {
        resetView();
      } else {
        const newW = clamp(vb.w / 2.2, PLAN_W / ZOOM_MAX, PLAN_W);
        const newH = newW / ratioRef.current;
        const ratio = newW / vb.w;
        let newX = pt.x - (pt.x - vb.x) * ratio;
        let newY = pt.y - (pt.y - vb.y) * ratio;
        newX = clamp(newX, 0, PLAN_W - newW);
        newY = clamp(newY, 0, PLAN_H - newH);
        animateTo({ x: newX, y: newY, w: newW, h: newH }, 400);
      }
    }, [vb, zoomLevel, screenToVb, animateTo, resetView]);

    useEffect(() => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }, []);

    const zoomPct = Math.round(zoomLevel * 100);
    const canFocusRoom = activeRoom != null;

    return (
      <div className="iplan" ref={wrapRef}>
        <style>{`
          .iplan {
            width: 100%;
            aspect-ratio: 720 / 820;
            position: relative;
            overflow: hidden;
            background: transparent;
            touch-action: none;
            cursor: grab;
            user-select: none;
            -webkit-user-select: none;
          }
          .iplan:active { cursor: grabbing; }
          .iplan svg { width: 100%; height: 100%; display: block; }

          .wall { fill: #1a1a1a; }
          .wall-thin { fill: none; stroke: #1a1a1a; stroke-width: 0.6; }
          .room-fill { fill: #fafaf7; }
          .corridor-fill { fill: #ececec; }
          .cour-fill { fill: #f5f3ee; }
          .lbl { font-family: 'Inter', system-ui, sans-serif; font-size: 9.5px; font-weight: 600; fill: #1a1a1a; text-anchor: middle; letter-spacing: 0.3px; }
          .lbl-lg { font-family: 'Italiana', serif; font-size: 13px; font-weight: 500; fill: #1a1a1a; text-anchor: middle; letter-spacing: 1.5px; }
          .zone { font-family: 'Inter', system-ui, sans-serif; font-size: 8px; font-weight: 500; fill: #666; text-anchor: middle; letter-spacing: 1.2px; text-transform: uppercase; }
          .sdb { font-family: 'Inter', system-ui, sans-serif; font-size: 6.5px; font-weight: 400; fill: #888; text-anchor: middle; letter-spacing: 0.4px; text-transform: uppercase; }
          .room-hl {
            fill: var(--sage-deep);
            stroke: none;
            opacity: 0;
            mix-blend-mode: multiply;
            transition: opacity 0.5s cubic-bezier(.2,.8,.2,1);
            pointer-events: none;
          }
          .room-hl.active { animation: roomPulse 2.2s ease-in-out infinite; }
          .room-hl-halo {
            fill: var(--sage-deep);
            opacity: 0;
            transition: opacity 0.5s cubic-bezier(.2,.8,.2,1);
            pointer-events: none;
          }
          .room-hl-halo.active { animation: roomHaloPulse 2.2s ease-in-out infinite; }
          @keyframes roomPulse {
            0%, 100% { opacity: 0.75; }
            50%      { opacity: 1; }
          }
          @keyframes roomHaloPulse {
            0%, 100% { opacity: 0.14; }
            50%      { opacity: 0.24; }
          }

          .iplan-ctrls {
            position: absolute;
            right: 12px; bottom: 12px;
            display: flex; flex-direction: column;
            gap: 4px;
            z-index: 4;
            pointer-events: none;
          }
          .iplan-ctrls .group {
            display: flex; flex-direction: column;
            background: rgba(247, 242, 230, 0.94);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--rule);
            border-radius: 999px;
            padding: 2px;
            box-shadow: 0 2px 12px rgba(31, 36, 25, 0.10);
            pointer-events: auto;
          }
          .iplan-btn {
            appearance: none;
            width: 38px; height: 38px;
            border-radius: 50%;
            border: 0;
            background: transparent;
            color: var(--sage-deep);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: background 0.18s, color 0.18s, transform 0.18s;
            padding: 0;
          }
          .iplan-btn:hover { background: var(--sage-deep); color: var(--cream); }
          .iplan-btn:active { transform: scale(0.92); }
          .iplan-btn:disabled {
            color: var(--sage-deep);
            opacity: 0.3;
            cursor: not-allowed;
            background: transparent;
          }
          .iplan-btn.target { background: var(--sage-deep); color: var(--cream); }
          .iplan-btn.target:hover { background: var(--ink); }

          .iplan-zoom-indicator {
            position: absolute;
            left: 12px; top: 12px;
            z-index: 4;
            font-family: var(--sans);
            font-size: 9px;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: var(--sage-deep);
            background: rgba(247, 242, 230, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--rule);
            padding: 6px 10px;
            border-radius: 999px;
            opacity: 0;
            transform: translateX(-4px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
          }
          .iplan-zoom-indicator.visible { opacity: 0.92; transform: translateX(0); }

          .iplan-hint {
            position: absolute;
            left: 50%; bottom: 60px;
            transform: translateX(-50%);
            font-family: var(--serif); font-style: italic; font-weight: 300;
            font-size: 12px;
            color: var(--sage-deep);
            background: rgba(247, 242, 230, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 7px 14px;
            border-radius: 999px;
            border: 1px solid var(--rule);
            white-space: nowrap;
            z-index: 4;
            pointer-events: none;
            opacity: 0;
            animation: hintShow 4s 0.6s ease-out forwards;
          }
          @keyframes hintShow {
            0%   { opacity: 0; transform: translate(-50%, 4px); }
            12%  { opacity: 1; transform: translate(-50%, 0); }
            75%  { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -4px); }
          }
        `}</style>

        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          preserveAspectRatio="xMidYMid meet"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          role="img"
          aria-label={t.plan_aria}
        >
          <PlanBody activeRoom={activeRoom} />
        </svg>

        <div className={`iplan-zoom-indicator ${zoomLevel > 1.05 ? 'visible' : ''}`}>{zoomPct}%</div>

        <div className="iplan-hint">{t.hint_pinch}</div>

        <div className="iplan-ctrls">
          <div className="group">
            <button
              className="iplan-btn"
              onClick={() => zoomBy(1.6)}
              disabled={zoomLevel >= ZOOM_MAX * 0.98}
              aria-label={t.btn_zoom_in}
              title={t.btn_zoom_in}
            ><PlusIcon /></button>
            <button
              className="iplan-btn"
              onClick={() => zoomBy(1/1.6)}
              disabled={zoomLevel <= ZOOM_MIN * 1.02}
              aria-label={t.btn_zoom_out}
              title={t.btn_zoom_out}
            ><MinusIcon /></button>
          </div>
          <div className="group">
            {canFocusRoom && (
              <button
                className="iplan-btn target"
                onClick={() => focusRoomFn.current?.(activeRoom, { duration: 600 })}
                aria-label={t.btn_target}
                title={t.btn_target}
              ><TargetIcon /></button>
            )}
            <button
              className="iplan-btn"
              onClick={resetView}
              disabled={zoomLevel <= ZOOM_MIN * 1.02 && vb.x === 0 && vb.y === 0}
              aria-label={t.btn_fit}
              title={t.btn_fit}
            ><FitIcon /></button>
          </div>
        </div>
      </div>
    );
  };

  /* ─── COMPOSANT PRINCIPAL ────────────────────────────────────────── */
  const MyRoom = () => {
    const t = window.useT().myroom;
    const [query, setQuery] = useState('');
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [focused, setFocused] = useState(false);
    const [inView, setInView] = useState(false);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
      const tm = setTimeout(() => setInView(true), 50);
      return () => clearTimeout(tm);
    }, []);

    const results = useMemo(() => searchGuests(query, 5), [query]);
    const showDropdown = focused && query.length > 0 && !selectedGuest;

    const selectGuest = useCallback((g) => {
      setSelectedGuest(g);
      setQuery(g.name);
      setFocused(false);
      inputRef.current?.blur();
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }, []);

    const clearSelection = useCallback(() => {
      setSelectedGuest(null);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'Escape') {
          if (selectedGuest) clearSelection();
          else if (focused) inputRef.current?.blur();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [selectedGuest, focused, clearSelection]);

    const activeRoom = selectedGuest?.room || null;
    const roomMeta = activeRoom ? ROOMS_META[activeRoom] : null;
    const roommates = selectedGuest?.sharedWith || [];
    const directions = activeRoom ? (t.directions?.[activeRoom] || '') : '';
    const guestNote = selectedGuest?.note ? t[`note_${selectedGuest.note}`] : null;

    return (
      <section className="finder">
        <style>{`
          .finder {
            min-height: 100vh; min-height: 100dvh;
            width: 100%;
            background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 100%);
            /* La nav strip fait ~56px de haut + safe-area, on garde 60px
               de respiration en plus avant le titre. */
            padding: calc(124px + env(safe-area-inset-top)) 24px 96px;
            display: flex; flex-direction: column;
          }

          .f-header {
            display: flex; flex-direction: column; align-items: center;
            gap: 18px; margin-bottom: 36px;
          }
          .f-header h2 { font-size: clamp(40px, 11vw, 56px); }

          .search-block { position: relative; z-index: 20; margin-bottom: 32px; }
          .search-field {
            position: relative;
            display: flex; align-items: center; gap: 12px;
            background: rgba(247, 242, 230, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--rule);
            border-radius: 999px;
            padding: 4px 6px 4px 18px;
            transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
          }
          .search-field:focus-within {
            border-color: var(--sage-deep);
            background: rgba(247, 242, 230, 1);
            box-shadow: 0 4px 24px rgba(61, 74, 54, 0.12);
          }
          .search-field .icon { color: var(--sage-deep); flex-shrink: 0; display: flex; }
          .search-input {
            flex: 1; min-width: 0;
            appearance: none; background: transparent; border: 0; outline: 0;
            padding: 16px 0;
            font-family: var(--serif); font-size: 18px; color: var(--ink);
          }
          .search-input::placeholder { color: var(--sage-deep); opacity: 0.55; font-style: italic; }
          .search-clear {
            flex-shrink: 0; width: 40px; height: 40px;
            border-radius: 50%; border: 0;
            background: var(--sage-deep); color: var(--cream);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            opacity: 0; transform: scale(0.7);
            transition: opacity 0.25s, transform 0.25s cubic-bezier(.2,.8,.2,1);
            pointer-events: none;
          }
          .search-clear.visible { opacity: 1; transform: scale(1); pointer-events: auto; }
          .search-clear:hover { background: var(--ink); }

          .search-dropdown {
            position: absolute;
            top: calc(100% + 8px); left: 0; right: 0;
            background: rgba(247, 242, 230, 0.97);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--rule);
            border-radius: 14px;
            box-shadow: 0 12px 36px rgba(31, 36, 25, 0.14);
            padding: 6px;
            max-height: 340px; overflow-y: auto;
            opacity: 0; transform: translateY(-6px) scale(0.98);
            transform-origin: top center;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(.2,.8,.2,1), transform 0.25s cubic-bezier(.2,.8,.2,1);
          }
          .search-dropdown.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
          .search-dropdown::-webkit-scrollbar { width: 4px; }
          .search-dropdown::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 4px; }
          .search-empty {
            padding: 22px 16px; text-align: center;
            font-family: var(--serif); font-style: italic;
            font-size: 15px; color: var(--sage-deep); opacity: 0.85;
          }
          .search-empty .small {
            display: block; font-family: var(--sans); font-size: 10px;
            letter-spacing: 0.3em; text-transform: uppercase;
            margin-top: 8px; opacity: 0.55; font-style: normal;
          }

          .result-item {
            width: 100%;
            appearance: none; border: 0; background: transparent;
            padding: 12px 14px;
            display: flex; align-items: center; gap: 12px;
            cursor: pointer; border-radius: 10px;
            text-align: left; font-family: inherit; color: inherit;
            transition: background 0.18s;
          }
          .result-item:hover, .result-item:focus {
            background: rgba(122, 139, 111, 0.12); outline: none;
          }
          .result-item .res-room {
            flex-shrink: 0;
            width: 44px; height: 44px;
            border-radius: 50%;
            border: 1px solid var(--sage-deep);
            background: var(--cream);
            display: flex; align-items: center; justify-content: center;
            font-family: var(--display); font-size: 15px; color: var(--sage-deep);
          }
          .result-item .res-body { flex: 1; min-width: 0; }
          .result-item .res-name {
            font-family: var(--display); font-size: 19px;
            color: var(--ink); line-height: 1.15;
          }
          .result-item .res-name mark { background: transparent; color: var(--sage-deep); font-weight: 500; padding: 0; }
          .result-item .res-meta {
            font-family: var(--serif); font-style: italic;
            font-size: 12.5px; color: var(--sage-deep); opacity: 0.78;
            margin-top: 2px;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          }
          .result-item .res-arrow {
            color: var(--sage-deep); flex-shrink: 0; opacity: 0.5;
            transition: opacity 0.2s, transform 0.2s;
          }
          .result-item:hover .res-arrow { opacity: 1; transform: translateX(3px); }

          .empty-state {
            width: 100%;
            padding: 32px 0;
            display: flex; flex-direction: column;
            align-items: center; gap: 20px;
            opacity: 1;
            transition: opacity 0.4s ease;
          }
          .empty-state.hidden { opacity: 0; pointer-events: none; height: 0; padding: 0; overflow: hidden; }
          .empty-plan-wrap {
            width: 100%;
            opacity: 0.32;
            filter: saturate(0) blur(0.3px);
            pointer-events: none;
            mask-image: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.3) 100%);
            -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.3) 100%);
          }
          .empty-hint {
            font-family: var(--serif); font-style: italic; font-weight: 300;
            font-size: 15px;
            color: var(--sage-deep);
            text-align: center;
            max-width: 280px;
            line-height: 1.6;
            margin-top: -20px;
          }

          .result-state {
            width: 100%;
            display: flex; flex-direction: column;
            gap: 36px;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.6s cubic-bezier(.2,.8,.2,1) 0.1s,
                        transform 0.6s cubic-bezier(.2,.8,.2,1) 0.1s;
          }
          .result-state.visible { opacity: 1; transform: translateY(0); }

          .hero-room {
            text-align: center;
            padding: 8px 0 0;
            position: relative;
            display: flex; flex-direction: column;
            align-items: center;
          }
          .hero-room .greeting {
            font-family: var(--sans); font-size: 9.5px;
            letter-spacing: 0.42em; text-transform: uppercase;
            color: var(--sage-deep); margin-bottom: 12px;
          }
          .hero-room .guest-name {
            font-family: var(--display);
            font-size: clamp(22px, 6vw, 26px);
            color: var(--ink); line-height: 1.15;
            letter-spacing: -0.005em; margin-bottom: 26px;
          }
          .hero-room .room-prefix {
            font-family: var(--sans); font-size: 9px;
            letter-spacing: 0.42em; text-transform: uppercase;
            color: var(--sage-deep); margin-bottom: 18px; opacity: 0.85;
          }
          /* Pancarte de chambre — plaque rectangulaire façon porte de château.
             Sage-deep, double-filet intérieur, 4 rivets aux angles, ombre
             portée discrète qui la décolle légèrement du cream. */
          .hero-room .room-badge {
            width: clamp(200px, 58vw, 248px);
            background: var(--sage-deep);
            color: var(--cream);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 22px 28px 24px;
            border-radius: 3px;
            box-shadow:
              0 14px 26px rgba(31, 36, 25, 0.22),
              0 2px 4px rgba(31, 36, 25, 0.12),
              inset 0 1px 0 rgba(247, 242, 230, 0.10);
            position: relative;
          }
          /* Double-filet intérieur en cream — détail typique des plaques
             gravées. */
          .hero-room .room-badge::before {
            content: '';
            position: absolute; inset: 8px;
            border: 1px solid rgba(247, 242, 230, 0.22);
            border-radius: 1px;
            pointer-events: none;
          }
          .hero-room .room-badge::after {
            content: '';
            position: absolute; inset: 12px;
            border-top: 1px solid rgba(247, 242, 230, 0.08);
            border-bottom: 1px solid rgba(247, 242, 230, 0.08);
            pointer-events: none;
          }
          /* Rivets aux 4 coins, posés sur le filet intérieur. */
          .hero-room .room-badge .rivet {
            position: absolute;
            width: 4px; height: 4px;
            border-radius: 50%;
            background: rgba(247, 242, 230, 0.34);
            box-shadow:
              inset 0 -1px 0 rgba(31, 36, 25, 0.45),
              0 0 0 1px rgba(31, 36, 25, 0.25);
            pointer-events: none;
          }
          .hero-room .room-badge .rivet.tl { top: 8px;  left: 8px; }
          .hero-room .room-badge .rivet.tr { top: 8px;  right: 8px; }
          .hero-room .room-badge .rivet.bl { bottom: 8px; left: 8px; }
          .hero-room .room-badge .rivet.br { bottom: 8px; right: 8px; }
          .hero-room .room-badge .badge-number {
            font-family: var(--display);
            font-size: clamp(54px, 15vw, 74px);
            line-height: 0.95;
            letter-spacing: -0.01em;
            font-variant-numeric: tabular-nums;
            margin: 0;
          }
          .hero-room .room-badge .badge-divider {
            width: 22px; height: 1px;
            background: rgba(247, 242, 230, 0.30);
            margin: 10px 0 9px;
          }
          .hero-room .room-badge .badge-meta {
            font-family: var(--sans);
            font-size: clamp(8.5px, 2.4vw, 9.5px);
            line-height: 1.35;
            opacity: 0.85;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            text-align: center;
            padding: 0 4px;
          }
          .hero-room .room-badge .badge-meta .sep { opacity: 0.5; margin: 0 6px; }

          .plan-block { width: 100%; position: relative; }
          .plan-head {
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 0 14px;
            margin-bottom: 8px;
          }
          .plan-head .plan-ttl {
            font-family: var(--sans); font-size: 9.5px;
            letter-spacing: 0.42em; text-transform: uppercase;
            color: var(--sage-deep);
          }
          .plan-head .plan-room {
            font-family: var(--display); font-style: italic;
            font-size: 14px; color: var(--sage-deep); letter-spacing: 0.5px;
          }

          .info-stats {
            display: grid; grid-template-columns: 1fr 1fr 1fr;
            padding: 4px 0;
            border-top: 1px solid var(--rule);
            border-bottom: 1px solid var(--rule);
          }
          .stat-cell {
            padding: 22px 8px 20px; text-align: center;
            border-right: 1px solid var(--rule);
          }
          .stat-cell:last-child { border-right: 0; }
          .stat-cell .stat-lbl {
            font-family: var(--sans); font-size: 8.5px;
            letter-spacing: 0.34em; text-transform: uppercase;
            color: var(--sage-deep); opacity: 0.8;
            margin-bottom: 10px;
          }
          .stat-cell .stat-val {
            font-family: var(--display); font-size: 22px;
            color: var(--ink); line-height: 1.2;
          }

          /* ── Section "Dans la chambre" ─────────────────────────── */
          .with-block { padding: 0; }
          .with-block .with-lbl {
            font-family: var(--sans); font-size: 9.5px;
            letter-spacing: 0.42em; text-transform: uppercase;
            color: var(--sage-deep);
            margin-bottom: 16px;
            display: flex; align-items: center; gap: 12px;
          }
          .with-block .with-lbl::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
          .with-list { display: flex; flex-wrap: wrap; gap: 10px; }
          .with-chip {
            display: inline-flex; align-items: center;
            gap: 10px;
            padding: 4px 16px 4px 4px;
            border: 1px solid var(--rule);
            border-radius: 999px;
            background: rgba(247, 242, 230, 0.58);
            font-family: var(--serif); font-style: italic;
            font-size: 16px; color: var(--ink);
            line-height: 1;
            transition: background 0.25s, border-color 0.25s;
          }
          .with-chip:hover {
            background: rgba(247, 242, 230, 1);
            border-color: var(--sage-deep);
          }
          .with-chip .ini {
            flex-shrink: 0;
            width: 28px; height: 28px;
            border-radius: 50%;
            background: var(--sage-deep);
            color: var(--cream);
            display: inline-flex; align-items: center; justify-content: center;
            font-family: var(--display);
            font-style: normal;
            font-size: 11.5px;
            letter-spacing: 0.06em;
            line-height: 1;
          }

          /* ── Section "Pour vous y rendre" ──────────────────────── */
          .how-block { padding: 0; }
          .how-block .how-lbl {
            font-family: var(--sans); font-size: 9.5px;
            letter-spacing: 0.42em; text-transform: uppercase;
            color: var(--sage-deep);
            margin-bottom: 16px;
            display: flex; align-items: center; gap: 12px;
          }
          .how-block .how-lbl::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
          .how-block .how-txt {
            display: flex; align-items: flex-start; gap: 12px;
            font-family: var(--serif);
            font-size: 17.5px; color: var(--ink);
            line-height: 1.55;
            padding: 14px 16px;
            background: rgba(247, 242, 230, 0.55);
            border: 1px solid var(--rule);
            border-radius: 4px;
          }
          .how-block .how-pin {
            flex-shrink: 0;
            color: var(--sage-deep);
            margin-top: 4px;
            display: inline-flex;
          }

          /* ── Note (callout discret) ────────────────────────────── */
          .note-block {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 12px 16px 12px 14px;
            background: rgba(122, 139, 111, 0.08);
            border-left: 2px solid var(--sage);
            border-radius: 0 4px 4px 0;
            font-family: var(--serif); font-style: italic; font-weight: 300;
            font-size: 14.5px; color: var(--sage-deep);
            line-height: 1.5;
          }
          .note-block::before {
            content: '※';
            font-family: var(--display);
            font-style: normal;
            color: var(--sage);
            font-size: 14px;
            line-height: 1.45;
            flex-shrink: 0;
            opacity: 0.85;
          }

          /* ── Bouton reset ──────────────────────────────────────── */
          .actions-bar {
            display: flex; justify-content: center;
            margin-top: 4px;
          }
          .btn-reset {
            appearance: none; border: 1px solid var(--rule);
            background: rgba(247, 242, 230, 0.5);
            color: var(--sage-deep);
            font-family: var(--sans); font-size: 9.5px;
            letter-spacing: 0.42em; text-transform: uppercase;
            cursor: pointer; padding: 12px 22px;
            border-radius: 999px;
            transition: background 0.25s, color 0.25s, border-color 0.25s, gap 0.25s;
            display: inline-flex; align-items: center; gap: 10px;
          }
          .btn-reset:hover {
            background: var(--sage-deep);
            color: var(--cream);
            border-color: var(--sage-deep);
            gap: 14px;
          }
          .btn-reset .arrow {
            font-family: var(--display);
            font-size: 16px; letter-spacing: 0;
          }

          .result-state.visible > * {
            opacity: 0; transform: translateY(8px);
            animation: stagger-in 0.7s cubic-bezier(.2,.8,.2,1) forwards;
          }
          .result-state.visible > *:nth-child(1) { animation-delay: 0.05s; }
          .result-state.visible > *:nth-child(2) { animation-delay: 0.18s; }
          .result-state.visible > *:nth-child(3) { animation-delay: 0.28s; }
          .result-state.visible > *:nth-child(4) { animation-delay: 0.36s; }
          .result-state.visible > *:nth-child(5) { animation-delay: 0.44s; }
          .result-state.visible > *:nth-child(6) { animation-delay: 0.52s; }
          .result-state.visible > *:nth-child(7) { animation-delay: 0.6s; }
          @keyframes stagger-in { to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div className="f-header">
          <div className={`eyebrow blur-in ${inView ? 'in' : ''}`}>
            <span>{t.eyebrow}</span>
          </div>
          <h2 className={`blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.15s' }}>
            {t.title_main}<br/>
            <span className="em">{t.title_em}</span>
          </h2>
        </div>

        <div className={`search-block blur-in ${inView ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }} ref={resultsRef}>
          <div className="search-field">
            <span className="icon"><SearchIcon /></span>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder={t.search_placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selectedGuest) setSelectedGuest(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 180)}
              autoComplete="off"
              spellCheck="false"
              aria-label={t.search_aria}
            />
            <button
              className={`search-clear ${query ? 'visible' : ''}`}
              onClick={selectedGuest ? clearSelection : () => { setQuery(''); inputRef.current?.focus(); }}
              aria-label={t.search_clear_aria}
              tabIndex={query ? 0 : -1}
            >
              <ClearIcon />
            </button>
          </div>

          <div className={`search-dropdown ${showDropdown ? 'visible' : ''}`} role="listbox">
            {results.length === 0 ? (
              <div className="search-empty">
                {t.search_empty}
                <span className="small">{t.search_empty_sub}</span>
              </div>
            ) : (
              results.map((g, i) => {
                const meta = ROOMS_META[g.room];
                return (
                  <button
                    key={`${g.name}-${g.room}-${i}`}
                    className="result-item"
                    onClick={() => selectGuest(g)}
                    onMouseDown={(e) => e.preventDefault()}
                    role="option"
                  >
                    <span className="res-room">{g.room}</span>
                    <div className="res-body">
                      <div className="res-name"><HighlightMatch text={g.name} query={query} /></div>
                      <div className="res-meta">
                        {t.meta_wing} {wingLabel(t, meta?.wing)} · {floorLong(t, meta?.floor, meta?.floorKey)}
                        {g.sharedWith?.length > 0 && ` · ${t.meta_shared}`}
                      </div>
                    </div>
                    <span className="res-arrow"><ArrowRight /></span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Empty state — plan désaturé en arrière-plan */}
        <div className={`empty-state ${selectedGuest ? 'hidden' : ''}`}>
          <div className="empty-plan-wrap">
            <InteractivePlan activeRoom={null} t={t} />
          </div>
          <p className="empty-hint">
            {t.empty_hint.map((line, i) => (
              <React.Fragment key={i}>{line}{i < t.empty_hint.length - 1 && <br/>}</React.Fragment>
            ))}
          </p>
        </div>

        {/* Result state */}
        {selectedGuest && (
          <div className="result-state visible">

            <div className="hero-room">
              <div className="greeting">{t.greeting}</div>
              <div className="guest-name">{selectedGuest.name}</div>
              <div className="room-prefix">{t.room_prefix}</div>
              <div className="room-badge">
                <span className="rivet tl" />
                <span className="rivet tr" />
                <span className="rivet bl" />
                <span className="rivet br" />
                <div className="badge-number">{selectedGuest.room}</div>
                <div className="badge-divider" />
                <div className="badge-meta">
                  {wingLabel(t, roomMeta?.wing)}
                  <span className="sep">·</span>
                  {floorShort(t, roomMeta?.floor)}
                </div>
              </div>
            </div>

            <div className="plan-block">
              <div className="plan-head">
                <span className="plan-ttl">{t.plan_title}</span>
                <span className="plan-room">{t.plan_room_label} {selectedGuest.room}</span>
              </div>
              <InteractivePlan activeRoom={activeRoom} t={t} />
            </div>

            <div className="info-stats">
              <div className="stat-cell">
                <div className="stat-lbl">{t.stat_wing}</div>
                <div className="stat-val">{wingLabel(t, roomMeta?.wing)}</div>
              </div>
              <div className="stat-cell">
                <div className="stat-lbl">{t.stat_floor}</div>
                <div className="stat-val">{floorShort(t, roomMeta?.floor)}</div>
              </div>
              <div className="stat-cell">
                <div className="stat-lbl">{t.stat_view}</div>
                <div className="stat-val">{viewLabel(t, roomMeta?.view)}</div>
              </div>
            </div>

            {roommates.length > 0 && (
              <div className="with-block">
                <div className="with-lbl">
                  {t.with_label} · {roommates.length} {roommates.length > 1 ? t.person_plural : t.person_singular}
                </div>
                <div className="with-list">
                  {roommates.map((r, i) => (
                    <span key={i} className="with-chip">
                      <span className="ini">{getInitials(r)}</span>
                      <span>{r}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="how-block">
              <div className="how-lbl">{t.how_label}</div>
              <div className="how-txt">
                <span className="how-pin"><PinIcon /></span>
                <span>{directions}</span>
              </div>
            </div>

            {guestNote && (
              <p className="note-block">{guestNote}</p>
            )}

            <div className="actions-bar">
              <button className="btn-reset" onClick={clearSelection}>
                <span className="arrow">←</span>
                <span>{t.reset_label}</span>
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  window.MyRoom = MyRoom;
})();
