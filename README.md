# Justine & Levani — Faire-part de mariage

Faire-part interactif mobile-first pour le mariage franco-géorgien de Justine & Levani — **5 septembre 2026**.

## Aperçu

Site mobile-first (≤480px) inspiré des références awwwards :
- Palette vert sauge, beige, crème
- Typographie mariage (Italiana, Cormorant Garamond italique, Pinyon Script)
- Animations scroll-driven (GSAP + ScrollTrigger + Lenis)
- Trilingue : Français / ქართული / Deutsch
- 13 scènes : LangGate → Hero → Cérémonie → Trajet → Réception → Timeline → Dress code → Galerie → Météo → Brunch → Closing

## Lancer en local

Aucun build — c'est de l'HTML + JSX in-browser via Babel standalone.

```bash
# Servir avec n'importe quel serveur statique
npx serve .
# ou
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Structure

```
index.html             # entrée principale + tokens CSS
app.jsx                # composition des scènes + tweaks panel
components/            # une scène par fichier
  lang-gate.jsx        # choix de langue
  hero.jsx             # noms + countdown
  ceremony.jsx         # cathédrale + horaires
  journey.jsx          # carte Paris → Chaumont
  reception.jsx        # château + buffet géorgien
  timeline.jsx         # 18h → 23h
  practical.jsx        # transport / hébergement / dress code
  gallery.jsx          # 6 ans en images (sticky scroll)
  closing.jsx          # mot de la fin
  audio-background.jsx # fond sonore Qartuli
  icons.jsx            # SVG icons + monogramme J&L
tweaks-panel.jsx       # panneau Tweaks (palette)
```

## Tweaks

Active le mode Tweaks dans la barre d'outils pour basculer entre 4 palettes : Clair / Sauge / Profond / Olive.

## Stack

- React 18 + Babel standalone (pas de build)
- GSAP 3.12 + ScrollTrigger + Lenis pour le scroll smooth
- Polices Google : Italiana, Cormorant Garamond, Pinyon Script, Inter
