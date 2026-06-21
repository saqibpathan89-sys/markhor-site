# Markhor — public website

A static, dependency-free public site for **Markhor — The National Operator, Pakistan**.
Single-page product site (`index.html`) plus legal pages, all plain HTML/CSS/JS. No build step.

## Structure

```
site/
├── index.html            # the product site (hero, markets, how-it-works, tabs, FAQ, waitlist)
├── 404.html              # custom not-found page
├── terms.html            # Terms of Use
├── privacy.html          # Privacy Policy (covers the waitlist email capture)
├── risk.html             # Risk Disclosure
├── site.webmanifest      # PWA manifest
├── robots.txt
├── sitemap.xml
├── netlify.toml          # headers, caching, 404 (only used if deploying to Netlify)
└── assets/
    ├── img/              # logo, favicons, app icons, og.png (social share)
    └── video/            # 7 brand b-roll clips (markhor ridge, javelin, etc.)
```

## Go live — checklist

1. **Pick the domain.** This build uses `https://markhor.pk` as a placeholder. Before launch, find-and-replace `markhor.pk` with your real domain in:
   - `index.html` (canonical + Open Graph/Twitter URLs and the og:image URL)
   - `robots.txt`, `sitemap.xml`
2. **Deploy the `site/` folder** to any static host:
   - **Netlify (recommended):** drag the `site/` folder onto app.netlify.com, or connect the repo with publish dir = `site`. `netlify.toml` is already set up.
   - **Vercel / Cloudflare Pages / GitHub Pages / S3:** upload the `site/` folder as-is (it's all static).
3. **Point your domain** at the host (DNS), then enable HTTPS (automatic on Netlify/Vercel/Cloudflare).
4. **The waitlist** is pre-wired for **Netlify Forms** (form name: `waitlist`). On Netlify it captures submissions automatically — see them under *Forms* in the dashboard, and add a notification email. On other hosts, point the form at your provider (Formspree, Basin, your API) by changing the `fetch('/')` target in `index.html`.

## Before a real launch (not code — content/legal)

- The **legal pages are honest pre-launch placeholders.** Have counsel review/replace `terms.html`, `privacy.html`, `risk.html` before offering any instrument.
- Market cards are clearly **illustrative** (labelled on-page). Swap in real, approved instruments only once they exist under the PVARA–SECP sandbox.
- Replace the placeholder **`hello@`-style contact** (currently the on-page form) with a monitored channel.

## Notes

- **Fonts are self-hosted** (Bodoni Moda, Hanken Grotesk, JetBrains Mono — woff2 in `assets/fonts/`, loaded via `assets/fonts/fonts.css`). No Google Fonts / third-party request, so no font-related consent banner is needed.
- **No tracking, no cookies** out of the box. A commented Plausible (privacy-friendly, cookieless) snippet sits at the bottom of `index.html` — uncomment and set your domain to enable basic analytics, still no cookie banner required. If you add a cookie-based tracker later, add a consent notice then.
- Favicons, app icons and the 1200×630 social image (`assets/img/og.png`) were generated from the brand logo.
- `film.html` is an unused brand-film page (not linked from the site); delete it if you don't want it deployed.
