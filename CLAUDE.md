# CLAUDE.md — Zik4U-web

## Vue d'ensemble
Site public Next.js 16 App Router pour Zik4U.
Tunnels d'acquisition : listeners et créateurs.
Backend partagé avec l'app mobile via Supabase.

## Stack
| Technologie | Version | Rôle |
|---|---|---|
| Next.js | 16.1.6 | App Router (framework web) |
| TypeScript | 5 | Langage principal |
| Tailwind CSS | 4 | Styles (via `@tailwindcss/postcss`, pas de `tailwind.config.ts`) |
| Supabase JS | 2 | Auth + DB (client partagé mobile) |
| Framer Motion | 12 | Animations (whileHover, whileInView, AnimatePresence) |
| Stripe | — | Checkout via Edge Function `create-stripe-checkout` (partagée avec l'app mobile) |

## Supabase
- Project ID : `eirkzsbjlwmflwhqihiw`
- URL : `https://eirkzsbjlwmflwhqihiw.supabase.co`
- Même base que l'app mobile — auth partagée (même compte = app mobile + web)
- Client : `src/lib/supabase.ts` — `createClient(url, anonKey, { auth: { persistSession, autoRefreshToken, detectSessionInUrl } })`

## Structure implémentée
```
src/
  app/
    /                      ✅ Landing (dual-door listener / creator)
    /users                 ✅ Tunnel listener : search + grille créateurs
    /creators              ✅ Tunnel créateur : hero + benefits + pricing + how-to
    /become-creator        ✅ Page transition user → creator
    /card/[username]       ✅ Share-to-Install : Now Card preview + CTAs App Store/Play
    /creator/[username]    ✅ Profil public créateur + tiers + auth gate
    /subscribe/[creatorId] ✅ Checkout Stripe (auth check, billing toggle, Edge Function redirect)
    /subscribe/success     ✅ Page succès post-paiement
    /subscribe/cancel      ✅ Page abandon paiement
    /legal/privacy         ✅ Privacy Policy (Server Component, 11 sections)
    /legal/terms           ✅ Terms of Service (Server Component, 12 sections)
    /sitemap.xml           ✅ Routes statiques + profils créateurs dynamiques depuis Supabase
    /robots.txt            ✅ Crawl autorisé, /subscribe/ et /api/ exclus
  components/
    landing/
      CreatorCard.tsx      ✅ Card search result (avatar, artistes, prix, hover)
      TierCard.tsx         ✅ Card abonnement (perks, prix, badge popular, CTA)
    auth/
      AuthModal.tsx        ✅ Modal auth (Google OAuth + Email sign in/sign up)
    ui/                    ⏳ Composants réutilisables (à construire)
  lib/
    supabase.ts            ✅ Client Supabase
    creators.ts            ✅ searchCreators, getFeaturedCreators, getCreatorProfile
    stripe.ts              ✅ createCheckoutSession → Edge Function create-stripe-checkout
    seo.ts                 ✅ defaultMetadata, generatePageMetadata, generateCreatorMetadata
  types/
    index.ts               ✅ CreatorProfile, CreatorTier, SearchResult
public/
  og-image.svg             ✅ OG image 1200×630 SVG (placeholder)
```

## Design System
- **Palette** : cyan `#00D4FF`, mint `#00FFB2`, pink `#FF3CAC`, violet `#7B2FFF`
- **Backgrounds** : `#0A0A1A` (page), `#12122A` (cards), `#1A1A35` (hover/buttons)
- **Police** : Inter (web)
- **Gradient signature** : `#00D4FF → #00FFB2 → #FF3CAC`
- **Gradient creator** : `#FF3CAC → #7B2FFF`
- **Classes CSS custom** : `.gradient-text` (brand), `.gradient-text-creator` (creator)

## Tailwind v4 — Configuration
Pas de `tailwind.config.ts`. Les couleurs custom sont dans `src/app/globals.css` via `@theme` :
```css
@import "tailwindcss";

@theme {
  --color-primary: #00D4FF;
  --color-mint: #00FFB2;
  --color-pink: #FF3CAC;
  --color-violet: #7B2FFF;
  --color-bg: #0A0A1A;
  --color-bg-card: #12122A;
  --color-bg-hover: #1A1A35;
  /* + background-image gradients */
}
```
En pratique : styles inline `style={{ background: '...' }}` utilisés partout (plus fiable avec Tailwind v4 JIT).

## SEO — Pattern metadata + 'use client'
Next.js interdit `export const metadata` dans un fichier `'use client'`. Solution :
créer un `layout.tsx` parent (Server Component) qui exporte `metadata`, laisser `page.tsx` en client component.
```tsx
// src/app/users/layout.tsx (Server Component — pas de 'use client')
import { generatePageMetadata } from '@/lib/seo';
export const metadata = generatePageMetadata('Title', 'description', '/path');
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```
Les profils créateurs dynamiques utilisent `generateCreatorMetadata` dans leur propre layout avec `generateStaticParams` si nécessaire.

## Sécurité — next.config.ts (obligatoire en production)
Security headers et `images.remotePatterns` doivent être configurés dans `next.config.ts` :
- `async headers()` : X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, CSP
- `images.remotePatterns` : whitelist `images.unsplash.com` + `*.supabase.co/storage/v1/object/public/**`
- Valider toute URL externe avant `window.location.href = url` : `url.startsWith('https://checkout.stripe.com')`
- Limiter les inputs utilisateur avant `.or()` Supabase : `query.trim().slice(0, 100)`

## Conventions
- **Styles** : inline `style={{}}` pour les couleurs Zik4U (évite les purges Tailwind v4 JIT)
- **Animations** : Framer Motion — `motion.div` avec `initial/animate/whileHover/whileInView`
- **`viewport={{ once: true }}`** sur tous les `whileInView` (pas de re-animation au scroll)
- **Jamais de secrets dans le code client** — seules les variables `NEXT_PUBLIC_*` sont exposées
- **Auth Supabase** : `onAuthStateChange` avec cleanup `unsubscribe()` dans `useEffect`
- **Types Supabase JS** : les joins `!inner` retournent des tableaux — utiliser `any` avec cast explicite
- **`'use client'`** : obligatoire sur toutes les pages (Framer Motion + hooks)

## Flows utilisateur

### Tunnel listener
`/` → clic "I'm a Listener" → `/users` → search créateurs → clic card → `/creator/[username]` → clic Subscribe → AuthModal (si non connecté) → `/subscribe/[creatorId]?tier=...` → Stripe Checkout → `/subscribe/success`

### Tunnel créateur
`/` → clic "I'm a Creator" → `/creators` → clic CTA → AuthModal → redirect `/`

### Auth flow
- Google OAuth : `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: window.location.href })`
- Email sign in : `supabase.auth.signInWithPassword({ email, password })`
- Email sign up : `supabase.auth.signUp({ email, password })` → email de confirmation

### Checkout Stripe
- `subscribe/[creatorId]` récupère le JWT via `supabase.auth.getSession()`
- Appelle `createCheckoutSession()` dans `src/lib/stripe.ts` → Edge Function `create-stripe-checkout`
- Valide `result.url.startsWith('https://checkout.stripe.com')` avant `window.location.href = result.url`
- Retour Stripe → `/subscribe/success?creator=<id>` ou `/subscribe/cancel?creator=<id>`

## Lib creators.ts — Gotchas Supabase
- `profiles` joint avec `users!inner(is_creator)` — filtrer avec `.eq('users.is_creator', true)`
- `creator_tiers` joint avec `creator_revenue_tiers!inner(price_web, sort_order)` — le champ `price_web` (snake_case en DB)
- RPC `get_user_top_artists(p_user_id, p_limit)` → `[{ artist_name: string }]`
- `creator_subscriptions` : compter avec `{ count: 'exact', head: true }` + `.eq('status', 'active')`
- **DEMO_CREATORS** : tableau de 6 profils statiques retourné si la DB est vide ou en erreur — site fonctionnel dès le premier jour sans données réelles
- **getFeaturedCreators()** : Promise.all — Query A (is_featured=true, limit 6)
  + Query B (tous creators, limit 12) — merge featured en premier, dédupliqués par id
- **isFeatured** : champ boolean ajouté à SearchResult (src/types/index.ts)
- **mapToSearchResult** : mappe is_featured depuis la jointure users

## Gotchas supplémentaires
- **`sitemap.ts`** : importer `supabase` (export nommé de `supabase.ts`), pas `createClient` (n'existe pas dans ce fichier)
- **`sitemap.ts`** : génère aussi les routes /card/{username} depuis profiles (limit 500)
  via Promise.all avec les creator routes (limit 5000)
- **`/card/[username]`** : Server Component — params typé Promise<{username}> et awaité
  (Next.js 16). Fetch profil + dernier scrobble + RPC get_user_top_artists.
  getMoodFromHour(utcHour) → 5 moods avec gradients. Deep link zik4u://profile/:username.
- **APP_STORE_URL** dans /card/[username]/page.tsx : placeholder à remplacer par l'ID
  réel après approbation App Store
- **`searchCreators`** : `.or(\`username.ilike.%${safeQuery}%,...\`)` — toujours passer par `safeQuery = query.trim().slice(0, 100)`
- **`AuthModal` password** : validation `password.length < 8` côté client avant `signUp` (Supabase exige ≥6, on en veut ≥8)
- **`og-image.svg`** dans `public/` : 1200×630 SVG — utilisé par `defaultMetadata.openGraph.images`
- **URL prod hardcodée interdite** : jamais `https://zik4u.com/...` dans le code — utiliser des chemins relatifs `/...` ou `process.env.NEXT_PUBLIC_SITE_URL`
- **Landing page** : pas de stats fictives — utiliser un badge "Early access" honnête

## Pages — état actuel

| Route | Statut | Description |
|---|---|---|
| `/` | ✅ | Landing dual-door, early access badge, footer avec liens légaux |
| `/users` | ✅ | Browse créateurs, search debouncée 300ms, skeleton, DEMO_CREATORS fallback |
| `/creators` | ✅ | Hero, 6 benefits, 3 tiers suggérés, 4 steps, sticky CTA mobile |
| `/become-creator` | ✅ | Page intermédiaire transition |
| `/creator/[username]` | ✅ | Profil public, tiers carousel mobile / grid desktop, Follow CTA si pas de tiers |
| `/subscribe/[creatorId]` | ✅ | Auth check, order summary, billing toggle mensuel/annuel, redirect Stripe |
| `/subscribe/success` | ✅ | Succès paiement, CTA download app |
| `/subscribe/cancel` | ✅ | Abandon paiement, retry CTA |
| `/legal/privacy` | ✅ | Privacy Policy GDPR/CCPA (Server Component, 11 sections) |
| `/legal/terms` | ✅ | Terms of Service (Server Component, 12 sections) |
| `/sitemap.xml` | ✅ | Routes statiques + profils créateurs dynamiques depuis Supabase |
| `/robots.txt` | ✅ | Crawl autorisé, /subscribe/ et /api/ exclus |

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://eirkzsbjlwmflwhqihiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<à configurer>
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # https://zik4u.com en prod
STRIPE_SECRET_KEY=<à configurer>            # non utilisé côté client — pour futures API routes
STRIPE_WEBHOOK_SECRET=<à configurer>        # non utilisé côté client — pour futures API routes
```

## Commandes
```bash
npm run dev      # Dev server
npm run build    # Build production (vérifier avant chaque commit)
git push         # Push via gh auth (upstream main configuré)
```

## Prochaines étapes

### Déploiement (à faire)
- [ ] Vercel : importer chardinne/Zik4U-web, configurer les 3 env vars
- [ ] Hostinger DNS : A @ 76.76.21.21 + CNAME www cname.vercel-dns.com
      (procédure complète : docs/HOSTINGER_VERCEL_DNS.md)
- [ ] Vercel : configurer NEXT_PUBLIC_SUPABASE_ANON_KEY en prod
- [ ] OG image : remplacer public/og-image.svg par PNG 1200×630

### Post-LLC
- [ ] Mettre à jour APP_STORE_URL dans /card/[username]/page.tsx
      avec l'ID réel App Store
- [ ] A/B test landing : mesurer conversion listener vs creator
- [ ] Composants ui/ réutilisables si duplication détectée

### Variables d'environnement (voir .env.example)
- NEXT_PUBLIC_SUPABASE_URL ✅ hardcodé (public)
- NEXT_PUBLIC_SUPABASE_ANON_KEY ⚠️ à configurer dans Vercel
- NEXT_PUBLIC_SITE_URL ⚠️ https://zik4u.com en prod
