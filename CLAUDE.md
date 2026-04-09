# CLAUDE.md — Zik4U-web

## Vue d'ensemble
Site public Next.js 16 App Router pour Zik4U.
Tunnels d'acquisition : listeners, créateurs, fans.
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
    /                      ✅ Landing (triple-door: Listener / Creator / Fan), plateformes cliquables avec modals AnimatePresence (Spotify/Apple Music/YouTube Music/SoundCloud — sans Deezer/Tidal), footer link discret "For labels & researchers →" vers /partner
    /listeners             ✅ Tunnel listener : hero "What are they listening to. For real." + features + section Pulse Teaser (waitlist email)
    /creators              ✅ Tunnel créateur : hero + benefits + pricing + how-to
    /fans                  ✅ Tunnel fan : search créateurs + WHAT_YOU_GET + store CTAs
    /users                 ✅ Page créateurs (ancienne URL — conservée pour compatibilité)
    /become-creator        ✅ Redirect → /creators (Server Component, next/navigation redirect)
    /card/[username]       ✅ Share-to-Install : Now Card preview + CTAs App Store/Play
    /creator/[username]    ✅ Profil public créateur + tiers + auth gate
    /subscribe/[creatorId] ✅ Checkout Stripe (auth check, billing toggle, Edge Function redirect)
    /subscribe/success     ✅ Page succès post-paiement + vrais liens App Store / Play Store
    /subscribe/cancel      ✅ Page abandon paiement ("Changed your mind?")
    /legal/privacy         ✅ Privacy Policy (Server Component, 11 sections)
    /legal/terms           ✅ Terms of Service (Server Component, 12 sections)
    /sitemap.xml           ✅ Routes statiques + profils créateurs dynamiques depuis Supabase
    /robots.txt            ✅ Crawl autorisé, /subscribe/ et /api/ exclus
    /not-found             ✅ Page 404 custom — "This track doesn't exist."
    /opengraph-image       ✅ OG image générée en code (ImageResponse, edge runtime, 1200×630)
    /icon                  ✅ Favicon généré en code (ImageResponse, edge runtime, 32×32, "Z4")
    api/
      pulse-waitlist/      ✅ POST — upsert email dans `pulse_waitlist` (service role, idempotent, onConflict: 'email')
      partner/me/          ✅ GET — profil partenaire par API key (`x-zik4u-key` header)
      partner/checkout/    ✅ POST — Stripe Checkout pour plans partenaires (génère `zik4u_live_` provisoire)
      partner/webhook/     ✅ POST — Stripe webhook — active clé API + envoie email Resend post-paiement
      partner/intelligence/artist/   ✅ GET — artist intelligence (params: artist, days) + log dans partner_search_logs (fire-and-forget service role)
      partner/intelligence/virality/ ✅ GET — virality leaderboard (param: limit)
      partner/ai/                    ✅ POST — AI Analyst (Claude API claude-sonnet-4-20250514, quota check_and_increment_ai_quota, rate limit 10/h)
  components/
    landing/
      CreatorCard.tsx      ✅ Card search result (avatar, artistes, prix, hover, badge "✦ Featured")
      TierCard.tsx         ✅ Card abonnement (perks, prix, badge popular, CTA)
                              CTA non-populaire : transparent + border cyan rgba(0,212,255,0.35)
    auth/
      AuthModal.tsx        ✅ Modal auth (Google OAuth + Email sign in/sign up)
    CookieBanner.tsx       ✅ Banner ePrivacy — 'use client', localStorage (zik4u_cookie_consent),
                              boutons "Essential only" / "Accept", lien /legal/privacy#cookies
    ui/                    ⏳ Composants réutilisables (à construire)
  lib/
    supabase.ts            ✅ Client Supabase (browser)
    supabase-server.ts     ✅ createServiceClient() (service role — /me /ai /checkout /webhook /pulse-waitlist)
                              createPartnerClient() (anon key — /intelligence/* avec auth RPC-side)
    creators.ts            ✅ searchCreators, getFeaturedCreators, getCreatorProfile
    stripe.ts              ✅ createCheckoutSession → Edge Function create-stripe-checkout
    rate-limit.ts          ✅ checkRateLimit(apiKey, endpoint) → RPC check_rate_limit — 100/h intelligence, 10/h AI — fallback { allowed: true } si erreur DB
    seo.ts                 ✅ defaultMetadata, generatePageMetadata, generateCreatorMetadata, generatePlatformMetadata(platform)
                              openGraph.images + twitter.images → '/opengraph-image' (pas og-image.png)
                              PLATFORM_META : spotify / apple-music / youtube-music / soundcloud
  types/
    index.ts               ✅ CreatorProfile, CreatorTier, SearchResult (+ isFeatured: boolean)
public/
  og-image.svg             (remplacé par opengraph-image.tsx — conservé pour compatibilité)
  llms.txt                 ✅ Description produit AI-readable (llmstxt.org standard) — indexé par LLMs
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
// src/app/fans/layout.tsx (Server Component — pas de 'use client')
import type { Metadata } from 'next';
export const metadata: Metadata = { title: '...', description: '...' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```
Layouts SEO créés : `/creators/layout.tsx`, `/listeners/layout.tsx`, `/fans/layout.tsx`.
Les profils créateurs dynamiques utilisent `generateCreatorMetadata` dans `generateMetadata`.

## OG Image & Favicon — Générés en code
- `src/app/opengraph-image.tsx` : `ImageResponse` edge runtime — logo ZIK4U gradient + tagline + badge
- `src/app/icon.tsx` : `ImageResponse` edge runtime — carré arrondi gradient "Z4" 32×32
- `seo.ts` référence `/opengraph-image` (plus `/og-image.png`)
- Import : `import { ImageResponse } from 'next/og'` (Next.js ≥13.3 — pas de `@vercel/og`)

## Icônes PNG réelles — Générées depuis SVG
- Fichier source : `public/zik4u-logo-512.svg` (logo vinyle)
- Script : `scripts/convert-icons.mjs` — utilise `sharp` (`--legacy-peer-deps`)
- Génère : `public/icon-512.png` (171K, maskable), `public/icon-192.png` (43K), `public/apple-touch-icon.png` (39K), `public/favicon-32.png` (2K)
- Référencés dans : `layout.tsx` (`<link rel="apple-touch-icon">` + `<link rel="icon" sizes="32x32">`) et `manifest.ts` (array `icons`)
- Logo vinyle img `28px` arrondi injecté dans la nav et le footer de `src/app/page.tsx`
- Commande : `node scripts/convert-icons.mjs`

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
- **Tirets longs (—)** : interdits dans les textes visibles — remplacer par `.`, `:`, `,` ou `·`

## Internationalisation — 100% anglais
Depuis le Sprint Pré-lancement, **tous les textes visibles** du site sont en anglais.
- `/fans/page.tsx`, `/listeners/page.tsx`, `/creators/page.tsx` : réécrits intégralement en anglais
- `legal/privacy/page.tsx`, `legal/terms/page.tsx` : LLC → C Corp, section Music Match FR → EN
- `subscribe/[creatorId]/page.tsx` : disclaimer store fees EN
- `pay/success/page.tsx` : labels EN (Request confirmed / Drop unlocked / Pulse session confirmed / Tip sent)
- `creator/[username]/page.tsx` : MOOD_CONFIG labels EN (Light / Melancholy)
- `page.tsx` : LiveTicker `mood: 'Melancholy'` (était Mélancolie)
- `seo.ts` : `publisher: 'Zik4U Inc.'` (était 'Zik4U LLC')
- **Règle absolue** : zéro mot français dans le texte visible — les identifiants de code (ex: `explorateur`) ne comptent pas

## Copy — Tagline "For real"
Le fil rouge copywriting du site est "For real" (authenticité des données d'écoute).
Décliné sur tous les tunnels :
- `/` : boutons "Listener / Creator / Fan" avec sous-titre "... For real."
- `/listeners` : h1 "What are they listening to. **For real.**"
- `/creators` : h1 "What do you listen to? For real. / Now you get paid for the answer."
- `/fans` : hero "See what they listen to. **For real.** Before anyone else."
- `/card/[username]` : CTA "Real music. Real identity. For real."
- `seo.ts` description : "...what you actually hear. For real."

## Flows utilisateur

### Tunnel listener
`/` → clic "Listener" → `/listeners` → clic CTA → store (App Store / Play Store)

### Tunnel créateur
`/` → clic "Creator" → `/creators` → clic CTA → AuthModal → redirect `/`

### Tunnel fan
`/` → clic "Fan" → `/fans` → search créateurs → clic card → `/creator/[username]` → clic Subscribe → AuthModal (si non connecté) → `/subscribe/[creatorId]?tier=...` → Stripe Checkout → `/subscribe/success`

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

## SEO & AI Discovery

- **`manifest.ts`** : `src/app/manifest.ts` — Next.js `MetadataRoute.Manifest`, PWA (name/short_name/theme_color #00D4FF/background_color #0A0A1A)
- **`llms.txt`** : `public/llms.txt` — standard llmstxt.org — description produit pour LLMs (privacy model, B2B intelligence, stack, legal)
- **JSON-LD Schema.org** : dans `layout.tsx` via `<script>` inline avec `__html` — `@graph` WebSite + Organization + MobileApplication — ajout via outil `Edit` (le hook sécurité bloque l'outil `Write` sur ce pattern)
- **Smart App Banner** : `<meta name="apple-itunes-app" content="app-id=6748722257">` (corrigé : était 6743844386) + `<meta name="google-play-app" content="app-id=com.zik4u.app">` + `<link rel="alternate" android-app://...>` dans `<head>` de `layout.tsx`
- **Store-ready meta tags** (7) : `application-name`, `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, `format-detection`, `msapplication-TileColor` — ajoutés dans `layout.tsx`
- **hreflang** : 5 `<link rel="alternate" hreflang="...">` (en / en-US / en-GB / fr / x-default) dans `layout.tsx` — ciblage géo multi-marché
- **appLinks** : block `other` dans `seo.ts` — `al:ios:url`, `al:ios:app_store_id`, `al:android:url`, `al:android:package`, `al:web:url`, `al:web:should_fallback`
- **`robots.ts`** : règles explicites par agent — GPTBot/ChatGPT-User/Google-Extended/PerplexityBot/ClaudeBot/anthropic-ai/Amazonbot autorisés (accès `/`, disallow `/api/`), Omgilibot bloqué entièrement (`disallow: '/'`)
- **Layouts SEO** : créer un `layout.tsx` Server Component pour chaque segment nécessitant une metadata scoped (ex: `/works-with/[platform]/layout.tsx` avec `generateMetadata({ params })` qui `await params`)

## Sécurité Partner API

- **`createPartnerClient()`** (anon key) : routes `/api/partner/intelligence/*` — l'auth est gérée côté DB via RPCs SECURITY DEFINER (`partner_get_virality_leaderboard`, `partner_get_artist_intelligence`) qui vérifient la clé API en interne. Code PostgreSQL `42501` → HTTP 401.
- **`createServiceClient()`** (service role) : routes `/api/partner/me`, `/api/partner/ai`, `/api/partner/checkout`, `/api/partner/webhook`, `/api/pulse-waitlist` — vérification manuelle JS de la clé.
- **Rate limiting** : `checkRateLimit(apiKey, endpoint)` dans `src/lib/rate-limit.ts` — appeler AVANT tout traitement métier. Retourne `{ allowed, remaining, resetAt }`.
- **ANTHROPIC_API_KEY** : utilisé dans `/api/partner/ai/route.ts` — jamais exposé côté client (pas de `NEXT_PUBLIC_`).

## Gotchas supplémentaires
- **`sitemap.ts`** : importer `supabase` (export nommé de `supabase.ts`), pas `createClient`
- **`sitemap.ts`** : génère aussi les routes /card/{username} depuis profiles (limit 500)
  via Promise.all avec les creator routes (limit 5000)
- **`/card/[username]`** : Server Component — params typé `Promise<{username}>` et awaité
  (Next.js 16). Fetch profil + dernier scrobble + RPC get_user_top_artists.
  `getMoodFromHour(utcHour)` → 5 moods avec gradients. Deep link `zik4u://profile/:username`.
- **APP_STORE_URL / PLAY_STORE_URL** dans `subscribe/success/page.tsx` : liens réels
  App Store `id6748722257` + Play Store `com.zik4u.app` — sous forme de `<a>` (pas `<button>`)
- **`searchCreators`** : `.or(\`username.ilike.%${safeQuery}%,...\`)` — toujours passer par `safeQuery = query.trim().slice(0, 100)`
- **`AuthModal` password** : validation `password.length < 8` côté client avant `signUp`
- **`/fans` vs `/users`** : `/fans` est la route principale (nouvelle navigation). `/users` est conservée pour les anciens liens mais ne figure plus dans les CTAs ni boutons nav.
- **`/become-creator`** : Server Component pur avec `redirect('/creators')` — pas de 'use client'
- **`not-found.tsx`** : `'use client'` requis (useRouter + motion)
- **`opengraph-image.tsx` / `icon.tsx`** : `export const runtime = 'edge'` obligatoire — sans ça, erreur de build ImageResponse
- **URL prod hardcodée interdite** : jamais `https://zik4u.com/...` dans le code — utiliser des chemins relatifs `/...` ou `process.env.NEXT_PUBLIC_SITE_URL`
- **Landing page** : pas de stats fictives — utiliser un badge "Early access" honnête
- **Landing footer partner link** : lien discret "For labels & researchers →" dans le footer de la landing (`src/app/page.tsx`), après les liens Privacy/Terms. Couleur `rgba(255,255,255,0.25)` → `#00D4FF` au hover. PAS un bouton nav — `onMouseEnter`/`onMouseLeave` inline style
- **`/partner/dashboard`** : `'use client'` + `force-dynamic`. API key stockée dans `localStorage` clé `zik4u_partner_key`. Validation côté client : `apiKey.startsWith('zik4u_live_')`. Calls parallèles `/api/partner/me` + `/api/partner/intelligence/virality` via `loadData()`. Pas d'auth Supabase — auth par clé API uniquement.
- **`/api/partner/checkout`** : génère d'abord une clé `zik4u_live_` provisoire, crée un Stripe Checkout avec `metadata.api_key`. Le webhook `/api/partner/webhook` active la clé après paiement.
- **`/api/partner/webhook`** : App Router — body lu via `request.text()`, pas de `export const config = { api: { bodyParser: false } }` (pattern Pages Router uniquement, inutile et trompeur en App Router).
- **`/api/pulse-waitlist`** : utilise `createServiceClient()` (service role) car la table `pulse_waitlist` n'a pas de RLS anon — insert depuis un visiteur non connecté.
- **`/partner/dashboard`** architecture Pro : `AuthScreen` (validation `zik4u_live_` prefix + localStorage `zik4u_partner_key`), `Sidebar` fixe 220px, 5 sections composants séparés. `handleArtistSelect()` : `setSection('artists')` puis `setTimeout(() => dispatchEvent(new CustomEvent('zik4u:artist-select', { detail: name })), 50)` — délai 50ms pour laisser `ArtistsSection` se monter et attacher son listener.
- **Watchlist** : clé localStorage `zik4u_watchlist` (string[]). AI history : `zik4u_ai_history` (50 derniers messages, objet `{ role, content }`).
- **Period selector** : `'7d' | '30d' | '90d'` — passé comme query param `days` vers `/api/partner/intelligence/virality`. Recalculé en jours : `{ '7d': 7, '30d': 30, '90d': 90 }`.
- **`partner_search_logs`** : table Supabase loggant toutes les recherches artistes — RLS service_role only. Alimentée de manière fire-and-forget dans la route API (lookup plan via `partner_requests` + insert). Ne jamais attendre ce log pour répondre.

## Pages — état actuel

| Route | Statut | Description |
|---|---|---|
| `/` | ✅ | Landing triple-door (Listener / Creator / Fan), taglines "For real", early access badge, 4 plateformes cliquables + modals (Spotify/Apple Music/YouTube Music/SoundCloud), lien footer discret → /partner |
| `/listeners` | ✅ | Tunnel listener — hero gradient + FEATURES (4 items) + section Pulse Teaser (form email waitlist → `/api/pulse-waitlist`) + store CTAs |
| `/creators` | ✅ | Hero, 6 benefits, 3 tiers suggérés, 4 steps, sticky CTA mobile |
| `/fans` | ✅ | Search créateurs, WHAT_YOU_GET pills, store CTAs |
| `/users` | ✅ | Alias ancienne URL — conservée pour liens existants |
| `/become-creator` | ✅ | Redirect Server Component → /creators |
| `/creator/[username]` | ✅ | Profil public, pills "What you get", titre "Get inside X's musical world", stats mobile, tiers carousel mobile / grid desktop |
| `/subscribe/[creatorId]` | ✅ | Auth check, avatar créateur réel, order summary, billing toggle mensuel/annuel, redirect Stripe |
| `/subscribe/success` | ✅ | Succès paiement, `<a>` App Store / Play Store avec vrais liens, "Explore creators →" |
| `/subscribe/cancel` | ✅ | "Changed your mind?", "Explore other creators →" → /fans |
| `/legal/privacy` | ✅ | Privacy Policy GDPR/CCPA (Server Component, 12 sections) — SCCs, B2B data disclosure, emotional retention, DPC contact, section 8c Music Match (Art. 6(1)(a) + Art. 9(2)(a) — statut relationnel = donnée sensible UE). `LAST_UPDATED = 'March 28, 2026'`. `COMPANY = 'Zik4U Inc.'` |
| `/legal/terms` | ✅ | Terms of Service (Server Component, 13 sections) — revenue share chiffré, IAP refunds clarifiés, clause EU consommateurs, section Music Match (17+, double opt-in, usages interdits, disclaimer). `LAST_UPDATED = 'March 28, 2026'`. `COMPANY = 'Zik4U Inc.'` |
| `/card/[username]` | ✅ | Share-to-install, OG metadata dynamique, mood + track + streak |
| `/sitemap.xml` | ✅ | Routes statiques + créateurs + /card/ pages (limit 500) |
| `/robots.txt` | ✅ | Crawl autorisé, /subscribe/ et /api/ exclus |
| `/not-found` (404) | ✅ | "This track doesn't exist." + boutons Back / Find a creator |
| `/partner` | ✅ | Page Partner enrichie — hero, demo report interactif (3 tabs), 6 features, ROI calculator, 4 plans ($0/$499/$1299/Enterprise), contact form Formspree |
| `/partner/dashboard` | ✅ | Dashboard Pro — sidebar fixe 5 sections (Overview/Virality/Artists/AI/Account), watchlist, AI Analyst persistant (50 msgs), period selector 7d/30d/90d, filtre pré-viral, sort, cross-section via CustomEvent |
| `/opengraph-image` | ✅ | OG PNG généré edge (1200×630, logo gradient + tagline) |
| `/icon` | ✅ | Favicon généré edge (32×32, "Z4" gradient) |

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://eirkzsbjlwmflwhqihiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<à configurer>
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # https://zik4u.com en prod
STRIPE_SECRET_KEY=<à configurer>
STRIPE_WEBHOOK_SECRET=<à configurer>
SUPABASE_SERVICE_ROLE_KEY=<à configurer>    # createServiceClient() — jamais exposé côté client
RESEND_API_KEY=<à configurer>               # Emails partenaires
ANTHROPIC_API_KEY=<à configurer>            # AI Analyst — /api/partner/ai/ — jamais NEXT_PUBLIC_
```

## Commandes
```bash
npm run dev      # Dev server
npm run build    # Build production (vérifier avant chaque commit)
git push         # Push via gh auth (upstream main configuré)
git commit --allow-empty -m "chore: trigger Vercel redeploy"  # Forcer un redeploy Vercel sans changement de code
```

## Prochaines étapes

### Déploiement (à faire)
- [ ] Vercel : importer chardinne/Zik4U-web, configurer les 3 env vars
- [ ] Hostinger DNS : A @ 76.76.21.21 + CNAME www cname.vercel-dns.com
      (procédure complète : docs/HOSTINGER_VERCEL_DNS.md)
- [ ] Vercel : configurer NEXT_PUBLIC_SUPABASE_ANON_KEY en prod

### Post-C Corp
- [ ] Mettre à jour APP_STORE_URL dans /card/[username]/page.tsx si l'ID change
- [ ] A/B test landing : mesurer conversion listener vs creator vs fan
- [ ] Composants ui/ réutilisables si duplication détectée

### Variables d'environnement (voir .env.example)
- NEXT_PUBLIC_SUPABASE_URL ✅ hardcodé (public)
- NEXT_PUBLIC_SUPABASE_ANON_KEY ⚠️ à configurer dans Vercel
- NEXT_PUBLIC_SITE_URL ⚠️ https://zik4u.com en prod

## CTO Skills

Skills Claude Code disponibles pour ce repo :
- `/cto-web` : contexte complet zik4u-web (routes, auth pattern, Anthropic, env vars, gaps)
- `/cto-zik4u` : master — état 4 repos + routage vers le bon skill
- `/deploy-migration` : checklist deploy Vercel (tsc → push → verify)
- `/incident-response` : diagnostic et correction incidents prod

**Path** : `/home/chardinnebertrand/projets/zik4u-web`
**Commandes** : `bash -c "cd /home/chardinnebertrand/projets/zik4u-web && npx tsc --noEmit"`
**Commit** : `bash -c "cd /home/chardinnebertrand/projets/zik4u-web && git add -A && git commit -m '...' && git push origin main"`
