# FIDELITY & QUALITÄTS-CHECKLISTE — Erben Bau 1:1-Rebuild

> Prüfbare Akzeptanz-Checkliste für den Rebuild der Microsite (Original: erben-bau.de, Webflow).
> Ziel-Stack: **Astro v5 + Tailwind v4 (CSS-first `@theme`)**, **Satoshi** (Fontshare), flach,
> Brand-Blau `#1142d4` + Schwarz `#141212` + Beige `#f3efe7` + Weiß `#ffffff`.
> Spätere Live-Domain: `erbenbau.voyagedigital.de` (**noindex**).
>
> **Quellen der Wahrheit:**
> - Roh-HTML: `02_KNOWLEDGE-BASE/_raw/{home,kontakt,impressum,datenschutz}.html` (Struktur/Reihenfolge/img/alt/Klassen)
> - Bereinigt: `02_KNOWLEDGE-BASE/00_core/*.md` + `README.md`
> - Design: `01_BRAND/erben-bau_brand_design-system.md` + `design-extract/erben-bau-de-design-language.md` + `…-variables.css`
> - Screenshots: `03_WEBSITE-TECH/screenshots/{01_home_full_1440,01_home_full_mobile390,02_kontakt_full_1440,03_impressum_full_1440,04_datenschutz_full_1440}.png`
> - Assets: `03_WEBSITE-TECH/images/`
> - Kontext: `00_COMPANY/research/erben-bau_research_{company,founder}.md`
>
> **Prüf-Konvention:** Jede Box hat eine Quelle (S = Screenshot, HTML = Roh-HTML, DS = Design-System, REF = Original-URL).
> Jeder QA-Agent vergleicht Build gegen die genannte Quelle und hakt nur bei echter Übereinstimmung ab.
> **PASS-Schwelle:** Alle `[CRITICAL]` müssen grün sein. ≥ 95 % aller Boxen grün = Acceptance.

---

## 0. VOLLSTÄNDIGKEIT (Seiten & Routen)

- [ ] `[CRITICAL]` 5 Routen gebaut: `/` (home), `/kontakt`, `/impressum`, `/datenschutz`, `/ueber-uns` (REF: 4 Original-Pages + 1 neu; `README.md` „4 echte URLs" + `/ueber-uns` war 404)
- [ ] `/ueber-uns` existiert und liefert HTTP 200 (Original = 404; im Rebuild MUSS sie real sein, da aus Nav, Footer und „Weitere Infos"-Button verlinkt)
- [ ] Keine weiteren Phantom-Seiten erfunden (keine ausgearbeiteten Service-Unterseiten — Original hat nur Nav-Anchors, kein Baukoordination/Bausicherheit/Wachstumspartner-Detailseiten)

---

## 1. VISUELLE TREUE (vs Original-Screenshots)

### 1.1 Sektions-Reihenfolge Startseite (S: 01_home_full_1440 / HTML: home.html)
Reihenfolge oben → unten exakt einhalten:
- [ ] `[CRITICAL]` 1. **Nav** (dunkel, fixed/sticky, Logo links)
- [ ] `[CRITICAL]` 2. **Hero** — Foto-Hintergrund + Dunkel-Gradient, „Erben Baukoordination" (H1) / „Alle Dienstleister aus einer Hand" (H2) / Subline / 2 Buttons
- [ ] 3. **„Was macht Erben Services so besonders?"** — Zentrierter Eyebrow-Text auf weiß
- [ ] `[CRITICAL]` 4. **Intro / Über-Uns-Teaser links** — Eyebrow „ÜBER UNS", H2 „Gemeinsam vor Ort & digital", Text, Button „Kontakt aufnehmen", Bild rechts (worker-at-laptop)
- [ ] `[CRITICAL]` 5. **About** — Bild links (Billboard/Glasfassade), Eyebrow „ÜBER UNS", H2 „Warum wir tun was wir tun", Text, Button „Weitere Infos"
- [ ] `[CRITICAL]` 6. **Work-Gallery** — großes EB-Logomark zentriert + 5-Bild-Composition (top-left, center, top-right, bottom-left, bottom-right)
- [ ] `[CRITICAL]` 7. **Rezensionen** — schwarzer/beiger Block, Eyebrow „KUNDEN VERTRAUEN AUF ERBEN BAU", H2 „REZENSIONEN", Karussell mit Pfeilen
- [ ] `[CRITICAL]` 8. **Contact-Form** — dunkel, links „Beratungstermin vereinbaren" + Kontaktdaten, rechts Formular
- [ ] `[CRITICAL]` 9. **Footer** — dunkel, 4 Legal-Links zentriert
- [ ] Cookie-Banner erscheint overlay (nicht in Section-Flow, aber sichtbar; S: mobile zeigt „Cookie Settings"-Banner oben)

### 1.2 Hero (S: 01_home_full_1440, oben)
- [ ] `[CRITICAL]` Hero zeigt Foto-Hintergrund (renoviertes Interieur, Treppe/Holz — Original: `david-kristianto-5Cczp_vIx8c-unsplash`)
- [ ] `[CRITICAL]` Dunkler Verlauf über dem Foto: `linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5))` (DS: design-language.md Gradients)
- [ ] Hero-Text linksbündig, weiß; H1 + H2 + Subline klar lesbar über dem Foto
- [ ] Zwei Buttons nebeneinander: „Kontakt" (gefüllt blau) + „Beratungstermin" (quartiär/outline)

### 1.3 Farben exakt (DS: brand_design-system.md + variables.css)
- [ ] `[CRITICAL]` Brand-Blau Buttons/Akzente = `#1142d4` (RGB 17,66,212)
- [ ] `[CRITICAL]` Schwarz Nav/Footer/Dark-Sections/Text = `#141212` (dominanteste Farbe)
- [ ] `[CRITICAL]` Beige warmer Sektions-Hintergrund (Rezensionen) = `#f3efe7`
- [ ] `[CRITICAL]` Weiß-Flächen = `#ffffff`
- [ ] Hover/dunkler Blau = `#103ab6` (optional, für Button-Hover)
- [ ] Keine fremden Akzentfarben eingeführt (kein zusätzliches Grün/Lila/Gradient außer dem Hero-Overlay)

### 1.4 Typografie (DS)
- [ ] `[CRITICAL]` **Satoshi** auf ALLEN Text-Elementen (eine Schrift, self-hosted via Fontshare; Weights 300–900)
- [ ] Headings Sentence-case, tight letter-spacing (≈ −1px bei großen Sizes)
- [ ] Große H2 ≈ 76.8px / 4.8rem (z.B. „REZENSIONEN", „Beratungstermin vereinbaren") — fluid via clamp ok
- [ ] Body 14px / weight 500 / line-height 21px
- [ ] Kein Fallback-Systemfont sichtbar (FOUT akzeptabel, aber Satoshi MUSS laden)

### 1.5 Spacing, Radien, Material (DS)
- [ ] Spacing-Rhythmus basiert auf 2px-Einheit; großzügige Section-Abstände (Stufen 32/48/64/80/110/128/150px)
- [ ] `[CRITICAL]` Border-Radius Buttons/Inputs = **2px** (`--radius-xs`); Pills/Arrows = 100px
- [ ] `[CRITICAL]` **Flacher Look** — keine starken Schatten; höchstens soft `rgba(51,51,51,0.1) -1px 1px 4px`
- [ ] Bilder `object-fit: cover`, square (radius 0), portrait-dominant
- [ ] Inputs: weiß, Border `#cccccc`, padding 8×12, radius 0 (Original-Inputs sind radius 0, nicht 2px — verbatim)

### 1.6 Nav & Footer (S + HTML)
- [ ] `[CRITICAL]` Nav dunkel (`#141212` / `#00061d`), Logo „ERBEN"-Wordmark links (weiß), 4 Text-Links + blauer „Kontakt"-Button rechts
- [ ] Nav-Links: Baukoordination · Bausicherheit · Wachstumspartner · Über Uns (Reihenfolge exakt)
- [ ] `[CRITICAL]` Footer dunkel `#141212`, **4 Links** zentriert: „Erben Services © 2025" · „Datenschutz u. Rechtsgrundlagen" · „Impressum" · „Kontakt"
- [ ] Footer-Textfarbe hell (`#f4f4f4`), 14px

---

## 2. INHALTSTREUE (verbatim Text)

### 2.1 Startseite Headings/Sublines (HTML home.html — verbatim, inkl. Zeilenumbrüche)
- [ ] `[CRITICAL]` H1 Hero: „Erben Baukoordination"
- [ ] `[CRITICAL]` H2 Hero: „Alle Dienstleister aus einer Hand"
- [ ] Subline Hero: „Ein Ansprechpartner für alle Gewerke. Schnell, digital und persönlich vor Ort."
- [ ] Eyebrow: „WAS MACHT ERBEN SERVICES SO BESONDERS?"
- [ ] Eyebrow „ÜBER UNS" (2×, je Intro- und About-Sektion)
- [ ] `[CRITICAL]` H2: „Gemeinsam vor Ort & digital"
- [ ] Text: „Ob Baukoordination, Bausicherheit oder als Wachstumspartner für innovative Produkte und Dienstleistungen im Bau – wir begleiten, sichern und beschleunigen Ihre Bauprojekte als starker und transparenter Partner für private und gewerbliche Kunden."
- [ ] `[CRITICAL]` H2: „Warum wir tun was wir tun"
- [ ] Text: „Jedes einzelne Detail unserer Dienstleistungen wird an unserem kontinuierlichen Ziel gemessen: Die Zusammenarbeit im Bau konstant zu verbessern."
- [ ] Eyebrow: „KUNDEN VERTRAUEN AUF ERBEN BAU" + H2 „REZENSIONEN"
- [ ] H2 Contact: „Beratungstermin vereinbaren"
- [ ] „Kontaktieren Sie uns gerne!"
- [ ] Wordmark/Logo-Composition zeigt „ERBEN — GEMEINSAM BESSER BAUEN" (Logomark-Bild in Gallery)

### 2.2 Die 5 Rezensionen vollständig & verbatim (HTML — alle 5, exakte Anführungszeichen)
- [ ] `[CRITICAL]` 1: „Mit dem Team von Erben Services hatten wir endlich eine Instanz, die zwischen Bauherrn und Gewerken alles zusammenhält. Transparent, zuverlässig und absolut professionell."
- [ ] `[CRITICAL]` 2: „Das Erben Team hat Probleme erkannt, bevor sie überhaupt entstanden sind. So blieb die Baustelle stressfrei und das Ergebnis war erstklassig."
- [ ] `[CRITICAL]` 3: „Das Erben Team hat uns die komplette Koordination abgenommen. Alles lief reibungslos, und wir konnten uns voll auf das Projekt konzentrieren.." (doppelter Punkt verbatim aus Original)
- [ ] `[CRITICAL]` 4: „Dank dem Team von Erben können wir uns wieder voll auf unser Handwerk konzentrieren. Den ganzen administrativen Aufwand übernehmen sie professionell und effizient."
- [ ] `[CRITICAL]` 5: „Mit der Firma Erben als Partner haben wir unsere gesamten internen und externen Abläufe modernisiert und automatisiert, was uns zusätzliche Kapazitäten für neue Projekt geschaffen hat. Das hätten wir alleine nie erreicht." („Projekt" Singular verbatim)
- [ ] Rezensionen bleiben anonym (keine erfundenen Namen/Firmen — Kontext-Regel)

### 2.3 Kontaktdaten korrekt (HTML — alle Seiten)
- [ ] `[CRITICAL]` E-Mail: `info@erben-bau.de` (mailto-Link, Home-Variante mit `?subject=Anfrage%3A`)
- [ ] `[CRITICAL]` Telefon: „+49 160 45 25 935" angezeigt, `tel:+491604525935` im href
- [ ] `[CRITICAL]` Google-Calendar Beratungstermin-Link vorhanden (verbatim URL: `https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3mSeSUNX1Y0Ddx15WUzG8q0enFHNT9Y9nkOn6Ooz78oN4aIrP346JlV6vsufMnr3_vrbd6NV0z`), `target="_blank"`
- [ ] Beratungstermin-Link an allen Original-Stellen: Hero, Intro-Button, Contact-Section (3×)

### 2.4 Kontaktformular-Inhalt (HTML home.html + kontakt.html — verbatim)
- [ ] Felder & Reihenfolge: Name* / Email* / Unternehmen / Telefon / Ihr Anliegen* (Textarea)
- [ ] Placeholders verbatim: „Name eingeben", „@", „Unternehmensname", „Telefonnummer eingben" (Tippfehler verbatim), Anliegen leer
- [ ] Required-Felder: Name, Email, Ihr Anliegen, Consent-Checkbox
- [ ] Consent-Text verbatim inkl. „**Erben Services UG**" (bold) + Link „Datenschutzerklärung" → `/datenschutz`
- [ ] Submit-Button-Text: „Jetzt senden"; data-wait-Pendant „Bitte warten…"
- [ ] Success-Text verbatim: „Vielen Dank für die Anfrage! Ein Mitglied des Erben Bau Teams wird sich umgehend bei Ihnen melden."
- [ ] Error-Text verbatim: „Ups! Da ist wohl etwas schief gelaufen. Bitte versuchen Sie es nochmal."

### 2.5 Impressum Volltext 1:1 (impressum.md/HTML)
- [ ] `[CRITICAL]` „Erben Services UG", „Corneliusstr. 12" (im Impressum „Corneliussstr." verbatim aus Original), „D-80469 München"
- [ ] E-Mail + „Website: www.erben-bau.de"
- [ ] Geschäftsführung: „Cihan Erben"
- [ ] `[CRITICAL]` „Amtsgericht München, HRB-Nummer HRB305895" — **verbatim aus Original übernehmen** (Original-Tippfehler; korrekt wäre 305965 lt. Research, aber 1:1-Rebuild = Original-Text behalten, NICHT eigenmächtig korrigieren)
- [ ] USt-IdNr „DE457731051"
- [ ] Blöcke vollständig: Haftung für Inhalte, Copyright, Haftungen für Links, Urheberrecht (alle Absätze verbatim)

### 2.6 Datenschutz Volltext 1:1 (datenschutz.md/HTML)
- [ ] `[CRITICAL]` Verantwortlicher „Erben Services UG (haftungsbeschränkt)", „Corneliusstr. 12", „D-80469 München"
- [ ] „Vertreten durch die Gesellschafter: Cihan Erben, Sebastian Schermer"
- [ ] „Stand: 01.11.2025"
- [ ] Alle 17 nummerierten Abschnitte vollständig & verbatim (1. Grundsätzliche Angaben … bis 17. Google Analytics), inkl. aller Drittanbieter-Listen (Google Fonts, Maps, YouTube, Instagram, LinkedIn, Twitter, Tumblr, XING, jQuery) und externer Links
- [ ] Keine Kürzung/Paraphrasierung des Rechtstextes

---

## 3. NEUE INHALTE korrekt (über-uns + Service-Sektionen)

### 3.1 /ueber-uns (neu, founder-led — Quelle: research_founder.md + research_company.md)
- [ ] `[CRITICAL]` Seite existiert, lädt, nutzt dasselbe Design-System (Nav/Footer/Farben/Satoshi)
- [ ] `[CRITICAL]` Founder-led: Cihan Erben namentlich präsent (Gründer/Geschäftsführer)
- [ ] Inhalt deckungsgleich mit verifizierten Fakten (München, Baukoordination/Bausicherheit/Digitalisierung, „Gemeinsam besser bauen")
- [ ] Keine unbelegten Behauptungen (keine erfundenen Projekte/Zahlen/Kundennamen; Stock-Bilder nicht als echte Referenzobjekte ausgeben)
- [ ] Messaging-Linie konsistent zu Cihans Haltung: „Bauen ist Teamsport", Vertrauen statt Kontrolle, Fehlerkultur, lernende Systeme (research_founder.md) — sofern Copy genutzt wird, faktisch korrekt

### 3.2 Service-Sektionen + Anchor-Nav
- [ ] `[CRITICAL]` 3 Service-Sektionen vorhanden: Baukoordination, Bausicherheit, Wachstumspartner
- [ ] `[CRITICAL]` Nav-Links auf diese 3 Services sind **funktionierende Anchor-Links** (kein `href="#"`-Toter-Link wie Original) — scrollen zur jeweiligen Sektion bzw. verlinken eine reale Sektion
- [ ] Anchor-Navigation funktioniert auch von Unterseiten zurück auf Home-Anchors (z.B. `/#baukoordination`) oder Sektionen liegen auf einer erreichbaren Seite
- [ ] Service-Inhalte fachlich korrekt zur Positionierung (Koordinator, führt NICHT selbst Gewerke aus; private + gewerbliche Bauherren) — keine GU-Behauptung

---

## 4. TECHNIK

### 4.1 Links & Navigation
- [ ] `[CRITICAL]` KEINE internen 404: alle Footer-Links (`/ueber-uns`, `/datenschutz`, `/impressum`, `/kontakt`) lösen auf
- [ ] „Weitere Infos"-Button → `/ueber-uns` (200, nicht 404 wie Original)
- [ ] „Erben Services © 2025"-Footer-Link → `/ueber-uns`
- [ ] Logo links verlinkt auf `/`
- [ ] `aria-current="page"` auf aktivem Nav-/Footer-Link je Seite
- [ ] Externe Links (Beratungstermin) öffnen `target="_blank"` mit `rel="noopener"`

### 4.2 Cookie-Consent
- [ ] `[CRITICAL]` Cookie-Banner erscheint beim ersten Besuch (Opt-in), Buttons „Ablehnen" / „Annehmen"
- [ ] Banner-Text verbatim („Wenn Sie auf ‚Akzeptieren' klicken …")
- [ ] Wahl wird persistiert (Reload zeigt Banner nicht erneut); Ablehnen blockt nicht-essentielle Cookies
- [ ] Preferences-/Manager-Button (Cookie-Einstellungen erneut öffnen) funktioniert
- [ ] Da Microsite noindex + keine echten Tracker: kein Google Analytics live geladen (Original-Datenschutz nennt GA, aber Rebuild lädt es nicht ungefragt)

### 4.3 Formular Success/Error
- [ ] `[CRITICAL]` Formular hat sichtbaren Success-State nach erfolgreichem Submit
- [ ] Formular hat sichtbaren Error-State bei Fehler
- [ ] Client-Validierung: required-Felder + Email-Format + Consent-Checkbox vor Submit geprüft
- [ ] Submit-Handler definiert (kein toter Webflow-`method=get` ins Leere — entweder echter Endpoint/Mailto-Fallback oder simulierter Success für Microsite, dokumentiert)

### 4.4 SEO / Indexierung
- [ ] `[CRITICAL]` `<meta name="robots" content="noindex, nofollow">` auf ALLEN Seiten
- [ ] `[CRITICAL]` `robots.txt` mit `User-agent: *` + `Disallow: /`
- [ ] `[CRITICAL]` Favicon gesetzt (ES-Logo, `256_ES_logo.png` / eigenes ICO) + apple-touch-icon
- [ ] `[CRITICAL]` Eindeutige `<title>` je Seite („Erben Bau: Home/Kontakt", „Impressum", „Erben Bau: Datenschutz")
- [ ] `[CRITICAL]` `<meta name="description">` je Seite (verbatim aus den `.md`-Frontmattern; Home + Kontakt + Datenschutz haben Originale, Impressum war leer → sinnvolle ergänzen)
- [ ] `lang="de"` auf `<html>`
- [ ] OG-Tags vorhanden (Verbesserung ggü. Original): `og:title`, `og:description`, `og:type=website`, `og:image`, `twitter:card=summary_large_image` (Kontakt-Original hatte OG/Twitter — auf alle Seiten ausrollen)
- [ ] `<meta charset>` + responsive viewport meta gesetzt

### 4.5 Build
- [ ] `[CRITICAL]` `astro build` (bzw. `npm run build`) exit 0, `dist/` generiert
- [ ] Gebautes HTML: keine Placeholder-Texte, keine kaputten Bild-Referenzen, keine `console.log`
- [ ] Keine ungenutzten Webflow-Artefakte (kein jQuery/GSAP-CDN von website-files.com geladen, falls nicht gebraucht)

---

## 5. RESPONSIVE (S: mobile390 vs 1440)

- [ ] `[CRITICAL]` 390px: kein horizontaler Overflow, kein abgeschnittener Content
- [ ] 768px: 2-Spalten-Sektionen brechen sauber auf 1 Spalte (Bild über/unter Text)
- [ ] 1440px: 2-Spalten-Layouts (Text+Bild) wie Original
- [ ] `[CRITICAL]` Mobile-Hamburger-Menü vorhanden, öffnet/schließt, zeigt Nav-Links + „Kontakt aufnehmen" (S: mobile zeigt Burger oben rechts)
- [ ] Touch-Targets ≥ 44×44px (Buttons, Nav-Links, Burger, Karussell-Pfeile)
- [ ] Hero-Text auf mobile lesbar über Foto (Gradient stark genug); Buttons stapeln sauber
- [ ] Gallery-Composition reflowt auf mobile ohne Bild-Verzerrung
- [ ] Rezensions-Karussell auf mobile bedienbar (swipe / Pfeile)
- [ ] Geprüfte Breakpoints: 390 / 768 / 1024 / 1440 (kein Overflow auf keinem)

---

## 6. A11Y

- [ ] `[CRITICAL]` Farbkontrast AA: Weiß auf `#1142d4` (7.63:1 ✓), Text auf Dark/Beige/Weiß alle ≥ 4.5:1 (DS: 17/17 Paare AA/AAA)
- [ ] `[CRITICAL]` Sichtbarer Fokus-Indikator auf allen interaktiven Elementen (Links, Buttons, Inputs, Burger, Karussell-Pfeile)
- [ ] `[CRITICAL]` Alle Bilder haben sinnvolle `alt`-Texte (verbatim/äquivalent zu HTML: „Erben Bau Logo White", „Erben Bau Close up worker…", Gallery-Alts; dekorative Icons `alt=""`)
- [ ] Semantisches HTML: `<header><nav>`, `<main>`, `<section>`, `<footer>`, eine `<h1>` pro Seite
- [ ] `aria-label` auf Nav („Main navigation"), Burger-Button (`aria-expanded`/`aria-controls`), Karussell (role/aria-label, Pfeile beschriftet), Cookie-Banner (`role`/`aria-label`)
- [ ] `[CRITICAL]` Vollständige Tastatur-Navigation: Tab-Reihenfolge logisch, Menü + Karussell + Formular + Cookie-Banner per Tastatur bedienbar, kein Keyboard-Trap
- [ ] Formular: `<label>` korrekt mit Inputs verknüpft (`for`/`id`), required als `aria-required`/visuell `*`
- [ ] `[CRITICAL]` `prefers-reduced-motion`: Scroll-/Hover-Animationen + Karussell-Autoplay respektieren Reduced-Motion (keine erzwungene Bewegung)

---

## 7. PERFORMANCE (Web-Rules: CWV + Bundle)

- [ ] `[CRITICAL]` Alle Bilder als **WebP** (lokale Assets aus `images/` nutzen, keine website-files.com-Hotlinks)
- [ ] `[CRITICAL]` Jedes `<img>` hat explizite `width`+`height` (kein CLS)
- [ ] `[CRITICAL]` Below-the-fold-Bilder `loading="lazy"` (Gallery, About-Bilder, Intro-Bild)
- [ ] `[CRITICAL]` Hero-Bild `loading="eager"` + `fetchpriority="high"` (LCP-Kandidat)
- [ ] `srcset`/`sizes` für responsive Bilder (Original liefert p-500/800/1080/… Varianten — nachnutzen)
- [ ] Satoshi: nur kritische Weights preloaden, `font-display: swap`, self-hosted (kein Render-Block)
- [ ] `[CRITICAL]` Keine Render-Blocker: kritisches CSS inline/oben, JS deferred; kein synchrones jQuery/GSAP von CDN
- [ ] Bundle-Budget Microsite: JS < 80kb gz, CSS < 15kb gz (Web-Performance-Rule)
- [ ] Nur Motion auf compositor-friendly Properties (transform/opacity), kein Layout-Thrashing
- [ ] Lighthouse Microsite: LCP < 2.5s, CLS < 0.1, keine kritischen Fails

---

## 8. CROSS-CHECK ABSCHLUSS (QA-Sign-off)

- [ ] Side-by-side Screenshot-Diff Home (Rebuild 1440 + 390) vs `01_home_full_1440.png` / `01_home_full_mobile390.png` — Sektionsreihenfolge, Farben, Spacing match
- [ ] Side-by-side `/kontakt` vs `02_kontakt_full_1440.png`
- [ ] Side-by-side `/impressum` vs `03_impressum_full_1440.png`
- [ ] Side-by-side `/datenschutz` vs `04_datenschutz_full_1440.png`
- [ ] Alle `[CRITICAL]`-Boxen grün
- [ ] Verbleibende offene Boxen dokumentiert mit Begründung (Known-Deviations-Liste)
