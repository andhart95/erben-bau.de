# Go-Live-Runbook — erben-bau.de (Astro-Microsite)

> ## ✅ GO-LIVE VOLLZOGEN — 2026-06-10
> www.erben-bau.de liefert die neue Site (TLS valide, Wildcard-Cert `*.erben-bau.de`). Gewählter Weg: **NS-Delegation zu Netlify DNS** (dns1–4.p05.nsone.net) statt Einzel-Record-Switch — alle Strato-Records (MX Google, SPF, DKIM `cemsc._domainkey`, DMARC, Verifications) wurden 1:1 in die Netlify-Zone übernommen, Mail lief unterbrechungsfrei. `X-Robots-Tag` aus `_headers` entfernt, Site indexierbar. **CI-Deploy aktiv:** Netlify-Projekt `erben-bau` baut aus `andhart95/erben-bau-site` (main, `npm run build` → `dist`) — Deploys ab jetzt per `git push`, nicht mehr manuell. **Formular-Mails: eigene Function (`netlify/functions/kontakt-mail.mjs`) + Resend** — Domain erben-bau.de in Resend verifiziert (EU-Region), Absender formular@erben-bau.de, Empfänger info@erben-bau.de + a.hartenfels@voyagedigital.de, `reply_to` = Besucher. Grund: Netlifys komplettes Event-System (E-Mail-Notifications UND `submission-created`-Trigger) feuert auf diesem Team nachweislich nicht (stiller Block, Support-Ticket optional). Das Formular-Script ruft die Function direkt nach dem Forms-POST auf → Mail unabhängig von Netlify-Events und Akismet (eigener Honeypot-Check in der Function), Submissions bleiben zusätzlich im Dashboard. E2E browser-getestet, Resend-Status `delivered` an beide. Env-Var `RESEND_API_KEY` (production); Key lokal in `~/.claude/secrets/resend-erbenbau-api-key.txt`. Resend-DNS (DKIM `resend._domainkey`, MX+SPF auf `send.erben-bau.de`) in der Netlify-Zone — kollidiert nicht mit der Google-Mail der Root-Domain.
> **Noch offen (Post-Launch):** GSC/Bing-Property + Sitemap einreichen · Datenschutz-Rechtstext (GA-Abschnitt, fehlender Abschn. 3) durch Betreiber · Webflow mind. 30 Tage als Rollback behalten · Indexierungs-Check nach 7 Tagen.

Stand: 2026-06-10 · Gilt für `04_REBUILD/` · Ziel: Ablösung der Webflow-Site auf www.erben-bau.de

---

## 1. Ist-Zustand

Die Astro-5-Site läuft als Demo auf https://erbenbau.voyagedigital.de — Netlify-Site `erbenbau-voyage` (ID `399e68c5-d737-49a9-811f-adf84f70a102`), davor Cloudflare-CNAME `erbenbau` (Zone voyagedigital.de, proxied). Deploys laufen bislang manuell aus `dist/` (Netlify-MCP `deploy-site`); ein GitHub-Repo mit CI-Deploy ist noch nicht eingerichtet. Die Produktivdomain www.erben-bau.de zeigt aktuell auf Webflow (`www` → CNAME `cdn.webflow.com`, Apex → A `198.202.211.1`, 301 Apex→www); DNS liegt bei **Strato** (NS `shades03.rzone.de` / `docks07.rzone.de`) — **nicht in unserer Hand**.

## 2. Pre-Flight-Checkliste (Code)

Der Code ist seit Commit `09aaee6` ("go-live prep") weitgehend produktionsfertig — alle URLs leiten sich aus `Astro.site` ab:

- [x] `astro.config.mjs:7` — `site: 'https://www.erben-bau.de'` bereits gesetzt (nichts umzustellen).
- [x] noindex-Mechanik (Stand 2026-06-10, Launch-Session): Demo-Schutz aktiv via `X-Robots-Tag: noindex, nofollow` in `public/_headers` (erste Header-Zeile unter `/*`, mit Kommentar markiert). Zusätzlich tragen `/impressum/` und `/datenschutz/` ein seitenlokales `noindex, follow` (Layout-Prop), das auch nach Launch bleiben soll.
  - [ ] ⚠️ **GO-LIVE-PFLICHTSCHRITT:** Die `X-Robots-Tag`-Zeile in `public/_headers` ENTFERNEN, bevor www.erben-bau.de auf diese Netlify-Site zeigt — derselbe Build bedient sonst die Produktivdomain mit noindex.
- [x] Canonical + OG-URLs: `Layout.astro:18` (canonical), `:19` (og:image), `:85` + `:91–101` (Meta-Tags) — alle aus `Astro.site` → zeigen bereits auf www.erben-bau.de. Kein Edit nötig.
- [x] JSON-LD: `Layout.astro:22` (`siteUrl`) ebenfalls aus `Astro.site`.
- [x] `public/robots.txt` — `Allow: /` + Sitemap-Verweis auf `https://www.erben-bau.de/sitemap-index.xml`. Korrekt.
  - [ ] Hinweis: Auf der Demo injiziert Cloudflare aktuell einen "Managed Content"-Block (AI-Crawler-Disallows) in die robots.txt. Das ist ein Zonen-Feature von voyagedigital.de und wandert **nicht** mit auf die Kundendomain — falls gewünscht, dort separat aktivieren.
- [x] `llms.txt` angelegt (`public/llms.txt`, 2026-06-10): Unternehmensprofil, Leistungen, Stammdaten, Seitenliste — zeigt auf www.erben-bau.de, launch-ready.
- [x] `robots.txt` erweitert (2026-06-10): AI-Suchcrawler (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) explizit erlaubt, Bytespider blockiert.
- [ ] ⚠️ **Rechtstext-Blocker (mit Betreiber klären, nicht eigenmächtig ändern):** `src/content/datenschutz-body.html` (1:1 vom Webflow-Original) nennt in Abschnitt 17 Google Analytics — die Site lädt aber kein GA (DSGVO-Widerspruch); Abschnitt 3 fehlt komplett (Sprung 2→4); Abschnitt 8 (Blog/Kommentare) beschreibt nicht existierende Funktionen. Vor Launch vom Betreiber aktualisieren lassen (z. B. Datenschutz-Generator).
- [ ] Frischer `npm run build` (exit 0) + Sichtprüfung `dist/`: canonical/OG/Sitemap-URLs zeigen auf www.erben-bau.de, keine voyagedigital-Referenzen (`grep -r voyagedigital dist/`).
- [x] GitHub-Repo eingerichtet: `andhart95/erben-bau-site` (privat, branch `main`). 
  - [ ] Offen: CI-Deploy aus git (Netlify-Site mit Repo verknüpfen) — vor Go-Live empfohlen, damit Launch-Stand reproduzierbar ist.

## 3. Domain-Switch

### 3.1 Netlify vorbereiten
- [ ] Netlify-Site `erbenbau-voyage`: Custom Domain `www.erben-bau.de` als **Primary Domain** hinzufügen, `erben-bau.de` als Alias (Netlify legt Apex→www-Redirect automatisch an).
- [ ] Let's-Encrypt-Zertifikat provisionieren lassen (geht erst durch, wenn DNS zeigt — siehe 3.3; bei Vorab-Validierung ggf. DNS-Challenge nutzen).
- [ ] Demo-Domain `erbenbau.voyagedigital.de` zunächst als Alias behalten (Rollback-/Vergleichspfad), nach stabiler Woche entfernen oder per Redirect auf die Hauptdomain legen (Duplicate Content vermeiden).

### 3.2 Webflow ablösen
- [ ] **Offener Punkt:** Zugänge klären — Strato-DNS und Webflow-Account liegen vermutlich beim Domaininhaber, nicht bei uns. Ohne diese Zugänge kein Switch.
- [ ] In Webflow: Custom Domain erst **nach** erfolgreichem DNS-Switch entfernen, Site nicht löschen (Rollback-Reserve, mind. 30 Tage).

### 3.3 DNS umstellen (bei Strato)
Optionen, abhängig davon, was der DNS-Inhaber zulässt:
- [ ] **Option A (minimal-invasiv, Strato bleibt):** `www` → CNAME `erbenbau-voyage.netlify.app`; Apex → A `75.2.60.5` (Netlify Load Balancer; Strato kann kein ALIAS/ANAME am Apex). Apex→www-Redirect übernimmt Netlify.
- [ ] **Option B (sauberer, mehr Aufwand):** Domain-DNS in eine eigene Cloudflare-Zone migrieren (NS-Wechsel beim Registrar) → CNAME-Flattening am Apex, Proxy/Caching wie bei der Demo. Erfordert Mitwirkung des Domaininhabers.
- [ ] Vorher TTL der betroffenen Records auf 300 s senken (falls Strato-UI das hergibt), Switch zu verkehrsarmer Zeit.
- [ ] Nach Switch: `dig www.erben-bau.de` + `curl -I https://www.erben-bau.de/` (200, Netlify-Header `x-nf-request-id`), SSL grün, Apex-Redirect prüfen.

### 3.4 Redirect-Plan (Webflow-URLs)
Geprüft per curl (2026-06-10) auf www.erben-bau.de:

| Pfad | Webflow heute | Rebuild | Maßnahme |
|---|---|---|---|
| `/` | 200 | ✅ vorhanden | keine |
| `/kontakt` | 200 | ✅ vorhanden | keine |
| `/impressum` | 200 | ✅ vorhanden | keine |
| `/datenschutz` | 200 | ✅ vorhanden | keine |
| `/ueber-uns` | 404 | ✅ **neu** | keine (Gewinn, kein Redirect nötig) |
| `/galerie` | 404 | — (Galerie auf `/`) | keine |

- [x] Alle indexierbaren Webflow-URLs existieren 1:1 im Rebuild → **keine `_redirects`-Regeln nötig.** Nur Apex→www (macht Netlify) und http→https (macht Netlify) sicherstellen.

## 4. Post-Launch

- [ ] Google Search Console: Property `https://www.erben-bau.de` anlegen (Domain-Property ideal, braucht DNS-TXT → wieder Strato-Abhängigkeit; sonst URL-Prefix-Property).
- [ ] Bing Webmaster Tools: Site anlegen (Import aus GSC möglich).
- [ ] Sitemap einreichen: `https://www.erben-bau.de/sitemap-index.xml` (GSC + Bing).
- [ ] Live-Smoke: alle 5 Seiten 200, OG-Preview (z. B. opengraph.xyz), JSON-LD via Rich-Results-Test.
- [ ] **Nach 7 Tagen:** Indexierungs-Check — `site:erben-bau.de` + GSC-Abdeckungsbericht; prüfen, dass die Demo-Subdomain nicht (mehr) indexiert ist.
- [ ] Lighthouse-Re-Check auf der Live-Domain (Performance/SEO/A11y, mobile + desktop) — offener Backlog-Punkt aus `.continue-here.md` gleich miterledigen.
- [ ] Netlify-Forms-Check auf der neuen Domain (Kontaktformular-Submission end-to-end, offener Backlog-Punkt).

## 5. Rollback-Plan

Bei kritischen Problemen DNS bei Strato zurückdrehen: `www` → CNAME `cdn.webflow.com`, Apex → A `198.202.211.1` — die Webflow-Site bleibt bis dahin unverändert publiziert und ist nach DNS-Propagation (TTL) wieder live. Deshalb: Webflow-Custom-Domain/Site frühestens 30 Tage nach stabilem Betrieb entfernen.

---

**Offene Abhängigkeiten (Blocker):** Strato-DNS-Zugang (Domaininhaber) · Webflow-Zugang · Datenschutz-Rechtstext aktualisieren (Betreiber) · CI-Deploy aus git (optional, empfohlen) · Go-Live-Pflichtschritt: `X-Robots-Tag`-Zeile aus `public/_headers` entfernen.
