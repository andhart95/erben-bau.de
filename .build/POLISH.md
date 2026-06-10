# Erben Bau — Rebuild Polish- & Komponenten-Spec

> Senior-UI/UX-Vorgabe für den Astro v5 + Tailwind v4 Rebuild (CSS-first `@theme`).
> **Treue-Regel (HART):** Kein Redesign. Flacher Blau/Beige/Satoshi-Look bleibt 1:1.
> Alle Empfehlungen hier sind *saubere Umsetzung + dezenter Feinschliff* — keine neuen
> Stilrichtungen, keine zusätzlichen Akzentfarben, keine Schatten-Eskalation.
> Material bleibt **flat**: radius `2px`, eine einzige soft Shadow, Motion 100/200ms.
> Microsite, später live auf `erbenbau.voyagedigital.de` mit `noindex`.

---

## 0. Design-Token-Layer (`src/styles/tokens.css` via `@theme`)

Basis für alles Folgende. Werte 1:1 aus dem Design-Extract — nichts erfinden.

```css
@theme {
  /* Farben — exakt aus Brand */
  --color-blue: #1142d4;          /* Primär, Buttons & Akzente */
  --color-blue-dark: #103ab6;     /* Hover */
  --color-black: #141212;         /* Nav, Footer, Text */
  --color-beige: #f3efe7;         /* warme Sektions-bg (Rezensionen) */
  --color-beige-light: #f9f6f1;
  --color-white: #ffffff;
  --color-grey: #747474;          /* Sekundärtext, Borders */
  --color-input-border: #cccccc;

  /* Typografie — eine Schrift */
  --font-sans: "Satoshi", system-ui, sans-serif;

  /* Type-Scale (fluid, clamp; Originalwerte als Max) */
  --text-eyebrow: 0.75rem;        /* 12px Label, uppercase, tracked */
  --text-body: clamp(0.95rem, 0.9rem + 0.2vw, 1rem);
  --text-body-lg: clamp(1.05rem, 1rem + 0.3vw, 1.25rem);
  --text-h2: clamp(2rem, 1.4rem + 2.5vw, 3rem);       /* 32 → 48px */
  --text-hero: clamp(2.5rem, 1.2rem + 5vw, 4.8rem);   /* 40 → 76.8px */

  /* Spacing-Rhythmus (Basiseinheit 2px; Section-Vertikale großzügig) */
  --space-section: clamp(4rem, 2.5rem + 6vw, 9.4rem); /* ~64 → 150px */
  --space-block: clamp(1.5rem, 1rem + 2vw, 3rem);

  /* Radius — knapp halten */
  --radius-xs: 2px;
  --radius-full: 100px;

  /* Elevation — exakt eine */
  --shadow-soft: rgba(51, 51, 51, 0.1) -1px 1px 4px 0px;

  /* Motion */
  --dur-fast: 100ms;
  --dur-normal: 200ms;
  --ease: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out-Feel des Originals */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* für Reveals */
}
```

**Satoshi:** self-hosted via Fontshare (Weights 300–900 + Italic im Original; für Rebuild
reichen **400 / 500 / 700**). `@font-face` mit `font-display: swap`, woff2, nur die drei
Weights subsetten (Latin). Niemals zweite Schriftfamilie einführen — Original ist
strikt monotypografisch.

**Heading-Stil (kanonisch):** Sentence case, `font-weight: 400–500`, `letter-spacing: -0.01em`
bis `-1px` bei `--text-hero`/`--text-h2`. Zeilenumbrüche im Original bewusst gesetzt
(„Alle Dienstleister / aus einer Hand", „Gemeinsam / vor Ort & / digital") → als
`<br>` oder `max-width` + `text-wrap: balance` reproduzieren.

---

## 1. Nav (`components/nav/SiteNav.astro`)

**Original:** dunkle Bar (`#141212`), Logomark links, 5 Items rechts (Baukoordination,
Bausicherheit, Wachstumspartner, Über Uns + blauer Kontakt-Button). Burger nur sichtbar
mobil (`adaptation-menu`). Service-Links zeigen auf `#`, `/ueber-uns` ist 404.

> **Inhalts-Hinweis für den Rebuild:** Da Service-Seiten + Über-Uns nicht existieren,
> Nav-Items als **Anchor-Links auf die echten Home-Sektionen** mappen (`#leistungen`,
> `#ueber-uns`, `#referenzen`, `#kontakt`) statt auf tote Routen. Kein Phantom-Routing.

### Verhalten
- **Sticky** (`position: sticky; top: 0; z-index: 50`), nicht `fixed` — vermeidet
  Content-Overlap-Bugs. Hero-Bild beginnt unter der Nav.
- **Scroll-Shift (dezent, kein Shrink-Zirkus):** Initial über dem Hero ist die Bar
  transparent-auf-dunkel (Hero-Bild ist eh dunkel-overlaid → Lesbarkeit gegeben).
  Ab Scroll-Y > 24px: solide `--color-black` bekommt `--shadow-soft` + `backdrop-filter:
  blur(8px)` als Fallback-Wärme. Höhen-Shrink: von `padding-block: 20px` → `14px`,
  Transition `--dur-normal --ease`. **Kein** Logo-Skalieren (flacher Look, ruhig halten).
- IntersectionObserver-Sentinel (1px-Div ganz oben) toggelt `.is-scrolled` auf `<nav>` —
  performanter als Scroll-Listener, kein Layout-Thrash.

### Active-State
- Aktuelle Sektion via IntersectionObserver (rootMargin `-45% 0px -45% 0px`) → setzt
  `aria-current="true"` + visuell: 2px blaue Unterstreichung (`box-shadow: 0 1px 0
  var(--color-blue)`) unter dem aktiven Link. Subtil, im Brand-Blau.

### Mobile-Burger (sauber definiert — Original hat nur Stub)
- Burger-Button ab `< 768px`: 3 Balken (`--color-white`), `min-w/h 44px` Touch-Target,
  `aria-label="Menü öffnen"`, `aria-expanded`, `aria-controls="mobile-menu"`.
- **Full-screen Overlay-Panel** (`#mobile-menu`), bg `--color-black`, slide-in von rechts
  (`transform: translateX(100%) → 0`, `--dur-normal --ease`). Links groß
  (`--text-body-lg`, weight 500, weiß), je 56px Zeilenhöhe, blauer Kontakt-Button
  full-width unten.
- **Focus-Trap** im offenen Panel (erstes/letztes fokussierbares Element loopen),
  `Esc` schließt, Body-Scroll-Lock (`overflow: hidden` auf `<html>`), Klick außerhalb
  schließt. Burger animiert zu „X" (zwei Balken rotieren ±45°, mittlerer `opacity 0`).
- Implementierung: vanilla `<script>` (kein Framework-Island nötig) — Microsite-schlank.

### Fokus-States (gesamt-Nav)
- `:focus-visible` → 2px solid `--color-blue` outline mit `outline-offset: 3px`.
  Auf dunklem bg gut sichtbar. Niemals `outline: none` ohne Ersatz.

---

## 2. Hero (`components/hero/Hero.astro`)

**Original:** Vollflächiges Bild-Background, dunkler Gradient-Overlay, weiße Headline
„Erben Baukoordination" (eyebrow-artig) + „Alle Dienstleister aus einer Hand" (H1-groß)
+ Subline + zwei Buttons (Kontakt primär, Beratungstermin sekundär/outline).

### Bild-Treatment + Overlay
- Hero-Bild als `<img>` mit `loading="eager"`, `fetchpriority="high"`, explizite
  `width`/`height` (CLS = 0), `object-fit: cover`, `decoding="async"`. Hinweis: Im
  Original ist das Hero-`section_hero_image_background` ein CSS-bg ohne `<img>` —
  fürs LCP **echtes `<img>`** verwenden (besser für Preload + CWV).
- **Gradient-Overlay exakt nach Original:** `linear-gradient(transparent, rgba(0,0,0,0.5))`
  — dunkelt nach unten ab, hält Headline-Lesbarkeit. Als `::before`/Overlay-Div über dem
  Bild, `pointer-events: none`. Optional minimal verstärkt für AA-Kontrast auf hellen
  Bildbereichen: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55))`. Im Brand-Rahmen
  (reines Schwarz-Overlay, kein Farbstich).
- Radius: **0/flat** auf Hero-Bild (vollflächig).

### Text-Reveal (SplitText-Feel via CSS — ohne GSAP)
- Original nutzt GSAP SplitText. Rebuild: **CSS-only Staffel-Reveal** — kein 60KB-GSAP
  laden. Headline-Zeilen je in `<span class="reveal-line">`, Wrapper `overflow: hidden`,
  Zeile startet `transform: translateY(110%)` → `0`, `opacity 0 → 1`, gestaffelt per
  `transition-delay` (0 / 80 / 160ms). Trigger: on-load (Hero ist above-the-fold), nicht
  scroll-gated. Eyebrow zuerst, dann H1-Zeilen, dann Subline, dann Buttons.
- `--dur-normal` + `--ease-out`. **`prefers-reduced-motion: reduce` → alles sofort
  sichtbar** (`transform: none; opacity: 1; transition: none`).

### Button-Hover (kanonische Button-Specs — projektweit wiederverwendbar)
- **Primär** (`.btn-primary`): bg `--color-blue`, Text weiß, `font: 500 1.125rem`,
  `padding: 12px 20px`, `radius: 2px`. Hover → bg `--color-blue-dark`, leichtes
  `translateY(-1px)`. Active → `translateY(0)`. Transition `color, background-color,
  transform --dur-fast --ease`. Focus-visible-Ring wie Nav.
- **Outline/Sekundär** (`.btn-outline`): transparent, `1px solid` (weiß auf Hero/dunkel,
  schwarz auf hell), Text in Linienfarbe, radius 2px. Hover → bg = Linienfarbe, Text
  invertiert (weiß→schwarz bzw. schwarz→weiß), `--dur-fast`. Auf Hero: weißer Rand,
  Hover füllt weiß, Text wird `--color-black`.
- Beide: `display: inline-flex; align-items: center; gap: 8px;` für optionales Icon,
  `min-height: 44px` (Touch).

---

## 3. SplitSection — 2-Spalter (`components/split/SplitSection.astro`)

**Original:** zwei alternierende Text+Bild-Blöcke („Gemeinsam vor Ort & digital" / „Warum
wir tun was wir tun"), Eyebrow-Label „ÜBER UNS", H2, Body, Sekundär-Button. Bild flach
(radius 0–2px).

### Props / Komposition
- `eyebrow`, `heading`, `body`, `cta` (label+href), `image` (src/alt/w/h),
  `reverse` (boolean → Bild rechts statt links). Wiederverwendbare Komponente für beide
  Blöcke (DRY).

### Scroll-Reveal (IntersectionObserver, reduced-motion-safe)
- Wiederverwendbare Utility `useReveal` / `data-reveal`-Attribut (siehe §8 Motion-System).
- Block fadet ein: `opacity 0 → 1`, `transform: translateY(24px) → 0`, `--dur-normal`
  (leicht länger ok: 400–500ms) `--ease-out`. Text- und Bild-Spalte mit ~80ms Versatz
  (Text zuerst), wirkt editorial ohne aufdringlich zu sein.
- IntersectionObserver `threshold: 0.15`, `rootMargin: 0px 0px -10% 0px`, **`unobserve`
  nach erstem Trigger** (kein Re-Animate beim Zurückscrollen — ruhiger, seriöser).
- `prefers-reduced-motion: reduce` → Elemente direkt sichtbar, Observer setzt nur
  `.is-visible` ohne Transform-Animation.

### Bild
- Radius `2px` (Original-flat). `object-fit: cover`, explizite Dimensionen,
  `loading="lazy"`, AVIF/WebP. Aspect-Ratio-Box (`aspect-ratio`) gegen CLS.

### Eyebrow-Stil („ÜBER UNS")
- Eigene Klasse `.eyebrow`: `font-size: var(--text-eyebrow)`, `text-transform: uppercase`,
  `letter-spacing: 0.08em`, `font-weight: 500`, color `--color-grey` (oder
  `--color-black` je nach bg). Optional 24px blauer Strich davor
  (`::before { content:''; width:24px; height:2px; background: var(--color-blue); }`,
  `inline-flex; gap:12px; align-items:center`) — *dezenter* Brand-Akzent, kein Muss.
- Hierarchie: Eyebrow (klein, grau) → H2 (groß, schwarz) → Body (`--text-body-lg`, grau)
  → Button. Klarer Scale-Contrast = Pflichtqualität.

---

## 4. Gallery — Collage (`components/gallery/Gallery.astro`)

**Original:** Logomark-Block oben (EB-Logomark + „GEMEINSAM BESSER BAUEN"), darunter
5-Bild-Collage (`top-left`, `center`, `top-right`, `bottom-left`, `bottom-right`),
Webflow-Lightbox, Bilder waren initial `visibility: hidden` (JS-Reveal).

### Layout
- CSS Grid Collage, **kein** uniformes 1:1-Raster (Anti-Template). Beispiel-Raster
  (Desktop, `grid-template-areas`):
  ```
  "tl  c   tr"
  "bl  c   br"
  ```
  center-Bild (`shiva-mardahi`, Hochformat) spannt beide Zeilen → Höhen-Rhythmus.
  Gaps `16–24px`. Mobile: einspaltig stapeln, oder 2-Spalten mit center full-width.
- Bilder radius `2px`, `object-fit: cover`, feste `aspect-ratio` pro Zelle.

### Hover (subtil, im flachen Rahmen)
- `.gallery-image` Wrapper `overflow: hidden; border-radius: 2px;`.
- Hover: `img { transform: scale(1.04); }` `--dur-normal --ease`,
  + dezentes Overlay `::after` `background: rgba(17,66,212,0.0) → rgba(17,66,212,0.12)`
  (Brand-Blau, sehr leicht) ODER neutrales `rgba(0,0,0,0.15)`. Cursor `zoom-in` wenn
  Lightbox aktiv. Kein Zoom > 1.05 (flacher, seriöser Look).
- `:focus-visible` auf den Lightbox-Triggern (sind interaktiv) → blauer Ring.

### Lazy-Loading
- Alle Galerie-Bilder `loading="lazy"` + explizite Dimensionen. `srcset`/`sizes` aus den
  vorhandenen `-p-500/-p-800/-p-1080…` Varianten (liegen in `images/`).

### Lightbox (leichtgewichtig, keine schwere Lib)
- **Empfehlung:** `<dialog>`-Element (nativ, A11y-Backdrop, Esc-close gratis) + ~40 Zeilen
  vanilla JS. Klick auf Bild → `dialog.showModal()`, großes Bild + Prev/Next + Close (X).
  Tastatur: ←/→ blättern, `Esc` schließt (nativ), Focus kehrt zum Trigger zurück. Backdrop
  `rgba(20,18,18,0.92)`. **Keine** externe Lightbox-Lib (kein GLightbox/PhotoSwipe nötig
  bei 5 Bildern). Reduced-motion: Open ohne Scale-Animation.
- Optional/Pragmatisch: Wenn Lightbox als Scope-Creep gilt → reine Collage mit Hover-Zoom
  ohne Lightbox ist legitim (Original-Bilder sind Stock, kein echtes Portfolio). Als
  bewusste Entscheidung dokumentieren.

### Logomark-Block
- EB-Logomark (`68b6adb3…_EB_logomark_black…webp`, vorhanden) zentriert, darunter
  Wordmark-Lockup „ERBEN — GEMEINSAM BESSER BAUEN". `loading="lazy"`. Reveal wie §3.

---

## 5. TestimonialCarousel (`components/testimonials/TestimonialCarousel.astro`)

**Original:** Beige-bg (`#f3efe7`), Eyebrow „KUNDEN VERTRAUEN AUF ERBEN BAU", H2
„REZENSIONEN", 5 anonyme Slides, Pfeil-Buttons (radius `100px`), Dot-Nav. Webflow-Slider,
`data-autoplay="false"`.

### A11y-konformes Karussell (vanilla, kein Slider-Framework)
- Region: `<section aria-roledescription="carousel" aria-label="Kundenstimmen">`.
- Slides-Container `<ul>`, jeder Slide `<li role="group" aria-roledescription="Slide"
  aria-label="2 von 5">`. Inaktive Slides `aria-hidden="true"` + `inert` (nicht
  fokussierbar).
- **Kein Auto-Play-Zwang** (Original hat es eh aus) — bewusst manuell. Falls je Auto-Play:
  Pause-Button + pause-on-hover/focus Pflicht. Hier: weglassen.
- **Pfeil-Buttons:** echte `<button>`, `radius: 100px` (`--radius-full`),
  `aria-label="Vorherige Rezension"` / „Nächste Rezension", `min 44×44px`. Stil: weiß/
  beige-light bg, 1px border `--color-black` oder Pfeil in `--color-black`. Hover → bg
  `--color-blue`, Pfeil weiß, `--dur-fast`. Disabled-State an den Rändern (wenn nicht
  infinite) → `opacity 0.4; cursor: not-allowed`.
- **Tastatur:** ←/→ blättern wenn Karussell fokussiert; Tab erreicht Pfeile + Dots; Dots
  als `<button>` mit `aria-label="Gehe zu Rezension 3"` + `aria-current` für aktiven Dot.
- **Slide-Übergang:** `transform: translateX()` auf dem Track, `--dur-normal --ease`.
  Live-Region `aria-live="polite"` ankündigt Slide-Wechsel optional (nur wenn dezent).
  Reduced-motion → instant `translateX` ohne Transition.
- **Swipe** mobil: pointer/touch-Events, ohne Lib (~30 Zeilen). Optional.

### Visuell
- Karten/Slide: beige-light bg innerhalb der beigen Sektion ODER schlicht zentrierter
  Quote-Text (`--text-body-lg`, `font-style: italic` optional wie Original-Quotes mit
  „"“). Großzügiges `max-width: 60ch`, zentriert. Anführungszeichen typografisch korrekt
  (deutsche „…"). Anonym = keine Avatare erfinden (Original ist namenlos — nicht
  faken). Optional dezentes blaues `"`-Glyph als Eyebrow-Akzent.

---

## 6. ContactForm (`components/contact/ContactForm.astro`)

**Original:** dunkle Sektion (`#141212`), links „Beratungstermin vereinbaren" + Google-
Calendar-Button + Mail/Telefon, rechts Webflow-Formular (Name*, Email*, Unternehmen,
Telefon, Ihr Anliegen*, Consent-Checkbox*, „Jetzt senden" outline-Button). Webflow-Form
hatte `method="get"` (= kein echtes Backend / mailto-artig).

### Backend-Empfehlung: **Netlify Forms** (sauberste Variante für Microsite)
- `<form name="kontakt" method="POST" data-netlify="true" netlify-honeypot="bot-field">`.
  Hidden `<input type="hidden" name="form-name" value="kontakt">` (Astro/statisch nötig,
  da Netlify das Form-Markup zur Build-Zeit parst). Honeypot-Feld `bot-field` versteckt.
- Submit → Redirect auf `/danke` (eigene schlanke Success-Seite) **oder** AJAX-POST +
  Inline-Success-State (kein Reload). Empfehlung: AJAX-`fetch`-POST an `/` mit
  `application/x-www-form-urlencoded` → Inline-Success (besser UX, kein Seitenwechsel).
- **mailto-Fallback** dokumentieren als Plan B, falls nicht auf Netlify deployed:
  `action="mailto:info@erben-bau.de"` ist UX-schwach (öffnet Mailclient) → nur Fallback.
  Da Ziel-Host Netlify-typisch ist (`voyagedigital.de`-Subdomain) → Netlify Forms ist
  die Wahl. **Spam-Schutz:** Honeypot reicht; optional Netlify-eigenes reCAPTCHA
  (`data-netlify-recaptcha="true"`) nur falls Spam auftritt — nicht vorab.

### Label / Input-States
- Jedes Feld: sichtbares `<label for>` über dem Input (nicht placeholder-as-label).
  Required mit `*` + `aria-required="true"`. Placeholder nur als Hinweis.
- **Input default:** weiß bg, `1px solid var(--color-input-border)` (`#cccccc`),
  radius `2px` (Brand; Original war 0 — 2px hält System konsistent), `padding: 10px 12px`,
  `font: 400 1rem Satoshi`.
- **Focus:** `border-color: var(--color-blue)` + `box-shadow: 0 0 0 3px rgba(17,66,212,0.18)`
  (Brand-Blau Focus-Ring, AA-sichtbar auf dunkler Sektion). `--dur-fast` transition.
- **Error:** `border-color: #c0392b` (rot, semantisch — minimal, nicht im Token-Set, nur
  für Validierungs-Feedback), `aria-invalid="true"`, Fehlertext darunter
  (`role="alert"`, klein, rot): „Bitte E-Mail-Adresse prüfen." Inline, feldnah.
- **Success (Feld):** optional dezenter grüner Border — eher weglassen, flach halten.

### Consent-Checkbox
- Custom-styled aber **echter** `<input type="checkbox" required>`. Label-Text 1:1 aus
  Original: „Hiermit bestätige ich die Übermittlung meiner Daten an die **Erben Services
  UG**. … Datenschutzerklärung." Link zu `/datenschutz` (`target="_blank" rel="noopener"`).
  Checkbox-Focus → blauer Ring. Check-Häkchen in `--color-blue` bei `:checked`.

### Validierung (clientseitig)
- Native HTML5 (`required`, `type="email"`, `pattern` für Telefon optional) + dezentes
  JS-Enhancement: validate on `blur` (nicht on jedem keystroke — weniger nervig), zeige
  Fehler erst nach erstem Blur/Submit-Versuch. `noValidate` auf Form + custom Messages
  für konsistente deutsche Texte. Submit-Button disabled bis Required+Consent ok
  (optional) ODER bei Submit-Versuch erste invalide Feld fokussieren.

### Submit-Button + States
- „Jetzt senden" — Stil: Original war `button_outline is-100` (outline, full-width). Auf
  dunkler Sektion: weißer Outline-Button full-width (`.btn-outline`, weiß), Hover füllt
  weiß/Text schwarz. (Konsistent mit Hero-Outline.)
- **Loading:** Button → „Bitte warten…", `aria-busy="true"`, disabled, dezenter Spinner
  oder reiner Textwechsel (Original: `data-wait="Bitte warten..."`).
- **Success-State:** Form ausblenden, Success-Message einblenden (Original-Text 1:1):
  „Vielen Dank für die Anfrage! Ein Mitglied des Erben Bau Teams wird sich umgehend bei
  Ihnen melden." → `role="status"`, Fokus dorthin setzen.
- **Error-State (Submit fehlgeschlagen):** „Ups! Da ist wohl etwas schief gelaufen. Bitte
  versuchen Sie es nochmal." `role="alert"`, Form bleibt befüllt.

### Linke Spalte (Kontaktinfo)
- H2 „Beratungstermin vereinbaren", primärer blauer Full-Button → Google-Calendar-Link
  (`target="_blank" rel="noopener"`). Mail + Telefon mit Icon (SVG vorhanden,
  weiß), als echte `mailto:`/`tel:`-Links, Hover → `--color-blue` Text oder Underline.

---

## 7. CookieConsent (`components/consent/CookieConsent.astro`)

**Original:** Finsweet `fs-cc` (externes jsDelivr-Script, opt-in). **Ersetzen** durch
eigene schlanke Komponente — kein externes Script, DSGVO-konform, localStorage-Persistenz.

### Funktionsumfang (DSGVO-konform, opt-in)
- **Drei Aktionen:** „Ablehnen" / „Annehmen" / „Einstellungen" (Original-Logik).
  Default = nichts gesetzt → keine nicht-essenziellen Cookies/Scripts laden bis Consent.
- **Kategorien** (aus Original): Notwendig (immer an, disabled), Marketing,
  Personalisierung, Analyse — als Toggles im Einstellungen-Panel. Da Microsite + `noindex`
  + vermutlich **keine** Analytics/Marketing-Scripts: Banner kann minimal sein
  („Notwendig" only). **Empfehlung:** Nur Banner zeigen wenn tatsächlich nicht-essenzielle
  Scripts existieren. Wenn die Microsite *keine* Tracker lädt → Consent-Banner ist rechtl.
  nicht zwingend; dann **weglassen oder rein informativ**. Mit Cihan/Voyage klären, ob
  Analytics geplant. Default-Bau: schlanker opt-in-Banner, vorbereitet für spätere Scripts.
- **Persistenz:** `localStorage` Key `eb-consent` = JSON `{ necessary:true, marketing,
  personalization, analytics, ts }`. Bei vorhandenem Consent → Banner nicht zeigen.
  „Cookie-Einstellungen"-Re-Open-Button (kleines Icon, fixed, wie Original `fs-cc-manager`)
  erlaubt späteres Ändern.

### Visuell (im Brand-Rahmen)
- Banner: bg `--color-black`, Text weiß `--text-body`, unten fixiert (`position: fixed;
  bottom: 0; z-index: 60`), `--shadow-soft` nach oben, max-width-Container.
- Buttons: „Annehmen" = `.btn-primary` (blau), „Ablehnen" = `.btn-outline` (weiß),
  „Einstellungen" = Textlink/ghost. Radius 2px.
- Einstellungen = `<dialog>` Modal (nativ, A11y), Toggles als echte Checkboxen/Switches,
  „Alle ablehnen / Alle zulassen / Einstellungen speichern".

### A11y
- Banner `role="dialog" aria-label="Cookie-Einstellungen" aria-modal="false"` (Banner
  blockiert nicht). Settings-`<dialog>` = `aria-modal="true"`. Tastatur erreichbar,
  Focus-Ring blau, Esc schließt Settings. Beim ersten Anzeigen Fokus **nicht** stehlen
  (Banner non-blocking) — Screenreader-Ankündigung via `aria-live="polite"`.
- **Kein** Cookie-Wall/Dark-Pattern: „Ablehnen" gleichwertig sichtbar wie „Annehmen"
  (DSGVO/TTDSG). Beide Buttons gleich prominent.

---

## 8. Motion-System (`src/lib/motion.ts` + `styles/motion.css`)

Token-basiert, eine Quelle der Wahrheit. Original-Feel: smooth, scroll-linked, 100/200ms,
ease-in-out. Rebuild **ohne GSAP** (CWV/Bundle) — CSS + IntersectionObserver reichen.

### Durations & Easing (Tokens, §0)
- `--dur-fast: 100ms` (Hover, Color, kleine States),
  `--dur-normal: 200ms` (Übergänge, Slides, Menü),
  Reveals dürfen 400–500ms `--ease-out` (großzügiger, editorial).

### Scroll-Reveal-Utility (wiederverwendbar)
- Ein einziger globaler IntersectionObserver, der alle `[data-reveal]`-Elemente beobachtet.
  ```js
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  ```
  CSS:
  ```css
  [data-reveal] { opacity: 0; transform: translateY(24px);
    transition: opacity var(--dur-normal) var(--ease-out),
                transform var(--dur-normal) var(--ease-out); }
  [data-reveal].is-visible { opacity: 1; transform: none; }
  [data-reveal][data-reveal-delay="1"] { transition-delay: 80ms; }
  ```
- Nur `transform` + `opacity` (compositor-friendly). Kein Animieren von
  width/height/top/margin.

### Reduced-Motion (Pflicht, global)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```
JS-seitig zusätzlich `matchMedia('(prefers-reduced-motion: reduce)')` prüfen und
Reveal-/Slide-Logik auf „direkt sichtbar" schalten.

### Hover/Interaction-Motion
- Buttons: `transform translateY(-1px)` + `background-color`, `--dur-fast`.
- Bilder: `scale(1.04)` max, `--dur-normal`.
- `will-change: transform` nur on-hover/aktiv setzen, nach Animation entfernen (nicht
  dauerhaft).

---

## 9. Performance- & A11y-Checkliste (vor „done")

### Performance (CWV-Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] **Jedes** `<img>` mit explizitem `width`+`height` (oder `aspect-ratio`) → CLS 0.
- [ ] Hero-Bild: `loading="eager"` + `fetchpriority="high"` + `<link rel="preload">`.
      Alle anderen Bilder `loading="lazy"` + `decoding="async"`.
- [ ] AVIF/WebP mit `srcset`/`sizes` aus vorhandenen `-p-500…-p-3200`-Varianten. Niemals
      Originalbilder (770KB–1.2MB) ungeskaliert ausliefern; je Slot passende Größe.
- [ ] Satoshi: nur 3 Weights, woff2, `font-display: swap`, **eine** Familie preloaded
      (kritischer Weight, z.B. 500). Latin-subset.
- [ ] **Kein GSAP / jQuery / Webflow-Runtime** im Rebuild (Original schleppte alle drei
      + 3 GSAP-Plugins). Inter-/Animations-JS vanilla, total < 10KB. CSS < 15KB (Microsite-
      Budget) — Tailwind v4 purged.
- [ ] Inline critical above-the-fold CSS (Astro macht das brauchbar), Rest defer.
- [ ] Motion nur auf `transform`/`opacity`. Kein Scroll-Handler-Churn (IO statt scroll).
- [ ] Lighthouse ≥ 95 Performance + 100 A11y/Best-Practices als Gate.

### A11y (WCAG AA, Original-Design-System ist 100% AA-fähig — nicht verspielen)
- [ ] Semantisches HTML: `<header><nav>`, `<main>`, `<section aria-labelledby>`,
      `<footer>`. Eine `<h1>` (Hero), saubere H2-Hierarchie, keine Skips.
- [ ] Kontrast: Weiß auf `--color-black` ✓; Blau `#1142d4` auf Weiß ✓ (Button-Text weiß
      auf Blau prüfen — passt). Grau-Text `#747474` auf Weiß = AA bei ≥ 16px (große Texte) —
      für Body ≥ 4.5:1 verifizieren, ggf. `#5e5e5e` falls knapp. Hero-Overlay-Gradient
      sicherstellen dass Headline-Bereich ≥ 4.5:1.
- [ ] **Fokus immer sichtbar:** `:focus-visible` blauer 2px-Ring + offset, projektweit.
      Nie `outline: none` ohne Ersatz.
- [ ] Tastatur: Nav, Mobile-Menü (Focus-Trap+Esc), Karussell (←/→, Dots), Lightbox
      (←/→, Esc, Focus-Return), Form, Consent komplett ohne Maus bedienbar.
- [ ] `prefers-reduced-motion` respektiert (alle Reveals/Slides/Hover-Scales).
- [ ] Touch-Targets ≥ 44×44px (Burger, Pfeile, Dots, Buttons, Checkbox-Hitbox).
- [ ] Alt-Texte: aussagekräftig auf Inhaltsbildern (aus Original übernehmen), `alt=""`
      auf rein dekorativen (Icons mit Textlabel daneben → dekorativ).
- [ ] Form: Labels verknüpft (`for`/`id`), Fehler `role="alert"`, Success `role="status"`,
      `aria-required`/`aria-invalid` korrekt.
- [ ] `lang="de"` auf `<html>`. `noindex` via `<meta name="robots" content="noindex">`
      (Staging-Subdomain) — vor echtem Go-Live entfernen.
- [ ] Reduced data: keine dekorativen Riesen-Hintergrundvideos (gibt's eh nicht).

---

## 10. Treue-Guardrails (was NICHT passieren darf)

- Keine zweite Schriftfamilie. Keine neuen Akzentfarben (Gold/Rosé bleiben ungenutzt wie
  im Original, höchstens minimal). Kein Dark-Mode-Toggle. Keine Glas-/Neon-/Schatten-
  Eskalation. Radius bleibt 2px (Pills/Arrows 100px). Eine Shadow. Flat bleibt flat.
- Keine erfundenen Inhalte: Service-Unterseiten existieren nicht → Nav auf Sektionen.
  Rezensionen bleiben anonym (keine Fake-Namen/Avatare). „Projekt"-Bilder sind Stock →
  nicht als echtes Portfolio framen.
- Motion bleibt dezent (100/200ms, Reveal max 500ms, Scale max 1.05). Original-Feel:
  ruhig, seriös, „digital-bau" — nicht verspielt.
