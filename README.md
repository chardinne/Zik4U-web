# Zik4U Web — Public Site & Creator Marketplace

Public website for **Zik4U**, the music social network. Handles listener acquisition, creator discovery, and Stripe subscription checkout. Shares the same Supabase backend as the mobile app.

## Features

| Route | Description |
|---|---|
| `/` | Landing page — dual-door entry (listener / creator) |
| `/users` | Browse creators — search with 300ms debounce, grid, DEMO_CREATORS fallback |
| `/creators` | Creator acquisition funnel — benefits, pricing tiers, 4-step how-to |
| `/become-creator` | Transition page: user → creator |
| `/creator/[username]` | Public creator profile — tiers carousel (mobile) / grid (desktop), Follow CTA |
| `/subscribe/[creatorId]` | Stripe checkout — auth gate, tier selection, monthly/annual toggle |
| `/subscribe/success` | Post-payment success — CTA to download the app |
| `/subscribe/cancel` | Abandoned payment — retry CTA |
| `/legal/privacy` | Privacy Policy (GDPR + CCPA, 11 sections) |
| `/legal/terms` | Terms of Service (12 sections) |
| `/card/[username]` | Share-to-install landing — Now Card preview (mood gradient + last track + top artist + streak), App Store / Play Store CTAs, deep link `zik4u://profile/:username`, OG metadata |
| `/sitemap.xml` | Static routes + dynamic creator profiles + `/card/` pages from Supabase (profiles, limit 500) |
| `/robots.txt` | Crawl allowed, /subscribe/ and /api/ excluded |

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | Framework (App Router, Server Components) |
| TypeScript | 5 | Language |
| Tailwind CSS | 4 | Styles via `@tailwindcss/postcss` — no `tailwind.config.ts` |
| Supabase JS | 2 | Auth + DB (shared backend with mobile app) |
| Framer Motion | 12 | Animations (`whileHover`, `whileInView`, `AnimatePresence`) |
| Radix UI | — | Dialog, Tabs primitives |
| Lucide React | — | Icons |
| react-hot-toast | — | Toast notifications |

## Project Structure

```
src/
  app/
    /                      # Landing (dual-door listener / creator)
    /users                 # Listener tunnel — creator search + grid
    /creators              # Creator acquisition funnel
    /become-creator        # Transition: user → creator
    /creator/[username]    # Public creator profile + tiers
    /subscribe/[creatorId] # Stripe checkout (auth check, billing toggle, Edge Function)
    /subscribe/success     # Post-payment success
    /subscribe/cancel      # Abandoned payment
    /legal/privacy         # Privacy Policy (Server Component, 11 sections)
    /legal/terms           # Terms of Service (Server Component, 12 sections)
    /card/[username]       # Share-to-install Server Component — Now Card preview + store CTAs
    /sitemap.xml           # Static + dynamic sitemap (creators + card pages)
    /robots.txt            # Crawl rules
  components/
    landing/
      CreatorCard.tsx      # Search result card (avatar, artists, price, hover, "✦ Featured" badge)
      TierCard.tsx         # Subscription tier card (perks, price, popular badge, CTA)
    auth/
      AuthModal.tsx        # Auth modal (Google OAuth + Email sign in/sign up)
  lib/
    supabase.ts            # Supabase client
    creators.ts            # searchCreators, getFeaturedCreators (Promise.all + dedup), getCreatorProfile
    stripe.ts              # createCheckoutSession → Edge Function create-stripe-checkout
    seo.ts                 # defaultMetadata, generatePageMetadata, generateCreatorMetadata
  types/
    index.ts               # CreatorProfile, CreatorTier, SearchResult (+ isFeatured: boolean)
public/
  og-image.svg             # OG image 1200×630 SVG
```

## Getting Started

### Prerequisites

- Node.js >= 18
- A Supabase project (shared with the mobile app)

### Installation

```bash
git clone https://github.com/chardinne/Zik4U-web.git
cd Zik4U-web
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eirkzsbjlwmflwhqihiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # https://zik4u.com in production
STRIPE_SECRET_KEY=<your-stripe-key>         # for future API routes
STRIPE_WEBHOOK_SECRET=<your-webhook-secret> # for future API routes
```

### Development

```bash
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Share-to-Install Flow (/card/[username])

```
Mobile app InviteScreen  →  Share.share({ url: 'https://zik4u.com/card/:username' })
                             OR copy to clipboard
  ↓
/card/[username]  (Server Component)
  Fetches: profiles (display_name, avatar, current_streak)
           scrobbles (last played — played_at DESC LIMIT 1)
           get_user_top_artists RPC (limit 1)
  Renders: mood gradient card (5 moods based on UTC hour)
           last track + top artist + streak badge
  ↓
CTAs:
  → App Store (id6748722257 — update after approval)
  → Google Play (com.zik4u.app)
  → zik4u://profile/:username (deep link — opens app if installed)
```

OG metadata is generated server-side per user (`generateMetadata`), enabling rich link previews on iOS/Android when the URL is shared via WhatsApp, Messenger, iMessage, etc.

## Featured Creators

`getFeaturedCreators()` runs two parallel queries:
1. `users WHERE is_featured = true LIMIT 6`
2. `users LIMIT 12`

Results are merged and deduplicated (featured first), giving a list of up to 12 with featured accounts always shown first. The `is_featured` flag is set manually in Supabase Dashboard. `CreatorCard` displays a "✦ Featured" badge (gradient #FF3CAC → #7B2FFF) for featured accounts.

## Checkout Flow

```
/creator/[username]  →  user clicks Subscribe
  ↓
AuthModal if not authenticated (Google OAuth or email/password)
  ↓
/subscribe/[creatorId]?tier=<tierId>
  Tier details + monthly/annual billing toggle
  JWT from supabase.auth.getSession()
  ↓
createCheckoutSession() → Edge Function create-stripe-checkout
  Validates: url.startsWith('https://checkout.stripe.com')
  ↓
window.location.href = checkoutUrl
  ↓
Stripe Checkout  →  /subscribe/success  or  /subscribe/cancel
```

## Design System

- **Palette**: cyan `#00D4FF`, mint `#00FFB2`, pink `#FF3CAC`, violet `#7B2FFF`
- **Backgrounds**: `#0A0A1A` (page), `#12122A` (cards), `#1A1A35` (hover)
- **Font**: Inter
- **Gradient brand**: `#00D4FF → #00FFB2 → #FF3CAC`
- **Gradient creator**: `#FF3CAC → #7B2FFF`
- **Custom CSS classes**: `.gradient-text`, `.gradient-text-creator`

Tailwind v4 tokens are declared in `src/app/globals.css` via `@theme`. Brand colors use inline `style={{}}` for reliability with the Tailwind v4 JIT compiler.

## Security

- Security headers in `next.config.ts` (X-Frame-Options DENY, CSP, Referrer-Policy, Permissions-Policy)
- `images.remotePatterns`: `images.unsplash.com` + `*.supabase.co`
- Stripe redirect validated: `url.startsWith('https://checkout.stripe.com')` before any redirect
- User inputs sanitized before Supabase queries: `query.trim().slice(0, 100)`
- No secrets in client-side code — only `NEXT_PUBLIC_*` variables are exposed

## Deployment (Vercel)

1. Push to `main` → Vercel deploys automatically
2. Set environment variables in **Vercel Dashboard → Settings → Environment Variables**
3. Configure custom domain: `zik4u.com`

## Relation to Other Repos

| Repo | Role | URL |
|---|---|---|
| [Zik4U](https://github.com/chardinne/Zik4U) | React Native mobile app (iOS + Android) | App Store / Google Play |
| [Zik4U-web](https://github.com/chardinne/Zik4U-web) | This repo — public site + Stripe checkout | `zik4u.com` |
| [Zik4U-admin](https://github.com/chardinne/Zik4U-admin) | Internal admin dashboard | `admin.zik4u.com` |

All three share the same Supabase project (`eirkzsbjlwmflwhqihiw`).
