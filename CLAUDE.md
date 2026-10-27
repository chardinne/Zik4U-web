> 📋 Contexte partagé obligatoire : lire `.claude/SHARED_CONTEXT.md` et `.claude/REVENUE_FLOW.md` avant toute session.
> 🧠 Fin de session obligatoire : mettre à jour `.claude/MEMORY.md` avec le template prévu.

# CLAUDE.md — Zik4U-web

> Réécrit le 27/10/2026 (SITE1-4, session 69). Source détaillée de la refonte : doc projet claude.ai `claude/REPRISE-SITE1.md`.

## Vue d'ensemble
Site public Next.js 16 App Router de Zik4U. **But unique (refonte SITE1, 26-27/10/2026) : inscrire les visiteurs sur la liste d'attente par e-mail** avant la publication de l'app sur les stores. Calibré pour le TÉLÉPHONE d'abord (Bertrand, 27/10). Texte visible 100 % anglais. Aucun paiement, aucun compte, aucune connexion sur le site.

## Stack
Next.js 16.1.6 (App Router, ISR) · React 19 · TypeScript 5 · Tailwind 4 (`@tailwindcss/postcss`, pas de `tailwind.config.ts`) · CSS modules pour l'accueil et les pages parcours · Supabase JS 2 (clé SERVICE côté serveur seulement) · jest + ts-jest · Vercel (déploiement auto sur push main).

## Supabase
- Project ID : `qjrwjdlqlmyliinfjjic` (us-east-1 — migré depuis `eirkzsbjlwmflwhqihiw`)
- URL : `https://qjrwjdlqlmyliinfjjic.supabase.co`
- Même base que l'app mobile.
- Client : `src/lib/supabase-server.ts` → `createServiceClient()` (clé service, serveur seulement). Plus aucun client navigateur ni connexion sur le site (AuthModal et `src/lib/supabase.ts` supprimés le 27/10/2026, SITE1-4).
- **Nouveau format clés** : `sb_publishable_...` (anon) + `sb_secret_...` (service_role) — les clés `eyJ...` JWT ne sont plus utilisées

## Routes (état au 27/10/2026)
| Route | Contenu |
|---|---|
| `/` | Accueil M2 (SITE1-2) : galaxie VIVANTE du compte `bertrand` (D174-D177, amende D175 : galaxie entière à l'arrivée), citation de Kant, formulaire unique, bandeau LIVE PROFILE, « Why it's different », « Three ways in ». ISR 900 s. Carte de planète au toucher / clic avec « Listen on » Spotify / Apple Music / YouTube (D180). |
| `/listeners`, `/creators`, `/fans` | Pages parcours courtes (SITE1-3, D182 + D184) : `PathPage` + textes `src/lib/pathTexts.ts`, formulaire avec le bon profil coché, seulement des fonctions qui existent dans l'app. |
| `/card/[username]` (+ `/@username`) | Carte minimale WEB-PRIV1 ; avec `?k=` valide : carte complète (SHARE-KEY1, DNA-SILLON). Formulaire de liste d'attente à la place des boutons de store (D183). |
| `/card/[username]/preview` | Aperçu de lien 1200×630 (runtime nodejs, TTF). |
| `/creator/[username]` | Carte minimale (WEB-PRIV1). |
| `/legal/privacy`, `/legal/terms`, `/legal/creator-terms`, `/legal/notice`, `/fr/legal/*` | Textes validés (COMPLY1c-i, WEB-LEGAL1, WEB-CGU1, D178). Ne changent QUE par Décision + test de garde. |
| `/delete-account` | Suppression de compte (exigée par Google Play). |
| `/api/waitlist` | POST seul (SITE1-1) : `pulse_waitlist` {email, role listener/fan} ou `creator_waitlist` {email, artist_name} ; champ piège `website` ; 400 validation, 500 `{error:'unavailable'}`. |
| `/api/founder-galaxy` | GET : copie fraîche de la galaxie du founder (compte `bertrand` seul), 404 si coupée. |
| `/users` → `/fans`, `/become-creator` → `/creators`, `/partner/*` → `/` | Redirections. |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/not-found` | `LIST_PROFILES = false` avant lancement (décision 3 = B). |

## Fichiers clés
- `src/lib/waitlist.ts` (WAITLIST_TEXTS, parseWaitlistBody, waitlistRow) · `src/components/waitlist/WaitlistForm.tsx` (seul formulaire du site).
- `src/lib/founderGalaxy.ts` (FOUNDER_USERNAME, interrupteur `FOUNDER_GALAXY=off` dans Vercel puis redéploiement) · `src/lib/homeTexts.ts` · `src/components/home/` (HomeHero, FounderSky, useNow, home.module.css).
- `src/lib/galaxy/` : modules purs de l'app copiés OCTET POUR OCTET (empreintes sha256 assertées) + `sphereGeometry.ts`, `textures.ts` ; `public/galaxy/` : textures et ciels extraits de l'app.
- `src/lib/pathTexts.ts` + `src/components/paths/` (pages parcours).
- `src/lib/seo.ts` : `SITE_TITLE` « Zik4U · Your music, as it really is. » et `SITE_DESCRIPTION` (D185), modèle de titre `%s | Zik4U` (utiliser `title: { absolute }` si le titre contient déjà « | Zik4U »).

## Règles dures
- **Liste d'attente seulement** : aucun bouton de store, aucune bannière d'app, aucun lien App Store / Google Play, aucun `al:*`, pas de `related_applications` jusqu'aux fiches des stores (D183, garde `site1-stores.test.ts`). Les remettre le jour de la publication en changeant la garde.
- **Aucune plateforme de streaming citée** sauf : carte partagée `/card?k=` (D172) et carte de planète de l'accueil (D180). Liens de recherche seulement, texte seul, aucune API tierce.
- **Aucune promesse que l'app ne tient pas** (audit WEB-TRUTH du 27/10) : pas de lettre annuelle, de portrait évolutif, de « connexion aux services de streaming », de détails de versement (Trolley, seuil, calendrier), de salles Pulse ni de flux « temps réel » (garde `site1-paths.test.ts`). Créateurs : « 80% of the net amount Zik4U receives after the store commission » (formule des CGU).
- **Aucun compte X déclaré** : le compte @zik4u sur X n'appartient PAS à Zik4U (D186). Pas de contact partenaires (B2B-OFF1) ; contact public = support@zik4u.com.
- Pas de mesure d'audience ni de provenance des inscrits (D181 = B) : tout outil de mesure = texte de politique à changer d'abord.
- Tirets longs (—) interdits dans le texte visible ; pas de faux profils ni de fausses statistiques.
- Zoom : `globals.css` zoome tout le site ×1,25 ; l'accueil, les pages parcours (`.root { zoom: 0.8 }`) et la carte partagée (`CARD_ZOOM = 0.8`) l'annulent.
- Contrôle à 390 px sans défilement horizontal sur un `next start` neuf ; un visuel neuf est essayé à la main par Bertrand sur l'aperçu avant la production.

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

## Logo, favicon, aperçu de lien — LOGO-2 (10/10/2026, logo « Empreinte A »)
- Source unique : le pack de marque du dépôt Zik4U (`docs/brand/`, SVG maîtres). Violet `#9B7BFF` sur Nuit `#120E24`.
- `src/app/favicon.ico` (16 px à 2 sillons, 32, 48) ; `public/favicon-32.png`, `public/apple-touch-icon.png`,
  `public/icon-192.png`, `public/icon-512.png` (maskable) ; `public/og-image.png` (aperçu de lien de la racine) ;
  `public/zik4u-logo.svg` (nav et footer de `src/app/page.tsx`).
- Plus aucune icône ni aperçu généré en code à la racine (`icon.tsx`, `opengraph-image.tsx` supprimés) ; le vinyle
  et le « Z4 » sont retirés. Garde : `src/__tests__/logo2.test.ts` (empreintes + absences).
- L'aperçu par profil est servi par `/card/[username]/preview` (route, DNA-SILLON 12/10/2026) ; `opengraph-image.tsx` n'existe plus.

## Sécurité — next.config.ts (obligatoire en production)
Security headers et `images.remotePatterns` doivent être configurés dans `next.config.ts` :
- `async headers()` : X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, CSP
- `images.remotePatterns` : whitelist `images.unsplash.com` + `*.supabase.co/storage/v1/object/public/**`
- Limiter les inputs utilisateur avant `.or()` Supabase : `query.trim().slice(0, 100)`

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
- EXCEPTION UNIQUE — carte complète partagée (WEB-PRIV1 partie 2 / SHARE-KEY1, migration 00177 de Zik4U) : `/card/<pseudo>?k=<clé>` (et `/@<pseudo>?k=`) affiche la carte complète SEULEMENT si la clé est la clé vivante de CE compte (table `share_keys`, lue avec la clé service). Seul `src/lib/sharedCard.ts` lit des écoutes, et toujours APRÈS la vérification de clé ; `src/components/profile/SharedFullCard.tsx` ne fait que rendre. Toute URL avec `?k=` est `noindex, nofollow` et `referrer: no-referrer`. Clé absente, fausse ou révoquée → carte minimale. Aperçu de lien : `/card/<pseudo>/preview?k=<clé>` (pointé par generateMetadata via `previewImageUrl`) vérifie lui-même la clé par `getSharedCard` ; sinon aperçu MINIMAL (`MinimalPreview.tsx`). Gardes : `src/__tests__/share-key1.test.ts`, `src/__tests__/dna-sillon-site.test.ts`. Clause 5c complète, « Links you share » compris, en ligne depuis le 24/09/2026.
- DNA-SILLON site (Décisions 25, 44, 45, 46 = A, 12/10/2026) : la carte partagée est le miroir de la carte Music DNA de l'app — disque vinyle (`SillonDisc.tsx`, empreinte dessinée par le serveur via `get_listening_fingerprint`, 1 tour / 40 s, arrêt si « réduire les animations », onglet masqué ou hors écran ; bulle « Drawn from {n} real listens »), MY GROOVES, pastilles LAST PLAYED / ON REPEAT, face A en barres (`get_user_top_artists`, 4 artistes, 7 jours). Titres : version nettoyée par le serveur (`*_normalized`) sinon titre capté (Décision 45). Module `src/lib/listeningFingerprint.ts` = port à l'identique de celui de l'app. `globals.css` zoome tout le site de 1,25 : la carte l'annule (`CARD_ZOOM = 0.8`) pour garder les proportions de l'app.

## Gotchas
- `box-shadow` / `filter: blur()` dans une ImageResponse (Satori) = panic resvg ; glows = halos en `radial-gradient`. Polices TTF lues par `readFileSync` (runtime nodejs) ; WOFF2 non supporté par Satori.
- `viewport` jamais dans `metadata` : `export const viewport` (defaultViewport de seo.ts).
- Pas d'URL de production en dur dans le code visible : chemins relatifs ou `NEXT_PUBLIC_SITE_URL` (les URL absolues du JSON-LD et des métadonnées canoniques sont l'exception).
- `searchCreators` et la liste de démonstration ont été supprimés (SITE1-4) ; ne pas les recréer.
- Un `opengraph-image.tsx` colocalisé ne reçoit pas `?k=` : l'aperçu de `/card` est une route `preview`.
- Les tests de garde lisent les fichiers sources : changer un texte validé = changer sa garde dans le même commit, avec la Décision citée.

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://qjrwjdlqlmyliinfjjic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://zik4u.com
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # serveur seulement (cartes, liste d'attente, galaxie du founder)
FOUNDER_GALAXY=off                        # optionnel : coupe la galaxie du founder (D174)
```

## Commandes
```bash
npx tsc --noEmit && npx jest && npm run lint:ci && npm run build
```
Livraison : blocs `.sh` exécutés par Bertrand (bloc A = branche + PR + CI + aperçu ; bloc B = merge = production + contrôles en ligne). Jamais de push direct sur main.
