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
| Stripe | — | Checkout abonnements créateurs (page /subscribe à venir) |

## Supabase
- Project ID : `eirkzsbjlwmflwhqihiw`
- URL : `https://eirkzsbjlwmflwhqihiw.supabase.co`
- Même base que l'app mobile — auth partagée (même compte = app mobile + web)
- Client : `src/lib/supabase.ts` — `createClient(url, anonKey)`

## Structure implémentée
```
src/
  app/
    /                      ✅ Landing (dual-door listener / creator)
    /users                 ✅ Tunnel listener : search + grille créateurs
    /creators              ✅ Tunnel créateur : hero + benefits + pricing + how-to
    /become-creator        ✅ Page transition user → creator
    /creator/[username]    ✅ Profil public créateur + tiers + auth gate
    /subscribe/[creatorId] ⏳ Checkout Stripe (à construire)
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
  types/
    index.ts               ✅ CreatorProfile, CreatorTier, SearchResult
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
`/` → clic "I'm a Listener" → `/users` → search créateurs → clic card → `/creator/[username]` → clic Subscribe → AuthModal (si non connecté) → `/subscribe/[creatorId]?tier=...`

### Tunnel créateur
`/` → clic "I'm a Creator" → `/creators` → clic CTA → AuthModal → redirect `/`

### Auth flow
- Google OAuth : `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: window.location.href })`
- Email sign in : `supabase.auth.signInWithPassword({ email, password })`
- Email sign up : `supabase.auth.signUp({ email, password })` → email de confirmation

## Lib creators.ts — Gotchas Supabase
- `profiles` joint avec `users!inner(is_creator)` — filtrer avec `.eq('users.is_creator', true)`
- `creator_tiers` joint avec `creator_revenue_tiers!inner(price_web, sort_order)` — le champ `price_web` (snake_case en DB)
- RPC `get_user_top_artists(p_user_id, p_limit)` → `[{ artist_name: string }]`
- `creator_subscriptions` : compter avec `{ count: 'exact', head: true }` + `.eq('status', 'active')`

## Pages — état actuel

| Route | Statut | Description |
|---|---|---|
| `/` | ✅ | Landing dual-door, gradient, stats, footer |
| `/users` | ✅ | Browse créateurs, search debouncée 300ms, skeleton, empty state |
| `/creators` | ✅ | Hero, 6 benefits, 3 tiers suggerés, 4 steps, CTA final |
| `/become-creator` | ✅ | Page intermédiaire transition |
| `/creator/[username]` | ✅ | Profil public, tiers grid, auth gate, stats |
| `/subscribe/[creatorId]` | ⏳ | Checkout Stripe (à construire) |

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://eirkzsbjlwmflwhqihiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<à configurer>
STRIPE_SECRET_KEY=<à configurer>
STRIPE_WEBHOOK_SECRET=<à configurer>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Commandes
```bash
npm run dev      # Dev server
npm run build    # Build production (vérifier avant chaque commit)
git push         # Push via gh auth (upstream main configuré)
```

## Prochaine étape : /subscribe/[creatorId]
- Vérifier session Supabase (redirect si non connecté)
- Afficher récap tier sélectionné
- Appeler Edge Function `create-stripe-checkout` (partagée avec l'app mobile)
- Redirect vers Stripe Checkout
- Page de succès `/subscribe/success`
