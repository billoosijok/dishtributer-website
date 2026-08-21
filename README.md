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
Pages, served at the custom domain in `public/CNAME` (dishtributer.com). GitHub Pages must be
configured in the repo settings to build from **GitHub Actions**.

## Content still needed

The following are placeholders pending real content from the team:

- Hero, booking-detail and guest-screen product screenshots
- Testimonial quotes, names, restaurants and headshots (currently 2 placeholder quotes)
- Pricing figures for the Single site and Group tiers
