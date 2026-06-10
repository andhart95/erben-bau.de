# SPEC-HOME — Erben Bau Startseite (1:1 Astro-Nachbau)

> Sektionsweise Build-Spec für den 1:1-Nachbau von **erben-bau.de** (Webflow → Astro v5 + Tailwind v4).
> Quellen: `02_KNOWLEDGE-BASE/_raw/home.html` (Roh-DOM, maßgeblich für Struktur/Reihenfolge/img-src/alt),
> Full-Page-Screenshots `01_home_full_1440.png` + `01_home_full_mobile390.png`, Design-System-Synthese
> `01_BRAND/erben-bau_brand_design-system.md`, Token-Rohdaten `design-extract/erben-bau-de-variables.css`.
> Stand: 2026-06-09. Ziel-Domain: `erbenbau.voyagedigital.de` (noindex Microsite).

---

## 0. Globale Grundlagen

### Stack & Setup
- **Astro v5**, **Tailwind v4** (CSS-first via `@theme` in `src/styles/global.css`, kein `tailwind.config.js`).
- **Font:** Satoshi (Fontshare CDN `@fontshare/satoshi` oder self-hosted; Weights 300/400/500/700/900). Eine einzige Familie für alles. `font-display: swap`.
- **noindex:** `<meta name="robots" content="noindex, nofollow">` im `<head>` des Layouts.
- Bilder lokal aus `03_WEBSITE-TECH/images/` → kopieren nach `public/images/` mit semantischen Slugs (siehe Bild-Mapping-Tabelle, §13). Astro `<Image>` aus `astro:assets` für responsive srcset/AVIF/WebP nutzen, wo sinnvoll.

### Design-Tokens (`@theme` in global.css)
```css
@theme {
  /* Farben */
  --color-blue: #1142d4;          /* Primär — Buttons/Akzente */
  --color-blue-dark: #103ab6;     /* Hover */
  --color-blue-light: #005fc5;
  --color-black: #141212;         /* Nav/Footer/dunkle Sektionen/Text */
  --color-ink: #000000;           /* reiner Text */
  --color-white: #ffffff;
  --color-beige: #f3efe7;         /* Rezensionen-bg */
  --color-beige-light: #f9f6f1;
  --color-beige-dark: #e5e6e2;
  --color-accent: #ffdede;        /* rosé, sparsam */
  --color-grey: #747474;
  --color-border: #cccccc;        /* Input-Border */

  /* Typografie-Scale (px aus Extract) */
  --text-h2-xl: 4.8rem;   /* 76.8px — Rezensionen-Headline */
  --text-h2: 3rem;        /* 48px — Section-H2 */
  --text-h1: 1.5rem;      /* 24px — kleine H1 (Eyebrow-artig im Hero) */
  --text-large: 1.25rem;  /* ~20px — Subline/Body-large */
  --text-base: 0.875rem;  /* 14px — Body */
  --text-small: 0.9375rem;/* 15px — Footer */

  /* Spacing-Stufen (Extract) */
  --space-32: 2rem; --space-40: 2.5rem; --space-48: 3rem; --space-64: 4rem;
  --space-80: 5rem; --space-110: 6.875rem; --space-128: 8rem; --space-150: 9.375rem;

  /* Radius */
  --radius-xs: 2px;       /* Buttons/Inputs */
  --radius-full: 100px;   /* Arrow-Buttons/Pills */

  /* Elevation — flat, eine soft shadow */
  --shadow-sm: -1px 1px 4px 0 rgba(51,51,51,0.1);

  /* Motion */
  --dur-fast: 100ms; --dur-normal: 200ms; --ease: cubic-bezier(0.4,0,0.2,1);
}
```

### Layout-Container
- **Container max ~1456px** (große Sektionen), Content-Block ~980px für Text-Spalten.
- 2-Spalten-Grids (Text + Bild), gap 24–48px.
- Breakpoints (Webflow-konform): **479 / 767 / 991 / 1440**. Tailwind-Defaults reichen (`sm 640 / md 768 / lg 1024 / xl 1280`); kritischer Umschaltpunkt ist **md (768px)** — darunter alles 1-spaltig.

### Button-Komponenten (wiederkehrend)
| Variante | Klasse-Quelle | Stil |
|----------|---------------|------|
| **Primary (blau)** | `.blue_button` / `.blue_button_full` | bg `#1142d4`, Text weiß, ~18px/500, padding 12×20px, radius 2px, hover → `#103ab6` |
| **Quartiary / Outline-hell** | `.quartiary-button` (Hero) | transparent, 1px weißer Rand, Text weiß, radius 2px |
| **Secondary** | `.secondary-button` | transparent, 1px schwarzer Rand auf hellem bg, Text schwarz, radius 2px |
| **Outline-100 (Submit)** | `.button_outline.is-100` | full-width, Rand, im dunklen Formular |

### Globale Motion (GSAP-Ersatz)
Original nutzt **GSAP ScrollTrigger + SplitText**. Nachbau mit leichtem CSS + **IntersectionObserver**:
- **Reveal-on-scroll:** Elemente starten `opacity:0; translateY(24px)`, beim Eintritt in den Viewport → `opacity:1; translateY(0)`, transition `~500ms var(--ease)`. Trigger via einem kleinen `useReveal`-Pattern (`data-reveal` Attribut + IO, Klasse `.is-visible`).
- **SplitText-Headlines** (Hero-H1/H2, Section-H2): Wörter/Zeilen gestaffelt einblenden — als vereinfachte Variante reicht ein gestaffeltes Fade-Up der ganzen Headline (kein echtes per-char Splitting nötig).
- **`prefers-reduced-motion: reduce`** → alle Reveals deaktivieren (sofort `opacity:1`, kein translate). Pflicht.
- Webflow versteckt initial via `visibility:hidden` (`.logo-wrapper, .inner-images-wrapper > *, .top-left-image …`) bis JS lädt — im Nachbau über die Reveal-Logik abbilden, aber **nie** Inhalt dauerhaft verstecken falls JS fehlt (no-JS → sichtbar).

---

## SEKTIONEN (exakte Reihenfolge laut Roh-DOM)

DOM-Reihenfolge im `<body>`: `nav.nav.dark` → `section.section_hero` → `section.section_whats_special` → `section.section_intro` → `section.section_es_in_numbers` (LEER) → `section.section_about` → `section.section_work_gallery` → `section.section_services_for_partners.black-bg` (= Rezensionen) → `section.section_contact_form-2` → `footer.footer-2.is-black` → Cookie-Banner (Finsweet).

---

## 1. Nav — `Nav.astro` (dunkel, sticky)

**(a) Rolle:** Sticky Top-Navigation, dunkler Hintergrund, über Hero liegend.

**(b) Copy VERBATIM** (Logo links, dann Links, dann Button rechts):
- Logo (img, kein Text)
- `Baukoordination`
- `Bausicherheit`
- `Wachstumspartner`
- `Über Uns`
- Button: `Kontakt` → href `/kontakt`

> Original-Links 1–4 zeigen auf `#` (Service-Seiten existieren nicht), „Über Uns" zeigt auf nichts Echtes (`/ueber-uns` ist 404). **Im Nachbau:** Service-Links als Anchor `#` belassen ODER auf entsprechende Home-Sektionen scrollen (Entscheidung beim Build; Default = `#` wie Original). `Über Uns` → `#` (keine Seite bauen).

Mobile-Menu (Burger) Copy (aus `.adaptation-menu`): `Baukoordination` / `Bausicherheit` / `Wachstumspartner` / `Über Uns` / Button `Kontakt aufnehmen`. Plus 2 Social-Icons (Facebook, Twitter) — beide href `#`. **Social-Icons im Nachbau optional weglassen** (Original-Links sind tot).

**(c) Bild:** Logo `68c14ad6d333f1aac5faf61c_EB_logomark_black%20–%205.svg` → Slug `logo-eb.svg`, alt `"Erben Bau Logo"`. (Trotz Dateiname „black" ist es das auf Dunkel sichtbare Logomark — auf dunklem Nav weiß/hell darstellen; SVG prüfen, ggf. `filter: invert` oder weiße SVG-Variante.)

**(d) Layout:** Flex-Row, `justify-between`, `items-center`. Logo links, rechts Flex-Gruppe aus 4 Text-Links + 1 blauem Button. Container ~1456px, horizontal padding. Höhe ~72–80px.

**(e) Tokens:** bg `var(--color-black)` (`#141212`), Link-Text `var(--color-white)` 14–16px/500, Button `.blue_button` (radius 2px). Kein Border-bottom (flat).

**(f) Responsive:**
- **Desktop (≥768/lg):** Logo + horizontale Link-Leiste + Button sichtbar.
- **Mobile (<768):** nur Logo + Burger (3 Striche, `.menu-bar-3`). Klick öffnet Overlay-Menu (`.adaptation-menu`, dunkel, vertikale Links + „Kontakt aufnehmen"-Button). Screenshot-Mobil zeigt Burger oben rechts.

**(g) Interaktion:** `position: sticky; top:0; z-50`. Burger-Toggle (Client-JS, Astro `<script>` oder kleine Insel). Optional: leichter bg-Opacity/Shadow-Wechsel beim Scrollen (Original ist durchgehend solid dark — **solid lassen**).

---

## 2. Hero — `Hero.astro` (`section_hero`)

**(a) Rolle:** Vollbild-Hero, Foto-Hintergrund mit dunklem Gradient, Text links-unten, 2 CTAs.

**(b) Copy VERBATIM:**
- H1 (`.heading-style-h1.is-white`): `Erben Baukoordination`
- H2 (`.heading-2.is-white.is-hero`): `Alle Dienstleister` ⏎ `aus einer Hand` (zwei Zeilen, `<br>`)
- Subline (`.text-size-large.is-white`): `Ein Ansprechpartner für alle Gewerke.` ⏎ `Schnell, digital und persönlich vor Ort.` (zwei Zeilen, `<br>`)
- Button 1 (`.blue_button`): `Kontakt` → `/kontakt`
- Button 2 (`.quartiary-button`): `Beratungstermin` → Google-Calendar-Termin-URL (target `_blank`):
  `https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3mSeSUNX1Y0Ddx15WUzG8q0enFHNT9Y9nkOn6Ooz78oN4aIrP346JlV6vsufMnr3_vrbd6NV0z`

**(c) Bild:** Hintergrund-Foto = **david-kristianto** (Treppe/Holzboden Interieur), Slug `hero.webp`.
> ⚠️ Hinweis: Im Roh-DOM ist der Hero-Background ein leeres `<div class="section_hero_image_background">` (Webflow setzt das Bild per CSS-Background, nicht als `<img>`). Das gleiche david-kristianto-Foto erscheint zusätzlich in der Galerie (bottom-right). Im Nachbau Hero-bg = `hero.webp` (= `68c2604ea31cb63ce2c26673_david-kristianto…`). Screenshot bestätigt: dunkles Interieur-Foto mit Treppe.
> alt für bg (falls als `<img>` gebaut): `"Renoviertes Haus von innen mit Treppe und Holzboden"`.

**(d) Layout:** Vollbreite, **min-height ~90–100vh**. Foto als `cover`-Background. Dunkler Gradient-Overlay (oben dunkler → nach unten dunkler, Text-Lesbarkeit): z.B. `linear-gradient(rgba(20,18,18,.55), rgba(20,18,18,.75))` ODER Vignette von unten. Text-Block (`.section_hero_text`) links ausgerichtet, vertikal unten/mittig. H1 klein (eyebrow-artig, 24px), darunter großes H2 (Display), darunter Subline, darunter Button-Reihe (Flex-Row, gap).

**(e) Tokens:** Text `var(--color-white)`, bg-Overlay über `var(--color-black)`. H2 groß (`--text-h2-xl`/responsive clamp), H1 `--text-h1` (24px), Subline `--text-large`. Buttons: blau + outline-weiß.

**(f) Responsive:**
- **Desktop:** Text-Block linksbündig, Buttons nebeneinander. Screenshot zeigt Text linke Hälfte unten.
- **Mobile:** Foto-Hero kürzer, Text linksbündig, H2 kleiner (clamp), Buttons untereinander oder nebeneinander je nach Breite. Mobile-Screenshot: H2 „Alle Dienstleister aus einer Hand" prominent, darunter Subline.

**(g) Interaktion/Animation:** SplitText-Reveal der H1/H2/Subline gestaffelt beim Load (Hero ist above-the-fold → on-load statt on-scroll). Buttons fade-up zuletzt. Reduced-motion → statisch.

---

## 3. „Was macht Erben besonders" — Eyebrow-Banner (`section_whats_special`)

**(a) Rolle:** Schmaler Übergangs-/Intro-Banner mit zentriertem Label. Sehr klein, fast nur Whitespace + ein Text.

**(b) Copy VERBATIM** (`.text-block.is-black.is-centered`): `WAS MACHT ERBEN SERVICES SO BESONDERS?`

**(c) Bild:** keins.

**(d) Layout:** weiße Sektion, zentrierter Eyebrow-Text, viel vertikaler Whitespace (`._0-top-margin`, padding-global). Im Screenshot kaum als eigene Sektion erkennbar — wirkt wie Vorlauf zur Intro-Sektion.

**(e) Tokens:** bg weiß, Text `var(--color-black)`, Eyebrow-Stil (uppercase, kleiner, letter-spacing leicht). 14px/500.

**(f) Responsive:** identisch zentriert Desktop+Mobile.

**(g) Interaktion:** Fade-up-Reveal on-scroll.

> Bau-Hinweis: kann mit Sektion 4 (`SplitSection` Intro) zusammengefasst werden — der Eyebrow gehört visuell als Vorlauf zur „Gemeinsam vor Ort & digital"-Sektion. Original hält sie getrennt; **Nachbau darf den Eyebrow als top-zentrierten Vorlauf rendern.**

---

## 4. Intro „Gemeinsam vor Ort & digital" — `SplitSection.astro` (`section_intro`)

**(a) Rolle:** 2-Spalter — **Text links, Foto rechts** (`.section_about_content` mit `is-left` linker Block).

**(b) Copy VERBATIM:**
- Eyebrow (`.text-block`): `ÜBER UNS`
- H2 (`.heading-style-h2.is-left-aligned`): `Gemeinsam` ⏎ `vor Ort &` ⏎ `digital` (drei Zeilen, `<br>`; Volltext „Gemeinsam vor Ort & digital")
- Body (`.text-size-large…is-left-aligned`): `Ob Baukoordination, Bausicherheit oder als Wachstumspartner für innovative Produkte und Dienstleistungen im Bau – wir begleiten, sichern und beschleunigen Ihre Bauprojekte als starker und transparenter Partner für private und gewerbliche Kunden.`
- Button (`.secondary-button`): `Kontakt aufnehmen` → Google-Calendar-Termin-URL (siehe §2).

**(c) Bild:** `68d543ce2ce6826372a8b30b_Close up worker at job (1).webp` → Slug `worker-desk.webp`, alt `"Erben Bau Close up worker at desk in front of laptop"` (Mitarbeiter am Laptop, Nahaufnahme).

**(d) Layout:** CSS-Grid/Flex 2 Spalten, **Text-Spalte links** (Eyebrow → H2 → Body → Button, alle links ausgerichtet), **Bild-Spalte rechts** (`max-width ~665px`, `object-fit: cover`, radius 0 = scharfe Kanten). gap ~32–48px, vertikal mittig ausgerichtet.

**(e) Tokens:** bg weiß, H2 schwarz (`--text-h2`, sentence-case, tight letter-spacing −1px), Body schwarz `--text-large`, Eyebrow uppercase. Button secondary (schwarzer Rand). Spacing-Stufe `--space-80`/`--space-110` vertikal.

**(f) Responsive:**
- **Desktop:** Text links | Bild rechts (2 Spalten).
- **Mobile:** 1-spaltig — **Text oben, Bild darunter** (Mobile-Screenshot bestätigt: „Gemeinsam vor Ort & digital" + Body + Button, dann das Laptop-Foto darunter).

**(g) Interaktion:** H2 SplitText-Reveal (gestaffeltes Fade-up der Zeilen), Body + Button fade-up. Bild leichter Scale/Fade-in beim Eintritt (Webflow versteckt `.section_about_content-_left img` initial). Reduced-motion → statisch.

---

## 5. (LEER) `section_es_in_numbers` — NICHT bauen

Im Roh-DOM vorhanden als `<section class="section_es_in_numbers"></section>` — **komplett leer** (geplante „Erben in Zahlen"-Stat-Sektion, nie befüllt). **Im Nachbau auslassen.** Nicht erfinden.

---

## 6. „Warum wir tun was wir tun" — `SplitSection.astro` (gespiegelt) (`section_about`)

**(a) Rolle:** 2-Spalter — **Foto links, Text rechts** (Spiegelung von §4; `.section_about_content_right` ohne `is-left`).

**(b) Copy VERBATIM:**
- Eyebrow (`.text-block.is-right-laigned`): `ÜBER UNS`
- H2 (`.heading-style-h2.is-left-aligned`): `Warum wir tun` ⏎ `was wir tun` (zwei Zeilen, `<br>`)
- Body: `Jedes einzelne Detail unserer Dienstleistungen wird an unserem kontinuierlichen Ziel gemessen: Die Zusammenarbeit im Bau konstant zu verbessern.`
- Button (`.secondary-button`): `Weitere Infos` → `/ueber-uns`
  > ⚠️ Ziel `/ueber-uns` ist im Original **404**. Im Nachbau: Button entweder auf `#` setzen oder auf `/kontakt` umleiten (Build-Entscheidung; **keine** /ueber-uns-Seite bauen). Default empfohlen: `href="#"`.

**(c) Bild:** `68d5452064afa97b57beb246_Two billboard on building glass wall (1).webp` → Slug `billboard.webp`, alt `"Erben Bau Billboard in black on the outside of a big office building with glass"` (schwarzes EB-Billboard an Glasfassade).

**(d) Layout:** 2 Spalten, **Bild links** (`max-width ~850px`, cover, radius 0), **Text rechts** (Eyebrow rechts-ausgerichtet im Original, H2/Body links-ausgerichtet). gap ~32–48px, vertikal mittig.

**(e) Tokens:** bg weiß, identisch zu §4 (H2 `--text-h2`, Body `--text-large`, Eyebrow uppercase, Button secondary).

**(f) Responsive:**
- **Desktop:** Bild links | Text rechts.
- **Mobile:** 1-spaltig — **Bild oben, Text darunter** (Mobile-Screenshot: Billboard-Foto, dann „Warum wir tun was wir tun" + Body + „Weitere Infos"-Button). → `SplitSection` braucht eine `reverse`-Prop; auf Mobile beide Varianten stapeln (Bild-zuerst hier, Text-zuerst in §4).

**(g) Interaktion:** wie §4 (H2 SplitText-Reveal, Body/Button fade-up, Bild fade/scale-in). Reduced-motion → statisch.

---

## 7. Galerie — `Gallery.astro` (`section_work_gallery`)

**(a) Rolle:** Brand-Statement-Block — großes ERBEN-Wordmark-Logo zentriert oben, darunter eine **überlappende editoriale 5-Foto-Collage** (kein sauberes Raster). Lightbox-Funktion im Original (`w-lightbox`).

**(b) Copy VERBATIM:** kein Fließtext. Der Text „GEMEINSAM BESSER BAUEN" ist **Teil der Wordmark-Grafik** (im PNG enthalten), nicht separates HTML.

**(c) Bilder** (5 Stück + 1 Wordmark; DOM-Klassen geben Position):
1. **Wordmark (zentriert oben):** `68b6adb38f933de849497b6e_EB_logomark_black – 6@2x.webp` (width 367) → Slug `wordmark.webp`, alt `"ERBEN — Gemeinsam besser bauen"`. (Zeigt „ERBEN" + Subline „GEMEINSAM BESSER BAUEN".)
2. **`.top-left-image`:** `68c26050d1c70c9f0a9b4749_d5-render-KSljCphBZ6Q-unsplash.webp` → `gallery-1.webp`, alt `"renovated living room with wooden floor and ceiling"`.
3. **`.center-image`** (groß, hinten/mittig, hoch): `68c2605c11f17f7c0e3e5523_shiva-mardahi-wiXZab0IdJ8-unsplash.webp` → `gallery-2.webp`, alt `"multi story house from outside with glass front"`.
4. **`.top-right-image`:** `68c26059c6e82b968b8f1e3f_takafumi-yamashita-81bAlhg7rQQ-unsplash.webp` → `gallery-3.webp`, alt `"renovated room in minimal wooden style with great couch and window"`.
5. **`.bottom-left-image`** (Vordergrund, überlappend): `68c28ca9a7944fa0bc274300_EB _bild_reklaame_wand_Schwarz@2x.webp` → `gallery-4.webp`, alt `"EB schwarzes Reklameschild an Hauswand mit Gold"` (eigenes EB-Render mit Gold-Schrift).
6. **`.bottom-right-image`:** `68c2604ea31cb63ce2c26673_david-kristianto-5Cczp_vIx8c-unsplash.webp` → `gallery-5.webp` (= dasselbe Foto wie Hero-bg), alt `"beautiful renovated house from inside with stairs ands wooden floor"`.

**(d) Layout (aus `/tmp`-Gallery-Crop verifiziert):**
- ERBEN-Wordmark zentriert, breit (~600px), darunter die Collage.
- Collage = **überlappende, leicht versetzte Anordnung** (nicht uniformes Grid):
  - Center-Image (gallery-2, hohe Glasfassade) bildet die hohe vertikale Mitte.
  - top-left (gallery-1) oben links, top-right (gallery-3) oben rechts.
  - bottom-left (gallery-4, schwarzes EB-Schild) ragt als Vordergrund-Element nach links unten, **überlappt** die Center-Spalte.
  - bottom-right (gallery-5) unten rechts.
- Verschachtelung im DOM: `.div-block-72` (Wordmark) → `.images-wrapper > .inner-images-wrapper` (5 `<a class="…-image w-lightbox">` mit `<img class="gallery-image">`).
- **Umsetzungsempfehlung:** CSS-Grid mit definierten `grid-template-areas` für die 5 Bilder (überlappende Areas via `grid-column/row`-Spans + `z-index` für bottom-left-Overlap) ODER ein 2-Reihen-Layout (oben 3 Bilder, unten 2) mit negativen Margins/Translate für den Überlapp-Effekt. Bilder `object-fit: cover`, radius 0.

**(e) Tokens:** bg weiß, Wordmark schwarz. Bilder scharfkantig (radius 0). Großzügiges vertikales Spacing oben (`--space-110`/`--space-128`).

**(f) Responsive:**
- **Desktop:** volle Collage mit Überlappung wie beschrieben.
- **Mobile (Screenshot):** Wordmark zentriert, darunter Collage kompakter — Bilder stapeln/verkleinern sich, Überlapp reduziert (eher 2-spaltig + ein breites). Auf Mobile darf die Collage zu einem einfacheren 2-Spalten-Mosaik vereinfacht werden, solange alle 5 Bilder + Wordmark erscheinen.

**(g) Interaktion:** Bilder einzeln gestaffelt fade-up/scale-in beim Scrollen (Webflow versteckt `.inner-images-wrapper > *` + Positions-Klassen initial → staggered reveal). **Lightbox:** Original öffnet Bilder im Lightbox-Overlay. Nachbau: **optional** (`CookieConsent`/Lightbox ist nice-to-have) — Default = Bilder ohne Lightbox, nur statisch/Reveal. Falls Lightbox: leichte Variante (Klick → Vollbild-Overlay). Reduced-motion → statisch.

---

## 8. Rezensionen-Karussell — `TestimonialCarousel.astro` (`section_services_for_partners.black-bg`)

> ⚠️ Klassen-Name irreführend (`section_services_for_partners`) — Inhalt ist das **Rezensionen-Karussell**. Hintergrund im Screenshot ist **beige** (`#f3efe7`), NICHT schwarz, obwohl die Klasse `black-bg` heißt. **Maßgeblich = Screenshot: beiger Hintergrund.** (Die `black-bg`-Klasse wird offenbar überschrieben/nicht angewandt.)

**(a) Rolle:** Zentriertes Kunden-Stimmen-Karussell mit Pfeil-Navigation, 5 Slides.

**(b) Copy VERBATIM:**
- Eyebrow (`.text-block.is-black`): `KUNDEN VERTRAUEN AUF ERBEN BAU`
- H2 (`.heading-2.is-centered`): `REZENSIONEN`
- **5 Testimonials** (Reihenfolge, Anführungszeichen exakt wie Quelle):
  1. `"Mit dem Team von Erben Services hatten wir endlich eine Instanz, die zwischen Bauherrn und Gewerken alles zusammenhält. Transparent, zuverlässig und absolut professionell."` (typografische „…")
  2. `"Das Erben Team hat Probleme erkannt, bevor sie überhaupt entstanden sind. So blieb die Baustelle stressfrei und das Ergebnis war erstklassig."` (gerade Anführungszeichen)
  3. `"Das Erben Team hat uns die komplette Koordination abgenommen. Alles lief reibungslos, und wir konnten uns voll auf das Projekt konzentrieren.."` (zwei Punkte am Ende — verbatim beibehalten)
  4. `"Dank dem Team von Erben können wir uns wieder voll auf unser Handwerk konzentrieren. Den ganzen administrativen Aufwand übernehmen sie professionell und effizient."`
  5. `"Mit der Firma Erben als Partner haben wir unsere gesamten internen und externen Abläufe modernisiert und automatisiert, was uns zusätzliche Kapazitäten für neue Projekt geschaffen hat. Das hätten wir alleine nie erreicht."` („Projekt" ohne -e — verbatim)
  > Rezensionen sind **anonym** (keine Namen/Firmen) — nicht erfinden.

**(c) Bilder:** Pfeil-Icons — links `68b6ad8a721e772ffeecc483_left-arrow.svg` → `arrow-left.svg`, rechts `68b6ad8a721e772ffeecc484_right-arrow.svg` → `arrow-right.svg`. alt jeweils `""` (dekorativ).

**(d) Layout:** zentrierter Block. Oben Eyebrow + großes zentriertes H2 „REZENSIONEN". Darunter Slider: ein Testimonial-Text mittig (`.testimonial-text`, größer, zentriert), flankiert von Pfeil-Buttons links/rechts. Dot-Nav (`.slide-nav`) unten. Container ~980px.

**(e) Tokens:** bg `var(--color-beige)` (`#f3efe7`), Text/H2 schwarz. H2 groß (`--text-h2`/`--text-h2-xl`, zentriert). Pfeil-Buttons rund (`--radius-full` 100px). Eyebrow uppercase.

**(f) Responsive:**
- **Desktop:** Text mittig, Pfeile links/rechts daneben.
- **Mobile (Screenshot):** Eyebrow + „REZENSIONEN" zentriert, ein Testimonial mittig, beide Pfeil-Buttons **unter** dem Text nebeneinander (Screenshot zeigt ← → unterhalb der Stimme). Dots darunter.

**(g) Interaktion:** Karussell — Slide-Wechsel per Pfeil (und Dots). Original: `data-animation="slide"`, `data-duration="500"`, `data-infinite="true"`, **autoplay aus** (`data-autoplay="false"`). Nachbau: kleine Client-Insel (Astro `<script>` oder minimaler Slider, kein Webflow). Swipe auf Touch optional. Slide-Transition ~500ms. Reduced-motion → Cross-Fade statt Slide oder instant.

---

## 9. Beratungstermin + Kontaktformular — `ContactSection.astro` + `ContactForm.astro` (`section_contact_form-2`)

**(a) Rolle:** Dunkle Conversion-Sektion — links CTA-Block (Beratungstermin + Kontaktdaten), rechts Kontaktformular. `id="contact-section"`.

**(b) Copy VERBATIM:**

*Linke Spalte (`.form-block-left-2`):*
- H2 (`.heading-15.left-aligned.is-white`): `Beratungstermin` ⏎ `vereinbaren` (`<br>`)
- Button (`.blue_button_full.is-limited`): `Beratungstermin` → Google-Calendar-Termin-URL (target `_blank`, siehe §2)
- Text (`.text-block.is-white`): `Kontaktieren Sie uns gerne!`
- Mail-Zeile: Icon + `info@erben-bau.de` → `mailto:info@erben-bau.de?subject=Anfrage%3A`
- Telefon-Zeile: Icon + `+49 160 45 25 935` → `tel:+491604525935`

*Rechte Spalte — Formular (`#wf-form-Website-Email-Formular`, `method="get"`):*
- Label `Name*` — input `name="Name"` placeholder `Name eingeben` (required)
- Label `Email*` — input `type=email name="Email"` placeholder `@` (required)
- Label `Unternehmen` — input `name="Unternehmen"` placeholder `Unternehmensname`
- Label `Telefon` — input `type=tel name="Telefon"` placeholder `Telefonnummer eingben` (sic — Tippfehler im Original; **verbatim beibehalten oder korrigieren** → empfohlen: korrigieren zu „Telefonnummer eingeben", Tippfehler ist kein Designmerkmal)
- Label `Ihr Anliegen*` — textarea `name="Ihr-Anliegen"` (required, maxlength 5000)
- Checkbox (required), Label-Text VERBATIM:
  `Hiermit bestätige ich die Übermittlung meiner Daten an die Erben Services UG. Ihre Daten werden bis zu Ihrem Widerruf bei uns gespeichert. Weitere Informationen zum Datenschutz finden Sie in unserer Datenschutzerklärung.` — „Erben Services UG" als `<strong>`, „Datenschutzerklärung" als Link → `/datenschutz` (target `_blank`).
- Submit (`.button_outline.is-100`): `Jetzt senden`
- Success-Msg (`.w-form-done`): `Vielen Dank für die Anfrage! Ein Mitglied des Erben Bau Teams wird sich umgehend bei Ihnen melden.`
- Error-Msg (`.w-form-fail`): `Ups! Da ist wohl etwas schief gelaufen.` ⏎ `Bitte versuchen Sie es nochmal.`

**(c) Bilder:** 2 Icons (weiß, 20px): Mail `68ecca435e27801e271a7a96_mail_…FFFFFF…svg` → `icon-mail.svg`, alt `"icon_mail_white"`; Phone `68eccc1d3e7665991d3d3a8d_call_…FFFFFF…svg` → `icon-phone.svg`, alt `"icon_phone_white"`.

**(d) Layout:** 2 Spalten (`.work-with-us-block`, Flex). Links CTA-Block (H2 → blauer Full-Button → „Kontaktieren Sie uns gerne!" → Mail-Zeile → Telefon-Zeile, jeweils Icon + Link). Rechts vertikales Formular (Labels über Inputs, full-width Felder, Checkbox-Zeile, full-width Submit). gap ~48px.

**(e) Tokens:** bg `var(--color-black)` (`#141212`), Text/Labels weiß, H2 weiß. Inputs: bg weiß, Border `#cccccc`, **radius 0**, 14px, padding 8×12px. Button links blau-full; Submit = Outline (weißer Rand, full-width). Mail/Tel-Links weiß, hover blau.

**(f) Responsive:**
- **Desktop:** CTA links | Formular rechts (2 Spalten).
- **Mobile (Screenshot):** 1-spaltig — CTA-Block oben (H2, Beratungstermin-Button, Kontaktdaten), Formular darunter (alle Felder full-width gestapelt, dann Checkbox, dann „Jetzt senden").

**(g) Interaktion:** Form-Validierung (HTML5 required). **Submit-Ziel:** Original ist Webflow `method=get` (Webflow-Backend). Im Astro-Nachbau ohne Webflow → Formular braucht ein Backend: Optionen (Build-Entscheidung) — (1) Netlify Forms (`data-netlify="true"` + hidden form-name), (2) Formspree/Brevo, (3) mailto-Fallback. **Empfehlung: Netlify Forms** (Microsite läuft auf Netlify). Success/Error-States entsprechend ein-/ausblenden. Fade-up-Reveal der Sektion on-scroll.

---

## 10. Footer — `Footer.astro` (`footer-2.is-black`)

**(a) Rolle:** schlanker dunkler Footer, zentrierte Legal-Links.

**(b) Copy VERBATIM** (4 Links, Reihenfolge):
- `Erben Services © 2025` → `/ueber-uns` (⚠️ 404 → im Nachbau `href="#"` oder entfernen des Links, Text behalten)
- `Datenschutz u. Rechtsgrundlagen` → `/datenschutz`
- `Impressum` → `/impressum`
- `Kontakt` → `/kontakt`

**(c) Bild:** keins.

**(d) Layout:** zentrierte horizontale Link-Reihe (`.footer-link-wrap.legals.is-centered`), jeder Link mit kleiner Trennlinie (`.nav-menu-item-line`). Schmaler Footer (`.footer-component.small`).

**(e) Tokens:** bg `var(--color-black)` (`#141212`), Text `#f4f4f4`/weiß, `--text-small` (14–15px). Flat, kein Border-top außer den Link-Trennlinien.

**(f) Responsive:** Desktop horizontale Reihe; Mobile gestapelt/zentriert (Mobile-Screenshot zeigt Links untereinander zentriert).

**(g) Interaktion:** Link-Hover (Farb-/Underline-Wechsel). Kein Reveal nötig.

---

## 11. CookieConsent — `CookieConsent.astro` (Finsweet `fs-cc`)

**(a) Rolle:** Opt-in Cookie-Banner (Original = Finsweet Cookie Consent, `fs-cc-mode="opt-in"`) + Preferences-Modal.

**(b) Copy VERBATIM:**
- Banner-Titel: `Cookie Settings`
- Banner-Text: `Wenn Sie auf "Akzeptieren" klicken, stimmen Sie der Speicherung von Cookies auf Ihrem Gerät zu, um die Navigation auf der Website zu verbessern, die Nutzung der Website zu analysieren und unsere Marketingaktivitäten zu unterstützen. Weitere Informationen finden Sie in unserer Datenschutzrichtlinie.`
- Buttons: `Ablehnen` (deny) / `Annehmen` (allow)
- Preferences-Modal-Titel: `Datenschutz Präferenzen`; Optionen: `Unverzichtbare Cookies` (Notwendig) / `Marketing Cookies` / `Personalisierungs Cookies` / `Analyse-Cookies`; Buttons `Alle Cookies ablehnen` / `Alle Cookies zulassen` / `Einstellungen speichern`.

**(c) Bild:** keins (SVG-Icons inline für Manager-Button + Close).

**(d/e) Layout/Tokens:** dunkles Banner unten, gemäß Brand (`#141212` bg, weiß Text, blauer Allow-Button). Mobile-Screenshot zeigt Banner oben/over-Hero.

**(f) Responsive:** voll-breit unten (Desktop) bzw. oben/oben-über-Hero (Mobile-Screenshot).

**(g) Interaktion:** Opt-in Consent-Logik (localStorage), Accept/Deny, Preferences-Modal. **Build-Hinweis:** Finsweet-Script nicht portieren — leichte eigene Consent-Insel ODER ein schlankes OSS-Cookie-Consent. Da Microsite **noindex** + Google-Analytics im Original: für den Nachbau **kein Analytics** einbinden → Banner kann auf rein dekorativ/minimal reduziert oder ganz weggelassen werden (Build-Entscheidung). **Empfehlung: minimaler Banner ohne echtes Tracking**, da keine Marketing/Analyse-Cookies gesetzt werden.

---

## 12. EIGENE KOMPONENTEN-LISTE (Astro)

| Komponente | Datei | Props | Verwendung |
|------------|-------|-------|------------|
| **Layout** | `src/layouts/Layout.astro` | `title`, `description`, `noindex=true` | `<head>` (Satoshi, meta, noindex), slottet Nav + Content + Footer + CookieConsent |
| **Nav** | `src/components/Nav.astro` | — | sticky dunkle Nav, Burger-Insel mobil (§1) |
| **Hero** | `src/components/Hero.astro` | — | Vollbild-Hero mit Gradient (§2) — nur Home |
| **SplitSection** | `src/components/SplitSection.astro` | `eyebrow`, `heading[]`, `body`, `cta{label,href,variant}`, `image{src,alt}`, `reverse:boolean` | §4 (reverse=false) + §6 (reverse=true). Wiederverwendbar. |
| **Eyebrow** | `src/components/Eyebrow.astro` (optional) | `text`, `align` | uppercase Label (§3/4/6/8) — oder als Inline-Pattern |
| **Gallery** | `src/components/Gallery.astro` | `wordmark`, `images[]` | Wordmark + 5-Foto-Collage (§7) |
| **TestimonialCarousel** | `src/components/TestimonialCarousel.astro` | `eyebrow`, `heading`, `testimonials[]` | Karussell-Insel, beige bg (§8) |
| **ContactSection** | `src/components/ContactSection.astro` | — | dunkle Wrapper-Sektion, slottet CTA-Block + ContactForm (§9) |
| **ContactForm** | `src/components/ContactForm.astro` | `action`, `provider` | Formular + States (§9) |
| **Footer** | `src/components/Footer.astro` | — | zentrierte Legal-Links (§10) |
| **CookieConsent** | `src/components/CookieConsent.astro` | — | minimaler Consent-Banner (§11) |
| **Button** | `src/components/Button.astro` (optional) | `variant: primary\|outline-light\|secondary\|outline-100`, `href`, `target` | wiederkehrende Buttons (§0) |

**Pages:** `src/pages/index.astro` (Home, komponiert §1–§11), `kontakt.astro`, `impressum.astro`, `datenschutz.astro` (§14).

---

## 13. BILD-MAPPING-TABELLE (Original → Slug → Sektion)

| Original-Dateiname (in `images/`) | Semantischer Slug | Sektion(en) |
|------------------------------------|-------------------|-------------|
| `68c14ad6d333f1aac5faf61c_EB_logomark_black – 5.svg` | `logo-eb.svg` | Nav (§1), evtl. Footer |
| `68b6adb38f933de849497b6e_EB_logomark_black – 6@2x.webp` (+ p-500/p-800 PNG) | `wordmark.webp` | Galerie (§7) — „ERBEN / GEMEINSAM BESSER BAUEN" |
| `68c2604ea31cb63ce2c26673_david-kristianto-…unsplash.webp` (+ srcset 500–3200) | `hero.webp` / `gallery-5.webp` | Hero-bg (§2) **und** Galerie bottom-right (§7) — gleiches Foto |
| `68d543ce2ce6826372a8b30b_Close up worker at job (1).webp` (+ p-500) | `worker-desk.webp` | Intro „Gemeinsam vor Ort & digital" (§4) |
| `68d5452064afa97b57beb246_Two billboard on building glass wall (1).webp` (+ p-500/p-800) | `billboard.webp` | „Warum wir tun was wir tun" (§6) |
| `68c26050d1c70c9f0a9b4749_d5-render-…unsplash.webp` (+ srcset) | `gallery-1.webp` | Galerie top-left (§7) |
| `68c2605c11f17f7c0e3e5523_shiva-mardahi-…unsplash.webp` (+ srcset) | `gallery-2.webp` | Galerie center (§7) |
| `68c26059c6e82b968b8f1e3f_takafumi-yamashita-…unsplash.webp` (+ srcset) | `gallery-3.webp` | Galerie top-right (§7) |
| `68c28ca9a7944fa0bc274300_EB _bild_reklaame_wand_Schwarz@2x.webp` (+ p-500 PNG) | `gallery-4.webp` | Galerie bottom-left (§7) — schwarzes EB-Reklameschild |
| `68b6ad8a721e772ffeecc483_left-arrow.svg` | `arrow-left.svg` | Karussell (§8) |
| `68b6ad8a721e772ffeecc484_right-arrow.svg` | `arrow-right.svg` | Karussell (§8) |
| `68ecca435e27801e271a7a96_mail_…FFFFFF…svg` | `icon-mail.svg` | Kontakt-CTA (§9) |
| `68eccc1d3e7665991d3d3a8d_call_…FFFFFF…svg` | `icon-phone.svg` | Kontakt-CTA (§9) |
| `690527c1fb423a2bbb5f236b_256_ES_logo.png` | `favicon.png` (apple-touch) | `<head>` Favicon/Apple-Touch |
| `660c5d42…Facebook.svg` / `660c5d42…Twitter.svg` | `icon-facebook.svg` / `icon-twitter.svg` | nur Mobile-Burger-Socials (§1) — **optional/weglassen** (tote Links) |

> ⚠️ **Fehlendes Asset:** Das Favicon `…690527bb9e7fd9783707310f_32_ES_logo.png` (shortcut icon, 32px) ist NICHT in `images/` vorhanden — nur die 256px-Variante (`690527c1fb423a2bbb5f236b_256_ES_logo.png`). Für den Nachbau die 256px-Variante als Favicon nutzen (Astro skaliert) oder ein neues Favicon aus dem Logomark generieren.

---

## 14. LEGAL PAGES — Bau-Hinweise (`/kontakt`, `/impressum`, `/datenschutz`)

**Gemeinsam:** Gleiche `Nav` (§1) + `Footer` (§10) wie Home. Schlichtes, gut lesbares Textlayout, weißer bg, Container ~720–860px zentriert, großzügiger vertikaler Whitespace, H1/H2 schwarz (Satoshi), Body 14–16px. Inhalt **1:1 verbatim** aus den `.md`-Dateien (`02_KNOWLEDGE-BASE/00_core/{kontakt,impressum,datenschutz}.md`). Reveal-Animationen hier sparsam/keine.

### `/kontakt` — `src/pages/kontakt.astro`
- **Layout = nur die ContactSection (§9)** auf eigener Seite: H2 `Beratungstermin vereinbaren`, Beratungstermin-Button, `Kontaktieren Sie uns gerne!`, Mail `info@erben-bau.de`, Telefon `+49 160 45 25 935`, **plus das volle Kontaktformular** (Original-Kontakt-Seite = identische Form-Sektion). → `ContactSection`-Komponente wiederverwenden. Meta-Description: `"Jetzt per Videocall, Email oder Anruf einen Termin zum Aufmaß oder Angebotserstellung vereinbaren."`

### `/impressum` — `src/pages/impressum.astro`
- H1 `Impressum`. Inhalt verbatim aus `impressum.md`:
  - **Erben Services UG**, Corneliussstr. 12 (sic — doppeltes „s", verbatim), D-80469 München, Email `info@erben-bau.de`, Website `www.erben-bau.de`.
  - **Geschäftsführung:** Cihan Erben. Amtsgericht München, HRB-Nummer HRB305895. USt-IdNr gemäß § 27a UStG: **DE457731051**.
  - Blöcke „Haftung für Inhalte", „Copyright", „Haftungen für Links", „Urheberrecht" — Fließtext verbatim übernehmen.
- Schlichte Typo-Hierarchie (H1 + fette Zwischen-Labels + Absätze).

### `/datenschutz` — `src/pages/datenschutz.astro`
- H1 `Datenschutz`. Inhalt verbatim aus `datenschutz.md`:
  - Verantwortlicher: Erben Services UG (haftungsbeschränkt), Corneliusstr. 12, D-80469 München. Vertreten durch Gesellschafter: **Cihan Erben, Sebastian Schermer**. Email `info@erben-bau.de`. Stand: **01.11.2025**.
  - 17 nummerierte Abschnitte (1. Grundsätzliche Angaben … bis 17. Google Analytics) — lange Fließtexte verbatim. Hosting: Strato AG. Drittanbieter-Liste (Google Fonts/Maps/YouTube/Google+, Instagram, LinkedIn, Twitter, Tumblr, XING, jQuery).
  - ⚠️ Inhaltliche Anomalien im Original (NICHT korrigieren, nur Hinweis): Mail-Link im Datenschutz zeigt fälschlich auf `info@thedigitalforce.eu`; Abschnitt 8 hat doppelte 7.x-Nummerierung. **Verbatim übernehmen** (= Originaltreue), da Legal-Text.
- Sehr lange Seite (Datenschutz-Screenshot bestätigt) — reines Lesetext-Layout, Überschriften (`####` → H4/H3), Listen, Absätze.

> Build-Strategie Legal: Markdown-Content direkt rendern (z.B. `.md`-Import oder `set:html` aus einem Content-Collection-Entry) im schlichten `prose`-artigen Wrapper, eingebettet in `Layout` mit Nav+Footer.

---

## 15. Build-Reihenfolge & Verifikation

1. Layout + Tokens (`@theme`) + Satoshi + Button-Primitive.
2. Nav + Footer (auf allen Seiten geteilt).
3. Home-Sektionen §2,4,6 (Hero + 2× SplitSection) → visueller Abgleich gegen `01_home_full_1440.png`.
4. Gallery (§7) → Abgleich Collage-Crop.
5. TestimonialCarousel (§8) + ContactSection/Form (§9).
6. CookieConsent (§11, minimal).
7. Legal Pages (§14).
8. Reveal-Motion (IntersectionObserver) + reduced-motion.
9. Responsive-QA gegen `01_home_full_mobile390.png` (Breakpoint 768).
10. Build (`astro build` exit 0) → Smoke (image-refs, keine Placeholder) → Deploy Netlify (`erbenbau.voyagedigital.de`, noindex) → HTTP-200-Check.

**Verifikations-Kriterien:** Sektions-Reihenfolge exakt §1–§11; Copy verbatim (Diff gegen `home.md`); alle 11 Bild-Slugs referenziert; 2 Buttons im Hero; 5 Testimonials; 4 Footer-Links; beige Rezensionen-bg; dunkle Nav/Hero/Kontakt/Footer; weiße Intro/About/Gallery-bg.
