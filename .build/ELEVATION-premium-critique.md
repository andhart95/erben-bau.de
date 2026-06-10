# ELEVATION — Premium-Critique (Anti-0815)

> Adversarielle „make-it-feel-premium"-Durchsicht der GANZEN Site (alle Komponenten + Seiten).
> Lens: **impeccable** (Hierarchie, optische Ausrichtung, States, Polish-Details),
> **emil-design-eng** (Übergänge konsistent, Easing-Disziplin, „kleine unsichtbare Details"),
> **make-interfaces-feel-better** (Interaction-Feedback flächendeckend, kein State vergessen).
>
> **Verdikt vorab:** Die Site ist solide gebaut und sieht bereits gut aus. Was sie noch
> leise nach „Template" riechen lässt, sind **nicht** große Layout-Sachen, sondern
> **Inkonsistenzen im Detail**: drei unterschiedliche Transition-Definitionen (viele OHNE
> Token-Duration → 150ms-Default-Drift), Easing-Wildwuchs (`ease-out` vs `ease`), ein
> Eyebrow-`letter-spacing`, das von der eigenen Spec abweicht, fehlende `:focus-visible`-
> Ringe auf Inline-Links + Karussell-Dots, kein optisches Alignment der Eyebrows zur
> Headline-Kante, und Reveal-Stagger der nie genutzt wird. Alles **CI-konform** und
> **subtil** fixbar — kein Redesign, kein neuer Effekt, keine neue Farbe.

Alle Fixes halten die HARTEN Guardrails ein: Flat (radius 2px / 100px Pills), eine
`--shadow-soft`, nur Token-Farben (Brand-Blau / Schwarz / Beige / Weiß), nur Satoshi,
Motion 100/200ms (Reveal ≤ 500ms), Scale ≤ 1.05, `prefers-reduced-motion` respektiert.
Startseite wird nur **subtil veredelt**, nicht umgebaut.

---

## TOP 8 — größtes Wirkung/Aufwand-Verhältnis (priorisiert)

### 1. Motion-System vereinheitlichen: Token-Durations + EIN Easing (höchster Hebel)

**Problem (der „billigste" Tell):** Über die Site existieren drei verschiedene
Transition-Schreibweisen, und die meisten `transition-colors` haben **keine** Duration
→ Browser-Default **150ms** statt der Spec-100/200ms. Dadurch fühlen sich Hovers uneinheitlich
schnell an (Nav-Link 100ms vs. Testimonial-Pfeil 150ms vs. Footer-Link 100ms). Zusätzlich
mischt der Code `ease-out` (Tailwind = `cubic-bezier(0,0,0.2,1)`) mit dem Token
`--ease-out-expo`. Emil-Prinzip: *gleichartige Elemente müssen sich exakt gleich bewegen,
sonst wirkt es ungeplant.*

Belege (alle ohne Duration → 150ms-Default):
- `TestimonialCarousel.astro:50,61` Pfeil-Buttons `transition-colors` (nackt)
- `TestimonialCarousel.astro:85` Dots `transition-colors` (nackt)
- `ContactSection.astro:27,31` Mail/Tel-Links `transition-colors` (nackt)
- `CookieConsent.astro:29,33,38,66,71,76,86` alle Buttons `transition-colors` (nackt)
- `ueber-uns.astro` Werte-Karten / Founder: keinerlei Hover-Transition-Token

**Fix A — kanonische Motion-Tokens + Utility-Klassen in `global.css` ergänzen:**

`src/styles/global.css` (nach dem `@theme`-Block, vor `/* ===== Base ===== */`):

```css
@theme {
  /* Motion — kanonisch (Spec §0/§8) */
  --duration-fast: 100ms;     /* Hover: color/bg/border */
  --duration-normal: 200ms;   /* Slides, Menü, Transform-States */
  --ease-std: cubic-bezier(0.4, 0, 0.2, 1);          /* Hover/States */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);    /* Reveals */
}

/* Kanonische Hover-Transition — überall statt nacktem `transition-colors` */
.t-hover {
  transition: color var(--duration-fast) var(--ease-std),
              background-color var(--duration-fast) var(--ease-std),
              border-color var(--duration-fast) var(--ease-std),
              transform var(--duration-fast) var(--ease-std);
}
```

**Fix B — nackte `transition-colors` durch `t-hover` ersetzen.** Beispiel
`TestimonialCarousel.astro:50` (Pfeil-Button):

```diff
-          class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white"
+          class="t-hover flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 text-ink hover:border-brand hover:bg-brand hover:text-white"
```

Gleiches Muster auf `ContactSection.astro:27,31`, `CookieConsent.astro` (alle Buttons),
`Footer.astro:17`, `Nav.astro:30`. Den Track-Übergang in `TestimonialCarousel.astro:28`
auf Token bringen:

```diff
-        <ul id="eb-track" class="flex transition-transform duration-300 ease-out">
+        <ul id="eb-track" class="flex transition-transform duration-200 [transition-timing-function:var(--ease-std)]">
```

(300ms war über dem 200ms-Limit für Slides.)

**Wirkung:** Die ganze Site bewegt sich plötzlich „aus einem Guss". Aufwand: ~15 Min
Find-and-Replace. Kein visuelles Risiko.

---

### 2. Eyebrow auf Spec-Tracking + optisches Alignment + konsistenter Brand-Strich

**Problem:** `global.css:70` setzt `.eyebrow { letter-spacing: 0.12em }`, die eigene Spec
(POLISH §3) verlangt **0.08em** — 0.12em ist für 13px-Uppercase einen Tick zu weit
gesperrt und wirkt „webflow-default". Außerdem: Eyebrows erscheinen mal grau
(`text-muted`), mal blau (`text-brand` in Services), mal `text-white/70..80` — die Farbe
ist OK (kontextabhängig), aber es fehlt der in der Spec vorgesehene **dezente 24px-Brand-
Strich** als wiederkehrendes Brand-Signal. Das ist das eine Detail, das „digital-bau,
seriös, eigen" statt „Standard-Eyebrow" macht — und es ist überall identisch einsetzbar.

**Fix — `global.css` Eyebrow härten + optionalen Strich als Modifier:**

`src/styles/global.css:67-72`:

```diff
 .eyebrow {
   font-size: 0.8125rem;
   font-weight: 500;
-  letter-spacing: 0.12em;
+  letter-spacing: 0.08em;
   text-transform: uppercase;
+  line-height: 1;
 }
+/* Brand-Akzent vor dem Eyebrow — dezentes, wiederkehrendes Signal (Spec §3) */
+.eyebrow.has-rule {
+  display: inline-flex;
+  align-items: center;
+  gap: 0.75rem;
+}
+.eyebrow.has-rule::before {
+  content: "";
+  width: 1.5rem;
+  height: 2px;
+  background: var(--color-brand);
+  flex: none;
+}
```

**Einsatz (subtil, NICHT überall — nur an den Sektions-Eröffnungen):** Services-Intro
`Services.astro:56`, beide SplitSection-Eyebrows, ueber-uns Intro `:39`. Beispiel
`Services.astro:56`:

```diff
-      <p class="eyebrow mb-4 text-muted">Was wir tun</p>
+      <p class="eyebrow has-rule mb-4 text-muted">Was wir tun</p>
```

**Wichtig — die per-Service Eyebrows (`Services.astro:71`, blau) bewusst OHNE Strich
lassen** (sonst doppelter Brand-Akzent neben dem blauen Bullet-Punkt → too much).

**Wirkung:** Ein ruhiges, eigenes Wiedererkennungsmerkmal statt 08/15-Label. Aufwand:
1 CSS-Block + 4 Klassen-Zusätze.

---

### 3. Fehlende `:focus-visible`-States auf Inline-Links & Karussell-Dots (a11y + Polish)

**Problem:** Der globale `:focus-visible` (global.css:47) greift, ABER Inline-Text-Links
(Footer, Mail/Tel in ContactSection, Datenschutz-Links im Consent-Text) bekommen einen
2px-Outline der ihre Glyphen eng umschließt → auf dunklem `--color-ink`-bg schwer sichtbar
und optisch hart. Die Karussell-**Dots** (`TestimonialCarousel.astro:85`) sind nur 8px
groß → Focus-Ring klebt am Punkt. make-interfaces-feel-better: *jeder interaktive State
muss bewusst gestaltet sein, auch der Fokus.*

**Fix — Fokus-Ring mit Offset & Radius global verbessern:**

`src/styles/global.css:47-50`:

```diff
 :focus-visible {
   outline: 2px solid var(--color-brand);
   outline-offset: 2px;
+  border-radius: var(--radius-xs);
 }
+/* Auf dunklen Sektionen Fokus-Ring zusätzlich absetzen (Brand-Blau auf Schwarz ist knapp) */
+.bg-ink :focus-visible,
+.bg-ink a:focus-visible {
+  outline-color: #5799bd; /* --color-brand-light, Token */
+  outline-offset: 3px;
+}
```

**Dots fokussierbar & Touch-tauglich machen** — `TestimonialCarousel.astro:84` (im JS):

```diff
-      d.className = 'h-2 w-2 rounded-full bg-ink/25 transition-colors';
+      d.className = 'eb-dot t-hover relative h-2 w-2 rounded-full bg-ink/25';
```

und CSS in der Komponente (oder global): die Hit-Area via Pseudo-Element auf 44px
vergrößern, ohne das visuelle 8px-Dot zu verändern:

```css
.eb-dot { position: relative; }
.eb-dot::after { content: ""; position: absolute; inset: -18px; } /* 44px Touch-Target */
```

**Wirkung:** Fokus wirkt designt statt „Browser-default", Dots werden tastatur- und
touch-tauglich (WCAG 2.5.5). Aufwand: klein.

---

### 4. Vertikaler Sektions-Rhythmus: doppelter Top-Space am Eyebrow-Band glätten

**Problem (Spacing-Rhythmus):** Auf der Home folgt nach dem Hero das **Eyebrow-Band**
(`index.astro:18-22`, nur `pt-20`, kein `pb`), direkt danach die erste SplitSection mit
vollem `py-[clamp(4rem,…,9rem)]`. Ergebnis: zwischen Eyebrow-Text und SplitSection-Eyebrow
stapelt sich `pt-20` (80px) + SplitSection-`py` (bis 144px) = **bis ~224px Leerraum** —
auf 1440 wirkt das wie ein Loch (im QA-Screenshot sichtbar: das Eyebrow-Band hängt
verloren über der ersten Sektion). Gleichzeitig ist das Eyebrow-Band semantisch ein
*Auftakt* zur ersten SplitSection, sollte also näher dran sein.

**Fix — Eyebrow-Band als Auftakt an die erste SplitSection koppeln** (`index.astro:18-31`):

```diff
-  <!-- Eyebrow-Band -->
-  <section class="bg-white">
-    <div class="mx-auto max-w-[1456px] px-6 pt-20 text-center md:px-10" data-reveal>
-      <p class="eyebrow text-muted">Was macht Erben Services so besonders?</p>
-    </div>
-  </section>
-
-  <!-- Intro: Gemeinsam vor Ort & digital (Text links, Bild rechts) -->
-  <SplitSection
+  <!-- Intro: Eyebrow-Band als Auftakt direkt an die erste SplitSection -->
+  <section class="bg-white">
+    <div class="mx-auto max-w-[1456px] px-6 pt-[clamp(4rem,2.5rem+6vw,9rem)] pb-2 text-center md:px-10" data-reveal>
+      <p class="eyebrow has-rule justify-center text-muted">Was macht Erben Services so besonders?</p>
+    </div>
+  </section>
+
+  <!-- Intro: Gemeinsam vor Ort & digital (Text links, Bild rechts) -->
+  <SplitSection
+    class="!pt-6"
```

Dazu in `SplitSection.astro` ein optionales `class`-Prop auf die innere `div` durchreichen
(die Komponente nimmt aktuell keine Klasse an):

```diff
-const { eyebrow, heading, body, cta, image, reverse = false } = Astro.props;
+const { eyebrow, heading, body, cta, image, reverse = false, class: cls = '' } = Astro.props;
```
```diff
-    class={`mx-auto grid max-w-[1456px] items-center gap-10 px-6 py-[clamp(4rem,2.5rem+6vw,9rem)] md:grid-cols-2 md:gap-16 md:px-10 ${reverse ? '' : ''}`}
+    class={`mx-auto grid max-w-[1456px] items-center gap-10 px-6 py-[clamp(4rem,2.5rem+6vw,9rem)] md:grid-cols-2 md:gap-16 md:px-10 ${cls}`}
```

(Interface `Props` um `class?: string;` ergänzen.)

**Wirkung:** Der Auftakt-Eyebrow „klebt" jetzt an seiner Sektion, das Loch verschwindet,
der vertikale Rhythmus liest sich als bewusste Hierarchie statt zufälligem Whitespace.
Räumt nebenbei das tote `${reverse ? '' : ''}` auf (Orphan aus eigener Änderung — OK zu
entfernen).

---

### 5. Hover-Feedback auf den großen Klickflächen, die aktuell tot sind

**Problem (make-interfaces-feel-better):** Mehrere prominente, große Elemente haben
**keinerlei** Hover-Reaktion, obwohl sie sich „anfassbar" anfühlen sollten:
- **SplitSection-Bilder** (`SplitSection.astro:20`) — Wrapper hat `overflow-hidden
  rounded-xs`, aber das Bild zoomt nicht (anders als die Spec §4 für Gallery vorsieht).
- **ueber-uns Werte-Karten** (`ueber-uns.astro:129`) — 5 Karten, komplett statisch, kein
  Hover. Das ist der klassische „uniformes Card-Grid"-Tell aus der Anti-Template-Policy.
- **Founder-Portrait** (`ueber-uns.astro:147`) — Wrapper `overflow-hidden rounded-xs`,
  kein Zoom.

**Fix — dezenter, CI-konformer Hover (Scale ≤ 1.03, nur transform):**

`SplitSection.astro:20-29` Bild-Wrapper:

```diff
-      <div class="overflow-hidden rounded-xs">
+      <div class="group overflow-hidden rounded-xs">
         <img
           src={image.src}
           alt={image.alt}
           width={image.width}
           height={image.height}
           loading="lazy"
           decoding="async"
-          class="h-full w-full object-cover"
+          class="h-full w-full object-cover transition-transform duration-[400ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] motion-reduce:transform-none"
         />
```

Werte-Karten `ueber-uns.astro:129` — Border-Akzent statt Schatten-Eskalation (flat bleibt):

```diff
-            <div class="flex flex-col bg-white p-8" data-reveal>
+            <div class="t-hover group flex flex-col bg-white p-8 hover:bg-beige-light" data-reveal>
               <span class="mb-4 h-2 w-8 rounded-full bg-brand" aria-hidden="true" />
-              <h3 class="text-xl font-medium text-ink">{w.h}</h3>
+              <h3 class="text-xl font-medium text-ink transition-colors duration-100 group-hover:text-brand">{w.h}</h3>
```

(Der `bg-ink/10`-Grid-Gap-Trick erzeugt ohnehin schon 1px-Divider-Linien — gut. Der
Hover-`bg-beige-light` gibt den Karten Leben ohne Schatten.)

**Wirkung:** Die statischen Flächen reagieren jetzt, das Werte-Grid verliert den
„default Tailwind grid"-Geruch. Scale 1.03 < 1.05-Limit, nur `transform`/`color`,
`motion-reduce` respektiert.

---

### 6. Type-Scale-Contrast: H3 in Services vs. Body, und die „verloren"-wirkende H2

**Problem (Hierarchie / impeccable):** In `Services.astro` ist der **Intro-Body unter den
Bullets unsichtbar gewichtet** — `intro` (`text-lg`, `text-ink/80`) und die Bullet-Texte
(`text-base`, `text-ink/90`) sind fast gleich laut, dabei ist der Intro die Hauptaussage
und die Bullets die Beweisführung. Außerdem: die Section-H2 „Drei Wege…" (`:57`) und die
Service-H3 „Alle Gewerke…" (`:72`) liegen scale-mäßig zu nah beieinander
(3rem max vs. 2.25rem max), die Hierarchie H2 → H3 ist dünn.

**Fix — Bullet-Text leiser, Intro lauter, klarer Sprung:**

`Services.astro:75` (Intro) + `:86` (Bullets):

```diff
-                <p class="mt-5 max-w-md text-lg leading-relaxed text-ink/80">{s.intro}</p>
+                <p class="mt-5 max-w-md text-lg leading-relaxed text-ink/90">{s.intro}</p>
```
```diff
-                  <span class="text-base leading-relaxed">{b}</span>
+                  <span class="text-[0.9375rem] leading-relaxed text-ink/70">{b}</span>
```

**Wirkung:** Auge springt jetzt Intro → Bullets statt grau-in-grau. Mikro-Änderung, klarer
Lesefluss. Keine neuen Tokens.

---

### 7. Reveal-Stagger nutzen (er ist gebaut, aber wird nie ausgelöst)

**Problem (emil — „die Details, die man nicht sieht, aber spürt"):** Der Layout-Reveal-IO
(`Layout.astro:60-79`) setzt nur `.is-visible`, und `global.css:57` liest `--reveal-delay`
— aber **kein einziges** `data-reveal` setzt je ein Delay. Heißt: In SplitSection,
ContactSection und der ueber-uns Founder-Section faden Text- und Bildspalte **exakt
gleichzeitig** ein. Die Spec (§3) will Text zuerst, Bild ~80ms versetzt → das ist der
editoriale Feinschliff, der „premium" von „alles-poppt-auf-einmal" trennt.

**Fix — `--reveal-delay` per inline-style auf die zweite Spalte.** `SplitSection.astro`:
Text-Spalte (`:32`) bleibt 0ms, Bild-Spalte (`:19`) bekommt 90ms:

```diff
-    <div class={`order-2 ${reverse ? 'md:order-1' : 'md:order-2'}`} data-reveal>
+    <div class={`order-2 ${reverse ? 'md:order-1' : 'md:order-2'}`} data-reveal style="--reveal-delay:90ms">
```

Analog in `ContactSection.astro` die Formular-Spalte (`:39`) `style="--reveal-delay:90ms"`,
und in `ueber-uns.astro` die Founder-Text-Spalte (`:161`) `style="--reveal-delay:90ms"`.

Die Werte-Karten (`ueber-uns.astro:129`) staffeln über `nth-child` — kleiner Block in der
Page-`<style>` (oder global), reduced-motion-safe weil an `[data-reveal]` gebunden:

```css
@media (prefers-reduced-motion: no-preference) {
  .grid > [data-reveal]:nth-child(2) { --reveal-delay: 60ms; }
  .grid > [data-reveal]:nth-child(3) { --reveal-delay: 120ms; }
  .grid > [data-reveal]:nth-child(4) { --reveal-delay: 60ms; }
  .grid > [data-reveal]:nth-child(5) { --reveal-delay: 120ms; }
  .grid > [data-reveal]:nth-child(6) { --reveal-delay: 180ms; }
}
```

**Wirkung:** Sektionen kommen jetzt mit ruhigem, editorialem Versatz herein statt als
Block. Nutzt vorhandene Infrastruktur — 0 neue JS-Zeilen. `reduced-motion` killt es
ohnehin global (global.css existierende Regel + Spec §8).

---

### 8. Nav-Polish: aktiver/aktueller Zustand + Logo-Filter-Hack ersetzen + Scroll-Shadow auf Token

**Problem:**
1. **Kein Active/Current-State** in der Nav (Spec §1 verlangt blaue 2px-Unterstreichung der
   aktuellen Sektion). Aktuell weiß man als User nie, wo man ist → wirkt „statische
   Template-Nav".
2. **Logo via Filter-Hack** (`Nav.astro:20` `[filter:brightness(0)_invert(1)]`) — das ist
   ein Code-Smell und kann je nach SVG matschig wirken; es gibt eine echte
   Footer-Wordmark. (Niedrige Prio, nur erwähnen — funktioniert.)
3. **Scroll-Shadow** (`Nav.astro:118`) nutzt eine **fremde** Shadow
   (`0_2px_16px_rgba(0,0,0,0.25)`) statt der einen erlaubten `--shadow-soft`. Verstößt
   gegen „EINE soft Shadow". Hier ist eine etwas kräftigere Shadow zwar vertretbar (dunkle
   Nav auf hellem Content), aber sie sollte als bewusster Token deklariert sein, nicht inline.

**Fix 8a — dezenter Active-Underline via vorhandenem Reveal-IO-Muster** (Nav-Links
`Nav.astro:28-34` bekommen Anker-Targets, der bestehende Mobile/Desktop-Link-Stil
erweitert). Minimal-invasiv: nur Desktop-Links, blaue Unterstreichung via `box-shadow`:

```diff
           <a
             href={l.href}
+            data-navlink={l.href}
-            class="text-sm font-medium text-white/90 transition-colors duration-100 hover:text-white"
+            class="t-hover text-sm font-medium text-white/90 hover:text-white [&[aria-current=true]]:text-white [&[aria-current=true]]:[box-shadow:0_2px_0_var(--color-brand)]"
           >
```

JS (ein kleiner IO im bestehenden `<script>` von Nav.astro, reduced-motion-irrelevant weil
nur Klassen/Attribute):

```js
const sections = ['baukoordination','bausicherheit','wachstumspartner'];
const navlinks = new Map([...document.querySelectorAll('[data-navlink]')]
  .map(a => [a.getAttribute('data-navlink')?.replace('/#',''), a]));
const secIO = new IntersectionObserver((ents) => {
  ents.forEach(e => {
    const a = navlinks.get(e.target.id);
    if (a && e.isIntersecting) {
      navlinks.forEach(x => x.removeAttribute('aria-current'));
      a.setAttribute('aria-current','true');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(id => { const el = document.getElementById(id); if (el) secIO.observe(el); });
```

**Fix 8b — Scroll-Shadow als Token** (`global.css` `@theme`):

```css
--shadow-nav: 0 2px 16px rgba(20, 18, 18, 0.22); /* Token statt inline-magic */
```
`Nav.astro:118-119`:
```diff
-    if (window.scrollY > 24) nav?.classList.add('shadow-[0_2px_16px_rgba(0,0,0,0.25)]');
-    else nav?.classList.remove('shadow-[0_2px_16px_rgba(0,0,0,0.25)]');
+    nav?.classList.toggle('shadow-[var(--shadow-nav)]', window.scrollY > 24);
```

**Wirkung:** Die Nav lebt mit dem Scroll, Orientierung wird klar, Shadow ist
system-deklariert. Aufwand: mittel (eine kleine IO), aber hoher Premium-Effekt — Nav ist
das erste, was Profis bewerten.

---

## Weitere Detail-Funde (unter Top-8, niedrigere Prio — als Backlog)

- **Footer ist zu flach** (`Footer.astro`): nur eine Zeile zentrierter Links, kein
  visueller Abschluss. Premium-fix ohne Umbau: 1px Divider oben (`border-t border-white/10`)
  + Logomark/Wordmark links, Links rechts. Macht das Seitenende „abgeschlossen" statt
  „abgehackt". CI-konform (nur Linie + vorhandene Assets).
- **`SplitSection` Bild ohne `aspect-ratio`-Box** → bei langsamem Laden minimaler CLS-Hop.
  Spec §3 verlangt Aspect-Ratio-Box. Fix: Wrapper `class="… aspect-[4/3]"` (bzw. `[3/4]`
  für Hochformat-Bilder via Prop) + `h-full` am img.
- **`SplitSection` Text-Spalte `max-w-xl` am Body** (`:37`) ist gut, aber die H2 hat keine
  Max-Breite → auf 1440 läuft „Gemeinsam / vor Ort & / digital" zwar via `<br>`, „Warum wir
  tun / was wir tun" könnte aber bei anderem Content reißen. `text-wrap: balance` auf alle
  H2/H1 setzen (global, ein Selektor) → editoriale Zeilenumbrüche, kostenlos:
  ```css
  h1, h2, h3 { text-wrap: balance; }
  ```
- **Testimonial-Quotes mischen Anführungszeichen** (`TestimonialCarousel.astro:3-7`): Slide
  1/3/4/5 nutzen typografische `„ "`/`" "`, Slide 2 nutzt gerade `" "`. Slide 3 hat doppelten
  Punkt `..`. Inkonsistenz = „nicht durchgesehen"-Signal. Vereinheitlichen auf deutsche
  `„ … "`-Form, Doppelpunkt fixen. (Content-Polish, 2 Min.)
- **Consent-Banner Headline „Cookie Settings"** (`CookieConsent.astro:17`) ist Englisch
  inmitten deutscher UI → „Cookie-Einstellungen". Kleiner aber sichtbarer Konsistenz-Bruch.
- **`hover:scale-105` auf dem Cookie-Reopen-Button** (`CookieConsent.astro:86`) ist genau am
  1.05-Limit und ohne `transition`-Duration-Token → mit `t-hover` versehen.
- **ContactSection Inputs `color:#333`** (`ContactSection.astro:101`) ist eine Off-Token-
  Farbe → auf `var(--color-ink)` (#141212) ziehen. Marginal, aber „nur Token"-Regel.
- **Eyebrow-Farbe `text-muted` (#747474) auf Weiß** für 13px-Uppercase ist
  kontrastmäßig grenzwertig (AA ~4.5 knapp bei small text). Da Eyebrows „large-ish/bold"
  sind, meist OK — bei Bedarf auf `#5e5e5e` (Spec-Vorschlag) ziehen. Nur prüfen, nicht
  blind ändern.

---

## Was NICHT anfassen (bewusst)

- **Hero** bleibt wie er ist — gefällt dem Auftraggeber, Reveal/Overlay/Buttons sind sauber.
  Maximal: die Headline-Zeilen könnten den Spec-§2-Staffel-Reveal (per `--reveal-delay` an
  `reveal-line`-Spans) bekommen — aber das ist „nice", nicht nötig, und birgt Risiko am
  geschätzten Element. **Weglassen**, außer explizit gewünscht.
- **Gallery-Zoom-Parallax** ist das Signature-Element — funktioniert, ist compositor-
  friendly (`transform: scale`), hat Mobile/reduced-motion-Fallback. Nicht antasten.
- Keine neue Farbe, keine zweite Schrift, keine Schatten-Eskalation, kein Glas/Neon —
  alle obigen Fixes bleiben strikt im Flat-Token-System.

---

## Umsetzungs-Reihenfolge (wenn als Loop gefahren)

1. **#1 Motion-Tokens + `t-hover`** (Fundament — alle anderen Hover-Fixes hängen dran)
2. **#2 Eyebrow** + **#6 Type-Contrast** (reine CSS/Klassen, kein Risiko)
3. **#3 Focus** + **#5 Hover-Flächen** (States flächendeckend)
4. **#7 Reveal-Stagger** + **#4 Spacing-Auftakt** (Rhythmus & Choreografie)
5. **#8 Nav-Active** (mittlerer Aufwand, höchster „Profi-merkt's"-Effekt) — zuletzt, isoliert testbar
6. Backlog-Funde nach Bedarf, dann Build + visuelles QA gegen die qa-*.png erneut.
