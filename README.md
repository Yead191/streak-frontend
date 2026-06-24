## Streak — landing experience

A single-page, scroll-driven promo site for **Streak**, a live-events platform.
Built as an immersive "dig deeper" journey: the logo emerges from the soil, the
mycelium network draws itself into the ground as you scroll, brand messages
light up along the way, the manifesto reveals, and the page bottoms out at a
**Coming soon** call to action with email capture.

> Slogan: _rooted in community_ · Palette: orange, green, white, black ·
> Mood: simple, mysterious, controlled, edgy, mystical.

### Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for layout utilities
- **GSAP 3.13** + **ScrollTrigger** for scroll-linked animation (all free now)
- **Lenis** for smooth inertia scrolling, synced to GSAP's ticker
- `@gsap/react` `useGSAP` for safe animation lifecycle in React

No paid/Club GSAP plugins are used. Roots "draw" with native SVG
`stroke-dashoffset`, so the whole thing runs on the free `gsap` package. If you
later want `DrawSVGPlugin` / `MorphSVGPlugin` (now free too) you can swap them in.

### Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production
```

### Scroll model (why it's not "scroll-jacked")

Native scroll stays fully intact — scrollbar, keyboard, anchors, accessibility.
Lenis only adds inertia/easing; GSAP `ScrollTrigger` with `scrub` ties each
animation to scroll *position*, not to hijacked snapping. This gives the
"controlled, mystical" feel without the usual scroll-jacking downsides
(broken accessibility, janky mobile, poor INP/SEO). `prefers-reduced-motion`
is respected everywhere: inertia is disabled and scrubbed reveals become
instant final states.

### Structure

```
app/
  layout.tsx            fonts, metadata, providers, audio toggle
  page.tsx              Hero → Descent → Manifesto → ComingSoon
  globals.css           tokens, keyframes, glow helpers
components/
  providers/SmoothScrollProvider.tsx   Lenis + GSAP ticker sync
  scene/Hero.tsx        sky, clouds, trees, swaying grass, emerging logo
  scene/Descent.tsx     tall sticky canvas; roots draw + nodes light up on scrub
  scene/Manifesto.tsx   welcome message revealed phrase by phrase
  scene/ComingSoon.tsx  glowing mark, email capture, store badges, slogan
  ui/AudioToggle.tsx    ambient sound (off by default)
  graphics/StreakLogo.tsx     placeholder mark — swap for real sp-logo.svg
  graphics/MyceliumRoots.tsx  the root-network SVG (glow + crisp layers)
lib/
  gsap.ts               registers ScrollTrigger once
  useReducedMotion.ts   media-query hook
public/
  audio/                drop ambient.mp3 here
  sp-logo.README.txt    how to drop in the real logo
```

### Before launch — what to wire up

1. **Real logo** — done. Matthew's mark is inlined in `StreakLogo.tsx` (brand
   green `#7DFF57`) and the raw file lives at `public/streak-logo.svg`.
2. **Ambient audio** — add `public/audio/ambient.mp3`.
3. **Email capture** — `ComingSoon.tsx` `handleSubmit` is a stub; connect it to
   Resend / Mailchimp / ConvertKit (or a Next route handler).
4. **App Store links** — the store badges are disabled "soon" placeholders;
   enable them once the app ships.
5. **Domain** — deploy to Vercel / Netlify / Cloudflare Pages and point
   `streak.world` at it.

### Notes on mobile

The experience is built to run on phones: scenes use `svh` units, the root SVG
scales with `preserveAspectRatio`, and Lenis `syncTouch` is left off (smoother
on iOS). Test the root-draw timing on a real device and tune the Descent
section height (`340vh`) if it feels too fast or slow.
