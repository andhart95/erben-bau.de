# Elevation — TestimonialCarousel · Gallery (Zoom-Parallax) · Über-uns

Konkrete, einbaubare CI-konforme Upgrades. Stack: Astro v5 + Tailwind v4 (`@theme`) + vanilla JS.
Kein React/GSAP/framer-motion, keine neuen Libs. Alle Werte aus dem Token-Set (`global.css`).

**Guardrails, die jede Änderung hier einhält:**
- Radius nur `rounded-xs` (2px) / `rounded-full` (100px). Genau eine Soft-Shadow (`--shadow-soft`). Kein Glas/Neon.
- Farben nur Token: `brand #1142d4`, `brand-dark #103ab6`, `ink #141212`, `beige #f3efe7` / `beige-light #f9f6f1`, Weiß. Keine neue Akzentfarbe.
- Eine Schrift: Satoshi.
- Motion dezent: Hover 100/200ms, Reveals ≤ 500ms, ease `cubic-bezier(0.16,1,0.3,1)` (Token `--ease-out-expo`), Scale ≤ 1.05 (Hover). `prefers-reduced-motion` Pflicht.
- Startseite gefällt schon → nur subtil veredeln, kein Umbau.

Motion-Prinzipien angewandt (Emil Kowalski / motion-patterns): Entrances `ease-out`, nie `scale(0)` (immer ≥ 0.96 + opacity), Exit schneller als Enter, Stagger 30–80ms, nur `transform`/`opacity` animieren, `will-change` schmal + nach Gebrauch entfernen, Crossfade ggf. mit Mikro-Blur überbrücken.

---

## 1 · TestimonialCarousel — `src/components/TestimonialCarousel.astro`

### Was sich ändert (und warum)

| Vorher | Nachher | Warum |
| --- | --- | --- |
| `translateX(-idx*100%)` Track, harter horizontaler Schub | Cross-Fade pro Slide: `opacity 0→1` + `translateY(8px→0)`, gestapelt im selben Raster | Edler, ruhiger; horizontaler „Förderband"-Look wirkt billig bei reinem Zitat-Text |
| Kein Quote-Glyph | Großes dezentes `„` in Brand-Blau hinter dem Zitat, `aria-hidden` | Editorial-Akzent, Marke ohne neue Farbe |
| Quote `text-xl/2xl text-ink/90`, kursiv nicht gesetzt | `text-[clamp]` ruhiger, optional kursiv, `text-balance`, `text-ink/80` | Ruhigere Typo, bessere Lesbarkeit, weniger Kontrastlärm |
| Dots `h-2 w-2`, aktiv nur Farbwechsel | Aktiver Dot wird zu Pille (`w-6`), Farbe Brand; Transition auf `width`+`background-color` | „Designter" aktiver Zustand statt Farb-Flip |
| Kein Auto-Advance | Opt-in Auto-Advance (`data-autoplay`), Pause on hover/focus, Stop bei reduced-motion, Pause bei Tab-Hidden | Vom Brief gefordert, a11y-konform, abschaltbar |
| `transition-transform` am Track | Bei reduced-motion: kein Transform/Fade, Slides instant | Pflicht-Guardrail |

### Drop-in: komplette Datei

```astro
---
// src/components/TestimonialCarousel.astro
// A11y-konformes Karussell, vanilla. Cross-Fade statt translateX.
// Auto-Advance opt-in via data-autoplay; Pause on hover/focus + reduced-motion + tab-hidden.
const testimonials = [
  'Mit dem Team von Erben Services hatten wir endlich eine Instanz, die zwischen Bauherrn und Gewerken alles zusammenhält. Transparent, zuverlässig und absolut professionell.',
  'Das Erben Team hat Probleme erkannt, bevor sie überhaupt entstanden sind. So blieb die Baustelle stressfrei und das Ergebnis war erstklassig.',
  'Das Erben Team hat uns die komplette Koordination abgenommen. Alles lief reibungslos, und wir konnten uns voll auf das Projekt konzentrieren.',
  'Dank dem Team von Erben können wir uns wieder voll auf unser Handwerk konzentrieren. Den ganzen administrativen Aufwand übernehmen sie professionell und effizient.',
  'Mit der Firma Erben als Partner haben wir unsere gesamten internen und externen Abläufe modernisiert und automatisiert, was uns zusätzliche Kapazitäten für neue Projekte geschaffen hat. Das hätten wir alleine nie erreicht.',
];
// Auto-Advance an/aus zentral steuerbar:
const AUTOPLAY = true;
const INTERVAL = 7000;
---

<section
  class="bg-beige"
  aria-roledescription="carousel"
  aria-label="Kundenstimmen"
  id="eb-testimonials"
  data-autoplay={AUTOPLAY ? 'true' : 'false'}
  data-interval={INTERVAL}
>
  <div class="mx-auto max-w-[980px] px-6 py-[clamp(4rem,2.5rem+6vw,9rem)] text-center md:px-10">
    <p class="eyebrow mb-4 text-muted" data-reveal>Kunden vertrauen auf Erben Bau</p>
    <h2
      class="mb-12 text-[clamp(2.5rem,1.4rem+4vw,4.8rem)] font-medium tracking-[-0.02em] text-ink"
      data-reveal
    >
      Rezensionen
    </h2>

    <div class="relative" data-reveal>
      <!-- dezentes Anführungszeichen-Glyph, Brand-Blau, hinter dem Zitat -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-[-0.35em] -z-0 -translate-x-1/2 select-none font-medium leading-none text-brand/10"
        style="font-size: clamp(7rem, 4rem + 14vw, 13rem);"
      >„</span>

      <!-- Stage: alle Slides gestapelt, aktiver wird eingeblendet -->
      <div id="eb-stage" class="relative z-10 mx-auto min-h-[clamp(9rem,7rem+8vw,12rem)] max-w-[62ch]">
        {
          testimonials.map((t, i) => (
            <p
              class="eb-slide absolute inset-0 flex items-center justify-center text-pretty px-1 text-[clamp(1.2rem,1rem+0.9vw,1.6rem)] leading-relaxed text-ink/80"
              role="group"
              aria-roledescription="Rezension"
              aria-label={`${i + 1} von ${testimonials.length}`}
              data-slide={i}
              hidden={i !== 0}
            >
              <span class="text-balance">{t}</span>
            </p>
          ))
        }
      </div>

      <div class="mt-10 flex items-center justify-center gap-5">
        <button
          id="eb-prev"
          type="button"
          class="eb-arrow flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-brand hover:bg-brand hover:text-white active:scale-95"
          aria-label="Vorherige Rezension"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
            ><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg
          >
        </button>
        <div id="eb-dots" class="flex items-center gap-2"></div>
        <button
          id="eb-next"
          type="button"
          class="eb-arrow flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-brand hover:bg-brand hover:text-white active:scale-95"
          aria-label="Nächste Rezension"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
            ><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg
          >
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  /* Cross-Fade: nur opacity + transform, compositor-friendly */
  .eb-slide {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.45s var(--ease-out-expo),
      transform 0.45s var(--ease-out-expo);
  }
  .eb-slide.is-active {
    opacity: 1;
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .eb-slide {
      transition: none;
      transform: none;
    }
  }
</style>

<script>
  const root = document.getElementById('eb-testimonials');
  const stage = document.getElementById('eb-stage');
  const prev = document.getElementById('eb-prev');
  const next = document.getElementById('eb-next');
  const dotsWrap = document.getElementById('eb-dots');

  if (root && stage && dotsWrap) {
    const slides = [...stage.querySelectorAll<HTMLElement>('.eb-slide')];
    const count = slides.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0;
    let timer: number | undefined;

    // Dots aufbauen
    const dots: HTMLButtonElement[] = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.className =
        'eb-dot h-2 w-2 rounded-full bg-ink/25 transition-[width,background-color] duration-200 ease-out';
      d.setAttribute('aria-label', `Gehe zu Rezension ${i + 1}`);
      d.addEventListener('click', () => {
        go(i);
        restart();
      });
      dotsWrap.appendChild(d);
      dots.push(d);
    }

    const go = (i: number) => {
      idx = (i + count) % count;
      slides.forEach((s, si) => {
        const active = si === idx;
        s.hidden = false; // hidden-Attr nur initial, danach via opacity
        s.classList.toggle('is-active', active);
        // inaktive Slides aus dem Tab-/AT-Fokus nehmen
        if (active) s.removeAttribute('aria-hidden');
        else s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach((d, di) => {
        const active = di === idx;
        d.classList.toggle('w-6', active);
        d.classList.toggle('bg-brand', active);
        d.classList.toggle('w-2', !active);
        d.classList.toggle('bg-ink/25', !active);
        if (active) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    };

    // --- Auto-Advance (opt-in, a11y-konform) ---
    const wantsAutoplay = root.dataset.autoplay === 'true' && !reduce;
    const interval = Number(root.dataset.interval) || 7000;
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      if (!wantsAutoplay || timer) return;
      timer = window.setInterval(() => go(idx + 1), interval);
    };
    const restart = () => {
      stop();
      start();
    };

    // Pause on hover/focus innerhalb der Sektion
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    // Pause wenn Tab im Hintergrund (spart Frames, kein blinder Sprung)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    prev?.addEventListener('click', () => {
      go(idx - 1);
      restart();
    });
    next?.addEventListener('click', () => {
      go(idx + 1);
      restart();
    });
    root.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'ArrowLeft') {
        go(idx - 1);
        restart();
      }
      if (k === 'ArrowRight') {
        go(idx + 1);
        restart();
      }
    });

    go(0);
    start();
  }
</script>
```

**Hinweise zum Snippet**
- Das Glyph nutzt das deutsche öffnende Tief-Anführungszeichen `„` passend zur Copy. `text-brand/10` = Brand-Blau bei 10 % Deckkraft → dezenter Akzent, keine neue Farbe.
- `min-h-[clamp(...)]` an der Stage verhindert Layout-Shift, weil die Zitate unterschiedlich lang sind (sonst springt die Höhe beim Fade).
- Auto-Advance ist zentral über die `AUTOPLAY`-Konstante im Frontmatter abschaltbar; bei reduced-motion startet der Timer gar nicht erst.
- Slides sind gestapelt absolut positioniert → ein einziger sauberer Cross-Fade, kein Track-Reflow.

---

## 2 · Gallery (Zoom-Parallax) — `src/components/Gallery.astro`

Die Mechanik (sticky 300vh, scale 1→target) bleibt. Feinschliff an Progress-Mapping, Komposition, Performance und Mobile-/reduced-motion-Fallback.

### Was sich ändert (und warum)

| Vorher | Nachher | Warum |
| --- | --- | --- |
| `scale = 1 + progress*(target-1)` (linear) | Progress wird ge-easet (`easeOutExpo`) vor dem Scale-Mapping | Linearer Zoom wirkt mechanisch; sanfter Aus-Lauf am Ende = edler, ruhiger |
| `will-change: transform` permanent auf 5 Items | `will-change` nur während aktivem Scrollen setzen, im Idle entfernen | Permanentes `will-change` belegt Layer dauerhaft → Speicher/Paint-Kosten; schmal halten |
| Items immer im DOM aktiv, auch außerhalb des Sticky-Bereichs | Update nur wenn Container im/nahe Viewport (`IntersectionObserver`-Gate) | Keine Scroll-Handler-Arbeit wenn Galerie gar nicht sichtbar |
| Start-Cluster: zentrales Bild 25vw/25vh, Nachbarn teils sehr breit/schmal | Start-Frames leicht kompakter + harmonischer (zentrales Bild als klarer Anker, Satelliten ausgewogener) | Ruhigerer Start-Cluster, der erst beim Scrollen aufbricht |
| Fallback-Grid: `auto-fit minmax(240px,1fr)`, alle gleich `4/3` | Editorial-Grid: zentrales Bild quer überspannend, restliche im rhythmischen 2er-Raster, gemischte Ratios | „Anti-Template", premium statt Standard-Kachelgrid; gilt für Mobile + reduced-motion |
| `gallery-2/-4` Stock-Außen/Schild gleichwertig groß | Reihenfolge so, dass Innen-Räume (vertrauensbildend) dominieren | Inhaltliche Gewichtung |

### Drop-in: komplette Datei

```astro
---
// src/components/Gallery.astro
// Brand-Statement + Zoom-Parallax (scroll-getrieben, vanilla — kein React/GSAP).
// Sticky 300vh: Bilder skalieren 1 → target. Reduced-motion + Mobile → editoriales Grid.
const images = [
  { src: '/img/gallery-1.webp', alt: 'Renoviertes Wohnzimmer mit Holzboden und Holzdecke', scale: 4 },
  { src: '/img/gallery-3.webp', alt: 'Renovierter Raum in minimalem Holzstil mit Couch und Fenster', scale: 5 },
  { src: '/img/gallery-2.webp', alt: 'Mehrstöckiges Haus von außen mit Glasfront', scale: 6 },
  { src: '/img/gallery-4.webp', alt: 'Schwarzes EB-Reklameschild an Hauswand mit Goldschrift', scale: 5 },
  { src: '/img/gallery-5.webp', alt: 'Renoviertes Haus von innen mit Treppe und Holzboden', scale: 6 },
];
---

<section class="bg-white">
  <div
    class="mx-auto flex max-w-[1456px] flex-col items-center px-6 pt-[clamp(4rem,2.5rem+6vw,9rem)] text-center md:px-10"
    data-reveal
  >
    <img
      src="/img/logomark.png"
      alt="ERBEN — Gemeinsam besser bauen"
      width="367"
      height="120"
      loading="lazy"
      class="h-auto w-[220px] md:w-[300px]"
    />
    <p class="eyebrow mt-5 text-muted">Gemeinsam besser bauen</p>
  </div>

  <div class="zoom-container" data-zoom>
    <div class="zoom-sticky">
      {
        images.map((img, i) => (
          <div class={`zoom-item zoom-item-${i}`} data-scale={img.scale}>
            <div class="zoom-frame overflow-hidden rounded-xs">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </div>
          </div>
        ))
      }
    </div>
  </div>
</section>

<style>
  .zoom-container {
    position: relative;
    height: 300vh;
  }
  .zoom-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  .zoom-item {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* will-change NICHT permanent — wird per JS während Scroll gesetzt */
  }
  .zoom-item.is-animating {
    will-change: transform;
  }
  .zoom-frame {
    position: relative;
    height: 24vh;
    width: 24vw;
  }
  /* Start-Cluster: zentrales Bild als Anker, Satelliten ausgewogener */
  .zoom-item-0 .zoom-frame { height: 26vh; width: 26vw; }              /* center / Anker */
  .zoom-item-1 .zoom-frame { top: -28vh; left: 4vw;  height: 28vh; width: 30vw; }
  .zoom-item-2 .zoom-frame { top: -8vh;  left: -26vw; height: 40vh; width: 18vw; }
  .zoom-item-3 .zoom-frame { left: 28vw; height: 24vh; width: 24vw; }
  .zoom-item-4 .zoom-frame { top: 28vh;  left: 4vw;  height: 24vh; width: 20vw; }

  /* Fallback: reduced-motion ODER Mobile → editoriales Grid (Anti-Template) */
  @media (prefers-reduced-motion: reduce), (max-width: 767px) {
    .zoom-container { height: auto !important; }
    .zoom-sticky {
      position: static !important;
      height: auto !important;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-flow: dense;
      gap: 12px;
      max-width: 1100px;
      margin: 2.5rem auto 0;
      padding: 0 1.5rem;
    }
    .zoom-item {
      position: static !important;
      transform: none !important;
      display: block;
    }
    .zoom-frame {
      position: static !important;
      top: auto !important;
      left: auto !important;
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 4 / 3;
    }
    /* zentrales Bild spannt beide Spalten + höheres Ratio → Rhythmus statt Uniformität */
    .zoom-item-0 { grid-column: 1 / -1; }
    .zoom-item-0 .zoom-frame { aspect-ratio: 16 / 9; }
    /* ein Hochformat-Akzent bricht das Raster */
    .zoom-item-2 .zoom-frame { aspect-ratio: 3 / 4; }
  }

  /* dezenter Hover im flachen Rahmen (nur Pointer-Geräte) */
  @media (hover: hover) and (pointer: fine) {
    .zoom-item .zoom-frame img {
      transition: transform 0.3s var(--ease-out-expo);
    }
    .zoom-item:hover .zoom-frame img {
      transform: scale(1.04);
    }
  }
</style>

<script>
  const container = document.querySelector('[data-zoom]') as HTMLElement | null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (container && !reduce && !isMobile) {
    const items = [...container.querySelectorAll<HTMLElement>('.zoom-item')];
    const targets = items.map((el) => parseFloat(el.dataset.scale || '4'));

    // sanfteres Progress-Mapping als linear (easeOutExpo)
    const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

    let ticking = false;
    let inView = false;
    let willChangeOn = false;
    let idleTimer: number | undefined;

    const setWillChange = (on: boolean) => {
      if (on === willChangeOn) return;
      willChangeOn = on;
      items.forEach((el) => el.classList.toggle('is-animating', on));
    };

    const update = () => {
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const raw = Math.min(Math.max(-rect.top / total, 0), 1);
      const progress = easeOutExpo(raw);
      items.forEach((el, i) => {
        const scale = 1 + progress * (targets[i] - 1);
        el.style.transform = `scale(${scale})`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!inView) return;
      setWillChange(true);
      // will-change im Idle wieder freigeben (Layer nicht dauerhaft halten)
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setWillChange(false), 200);
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Scroll-Arbeit nur wenn Galerie im/nahe Viewport
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (inView) update();
        else setWillChange(false);
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(container);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
</script>
```

**Hinweise zum Snippet**
- `easeOutExpo` auf `progress` (nicht auf den Scale-Endwert) → der Zoom zieht am Anfang schneller an und läuft am Ende weich aus, statt durchgehend konstant. Das ist der „smoother"-Effekt ohne Lib.
- `will-change` wird nur während aktiven Scrollens gesetzt und nach 200 ms Idle entfernt — exakt die „sparsam"-Regel.
- Der `IntersectionObserver` ist ein reines Gate (`inView`), die eigentliche Animation läuft weiter scroll-getrieben über `transform` — bleibt also compositor-friendly.
- Start-Frames sind leicht kompakter/ausgewogener; das zentrale Bild (`zoom-item-0`) bleibt klarer Anker, von dem alles aufzoomt.
- Fallback-Grid ist jetzt editorial (zentrales Bild über beide Spalten + ein Hochformat-Akzent), nicht mehr uniformes `auto-fit`-Kachelraster.

---

## 3 · Über-uns — `src/pages/ueber-uns.astro`

Solide Struktur. Hebung über Section-Rhythmus, Reveal-Staffelung und drei gezielte Kompositions-Finessen — kein Umbau, alle Farben/Radien/Shadow unverändert.

### Was sich ändert (und warum)

| Bereich | Vorher | Nachher | Warum |
| --- | --- | --- | --- |
| Hero-Intro | Eyebrow → H1 → 2 Absätze, alle gleichzeitig sichtbar | Gestaffelter Reveal (`--reveal-delay`), dünne Brand-Linie unter Eyebrow, Lead-Absatz größer als Folge-Absatz (klare Hierarchie) | Editorial-Einstieg, Hierarchie durch Scale-Kontrast |
| Team-Band | `h-[58vh]`, Caption-Verlauf | Bild leicht höher auf Desktop + sanfter Ken-Burns-Drift (scale 1→1.05, reduced-motion off) + Caption-Eyebrow in Brand | Bild-Band bekommt Tiefe/Leben, bleibt dezent |
| Werte-Karten | Gleichmäßiges 3er/2er-Grid, alle gleich | Stagger-Reveal je Karte (40ms), Akzent-Strich animiert auf Hover, Karte hebt sich minimal | „Designter" Hover statt statisch; Rhythmus |
| Founder-Block | 2-spaltig, Portrait sticky | Portrait mit dünnem Brand-Rahmen-Akzent + Nummerierung/Kicker, Zitat-Block prominenter | Premium-Founder-Moment, klare Leseführung |
| Section-Rhythmus | Alle Sections `clamp(4rem,...,9rem)` | Übergänge bleiben, aber Founder + Werte bekommen mehr vertikalen Atem; Trenner via bg-Wechsel bleibt | Ruhiger, premium Takt |

### A · Reveal-Staffelung global ermöglichen (`src/styles/global.css`)

Aktuell unterstützt `[data-reveal]` nur einen einzelnen `--reveal-delay`. Für saubere Stagger-Stufen eine kleine, additive Erweiterung — ändert bestehendes Verhalten nicht:

```css
/* in global.css, im @media (prefers-reduced-motion: no-preference) Block ergänzen */
[data-reveal][data-reveal-delay="1"] { --reveal-delay: 80ms; }
[data-reveal][data-reveal-delay="2"] { --reveal-delay: 160ms; }
[data-reveal][data-reveal-delay="3"] { --reveal-delay: 240ms; }
```

(Die bestehende `transition-delay: var(--reveal-delay, 0ms)`-Regel greift das automatisch ab.)

### B · Hero-Intro — gestaffelt + Hierarchie

Ersetze den Intro-`<div>`-Inhalt (Zeilen ~38–57) durch:

```astro
    <div class="mx-auto max-w-[1456px] px-6 pb-[clamp(3rem,2rem+4vw,6rem)] pt-32 md:px-10">
      <p class="eyebrow mb-3 text-white/70" data-reveal>Über uns</p>
      <span
        class="mb-7 block h-px w-16 bg-brand"
        aria-hidden="true"
        data-reveal
        data-reveal-delay="1"
      ></span>
      <h1
        class="max-w-3xl text-[clamp(2.5rem,1.4rem+4vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.02em]"
        data-reveal
        data-reveal-delay="1"
      >
        Bauen ist Teamsport
      </h1>
      <p
        class="mt-6 max-w-2xl text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-relaxed text-white/90"
        data-reveal
        data-reveal-delay="2"
      >
        Bauprojekte scheitern selten am Handwerk. Sie scheitern an Kommunikation, Koordination und
        fehlender Übersicht. Genau da setzen wir an.
      </p>
      <p
        class="mt-5 max-w-2xl text-lg leading-relaxed text-white/65"
        data-reveal
        data-reveal-delay="3"
      >
        Erben Bau ist ein Bau-Koordinationsdienstleister aus München. Wir führen keine Gewerke aus.
        Wir halten sie zusammen. Vom Bauherrn über die Bauleitung bis zum Handwerker auf der
        Baustelle. Ein Ansprechpartner. Klare Abläufe. Volle Transparenz. Für private und gewerbliche
        Bauherren.
      </p>
      <div class="mt-9 flex flex-wrap gap-4" data-reveal data-reveal-delay="3">
        <Button href={CAL} target="_blank" variant="primary">Beratungstermin vereinbaren</Button>
        <Button href="/kontakt" variant="outline-light">Kontakt aufnehmen</Button>
      </div>
    </div>
```

Effekt: Eyebrow → Linie+H1 → Lead → Body+CTA laufen in 80ms-Stufen ein. Lead-Absatz größer (`clamp ~1.25–1.5rem`, `text-white/90`), Folge-Absatz kleiner/leiser (`text-white/65`) → klare Hierarchie statt zwei gleichwertiger Textblöcke.

### C · Team-Band — Tiefe via dezentem Ken-Burns

Ersetze die `<img>` der Team-Figure (Zeilen ~64–72) durch eine gewrappte Variante und ergänze CSS:

```astro
  <!-- Atmosphäre / Team -->
  <section class="bg-ink">
    <div class="mx-auto max-w-[1456px] md:px-10">
      <figure class="eb-band relative overflow-hidden md:rounded-xs" data-reveal>
        <img
          src="/img/team-office.jpg"
          alt="Cihan Erben mit dem Team von Erben Bau im Büro"
          width="800"
          height="979"
          loading="lazy"
          decoding="async"
          class="eb-band-img h-[62vh] w-full object-cover object-center"
        />
        <figcaption
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 md:p-10"
        >
          <p class="eyebrow text-brand-light">Vor Ort, im Team</p>
          <p class="mt-2 max-w-xl text-lg leading-relaxed text-white md:text-xl">
            Bauen ist Zusammenarbeit. Wir sind dort, wo Entscheidungen fallen: auf der Baustelle und
            am Tisch mit allen Beteiligten.
          </p>
        </figcaption>
      </figure>
    </div>
  </section>
```

CSS (in einen `<style>`-Block der Seite, oder global):

```css
/* Sehr dezenter Ken-Burns-Drift am Team-Band — innerhalb Scale ≤ 1.05 */
@media (prefers-reduced-motion: no-preference) and (hover: hover) {
  .eb-band-img {
    transform: scale(1.001);
    transition: transform 8s linear;
  }
  .eb-band.is-visible .eb-band-img {
    transform: scale(1.05);
  }
}
```

Caption-Eyebrow nutzt jetzt `text-brand-light` (vorhandenes Token `#5799bd`) statt `text-white/80` → setzt einen ruhigen Markenakzent auf dem Bild, ohne neue Farbe.
Der Drift ist bewusst langsam (8s) und an `.is-visible` gekoppelt (läuft erst beim Reveal an). Bei reduced-motion: kein Transform.

> Hinweis: `--color-brand-light` ist bereits im Token-Set definiert. Falls der Auftraggeber den Blau-Ton auf dem Bild zu kühl findet → auf `text-white/85` zurückfallen. Beides CI-konform.

### D · Werte-Karten — Stagger + designter Hover

Ersetze den Werte-`map` (Zeilen ~127–135) durch:

```astro
        {
          werte.map((w, i) => (
            <div
              class="eb-value group flex flex-col bg-white p-8 transition-transform duration-200 ease-out hover:-translate-y-0.5"
              data-reveal
              data-reveal-delay={String(Math.min(i % 3 === 0 ? 0 : i % 3, 3))}
            >
              <span
                class="mb-4 block h-2 w-8 rounded-full bg-brand transition-[width] duration-200 ease-out group-hover:w-12"
                aria-hidden="true"
              />
              <h3 class="text-xl font-medium text-ink">{w.h}</h3>
              <p class="mt-3 text-base leading-relaxed text-ink/75">{w.t}</p>
            </div>
          ))
        }
```

Effekt: Karten reveal-staffeln pro Spalte (80/160ms), der Brand-Akzentstrich wächst auf Hover von `w-8`→`w-12`, Karte hebt sich 2px. Alles `transform`/`width`-basiert, ≤ 200ms, kein neuer Schatten (das `gap-px`-Grid liefert die Trennlinien wie gehabt).

> Falls strikt „nur transform animieren" gewünscht: `group-hover:w-12` weglassen und nur das `-translate-y-0.5` behalten. Der Strich-Grow ist ein bewusster, sehr kleiner Akzent; `width` auf einem 8px-Element ist günstig, aber technisch layout-bound — Entscheidung dokumentiert.

### E · Founder-Block — Portrait-Akzent + Kicker

Ersetze den linken Founder-`<div>` (Zeilen ~145–160) durch:

```astro
      <div class="md:sticky md:top-28 md:self-start" data-reveal>
        <div class="relative w-full max-w-[320px]">
          <!-- dünner Brand-Akzent-Rahmen, versetzt — flach, kein Schatten -->
          <span
            aria-hidden="true"
            class="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-xs border border-brand/40"
          ></span>
          <div class="overflow-hidden rounded-xs">
            <img
              src="/img/cihan-portrait.jpg"
              alt="Cihan Erben, Gründer und Geschäftsführer von Erben Bau"
              width="400"
              height="400"
              loading="lazy"
              decoding="async"
              class="aspect-square w-full object-cover"
            />
          </div>
        </div>
        <p class="eyebrow mt-7 text-brand" data-reveal data-reveal-delay="1">Der Gründer</p>
        <p class="mt-1 text-2xl font-medium text-ink">Cihan Erben</p>
        <p class="text-muted">Gründer und Geschäftsführer, Erben Bau</p>
      </div>
```

Effekt: ein versetzter, dünner Brand-Linien-Rahmen hinter dem Portrait gibt dem Founder-Moment Tiefe — flach, keine Shadow, kein Glas, nur `border-brand/40`. Das vorhandene Zitat (`border-l-2 border-brand`) bleibt als prominenter Abschluss.

> Spacing-Feinschliff Founder-Section (optional): das Grid-`gap` auf Desktop von `md:gap-16` auf `md:gap-20` und das `py` einen Tick großzügiger — gibt dem Founder-Block mehr Atem als den übrigen Sektionen. Eine Zeile:
> `class="mx-auto grid max-w-[1100px] gap-10 px-6 py-[clamp(5rem,3rem+6vw,10rem)] md:grid-cols-[0.82fr_1.18fr] md:gap-20 md:px-10"`

---

## Verifikations-Checkliste (vor Deploy)

- [ ] `npm run build` exit 0 (Astro), keine TS-Fehler im Insel-Script.
- [ ] Testimonials: Tab erreicht Pfeile + Dots; ←/→ blättert; aktiver Dot = Pille + `aria-current`; Auto-Advance pausiert bei Hover/Focus und Tab-Wechsel.
- [ ] `prefers-reduced-motion: reduce` (DevTools → Rendering): Testimonials instant ohne Fade, Auto-Advance aus; Gallery zeigt editoriales Grid; Team-Band ohne Drift.
- [ ] Gallery 1440px: weicher Aus-Lauf des Zooms; im Idle kein `will-change` mehr (DevTools Layers).
- [ ] Mobile 390px: Gallery-Grid mit zentralem Bild über 2 Spalten + Hochformat-Akzent, kein Overflow.
- [ ] Über-uns: Hero staffelt ein; Werte-Karten staffeln + Hover-Akzent; Founder-Rahmen sitzt versetzt ohne Overflow.
- [ ] Kein neuer Farbwert/Radius/Schatten/Font außerhalb des Token-Sets eingeschleust (grep auf `#`, `shadow-`, `rounded-` Diffs).
```
