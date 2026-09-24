> 📋 Contexte partagé obligatoire : lire `.claude/SHARED_CONTEXT.md` et `.claude/REVENUE_FLOW.md` avant toute session.
> 🧠 Fin de session obligatoire : mettre à jour `.claude/MEMORY.md` avec le template prévu.

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
| Stripe | — | AUCUN paiement sur le site (B2B-OFF1, 24/09/2026). Les abonnements créateurs passent par les achats intégrés des stores, dans l'app |

## Supabase
- Project ID : `qjrwjdlqlmyliinfjjic` (us-east-1 — migré depuis `eirkzsbjlwmflwhqihiw`)
- URL : `https://qjrwjdlqlmyliinfjjic.supabase.co`
- Même base que l'app mobile — auth partagée (même compte = app mobile + web)
- Client : `src/lib/supabase.ts` — `createClient(url, anonKey, { auth: { persistSession, autoRefreshToken, detectSessionInUrl } })`
- **Nouveau format clés** : `sb_publishable_...` (anon) + `sb_secret_...` (service_role) — les clés `eyJ...` JWT ne sont plus utilisées

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
    /card/[username]       ✅ Carte MINIMALE (WEB-PRIV1) : nom, avatar, bio + CTAs App Store/Play. Aussi servie par /@<username> (rewrite next.config.ts). Avec ?k=<clé de partage valide> : carte COMPLÈTE, noindex (SHARE-KEY1)
    /card/[username]/
      opengraph-image.tsx  ✅ OG PNG MINIMAL (nom + @handle, 1200×630, runtime nodejs, Inter TTF) — aucune donnée d'écoute
    /creator/[username]    ✅ Carte MINIMALE (WEB-PRIV1, décision 1 = B) — paliers/prix absents jusqu'aux produits store
    /legal/privacy         ✅ Privacy Policy (Server Component, 11 sections)
    /legal/terms           ✅ Terms of Service (Server Component, 12 sections)
    /sitemap.xml           ✅ Routes statiques + profils créateurs dynamiques depuis Supabase
    /robots.txt            ✅ Crawl autorisé (robots IA compris, décision 4 du 23/09), /api/ exclu
    /not-found             ✅ Page 404 custom — "This track doesn't exist."
    /opengraph-image       ✅ OG image générée en code (ImageResponse, edge runtime, 1200×630)
    /icon                  ✅ Favicon généré en code (ImageResponse, edge runtime, 32×32, "Z4")
    api/
      pulse-waitlist/      ✅ POST — upsert email dans `pulse_waitlist` (service role, idempotent, onConflict: 'email')
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
    supabase-server.ts     ✅ createServiceClient() (service role — publicProfile, sharedCard, waitlists)
    creators.ts            ✅ searchCreators, getFeaturedCreators, getCreatorProfile
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

## B2B-OFF1 — pas de B2B ni de paiement sur le site (RÈGLE DURE, 24/09/2026)
- D1 = A : l'offre aux labels (/partner, forfaits, AI Analyst) n'est ni vendue ni promise avant le lancement. `/partner` et `/partner/*` redirigent vers `/` (next.config.ts). `public/llms.txt` ne la présente plus.
- D2 = A : le B2B vit UNIQUEMENT dans le dépôt Zik4U-api, en sommeil (service Render suspendu le 24/09). Ne jamais le recopier ici. Zik4U-admin = back-office interne seul.
- D3 = A : aucun paiement direct créateur. Aucune route `/api/partner/*` ni `/api/creator/*`, aucun renvoi vers `api.zik4u.com` ou `admin.zik4u.com` (domaines inexistants).
- CSP : `connect-src` limité à Supabase, `frame-src 'none'`. Garde : `src/__tests__/b2b-off1.test.ts`.
- Textes légaux (privacy/terms) NON modifiés par B2B-OFF1 : la mention du programme partenaires reste une information sur un partage possible, à revoir avec l'avocat.

## WEB-PRIV1 — confidentialité des profils (RÈGLE DURE)

Les pages de profil lisent avec la clé SERVICE, qui contourne la RLS et la règle de base `public.listening_visible_to`. Le site applique donc lui-même les décisions produit :
- Visiteur sans compte : nom, avatar, bio SEULEMENT, pour TOUS les profils (D3). Jamais d'écoutes, top artistes/titres, archétype, signature, activité, compatibilité, humeur, posts ni paliers.
- Compte privé (users.is_private OU profiles.profile_visibility = 'private') : exclu du sitemap, `noindex, nofollow`.
- Compte supprimé (users.deleted_at) : introuvable.
- Toute nouvelle page publique de profil passe par `src/lib/publicProfile.ts`. Garde : `src/__tests__/web-priv1.test.ts`.
- EXCEPTION UNIQUE — carte complète partagée (WEB-PRIV1 partie 2 / SHARE-KEY1, migration 00177 de Zik4U) : `/card/<pseudo>?k=<clé>` (et `/@<pseudo>?k=`) affiche la carte complète SEULEMENT si la clé est la clé vivante de CE compte (table `share_keys`, lue avec la clé service). Seul `src/lib/sharedCard.ts` lit des écoutes, et toujours APRÈS la vérification de clé ; `src/components/profile/SharedFullCard.tsx` ne fait que rendre. Toute URL avec `?k=` est `noindex, nofollow` et `referrer: no-referrer`. Clé absente, fausse ou révoquée → carte minimale. L'image d'aperçu de lien reste MINIMALE (pas d'accès à la clé). Garde : `src/__tests__/share-key1.test.ts`. Clause 5c complète, « Links you share » compris, en ligne depuis le 24/09/2026.

## Flows utilisateur

### Tunnel listener
`/` → clic "Listener" → `/listeners` → clic CTA → store (App Store / Play Store)

### Tunnel créateur
`/` → clic "Creator" → `/creators` → clic CTA → AuthModal → redirect `/`

### Tunnel fan
`/` → clic "Fan" → `/fans` → search créateurs → clic card → `/creator/[username]` (carte minimale) → stores. Aucun paiement sur le site

### Auth flow
- Google OAuth : `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: window.location.href })`
- Email sign in : `supabase.auth.signInWithPassword({ email, password })`
- Email sign up : `supabase.auth.signUp({ email, password })` → email de confirmation

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

## Gotchas supplémentaires
- **`/api/creator-waitlist` vs `/api/pulse-waitlist`** : `creator-waitlist` exige 3 champs obligatoires (email + artist_name + main_platform) — jamais pour capture email fans. `pulse-waitlist` = email uniquement (table `pulse_waitlist`, `createServiceClient()`).
- **Nav architecture** : nav homepage dans `src/app/page.tsx` (inline). Navs `/creators`, `/fans`, `/listeners` = inline dans chaque `page.tsx` — pas de layout nav partagé. Chaque page gère ses propres boutons nav.
- **Revenue split** : abonnements créateurs = **80 %** du net reçu par Zik4U après commission store. AUCUN paiement direct (décision D3 du 24/09/2026 : le 70/30 est retiré).
- **`defaultMetadata.description`** : source de la meta description homepage — dans `src/lib/seo.ts`, PAS dans `page.tsx` (qui est `'use client'` → pas de metadata export possible).
- **Bouton "Copy the post →" sur /creators** : déjà implémenté avec `navigator.clipboard.writeText()` + état `copied` (2.5s). Ne pas réimplémenter.
- **`sitemap.ts`** : AVANT LANCEMENT, `LIST_PROFILES = false` → aucun profil listé (décision 3 = B du 23/09 : comptes de test et pseudos dérivés d'e-mails hors de Google). AU LANCEMENT, après purge des comptes de test : passer `LIST_PROFILES` à true (et adapter le test). Alors `listSitemapProfiles()` de `src/lib/publicProfile.ts` (clé service) liste /card/{username} des seuls comptes publics non supprimés (D4), `revalidate = 3600`. Aucune route /creator (canonique = /card).
- **`/card/[username]` et `/creator/[username]`** : `getPublicProfile()` + `MinimalProfileCard` / `profileMetadata()` (`src/components/profile/`). Compte privé (users.is_private OU profile_visibility = private) → `robots: noindex, nofollow`. Compte supprimé → introuvable. Deep link `zik4u://profile/:username`.
- **`/card/[username]/opengraph-image.tsx`** : `runtime = 'nodejs'` (readFileSync TTF), 1200×630, nom + @handle seulement, via `getPublicProfile()`.
- **`searchCreators`** : `.or(\`username.ilike.%${safeQuery}%,...\`)` — toujours passer par `safeQuery = query.trim().slice(0, 100)`
- **`AuthModal` password** : validation `password.length < 8` côté client avant `signUp`
- **`/fans` vs `/users`** : `/fans` est la route principale (nouvelle navigation). `/users` est conservée pour les anciens liens mais ne figure plus dans les CTAs ni boutons nav.
- **`/become-creator`** : Server Component pur avec `redirect('/creators')` — pas de 'use client'
- **`not-found.tsx`** : `'use client'` requis (useRouter + motion)
- **`src/app/opengraph-image.tsx` / `src/app/icon.tsx`** : `export const runtime = 'edge'` obligatoire — sans ça, erreur de build ImageResponse. **EXCEPTION** : `/card/[username]/opengraph-image.tsx` utilise `runtime = 'nodejs'` (readFileSync TTF — edge ne peut pas lire le filesystem).
- **`box-shadow` dans Satori = MORT** : Satori convertit `box-shadow` → `feGaussianBlur` → resvg **panic** (500 au premier vrai partage). Tout glow dans une ImageResponse = stacked `radial-gradient` halos sur des divs absolus avec `borderRadius: 9999`. JAMAIS de `box-shadow` ni `filter: blur()`.
- **Fonts TTF dans ImageResponse** : `readFileSync(join(process.cwd(), 'src/fonts/inter-400.ttf'))` — Satori exige ArrayBuffer. Fichiers dans `src/fonts/` (inter-400.ttf + inter-700.ttf). WOFF2 non supporté.
- **`fitLine(title, artist)` helper** : pré-tronquer côté serveur avant ImageResponse (`whiteSpace: 'nowrap'` dans Satori ne coupe pas, le texte dépasse). Budget : 38 chars total, artist préservé ≤20, title prend le reste. Pattern : `artist.slice(0,19)+'…'` si trop long, title tronqué avec `Math.max(6, budget-1)`.
- **File-based OG image** : `opengraph-image.tsx` colocalisé avec `page.tsx` est servi automatiquement comme og:image. Si `generateMetadata` a un array `images:`, il **override** le file-based → les deux entrent en conflit. Supprimer `images:` de `generateMetadata` pour laisser le file-based prendre le dessus.
- **`/card/[username]` generateMetadata** : `profileMetadata()` — pas de donnée d'écoute dans title/description. `twitter.card: 'summary_large_image'`. Pas de `images:` array dans `openGraph` ni `twitter`.
- **`viewport` dans `metadata`** : Next.js 14+ interdit `viewport` dans l'objet `metadata`. Toujours exporter une constante séparée `export const viewport: Viewport = { ... }` dans `layout.tsx`. Sinon : 21 warnings build `⚠ Unsupported metadata viewport is configured in metadata export`. Défini dans `src/lib/seo.ts` → `defaultViewport` + export `viewport` dans `app/layout.tsx`.
- **URL prod hardcodée interdite** : jamais `https://zik4u.com/...` dans le code — utiliser des chemins relatifs `/...` ou `process.env.NEXT_PUBLIC_SITE_URL`
- **Landing page** : pas de stats fictives — utiliser un badge "Early access" honnête
- **`/api/pulse-waitlist`** : utilise `createServiceClient()` (service role) car la table `pulse_waitlist` n'a pas de RLS anon — insert depuis un visiteur non connecté.

## Pages — état actuel

| Route | Statut | Description |
|---|---|---|
| `/` | ✅ | Landing triple-door (Listener / Creator / Fan), taglines "For real", early access badge, 4 plateformes cliquables + modals (Spotify/Apple Music/YouTube Music/SoundCloud), lien footer discret → /partner |
| `/listeners` | ✅ | Tunnel listener — hero + 3 sections × 4 features (12 total) + "Free. No card required." sous les CTAs |
| `/creators` | ✅ | Hero, 4 steps, monetisation (80% abonnements), visibility, live presence + waitlist créateur |
| `/fans` | ✅ | 4 placeholder creator cards (harmony/marco/luna/tyler) + fan waitlist email + WHAT_YOU_GET + store CTAs |
| `/users` | ✅ | Alias ancienne URL — conservée pour liens existants |
| `/become-creator` | ✅ | Redirect Server Component → /creators |
| `/creator/[username]` | ✅ | Profil public, pills "What you get", titre "Get inside X's musical world", stats mobile, tiers carousel mobile / grid desktop |
| `/legal/privacy` | ✅ | Privacy Policy GDPR/CCPA (Server Component, 12 sections) — SCCs, B2B data disclosure, emotional retention, DPC contact, section 8c Music Match (Art. 6(1)(a) + Art. 9(2)(a) — statut relationnel = donnée sensible UE). `LAST_UPDATED = 'September 23, 2026'` (section 5c WEB-PRIV1). `COMPANY = 'Zik4U Inc.'` |
| `/legal/terms` | ✅ | Terms of Service (Server Component, 13 sections) — revenue share chiffré, IAP refunds clarifiés, clause EU consommateurs, section Music Match (17+, double opt-in, usages interdits, disclaimer). `LAST_UPDATED = 'March 28, 2026'`. `COMPANY = 'Zik4U Inc.'` |
| `/card/[username]` | ✅ | Carte minimale WEB-PRIV1 (nom, avatar, bio), OG minimal, noindex si compte privé. `/@username` y mène. |
| `/sitemap.xml` | ✅ | Routes statiques seulement avant lancement (LIST_PROFILES = false, décision 3 = B) ; au lancement + /card/ des comptes publics non supprimés (D4) |
| `/robots.txt` | ✅ | Crawl autorisé (robots IA compris, décision 4 du 23/09), /api/ exclu |
| `/not-found` (404) | ✅ | "This track doesn't exist." + boutons Back / Find a creator |
| `/opengraph-image` | ✅ | OG PNG généré edge (1200×630, logo gradient + tagline) |
| `/icon` | ✅ | Favicon généré edge (32×32, "Z4" gradient) |

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://qjrwjdlqlmyliinfjjic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WH4Ta8aLhTDQyzLE1Toc4A_QH-XzVjO
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # https://zik4u.com en prod
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...     # createServiceClient() — jamais exposé côté client
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
- [x] Vercel : configurer NEXT_PUBLIC_SUPABASE_ANON_KEY en prod (`sb_publishable_...`)

### Post-C Corp
- [ ] Mettre à jour APP_STORE_URL dans /card/[username]/page.tsx si l'ID change
- [ ] A/B test landing : mesurer conversion listener vs creator vs fan
- [ ] Composants ui/ réutilisables si duplication détectée

### Variables d'environnement (voir .env.example)
- NEXT_PUBLIC_SUPABASE_URL ✅ hardcodé (public)
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✅ `sb_publishable_WH4Ta8aLhTDQyzLE1Toc4A_QH-XzVjO`
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
