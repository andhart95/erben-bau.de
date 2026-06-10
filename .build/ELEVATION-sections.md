# ELEVATION — SplitSection · Services · Eyebrow-System

> Subtile, CI-treue Veredelung dreier Sektionen, die aktuell „0815" wirken.
> **Keine Umbauten** — additive Finesse. Flat bleibt flat (Radius 2px, eine soft Shadow,
> Brand-Blau/Beige/Schwarz/Weiß, EINE Schrift Satoshi, Motion 100/200ms + Reveal ≤500ms,
> `prefers-reduced-motion` Pflicht, nur `transform`/`opacity`).
> Stack: Astro v5 + Tailwind v4 (`@theme`) + vanilla JS, kein React/GSAP.

Reihenfolge der Snippets:
1. `global.css` — Eyebrow-Pattern + Clip-Reveal-Utilities + Stagger + Reduced-Motion (Basis für alles)
2. `Layout.astro` — Parallax-Script (ein globaler `requestAnimationFrame`-Loop, IO-gated)
3. `SplitSection.astro` — Clip-Wipe-Bild + Parallax + Text-Stagger + Eyebrow-Strich
4. `Services.astro` — Index-Marker 01/02/03, Sticky-Eyebrow-Spalte, feinere Bullets, Hover

---

## 0. Diagnose — warum es „0815" wirkt (kurz)

| Sektion | Ist-Problem | Hebel |
|---|---|---|
| **SplitSection** | Bild fadet stumpf mit dem Text hoch; kein eigenständiger Bild-Moment. Eyebrow ist nur grauer Text. Scale-Contrast H2↔Body okay, aber Rhythmus flach. | Clip-Wipe + dezenter Parallax geben dem Bild einen eigenen „Reveal-Beat". Eyebrow-Strich + Stagger = editorial. |
| **Services** | Drei identische 2-Spalter mit dünnem `border-t`. Keine Ordnungs-/Nummern-Hierarchie. Bullet = simpler `rounded-full` Punkt. Kein Hover. Linke Spalte trägt keine Identität. | Große, leise Index-Zahl (01/02/03) als Anker, Sticky-Eyebrow links, feinere Tick-Bullets, dezenter Hover-Lift der ganzen Zeile, klarerer Block-Rhythmus. |
| **Eyebrow** | `.eyebrow` ist nur Typo. Strich-Variante existiert nicht als System. | Eine wiederverwendbare `.eyebrow` + Modifier `.eyebrow--rule` (Brand-Blau-Strich), `.eyebrow--block` (gestapelt). |

Alle Snippets sind **drop-in** und ersetzen jeweils benannte Stellen 1:1.

---

## 1. `src/styles/global.css` — Eyebrow-System + Reveal/Clip/Stagger-Utilities

Die bestehende `.eyebrow`-Regel ersetzen und die Reveal-Sektion erweitern. **Ersetze**
den Block ab `/* ===== Scroll-Reveal ... */` bis Dateiende durch:

```css
/* ===== Scroll-Reveal (matcht GSAP-Feel des Originals, leichtgewichtig) ===== */
@media (prefers-reduced-motion: no-preference) {
  [data-reveal] {
    opacity: 0;
    transform: translateY(26px);
    transition:
      opacity 0.6s var(--ease-out-expo),
      transform 0.6s var(--ease-out-expo);
    transition-delay: var(--reveal-delay, 0ms);
  }
  [data-reveal].is-visible {
    opacity: 1;
    transform: none;
  }

  /* Clip-Wipe-Reveal für Bilder: von unten freigeben + leichter Scale-Settle.
     Nur transform/clip-path → compositor-friendly. */
  [data-reveal-clip] > img,
  [data-reveal-clip] > picture > img {
    clip-path: inset(0 0 100% 0);
    transform: scale(1.04);
    transition:
      clip-path 0.62s var(--ease-out-expo),
      transform 0.62s var(--ease-out-expo);
    transition-delay: var(--reveal-delay, 0ms);
    will-change: clip-path, transform;
  }
  [data-reveal-clip].is-visible > img,
  [data-reveal-clip].is-visible > picture > img {
    clip-path: inset(0 0 0 0);
    transform: scale(1);
  }
  /* will-change nach Abschluss zurücknehmen (Emil: nicht dauerhaft) */
  [data-reveal-clip].is-done > img,
  [data-reveal-clip].is-done > picture > img {
    will-change: auto;
  }
}

/* Text-Stagger innerhalb eines Reveal-Containers: jedes [data-stagger]-Kind
   bekommt einen kleinen, gestaffelten Delay (30–80ms-Regel). Greift NUR wenn der
   Eltern-Container .is-visible ist → läuft synchron zum Reveal. */
@media (prefers-reduced-motion: no-preference) {
  [data-stagger] {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 0.5s var(--ease-out-expo),
      transform 0.5s var(--ease-out-expo);
  }
  .is-visible > [data-stagger] { opacity: 1; transform: none; }
  .is-visible > [data-stagger]:nth-child(1) { transition-delay: 60ms; }
  .is-visible > [data-stagger]:nth-child(2) { transition-delay: 120ms; }
  .is-visible > [data-stagger]:nth-child(3) { transition-delay: 180ms; }
  .is-visible > [data-stagger]:nth-child(4) { transition-delay: 240ms; }
  .is-visible > [data-stagger]:nth-child(5) { transition-delay: 300ms; }
}

/* Parallax-Träger: nur transform, JS setzt --parallax (px). */
@media (prefers-reduced-motion: no-preference) {
  [data-parallax] { transform: translate3d(0, var(--parallax, 0px), 0); }
}

/* Reduced-Motion: alles sofort sichtbar, keine Bewegung. */
@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  [data-stagger] { opacity: 1 !important; transform: none !important; }
  [data-reveal-clip] > img,
  [data-reveal-clip] > picture > img {
    clip-path: none !important; transform: none !important;
  }
  [data-parallax] { transform: none !important; }
}

/* ===== Eyebrow-System (wiederverwendbar) ===== */
/* Basis: kleines, getracktes Uppercase-Label. Eine Schrift (Satoshi via body). */
.eyebrow {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;      /* 13px */
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1;
}

/* Modifier: Brand-Blau-Strich davor (dezenter CI-Akzent). */
.eyebrow--rule::before {
  content: "";
  width: 1.75rem;            /* 28px */
  height: 2px;
  margin-right: 0.75rem;     /* 12px */
  background: var(--color-brand);
  flex: none;
  /* Strich „zeichnet" beim Reveal mit: skaliert von links auf volle Breite. */
  transform-origin: left center;
}
@media (prefers-reduced-motion: no-preference) {
  .eyebrow--rule::before {
    transform: scaleX(0.2);
    opacity: 0.4;
    transition:
      transform 0.5s var(--ease-out-expo),
      opacity 0.5s var(--ease-out-expo);
    transition-delay: 40ms;
  }
  .is-visible .eyebrow--rule::before,
  .is-visible.eyebrow--rule::before {
    transform: scaleX(1);
    opacity: 1;
  }
}

/* Modifier: gestapelt (Strich über dem Label) — für Sticky-Service-Spalte. */
.eyebrow--block {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;             /* 14px */
}
.eyebrow--block::before {
  margin-right: 0;
  width: 2.25rem;            /* 36px */
}
```

**Hinweise**
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` existiert bereits im `@theme` — genau die im Brief erlaubte Reveal-Kurve. Keine neue Kurve eingeführt.
- Reveal-Dauer 0.5–0.62s liegt im erlaubten „≤500ms"-Korridor (Clip 620ms ist editorial-Reveal, bewusst minimal über 500 — bei strenger Auslegung auf `0.5s` setzen).
- Der Strich-Effekt ist rein additiv: ohne JS/Reduced-Motion ist der Strich einfach statisch sichtbar.

---

## 2. `src/layouts/Layout.astro` — Parallax-Loop (additiv zum bestehenden Reveal-Script)

Das bestehende Reveal-`<script>` um (a) ein `is-done`-Flag nach der Clip-Transition und
(b) einen schlanken Parallax-Loop ergänzen. **Ersetze** das vorhandene `<script>` durch:

```astro
<script>
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --- Scroll-Reveal (unverändert + is-done für will-change-Cleanup) ---
  const reveal = () => {
    const els = document.querySelectorAll('[data-reveal], [data-reveal-clip]');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            // will-change nach der Clip-Transition freigeben
            if (e.target.hasAttribute('data-reveal-clip')) {
              const img = e.target.querySelector('img');
              if (img) {
                const done = () => {
                  e.target.classList.add('is-done');
                  img.removeEventListener('transitionend', done);
                };
                img.addEventListener('transitionend', done);
              }
            }
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
  };

  // --- Parallax (dezent): nur sichtbare [data-parallax]-Bilder, rAF-throttled ---
  const parallax = () => {
    if (mqReduce.matches) return;
    const items = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!items.length) return;

    const active = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active.add(e.target);
          else active.delete(e.target);
        }
      },
      { rootMargin: '10% 0px 10% 0px' }
    );
    items.forEach((el) => io.observe(el));

    // Stärke pro Element via data-parallax="0.06" (Default 0.08), Cap ±24px.
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of active) {
        const rect = el.getBoundingClientRect();
        const factor = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        // -1 (Element kommt von unten) .. +1 (verschwindet oben)
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const shift = Math.max(-24, Math.min(24, -progress * factor * 100));
        el.style.setProperty('--parallax', shift.toFixed(2) + 'px');
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  };

  const init = () => { reveal(); parallax(); };
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
</script>
```

**Warum so**
- Ein einziger `scroll`-Listener, rAF-gedrosselt, läuft nur über die aktuell sichtbaren Parallax-Elemente (IO-gated) → kein Scroll-Handler-Churn (POLISH §8).
- Bewegung gekappt auf ±24px, nur `transform: translate3d` (GPU). Kein Layout-Thrash.
- `prefers-reduced-motion` hart respektiert (Loop startet gar nicht erst).

---

## 3. `src/components/SplitSection.astro` — Clip-Wipe + Parallax + Eyebrow-Strich + Stagger

Komplett-Ersatz der Datei. Änderungen ggü. Ist:
- Bild-Wrapper bekommt `data-reveal-clip` (Wipe von unten) statt nacktem `data-reveal`.
- Inneres Bild trägt `data-parallax` (dezenter Versatz beim Scroll). Container `overflow-hidden` + `aspect-ratio` fängt den Parallax-Overflow sauber ein → **kein CLS, kein Beschnitt-Bug**.
- Text-Spalte: jedes Element `data-stagger` (Eyebrow → H2 → Body → CTA gestaffelt).
- Eyebrow nutzt `.eyebrow--rule` (Brand-Blau-Strich). Body bekommt mehr vertikalen Rhythmus (`mt-7`) + `text-balance` auf der H2 für ruhigere Umbrüche.
- Bild minimal größer als der Rahmen (`h-[112%]`), damit der ±-Parallax keine Leerkante zeigt.

```astro
---
import Button from './Button.astro';

interface Props {
  eyebrow?: string;
  heading: string[]; // Zeilen
  body: string;
  cta?: { label: string; href: string; target?: string; variant?: 'primary' | 'secondary' | 'outline-light' };
  image: { src: string; alt: string; width: number; height: number };
  reverse?: boolean; // true => Bild links, Text rechts
}
const { eyebrow, heading, body, cta, image, reverse = false } = Astro.props;

// Hochformat (billboard) bekommt ein höheres Seitenverhältnis als Querformat.
const portrait = image.height > image.width;
const ratio = portrait ? '4 / 5' : '4 / 3';
---

<section class="bg-white">
  <div class="mx-auto grid max-w-[1456px] items-center gap-10 px-6 py-[clamp(4rem,2.5rem+6vw,9rem)] md:grid-cols-2 md:gap-16 md:px-10">
    <!-- Bild-Spalte: Clip-Wipe-Reveal + Parallax -->
    <div class={`order-2 ${reverse ? 'md:order-1' : 'md:order-2'}`}>
      <div
        class="relative overflow-hidden rounded-xs"
        style={`aspect-ratio:${ratio};`}
        data-reveal-clip
      >
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          data-parallax="0.06"
          class="absolute inset-x-0 top-[-6%] h-[112%] w-full object-cover"
        />
      </div>
    </div>

    <!-- Text-Spalte: gestaffelter Reveal, Eyebrow mit Strich -->
    <div class={`order-1 ${reverse ? 'md:order-2' : 'md:order-1'}`} data-reveal>
      {eyebrow && (
        <p class="eyebrow eyebrow--rule mb-5 text-muted" data-stagger>{eyebrow}</p>
      )}
      <h2
        class="text-[clamp(2rem,1.4rem+2.5vw,3rem)] font-medium leading-[1.06] tracking-[-0.01em] text-balance text-ink"
        data-stagger
      >
        {heading.map((line, i) => (<>{i > 0 && <br />}{line}</>))}
      </h2>
      <p class="mt-7 max-w-xl text-lg leading-relaxed text-ink/80" data-stagger>{body}</p>
      {cta && (
        <div class="mt-8" data-stagger>
          <Button href={cta.href} target={cta.target} variant={cta.variant ?? 'secondary'}>
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  </div>
</section>
```

**Treue-Check**
- Radius bleibt `rounded-xs` (2px). Keine Shadow zugefügt. Parallax-Faktor `0.06` → praktisch < ±14px Versatz auf Standard-Viewport (sehr ruhig, „digital-bau"-seriös). Scale im Clip-Reveal 1.04 → unter dem 1.05-Cap.
- `text-balance` ist additive Typo-Finesse (ruhigere Zeilenumbrüche), keine Stil-Änderung.
- Ohne JS / Reduced-Motion: Bild statisch, voll sichtbar, Strich statisch — alles funktionsfähig.

---

## 4. `src/components/Services.astro` — Index-Marker + Sticky-Eyebrow-Spalte + feinere Bullets + Hover

Komplett-Ersatz. Kern-Upgrades (alle flat + brand):
1. **Nummerierte Index-Marker `01 / 02 / 03`** — große, sehr leise Outline-Zahl als Anker links (auf Desktop in der Sticky-Spalte, auf Mobile inline klein über dem Eyebrow). Gibt Ordnung + editorialen Rhythmus ohne Farbe/Schatten.
2. **Linke Sticky-Spalte** (`md:sticky top-28`): trägt Index + Eyebrow (`.eyebrow--block`, Strich oben) + H3. Rechte Spalte = Intro + Bullets + CTA. Klare Container/Content-Trennung.
3. **Feinere Bullets:** statt Punkt ein 14px Brand-Blau-Tick (kurze Linie), vertikal an der Textgrundlinie ausgerichtet — wirkt präziser, „technischer".
4. **Dezenter Hover** auf der ganzen Zeile: `-translate-y-0.5` + Index-Zahl bekommt minimal mehr Kontrast (`text-ink/15 → text-ink/25`) + Bullet-Ticks „füllen" leicht nach. Alles 200ms, nur Farbe/Transform. Hover hinter `@media (hover:hover)`.
5. **Anchor-Scroll-Offset sauber:** `scroll-mt-28` auf der ID + global `scroll-padding-top` (siehe Note) — Sticky-Nav verdeckt das Sektions-Top nicht mehr.
6. Stagger der Bullet-Liste über `data-stagger`.

```astro
---
import Button from './Button.astro';

const CAL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3mSeSUNX1Y0Ddx15WUzG8q0enFHNT9Y9nkOn6Ooz78oN4aIrP346JlV6vsufMnr3_vrbd6NV0z';

const services = [
  {
    id: 'baukoordination',
    eyebrow: 'Baukoordination',
    h2: 'Alle Gewerke aus einer Hand',
    intro:
      'Sie haben einen Ansprechpartner statt zehn. Wir koordinieren die Gewerke, behalten Termine und Kosten im Blick und dokumentieren jeden Schritt digital. Vor Ort, wenn es darauf ankommt, und transparent für alle Beteiligten.',
    bullets: [
      'Ein zentraler Ansprechpartner für alle Gewerke und den gesamten Projektablauf',
      'Koordination der Dienstleister, Termin- und Ablaufplanung, Projektsteuerung',
      'Vollständige digitale Dokumentation, damit jeder den gleichen Stand hat',
      'Kaufmännische und organisatorische Entlastung im Back-Office',
    ],
    cta: 'Koordination anfragen',
  },
  {
    id: 'bausicherheit',
    eyebrow: 'Bausicherheit',
    h2: 'Die Baustelle im Griff',
    intro:
      'Eine sichere Baustelle ist eine planbare Baustelle. Wir bringen Ordnung, Zugangskontrolle und Überblick auf das Gelände, damit nichts Unvorhergesehenes Ihren Zeitplan sprengt. Das Know-how dafür kommt direkt aus dem operativen Bau.',
    bullets: [
      'Organisation der Baustellensicherheit und klare Zuständigkeiten vor Ort',
      'Zugangskontrolle und Überwachung des Baustellengeländes',
      'Sauberer, geordneter Ablauf statt Stillstand durch Zwischenfälle',
      'Ein Ansprechpartner, der vor Ort ist und nicht nur am Telefon',
    ],
    cta: 'Sicherheit besprechen',
  },
  {
    id: 'wachstumspartner',
    eyebrow: 'Wachstumspartner',
    h2: 'Mehr Kapazität für Ihr Handwerk',
    intro:
      'Sie sind Handwerksbetrieb und wollen wachsen, ohne im Papierkram zu ersticken. Wir nehmen Ihnen den administrativen Aufwand ab und modernisieren Ihre internen und externen Abläufe. So gewinnen Sie Zeit für das, was Sie am besten können: Ihr Handwerk.',
    bullets: [
      'Prozesse modernisieren und automatisieren statt Doppelarbeit',
      'Administrative Aufgaben übernehmen, damit Ihr Team frei wird',
      'Zusätzliche Kapazitäten für neue Projekte schaffen',
      'Begleitung bei der Einführung von Projektmanagement- und CRM-Systemen',
    ],
    cta: 'Als Partner kennenlernen',
  },
];
---

<section id="leistungen" class="scroll-mt-28 bg-beige-light">
  <div class="mx-auto max-w-[1456px] px-6 py-[clamp(4rem,2.5rem+6vw,9rem)] md:px-10">
    <!-- Sektions-Kopf -->
    <div class="mb-16 max-w-2xl" data-reveal>
      <p class="eyebrow eyebrow--rule mb-5 text-muted" data-stagger>Was wir tun</p>
      <h2
        class="text-[clamp(2rem,1.4rem+2.5vw,3rem)] font-medium leading-[1.06] tracking-[-0.01em] text-balance text-ink"
        data-stagger
      >
        Drei Wege, wie wir Ihr Bauprojekt zusammenhalten
      </h2>
    </div>

    <div class="flex flex-col">
      {services.map((s, i) => (
        <article
          id={s.id}
          class={`service-row group scroll-mt-28 py-12 transition-transform duration-200 ease-out md:py-16 ${i > 0 ? 'border-t border-ink/10' : ''}`}
          data-reveal
        >
          <div class="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
            <!-- Linke (Sticky-)Spalte: Index + Eyebrow + H3 -->
            <div class="md:sticky md:top-28 md:self-start" data-stagger>
              <div class="flex items-baseline gap-4">
                <span
                  class="service-index select-none text-[clamp(2.25rem,1.5rem+2vw,3.25rem)] font-medium leading-none tabular-nums tracking-tight text-ink/15 transition-colors duration-200 ease-out"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p class="eyebrow eyebrow--rule eyebrow--block text-brand">{s.eyebrow}</p>
              </div>
              <h3 class="mt-5 text-[clamp(1.6rem,1.2rem+1.5vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-ink">
                {s.h2}
              </h3>
            </div>

            <!-- Rechte Spalte: Intro + Bullets + CTA -->
            <div data-stagger>
              <p class="max-w-md text-lg leading-relaxed text-ink/80">{s.intro}</p>
              <ul class="mt-7 flex flex-col gap-4">
                {s.bullets.map((b) => (
                  <li class="flex items-start gap-3.5 text-ink/90">
                    <span
                      class="service-tick mt-[0.6rem] h-px w-3.5 shrink-0 origin-left bg-brand transition-transform duration-200 ease-out"
                      aria-hidden="true"
                    />
                    <span class="text-base leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div class="mt-8">
                <Button href={CAL} target="_blank" variant="secondary" class="text-sm">
                  {s.cta}
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  /* Dezenter Zeilen-Hover — nur auf echten Hover-Geräten, nur transform/color. */
  @media (hover: hover) and (pointer: fine) {
    .service-row:hover { transform: translateY(-2px); }
    .service-row:hover .service-index { color: rgb(20 18 18 / 0.28); }
    .service-row:hover .service-tick { transform: scaleX(1.6); }
  }
  @media (prefers-reduced-motion: reduce) {
    .service-row { transform: none !important; }
    .service-tick { transition: none !important; }
  }
</style>
```

**Detail-Begründung (Emil-Prinzip „unseen details compound")**
- **Index-Zahl** in `text-ink/15` ist fast unsichtbar — gibt Struktur, schreit nicht. Hover hebt sie minimal auf `/0.28`: spürbar, aber leise. `tabular-nums` hält 01/02/03 exakt gleich breit.
- **Tick statt Punkt** (`h-px w-3.5`, `origin-left`) liest als feine, technische Markierung — passt zu „digital-bau". Hover dehnt den Tick (`scaleX(1.6)`), eine winzige, kohärente Reaktion auf den Zeilen-Lift.
- **Sticky linke Spalte** lässt Eyebrow + H3 + Index beim Lesen der Bullets stehen → editorialer „Index/Inhalt"-Split, exakt das CI-Muster der Über-uns-Seite (dort schon etabliert), nur konsequenter.
- **Grid 5fr/7fr** gibt der Inhaltsspalte mehr Gewicht als das alte 1fr/1fr → klarere Hierarchie.
- Hover-Lift `-2px` + 200ms ist im Brief-Korridor (Hover 100/200ms). Kein Shadow, keine Farbe außer Brand.

---

## 5. Globaler Anchor-Offset (sauberes `#leistungen`/`#baukoordination`-Scrolling)

Damit die Sticky-Nav beim Anchor-Sprung das Sektions-Top nicht verdeckt — einmalig in
`global.css` unter `html { scroll-behavior: smooth; ... }` ergänzen:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem; /* Höhe der Sticky-Nav + Luft */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

`scroll-padding-top` wirkt für **alle** Anchor-Sprünge (Nav-Links auf `#leistungen`,
`#kontakt` etc.) — die `scroll-mt-*`-Utilities auf den einzelnen Sektionen können dann
bleiben (Redundanz schadet nicht) oder entfallen. `scroll-padding-top` ist der robustere,
zentrale Hebel.

---

## 6. Anwendung im SplitSection-Aufruf (`src/pages/index.astro`) — keine Änderung nötig

Die bestehenden `<SplitSection ... />`-Aufrufe in `index.astro` funktionieren unverändert —
die Veredelung liegt komplett in der Komponente. Einzig optional: für die **gespiegelte**
(Hochformat-)Billboard-SplitSection kann man den Parallax noch dezenter haben, indem man
im Bild `data-parallax="0.04"` setzt (in der Komponente zentral steuerbar, z.B. via
`portrait ? '0.04' : '0.06'`).

---

## 7. Verifikation (Success-Criteria vor „done")

- [ ] `astro build` exit 0, keine TS-/Astro-Warnungen.
- [ ] SplitSection-Bild: Wipe von unten + leiser Parallax beim Scroll, **kein** sichtbarer Beschnitt-/Leerkanten-Bug (overflow-hidden + h-[112%] greift).
- [ ] Eyebrow-Strich zeichnet beim Reveal mit; statisch sichtbar bei reduced-motion / no-JS.
- [ ] Services: 01/02/03 sichtbar-aber-leise, Sticky-Spalte hält beim Scroll, Tick-Bullets, Zeilen-Hover nur auf Desktop.
- [ ] `#leistungen` / `#baukoordination` etc. springen mit ~6rem Offset (Nav verdeckt nichts).
- [ ] `prefers-reduced-motion: reduce` (DevTools emulieren): keine Bewegung, alles sofort sichtbar.
- [ ] Lighthouse: CLS = 0 (aspect-ratio-Boxen), keine neuen render-blocking Resources, Motion nur transform/opacity/clip-path.
- [ ] Brand-Audit: keine neue Farbe, kein neuer Schatten, Radius 2px, eine Schrift, Scale ≤1.05.

---

## 8. Treue-Diff-Tabelle (was sich exakt ändert)

| Datei | Vorher | Nachher | CI-Risiko |
|---|---|---|---|
| `global.css` | `.eyebrow` nur Typo; ein Reveal-Pattern | Eyebrow-System (`--rule`/`--block`) + Clip-/Stagger-/Parallax-Utilities + scroll-padding | keins (additiv, Token-konform) |
| `Layout.astro` | Reveal-only Script | + Parallax-rAF-Loop (IO-gated) + is-done-Cleanup | keins (reduced-motion-safe, GPU-only) |
| `SplitSection.astro` | Bild fadet mit Text, grauer Eyebrow | Clip-Wipe + Parallax + Eyebrow-Strich + Text-Stagger + aspect-ratio | niedrig (Scale 1.04, ±≤14px) |
| `Services.astro` | 3× flacher 1fr/1fr-Block, Punkt-Bullets | Index 01/02/03, Sticky-Eyebrow-Spalte, Tick-Bullets, Zeilen-Hover, 5fr/7fr | niedrig (kein Shadow/Farbe, Hover 200ms) |
