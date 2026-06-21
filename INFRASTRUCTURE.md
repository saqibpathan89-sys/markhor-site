# Markhor — infrastructure

Everything this site needs to run, in one place. It's a static site, so the "infrastructure" is deliberately small and cheap.

## Hosting & deploy

| Piece | What | Where |
|---|---|---|
| **Live site** | Static HTML/CSS/JS, no build step | GitHub Pages |
| **URL** | `https://saqibpathan89-sys.github.io/markhor-site/` | (swap for `markhor.pk` at launch) |
| **Repo** | `saqibpathan89-sys/markhor-site`, branch `main` | GitHub |
| **CI/CD** | Every push to `main` auto-deploys | `.github/workflows/deploy.yml` (GitHub Actions → Pages) |

**To update the live site:** edit files, then
```bash
git add -A && git commit -m "..." && git push origin main
```
The Actions workflow rebuilds and deploys in ~1 minute. Watch it under the repo's **Actions** tab.

## Forms (early-access + federation briefing)

- Backend: **FormSubmit** (`formsubmit.co`) — free, no server, delivers submissions by email.
- Destination inbox: set in `FORM_ENDPOINT` near the bottom of `index.html` and `federations.html`
  (currently `saqibpathan89@gmail.com`).
- **One-time activation:** the first time a form is used, FormSubmit emails that address an *"Activate Form"* link. Click it once and submissions start arriving. Until then, the form shows success but doesn't deliver.
- **To change the destination:** swap the email in both `FORM_ENDPOINT` constants, push, and click the new activation email.
- **To hide the email from page source:** after activating, FormSubmit can give you a random alias (`formsubmit.co/ajax/<random>`); paste that into the two constants instead of the raw email.

## Fonts

Self-hosted in `assets/fonts/` (Bodoni Moda, Hanken Grotesk, JetBrains Mono), loaded via `assets/fonts/fonts.css`. No Google Fonts / third-party request — so no font-related consent banner is needed.

## Analytics (optional, off by default)

A commented, cookieless **Plausible** snippet sits at the bottom of `index.html`. Uncomment it and set your domain to enable basic analytics — still no cookie banner required. (Plausible needs a free account; nothing tracks visitors until you enable it.)

## Third parties at runtime

- **FormSubmit** — only when a form is submitted.
- **YouTube** (`youtube-nocookie.com`) — only when a visitor taps a video in the "See it for yourself" gallery (click-to-play facade; nothing loads from YouTube before that).
- **open.er-api.com** — a single keyless call for the live USD→PKR rate shown in the wallet section (fails silently to a static value).

Everything else (fonts, icons, images, video) is first-party and self-hosted.

## Go-live with the real domain

1. Buy/point the domain (e.g. `markhor.pk`).
2. Add a `CNAME` file at the repo root containing the domain, or set it under repo **Settings → Pages → Custom domain**.
3. Find-and-replace the preview URL / `markhor.pk` placeholders in: `index.html`, `federations.html`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt` (canonical + Open Graph URLs).
4. Push. GitHub provisions HTTPS automatically.

## Files of note

```
.github/workflows/deploy.yml   CI/CD (auto-deploy on push)
.well-known/security.txt       security contact
.nojekyll                      serve dotfiles/folders as-is
netlify.toml                   headers/caching (only used if you ever host on Netlify)
robots.txt / sitemap.xml       SEO
site.webmanifest               installable PWA metadata
README.md                      overview
INFRASTRUCTURE.md              this file
```
