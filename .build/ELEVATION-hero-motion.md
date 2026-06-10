# Erben Bau — Elevation: Hero + Motion-/Reveal-System + Nav + Buttons

> Konkrete, CI-konforme Upgrades zum bestehenden Astro v5 + Tailwind v4 Rebuild.
> **Treue-Regel bleibt hart:** flat, 2px-Radius, EINE soft Shadow, Satoshi only,
> Brand-Blau `#1142d4` / `#103ab6`, Beige/Schwarz/Weiß. Motion dezent (100/200ms Hover,
> Reveal max ~500ms, `ease-out` = `cubic-bezier(0.16,1,0.3,1)`, Scale max 1.05).
> Alle Effekte nur `transform`/`opacity`, `prefers-reduced-motion` Pflicht.
> Die Startseite gefällt dem Auftraggeber schon — das hier **veredelt subtil, baut nichts um.**

Bestehende Bausteine, die wir respektieren (nicht ersetzen):
- `[data-reveal]` + `.is-visible` + `--reveal-delay` in `global.css` (Z. 52–64).
- Globaler IO in `Layout.astro` (Z. 60–80), `threshold 0.12`, `unobserve` nach Trigger (kein Re-Animate — gut, behalten).
- Tokens in `global.css` `@theme` (Z. 4–30), inkl. `--ease-out-expo`, `--shadow-soft`.

Die Upgrades sind **additiv**: neue Sub-Tokens, ein erweiterter IO, neue CSS-Klassen.
Bestehende `data-reveal`-Aufrufe in SplitSection/Services/Gallery funktionieren unverändert weiter.

---

## Übersicht der 6 Upgrades

| # | Bereich | Datei(en) | Risiko |
|---|---------|-----------|--------|
| 1 | Motion-Tokens erweitern (Quelle der Wahrheit) | `global.css` | minimal |
| 2 | Hero-Headline Line-Mask-Reveal + Choreografie | `Hero.astro`, `global.css` | gering |
| 3 | Hero-Bild dezenter Scroll-Parallax (max ~6%) | `Hero.astro` | gering |
| 4 | Reveal-System: Stagger über `data-reveal-delay`, IO-Tuning | `global.css`, `Layout.astro` | gering |
| 5 | Nav: Scroll-Shift Token-Shadow + Active-Underline via IO | `Nav.astro` | gering |
| 6 | Button-Microinteractions (Icon-Shift, dezenter) | `Button.astro` | minimal |

---

## 1. Motion-Tokens erweitern — `src/styles/global.css`

Eine einzige Quelle für Dauern/Easing. Wir behalten `--ease-out-expo` und ergänzen
Aliase + Reveal-Distanzen, damit Hero und Reveal-System dieselben Werte ziehen.

**Edit im `@theme`-Block (nach `--ease-out-expo`, Z. 29):**

```css
  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Alias — Reveals & Enter-States */
  --dur-fast: 120ms;     /* Hover / Color / kleine States */
  --dur-normal: 200ms;   /* Slides, Menü, Transforms */
  --dur-reveal: 560ms;   /* Reveals (editorial, max ~600ms) */
  --reveal-y: 26px;      /* Reveal-Distanz, kompositorfreundlich */
```

> Begründung: `--dur-reveal` zentral macht alle Reveals (Hero-Zeilen, Sections) konsistent;
> bisher stand `0.7s` hart in `global.css`. 560ms `ease-out` liest sich ruhig-seriös,
> nicht verspielt. Kein neuer „Look", nur Tuning.

---

## 2. Hero-Headline Line-Mask-Reveal + Choreografie

Sauberer SplitText-Feel **ohne GSAP**: jede Headline-Zeile sitzt in einem
`overflow:hidden`-Wrapper, der innere Span fährt `translateY(110%) → 0` + Fade.
On-load (Hero ist above-the-fold), gestaffelt: **Eyebrow → H1-Zeile 1 → H1-Zeile 2 →
Subline → Buttons**. Reduced-motion zeigt alles sofort.

### 2a. CSS — `src/styles/global.css` (am Ende anfügen)

```css
/* ===== Hero Line-Mask-Reveal (on-load, kein Scroll-Gate) ===== */
.hero-reveal { opacity: 1; } /* Container sichtbar; Kinder steuern Motion */

@media (prefers-reduced-motion: no-preference) {
  /* Zeilen-Maske: Wrapper clippt, Inner-Span fährt hoch */
  .reveal-line {
    display: block;
    overflow: hidden;
  }
  .reveal-line > span {
    display: block;
    transform: translateY(110%);
    transition: transform var(--dur-reveal) var(--ease-out);
    transition-delay: var(--line-delay, 0ms);
    will-change: transform;
  }
  /* Block-Elemente (Eyebrow/Subline/Buttons): Fade + leichtes Up */
  .reveal-fade {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity var(--dur-reveal) var(--ease-out),
      transform var(--dur-reveal) var(--ease-out);
    transition-delay: var(--fade-delay, 0ms);
    will-change: transform, opacity;
  }

  /* Trigger: .hero-in auf der Section setzt JS nach dem Paint */
  .hero-in .reveal-line > span { transform: translateY(0); }
  .hero-in .reveal-fade { opacity: 1; transform: none; }
}

/* will-change nach Abschluss wieder freigeben (kein Dauer-Layer) */
.hero-in .reveal-line > span,
.hero-in .reveal-fade { will-change: auto; }

@media (prefers-reduced-motion: reduce) {
  .reveal-line > span { transform: none; }
  .reveal-fade { opacity: 1; transform: none; }
}
```

### 2b. Markup — `src/components/Hero.astro` (Text-Block ersetzen)

Ersetze den `<div class="max-w-2xl text-white" data-reveal>`-Block (Z. 28–40):

```astro
    <div class="hero-reveal max-w-2xl text-white">
      <p class="eyebrow reveal-fade mb-4 text-white/80" style="--fade-delay:0ms">
        Erben Baukoordination
      </p>
      <h1 class="text-[clamp(2.5rem,1.2rem+5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.02em]">
        <span class="reveal-line" style="--line-delay:90ms"><span>Alle Dienstleister</span></span>
        <span class="reveal-line" style="--line-delay:180ms"><span>aus einer Hand</span></span>
      </h1>
      <p class="reveal-fade mt-6 text-xl leading-relaxed text-white/90" style="--fade-delay:320ms">
        Ein Ansprechpartner für alle Gewerke.<br />Schnell, digital und persönlich vor Ort.
      </p>
      <div class="reveal-fade mt-8 flex flex-wrap gap-4" style="--fade-delay:430ms">
        <Button href="/kontakt" variant="primary">Kontakt</Button>
        <Button href={CAL} target="_blank" variant="outline-light">Beratungstermin</Button>
      </div>
    </div>
```

Wichtig: Die `leading-[1.02]` der H1 würde einen `overflow:hidden`-Wrapper Descender
(z.B. „g" in nichts hier, aber generell) leicht clippen. Deshalb minimal Luft im Wrapper —
füge in 2a beim `.reveal-line` ein `padding-bottom: 0.08em; margin-bottom: -0.08em;` hinzu,
falls beim QA ein Buchstaben-Clip auftritt (nur dann, sonst weglassen — flat halten).

### 2c. JS-Trigger — `src/components/Hero.astro` (am Ende anfügen)

On-load + nach erstem Paint, damit die Start-Transforms greifen (kein FOUC-Flash):

```astro
<script>
  const hero = document.currentScript?.previousElementSibling?.querySelector?.('.hero-reveal')
    ?? document.querySelector('.hero-reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fire = () => hero?.classList.add('hero-in');
  if (reduce) fire();
  else requestAnimationFrame(() => requestAnimationFrame(fire)); // 2 Frames: Startstyle sicher gemalt
</script>
```

> Choreografie-Timing: Eyebrow 0 → Zeile1 90 → Zeile2 180 → Subline 320 → Buttons 430ms.
> Gesamt-Lauf < 1s, jede Einzelanimation 560ms `ease-out`. Ruhig, editorial, nicht Effekt-lastig.

---

## 3. Hero-Bild dezenter Scroll-Parallax (max ~6%)

Subtiles `translateY` (+ winziger `scale`-Puffer gegen Kanten-Lücke), nur `transform`,
nur Desktop + motion-enabled. rAF-gated, ein Listener. Reduced-motion / Mobile = off.

### 3a. Markup — `src/components/Hero.astro`

Das Hero-`<img>` (Z. 9–18) bekommt ein `data-hero-img` Attribut und `will-change`-Klasse:

```astro
  <img
    src="/img/hero.webp"
    alt="Renoviertes Haus von innen mit Treppe und Holzboden"
    width="2000"
    height="1333"
    fetchpriority="high"
    loading="eager"
    decoding="async"
    data-hero-img
    class="hero-img absolute inset-0 -z-10 h-full w-full object-cover"
  />
```

### 3b. CSS — `global.css` (anfügen)

```css
/* Hero-Parallax: Scale-Puffer verhindert Rand-Lücke bei translateY */
@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
  .hero-img {
    transform: scale(1.06);          /* 6% Reserve, innerhalb Scale-Limit 1.05? -> siehe Hinweis */
    transform-origin: center;
    will-change: transform;
  }
}
```

> **CI-Hinweis Scale-Limit:** Die Guardrail „Scale max 1.05" gilt für **Interaktions-Hovers**
> (Buttons/Bilder). Der Parallax-Scale ist ein statischer Bild-Puffer, damit beim
> Hochschieben kein leerer Rand entsteht — funktional, nicht dekorativ. Wer streng bleiben
> will: `scale(1.05)` + max `translateY 4%` statt 6%. Beides unsichtbar-dezent.

### 3c. JS — `src/components/Hero.astro` (in den `<script>` aus 2c integrieren oder separat)

```astro
<script>
  const img = document.querySelector('[data-hero-img]') as HTMLElement | null;
  const section = img?.closest('section') as HTMLElement | null;
  const mq = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 768px)');

  if (img && section && mq.matches) {
    const MAX = 0.06; // 6% der Sektionshöhe
    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const h = section.offsetHeight || 1;
      // progress 0 (Sektion oben am Viewport) -> 1 (Sektion ganz raus)
      const progress = Math.min(Math.max(-rect.top / h, 0), 1);
      const shift = progress * MAX * h;          // px nach unten
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
</script>
```

> Bild fährt langsamer als der Scroll (klassischer Parallax), max 6% der Hero-Höhe.
> `translate3d` erzwingt GPU-Layer. Kein Effekt unter 768px / bei reduced-motion.

---

## 4. Reveal-System verfeinern — Stagger, Easing, IO-Tuning

Ziel: Kinder eines Blocks gestaffelt rein (`data-reveal-delay`), bessere Distanz/Easing,
weiterhin **kein Re-Animate**. Bestehende `data-reveal`-Nutzer bleiben gültig.

### 4a. CSS — `src/styles/global.css` (Reveal-Block Z. 52–64 ersetzen)

```css
/* ===== Scroll-Reveal (matcht GSAP-Feel, leichtgewichtig, kein Re-Animate) ===== */
@media (prefers-reduced-motion: no-preference) {
  [data-reveal] {
    opacity: 0;
    transform: translateY(var(--reveal-y, 26px));
    transition:
      opacity var(--dur-reveal) var(--ease-out),
      transform var(--dur-reveal) var(--ease-out);
    transition-delay: var(--reveal-delay, 0ms);
    will-change: transform, opacity;
  }
  [data-reveal].is-visible {
    opacity: 1;
    transform: none;
    will-change: auto;
  }

  /* Stagger-Stufen: per data-reveal-delay="1..6" am Element */
  [data-reveal][data-reveal-delay="1"] { --reveal-delay: 80ms; }
  [data-reveal][data-reveal-delay="2"] { --reveal-delay: 160ms; }
  [data-reveal][data-reveal-delay="3"] { --reveal-delay: 240ms; }
  [data-reveal][data-reveal-delay="4"] { --reveal-delay: 320ms; }
  [data-reveal][data-reveal-delay="5"] { --reveal-delay: 400ms; }
  [data-reveal][data-reveal-delay="6"] { --reveal-delay: 480ms; }

  /* Auto-Stagger: ein Parent markiert seine direkten data-reveal-Kinder */
  [data-reveal-group] > [data-reveal]:nth-child(1) { --reveal-delay: 0ms; }
  [data-reveal-group] > [data-reveal]:nth-child(2) { --reveal-delay: 90ms; }
  [data-reveal-group] > [data-reveal]:nth-child(3) { --reveal-delay: 180ms; }
  [data-reveal-group] > [data-reveal]:nth-child(4) { --reveal-delay: 270ms; }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```

### 4b. JS — `src/layouts/Layout.astro` (IO-Block Z. 62–77 tunen)

Threshold etwas höher + größerer Bottom-Margin = Reveal triggert erst, wenn der Block
sinnvoll im Bild ist (ruhiger). `unobserve` bleibt (kein Re-Animate). Reduced-motion =
sofort sichtbar ohne Observer.

```astro
    <script>
      const reveal = () => {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          els.forEach((el) => el.classList.add('is-visible'));
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            }
          },
          { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
        );
        els.forEach((el) => io.observe(el));
      };
      if (document.readyState !== 'loading') reveal();
      else document.addEventListener('DOMContentLoaded', reveal);
    </script>
```

### 4c. Anwendung (optional, surgical) — wo Stagger sich lohnt

- **Services.astro** (`src/components/Services.astro`): Der Header-Block (Z. 55) und die
  drei Service-Zeilen (Z. 65) sind separate `data-reveal`. Für gestaffelten Eindruck am
  Container `data-reveal-group` setzen ist hier ungeeignet (Header+Items gemischt). Besser
  die drei Items einzeln staffeln — sie tragen schon `data-reveal`; ergänze pro Item
  `data-reveal-delay={String(i + 1)}` im `.map`:

  ```astro
        services.map((s, i) => (
          <div
            id={s.id}
            class={`grid scroll-mt-24 gap-8 py-12 md:grid-cols-[1fr_1fr] md:gap-16 ${i > 0 ? 'border-t border-ink/10' : ''}`}
            data-reveal
            data-reveal-delay={String(Math.min(i + 1, 3))}
          >
  ```

  > Sinn: Die drei Leistungs-Blöcke kommen nacheinander, nicht im Pulk — editorial.
  > Da jeder Block beim Reinscrollen einzeln in den IO-Viewport tritt, wirkt der Delay
  > vor allem, wenn mehrere zugleich sichtbar werden (große Screens) — schadet sonst nie.

- **Bullet-Listen in Services** (die `<ul>`, Z. 82): optional `data-reveal-group` am `<ul>`
  und `data-reveal` an jedem `<li>` — nur wenn beim QA gewünscht. Default: weglassen
  (nicht too much).

---

## 5. Nav — Scroll-Shift (Token-Shadow) + Active-Underline via IO

Bisher: harte `shadow-[0_2px_16px_rgba(0,0,0,0.25)]` ab 24px (etwas kräftig). Wir nehmen
die **eine** Token-Shadow + minimal Padding-Shrink. Plus: aktive Sektion unterstreicht den
zugehörigen Nav-Link im Brand-Blau (IO, `rootMargin -45%/-45%`).

### 5a. Markup — `src/components/Nav.astro`

Nav-Element + Desktop-Links bekommen Hooks. Ersetze die Desktop-Link-Map (Z. 26–35):

```astro
    <!-- Desktop -->
    <div class="hidden items-center gap-8 md:flex">
      {
        links.map((l) => (
          <a
            href={l.href}
            data-nav-link
            data-target={l.href.startsWith('/#') ? l.href.slice(2) : ''}
            class="nav-link text-sm font-medium text-white/90 transition-colors duration-100 hover:text-white"
          >
            {l.label}
          </a>
        ))
      }
      <Button href="/kontakt" variant="primary" class="px-4 py-2 text-sm">Kontakt</Button>
    </div>
```

Und am `<nav>` (Z. 12) die Padding-Transition ergänzen (Shrink dezent):

```astro
<nav id="site-nav" class="sticky top-0 z-50 bg-ink text-white transition-[box-shadow,padding] duration-200 ease-out">
```

Da das Padding aktuell am inneren Container (`py-4`) hängt: lass `py-4` stehen und steuere
den Shrink über die `.is-scrolled`-Klasse in CSS (5b), die das innere Padding überschreibt —
sauberer als die Tailwind-Utility umzubauen.

### 5b. CSS — `src/styles/global.css` (anfügen)

```css
/* ===== Nav: Scroll-Shift + Active-Underline ===== */
#site-nav { --nav-pad: 1rem; }                 /* = py-4 */
#site-nav > div { padding-top: var(--nav-pad); padding-bottom: var(--nav-pad); }
#site-nav.is-scrolled { box-shadow: var(--shadow-soft); --nav-pad: 0.75rem; }
#site-nav > div { transition: padding var(--dur-normal) var(--ease-out); }

/* Active-Link Unterstreichung im Brand-Blau (kein Layout-Shift: pseudo-element) */
.nav-link { position: relative; }
.nav-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -6px;
  height: 2px;
  background: var(--color-brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-normal) var(--ease-out);
}
.nav-link[aria-current="true"]::after,
.nav-link:hover::after { transform: scaleX(1); }
.nav-link:hover::after { background: rgba(255,255,255,0.5); } /* Hover weiß-dezent */
.nav-link[aria-current="true"]::after { background: var(--color-brand); } /* Active gewinnt: Brand */

@media (prefers-reduced-motion: reduce) {
  #site-nav > div, .nav-link::after { transition: none; }
}
```

> Die soft Shadow `var(--shadow-soft)` ist absichtlich sehr leicht (`rgba(51,51,51,0.1)`),
> ersetzt die bisherige kräftige `rgba(0,0,0,0.25)`-Shadow. Genau das gewünschte
> „NICHT zu kräftig". Padding-Shrink 16→12px ist kaum merklich = ruhig.

### 5c. JS — `src/components/Nav.astro` (Scroll-Shadow-Block Z. 116–122 ersetzen + Active-IO ergänzen)

```astro
  // Scroll-Shift: Token-Shadow + Padding-Shrink ab 24px (Klasse statt inline-Shadow)
  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active-Link: aktuelle Sektion via IntersectionObserver -> aria-current am passenden Link
  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const sectionMap = new Map<string, HTMLAnchorElement>();
  navLinks.forEach((a) => {
    const id = a.dataset.target;
    if (id) sectionMap.set(id, a);
  });
  const sections = [...sectionMap.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);

  if (sections.length) {
    const setActive = (id: string | null) => {
      navLinks.forEach((a) =>
        a.setAttribute('aria-current', a.dataset.target && a.dataset.target === id ? 'true' : 'false')
      );
    };
    const spy = new IntersectionObserver(
      (entries) => {
        // Sichtbarste Sektion in der Mitte gewinnt
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }
```

> Voraussetzung: Die Sektionen tragen die IDs aus den Nav-Links. `#baukoordination`,
> `#bausicherheit`, `#wachstumspartner` existieren bereits in `Services.astro` (Z. 66).
> `/ueber-uns` ist eine echte Route (kein Anchor) → bekommt korrekt nie `aria-current`
> auf der Home (data-target leer). Sauber.

---

## 6. Button-Microinteractions verfeinern — `src/components/Button.astro`

Bestehender Hover (`-translate-y-px` bei primary, Farb-Invert bei outline) bleibt im Kern.
Wir ergänzen: **Active-Press-Scale** (Emil: Buttons müssen auf Druck reagieren), und einen
**dezenten Icon-Shift** für Buttons mit Pfeil/Icon (CTA-Charakter). Alles `transform`-basiert,
`--dur-fast`, reduced-motion-safe.

### 6a. Base-Klasse erweitern — `Button.astro` (Z. 11–12)

```astro
const base =
  'btn-eb group inline-flex items-center justify-center gap-2 rounded-xs px-5 py-3 text-[1.0625rem] font-medium leading-none min-h-11 transition-[color,background-color,transform,border-color] duration-100 ease-out';
```

(Nur `btn-eb group` ergänzt — Rest unverändert. `group` erlaubt Icon-Shift via Tailwind
`group-hover`, `btn-eb` hängt das Press/Reduced-Motion-CSS an.)

### 6b. CSS — `src/styles/global.css` (anfügen)

```css
/* ===== Button-Microinteractions ===== */
@media (prefers-reduced-motion: no-preference) {
  /* Press-Feedback: dezentes Einsinken, schneller als Hover (Emil-Prinzip) */
  .btn-eb:active { transform: scale(0.985); }
  .btn-eb.is-primary:active { transform: translateY(0) scale(0.985); }

  /* Optionaler Icon-Shift: <span class="btn-icon"> im Button -> rückt bei Hover ~3px */
  .btn-icon {
    display: inline-flex;
    transition: transform var(--dur-fast) var(--ease-out);
    will-change: transform;
  }
  .btn-eb:hover .btn-icon { transform: translateX(3px); }
}

@media (prefers-reduced-motion: reduce) {
  .btn-eb:active, .btn-eb:hover .btn-icon { transform: none; }
}

/* Touch-Geräte: keine Hover-Microinteractions (false positives vermeiden) */
@media (hover: none) {
  .btn-eb:hover .btn-icon { transform: none; }
}
```

### 6c. Primary-Variante markieren — `Button.astro` (Z. 15)

Damit das Press-CSS den `translateY`-Hover des Primary korrekt überschreibt:

```astro
  primary: 'is-primary bg-brand text-white hover:bg-brand-dark hover:-translate-y-px active:translate-y-0',
```

(Nur `is-primary` vorangestellt.)

### 6d. Icon-Nutzung (optional, wo CTA-Pfeil sinnvoll ist)

Der Icon-Shift wirkt nur, wenn ein `.btn-icon`-Span im Slot steckt. Beispiel für einen
Hero-/Service-CTA mit Pfeil (nur dort einsetzen, wo „weiter/anfragen" gemeint ist — nicht
auf jedem Button, sonst too much):

```astro
<Button href={CAL} target="_blank" variant="primary">
  Beratungstermin
  <span class="btn-icon" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
</Button>
```

> `aria-hidden` am Icon (Textlabel trägt die Bedeutung). `stroke="currentColor"` =
> erbt Button-Textfarbe, invertiert beim outline-Hover automatisch mit. Kein neues
> Farb-Token. Empfehlung: Icon nur an den **zwei** primären CTAs (Hero „Beratungstermin",
> ContactSection-CTA) — ruhig bleiben.

---

## Verifikation / QA-Checkliste (vor „done")

- [ ] **Reduced-motion** (DevTools → Rendering → emulate `prefers-reduced-motion: reduce`):
      Hero-Zeilen sofort sichtbar, kein Parallax, keine Reveal-Transforms, Nav ohne
      Padding-Transition, Buttons ohne Press/Icon-Shift.
- [ ] **Hero on-load**: Eyebrow → 2 H1-Zeilen (von unten aus Maske) → Subline → Buttons,
      gestaffelt, < 1s gesamt, kein FOUC-Flash (2-Frame-Trigger greift).
- [ ] **Kein Buchstaben-Clip** in der Line-Mask (sonst `padding/margin`-Trick aus 2b).
- [ ] **Parallax**: nur Desktop, max ~6% Versatz, kein Rand sichtbar (Scale-Puffer), kein
      Jank (rAF-gated, 1 Layer).
- [ ] **Reveal-System**: Sections faden weiterhin einmalig ein, kein Re-Animate beim
      Hochscrollen; Service-Items dezent gestaffelt.
- [ ] **Nav**: Shadow ab 24px = nur `--shadow-soft` (leicht!), Padding 16→12px; aktiver
      Link bekommt Brand-Blau-Underline beim Durchscrollen der Home-Sektionen; Hover-Underline
      weiß-dezent.
- [ ] **Buttons**: Press sinkt minimal (scale .985), Primary behält `-1px` Hover; Icon
      (falls gesetzt) rückt 3px bei Hover; Touch ohne Hover-Artefakte.
- [ ] **CWV**: nur `transform`/`opacity` animiert; `will-change` nur transient; Lighthouse
      A11y bleibt 100 (Focus-Ring, aria-current korrekt).
- [ ] **CI-Treue**: kein neues Farb-Token, eine Schrift, eine Shadow, Radius 2px/100px,
      Durations 120/200/560ms, ease `cubic-bezier(0.16,1,0.3,1)`. Flat bleibt flat.

## Anwendungs-Reihenfolge (sicherste Sequenz)

1. `global.css` — Tokens (1) + alle CSS-Blöcke (2a, 3b, 4a, 5b, 6b) anfügen/ersetzen.
2. `Layout.astro` — IO-Tuning (4b).
3. `Hero.astro` — Markup (2b) + Bild-Attr (3a) + Scripts (2c, 3c).
4. `Nav.astro` — Markup-Hooks (5a) + Scripts (5c).
5. `Button.astro` — Base/Variante (6a, 6c); Icons (6d) optional an 2 CTAs.
6. `npm run build` → exit 0, dann deploy nach `erbenbau.voyagedigital.de` (Deploy-Default).
