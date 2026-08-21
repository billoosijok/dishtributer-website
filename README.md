# Dishtributer website

The public marketing site for [Dishtributer](https://dishtributer.com) — pre-orders, referrals
and reviews for restaurants. Built with [Astro](https://astro.build) and deployed to GitHub Pages.

Implements the homepage from the `design/` folder's Claude Design handoff (turn 4, option 4a):
glass-morphism hero, accent-green "how it works" section with custom seams, a scrolling feature
ticker, and placeholder slots for screenshots, testimonials and pricing pending real content.

## Development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build      # outputs to dist/
npm run preview
```

## Deployment

Pushes to `main` build and deploy automatically via `.github/workflows/deploy.yml` to GitHub
Pages. GitHub Pages must be configured in the repo settings to build from **GitHub Actions**.

The build emits **document-relative** asset paths (`./_astro/...`) via the `relative-asset-paths`
integration in `astro.config.mjs`, so one artifact works at any mount point:

- the project URL - `https://billoosijok.github.io/dishtributer-website/` (current)
- an apex custom domain - `https://dishtributer.com/` (planned)

Do not add a hardcoded `base` to the Astro config: it would fix one of those URLs and break the other.

### Custom domain

There is deliberately **no `CNAME` file**. Adding `public/CNAME` makes every Actions deploy
re-assert the custom domain, which overrides changes made in the Pages UI. To switch to
dishtributer.com: point DNS at GitHub Pages first, then add `public/CNAME` containing
`dishtributer.com` in a single commit. `site:` in the Astro config is already set to that domain
and only affects generated absolute URLs (canonical, sitemap), not asset paths.

## Content still needed

The following are placeholders pending real content from the team:

- Hero, booking-detail and guest-screen product screenshots
- Testimonial quotes, names, restaurants and headshots (currently 2 placeholder quotes)
- Pricing figures for the Single site and Group tiers
