# MEMORY — Zik4U Web
> Mis à jour après chaque session. Source de vérité de l'état réel du projet.

## 🔁 SESSION 69 — REFONTE SITE1 (26-27/10/2026) — liste d'attente + galaxie du founder
> Détail complet : doc projet claude.ai `claude/REPRISE-SITE1.md`. Décisions D171-D186 de Bertrand.
- **But du site** : inscrire sur la liste d'attente par e-mail avant les stores ; calibré téléphone ; aucun store, aucun paiement, aucune connexion.
- **SITE1-1** (web #17 → 6ab9351 ; Zik4U #158 → develop 7d33319, migration 00235) : formulaire unique `WaitlistForm`, `/api/waitlist`, politique EN/FR (D178), anciennes routes `/api/pulse-waitlist` et `/api/creator-waitlist` supprimées.
- **SITE1-2** (#18 → f04aeff) : accueil M2 = galaxie VIVANTE du compte `bertrand` (port web de LivingSignalSphere, modules et textures de l'app copiés à l'identique, ISR 900 s, `/api/founder-galaxy`, interrupteur `FOUNDER_GALAXY=off`), galaxie entière à l'arrivée.
- **SITE1-2c** (#19 → c6a6bf1) : carte de planète « Listen on » Spotify / Apple Music / YouTube (D180), clic et non survol sur ordinateur.
- **SITE1-5** (#20 → 8073bea) : plus aucune bannière d'app ni lien de store (D183) ; `/card` montre le formulaire.
- **SITE1-3** (#21 → 90e0125) : `/listeners`, `/creators`, `/fans` courtes (`PathPage` + `pathTexts.ts`, D184) ; promesses non tenues et faux créateurs retirés (audit WEB-TRUTH).
- **SITE1-4** (ménage, D185-D186) : titre « Zik4U · Your music, as it really is. » + description ; aucun compte X (@zik4u n'est PAS à Zik4U) ; JSON-LD sans contact partenaires ni recherche, logo = icon-512 ; code mort supprimé (AuthModal, supabase.ts navigateur, landing/*, creators.ts, types/) ; CLAUDE.md réécrit.
- **Gardes** : site1-waitlist, site1-galaxy, site1-stores, site1-paths, site1-cleanup (+ comply1g adapté par D184).
- **Pièges appris** : le réglage Chrome « Version pour ordinateur » affiche la mise en page ordinateur sur téléphone (pas un défaut) ; le modèle de titre `%s | Zik4U` double « | Zik4U » → `title: { absolute }` ; un `git diff` n'inclut pas les fichiers non suivis → patchs faits avec `git diff-index --cached` contre un commit de l'arbre de base.

## 🔁 SITE2 (27/10/2026) — page /bertrand : galaxie + carte Music DNA du founder (D188 = V2, D189 = A, D190 = A)
- `src/app/bertrand/page.tsx` (ISR 900 s, 404 si `FOUNDER_GALAXY=off`) : « This is Bertrand. For real. », 01 galaxie (`FounderSky`), 02 carte Music DNA (`MusicDnaCard`, extraite de `SharedFullCard`, pied `zik4u.com/bertrand`), 03 formulaire. Textes `src/lib/founderPageTexts.ts`. Lien « See Bertrand's full Music DNA » sous le bandeau LIVE PROFILE de l'accueil ; `/bertrand` dans le sitemap.
- `src/lib/sharedCard.ts` : lectures déplacées dans `loadCard()` (APRÈS les deux portes : clé vivante, `getFounderCard()` du compte `bertrand` seul). Garde `site2-founder-page.test.ts`. Jeu de match et Music Match ABANDONNÉS par Bertrand.

## 🔁 SPRINT W1 (2026-06-06) — Suppression flux fan Stripe (IAP only) MERGÉ main
**HEAD main = `d847faf`** (merge `--no-ff` de `refactor/w1-remove-fan-stripe`@`c27740d`). tsc 0, jest 6/6 (2 suites). 13 fichiers, −1482/+8.
- **Pivot** : fans paient EXCLUSIVEMENT via IAP (App Store/Google Play + RevenueCat). Web fan Stripe retiré.
- **Supprimé** : pages `/subscribe/[creatorId]|success|cancel`, `/pay/success|cancel`, routes `/api/creator/payment` + `/api/creator/payment-webhook`, `src/lib/stripe.ts` (client fan), + 2 tests devenus cassants (`creator-payment`, `payment-webhook` importaient les routes supprimées).
- **Intact** : Stripe B2B `/api/partner/*` + `src/lib/stripe-server.ts`. `creator/[username]` + landing déjà IAP (0 modif).
- **Corrigé** : `creators/page.tsx` + `layout.tsx` → « 80% of net revenue » partout + mentions « subscribe from the web » retirées ; `robots.ts` disallow `/subscribe/` retiré.
- **DETTE (sprint séparé)** : Edge Function Supabase `create-stripe-checkout` (repo supabase) encore déployée — voie web abonnement pas coupée côté serveur.
- **Gotcha tsc** : 1ère passe rouge UNIQUEMENT sur `.next/types/validator.ts` (cache généré périmé référençant les routes supprimées) → `rm -rf .next` puis tsc = 0. Se régénère propre au build.

## État actuel (2026-06-06)
- TypeScript : 0 erreur
- Tests : 6/6 passants (2 suites — était 14/4 avant la suppression W1 des 2 suites fan)
- Déploiement : Vercel → zik4u.com (auto-deploy sur push main)
- Stack : Next.js 16.1.6 / Tailwind 4 / App Router

## Chantiers en cours
- C Corp Zik4U Inc. Florida — BLOQUANT Stripe prod
- Stripe prod webhooks en attente de C Corp

## Tests — Jest configuré (2026-04-15)
- **14 tests / 4 suites — 100% passants** (`npx jest --no-coverage`)
- Routes couvertes (post-W1) : partner-webhook (3), partner-ai (3). ~~payment-webhook (4), creator-payment (4)~~ supprimées W1 (routes fan retirées).
- Pattern de mock : `jest.mock('@/lib/stripe-server', ...)` + `jest.requireMock()`/`require()` dans `beforeEach`
- Supabase mock pattern : `createServiceClient: jest.fn()` → `.mockReturnValue({ from: jest.fn().mockReturnValue({ select, update, insert }) })`
- Tests ciblent auth/validation early-returns → aucun mock chain profond requis
- Idempotency : check par `stripe_session_id` (colonne UNIQUE — migration 00085), return `{ ok: true, idempotent: true }` si déjà paid

## Gap critique résolu (2026-04-16) — ⚠️ route supprimée depuis (W1)
- ~~/api/creator/payment-webhook : idempotency check keyed sur `stripe_session_id`~~ — **route supprimée au sprint W1** (2026-06-06, fan Stripe retiré). Le pattern idempotency reste valable pour les webhooks B2B partner conservés (`stripe_session_id` UNIQUE).

## Décisions récentes
- SHARED_CONTEXT.md + REVENUE_FLOW.md ajoutés dans .claude/ (2026-04-15)
- Idempotency webhook partner ajouté (Sprint Audit P0)
- createPartnerClient() vs createServiceClient() : ne jamais mélanger

## Erreurs résolues à ne pas répéter
- tailwind.config.ts → INTERDIT (Tailwind v4 utilise @tailwindcss/postcss)
- ANTHROPIC_API_KEY en NEXT_PUBLIC_ → INTERDIT (server-side uniquement)
- Mélanger createPartnerClient et createServiceClient dans le même handler

## Template fin de session
### Session [DATE]
- **Ce qui a été fait** : 
- **État TypeScript** : 0 erreur / erreurs
- **Décisions prises** : 
- **Erreurs rencontrées** : 
- **Gap critique résolu** : oui/non
- **Chantier suivant** : 

---

## EAS Build env vars pitfall (learned 2026-05-01)

The `.env` file is gitignored, which means **EAS Build never sees it**.
Variables referenced in app code via `react-native-config` (`Config.VAR`) will be `undefined`
in EAS builds unless they are explicitly defined in:
- `eas.json` → `build.{profile}.env` for non-sensitive public values
- EAS Secrets dashboard for sensitive credentials (API keys, tokens)

**Symptom of this pitfall:** the app builds and starts correctly, then
crashes at runtime the first time it tries to use the missing variable
(typically a `TypeError: Cannot read properties of undefined`).

**Hardest case to debug:** when `inlineRequires: true` is enabled in
Metro, client initialization is deferred. The crash happens inside a
React Query / async hook, far from the import site, making the root
cause non-obvious.

**Checklist when adding a new service (Stripe, RevenueCat, Firebase,
etc.):** for each new env var, decide whether it goes in eas.json
(public) or EAS Secrets (sensitive), and add it to all three profiles
(development, preview, production).

**EAS Secrets scope pitfall:** EAS Secrets are scoped per environment
(development / preview / production). A secret added only to `production`
is NOT available in `preview` or `development` builds.
Current state (2026-05-01): SUPABASE_ANON_KEY, GOOGLE_WEB_CLIENT_ID,
SENTRY_DSN are production-only secrets → missing from preview/dev builds.

---

## Android Build Pipeline (validated 2026-05-04)

### Validated stack
- Expo SDK 53 + RN 0.79.6 + Hermes + old-arch mode
- supabase-js@2.95.3
- Minimal metro.config.js with explicit WEB_ONLY_PACKAGES list
  (no auto-detect, no inlineRequires)
- See docs/metro-config-history.md and docs/BUILD_PIPELINE.md
  in Zik4U mobile repo for full details

### Build commands
- Diagnostic/preview: GitHub Actions (.github/workflows/build-android-local.yml)
- Production: EAS Build (eas build --platform android --profile production)

### When adding new dependencies
1. Run yarn add and verify locally with:
   - npx jest --no-coverage
   - npx tsc --noEmit
   - npx expo export:embed (check for "Suspect require count: 0")
2. Push to main to trigger GitHub Actions build
3. Test the APK on Firebase Test Lab before considering it working
4. NEVER add packages to WEB_ONLY_PACKAGES without verifying
   they are truly web-only and unused at runtime

### Common pitfalls (learned the hard way)
- react-native-config only reads .env files, not OS env vars
  (use eas-build-post-install.sh)
- EAS Secrets need explicit "$VAR" reference in eas.json env block
- inlineRequires in metro.config.js can break OXC-bundled
  packages like supabase-js@2.95+
- Don't auto-shim UMD packages by content detection — too many
  false positives (tslib, superstruct, stacktrace-js)

## WEB-PRIV1 PARTIE 1 (2026-09-23) — CLOSE EN PRODUCTION (PR #2, merge `58d18bf`)
- Commits `7faa43d` (partie 1) + `7c09ee7` (décision 3), merge `--no-ff` sur main = production. Vercel success, CI main verte.
- **Première CI du dépôt** : `.github/workflows/ci.yml` (push/PR vers main) = `npm run lint:ci` (fichiers de confidentialité seulement), `npx tsc --noEmit`, `npm test` (jest, 21 tests), `npm run build`. `npm run lint` complet = 62 erreurs anciennes (dette, hors périmètre).
- **Règle** : toute page publique de profil passe par `src/lib/publicProfile.ts` (`getPublicProfile`, `listSitemapProfiles`) + `src/components/profile/MinimalProfileCard.tsx`. Visiteur = nom, avatar, bio SEULEMENT (D3). Compte privé (users.is_private OU profiles.profile_visibility = private, fail-closed) → noindex. Compte supprimé → introuvable. Garde : `src/__tests__/web-priv1.test.ts`. Voir CLAUDE.md § WEB-PRIV1.
- `/@<pseudo>` → carte (rewrite next.config.ts). `/creator/<pseudo>` = carte minimale (décision 1 = B : paliers/prix quand les produits store existeront). `getCreatorProfile` supprimée (lisait des colonnes inexistantes de profiles → 404 depuis toujours).
- Clause 5c en ligne SANS « Links you share » (décision 2 = B) : ce paragraphe revient avec la partie 2 (SHARE-KEY1). LAST_UPDATED = September 23, 2026.
- Sitemap : `LIST_PROFILES = false` (décision 3 = B) → aucun profil avant lancement. AU LANCEMENT : purger les comptes de test, passer à true, adapter le test, aligner l'hôte (canonique/sitemap en zik4u.com alors que le site sert www).
- **Preview Vercel protégée** : 302 vers la connexion Vercel pour tout anonyme → vérifier une preview à l'œil (navigateur connecté) ; vérif HTTP en production. `zik4u.com` → 307 vers `www.zik4u.com` : tout curl de production prend `-L`.
- Déploiement de production lisible par `gh api "repos/chardinne/Zik4U-web/deployments?sha=<sha>&environment=Production"` puis `/statuses`.
- Dettes relevées : `/fans` et recherche créateurs (`lib/creators.ts`) lisent des colonnes inexistantes de profiles ; politique « Florida C Corp » à faire relire.

## WEB-PRIV1 PARTIE 2 / SHARE-KEY1 (2026-09-24) — CLOSE EN PRODUCTION (PR #3, commit `eea8ee1`, merge `79fe685`)
- Exige la migration 00177 de Zik4U (table `share_keys`, une clé vivante par compte, révoquée par `revoke_share_keys()` depuis l'app).
- `/card/<pseudo>?k=<clé>` (et `/@<pseudo>?k=`) → carte COMPLÈTE (dernière écoute, en répétition, archétype, rareté, constellation) SEULEMENT si la clé est la clé vivante de CE compte, même pour un compte privé. Clé absente, fausse, révoquée ou d'un autre compte → carte minimale. Compte supprimé → rien.
- Seul lecteur d'écoutes du site : `src/lib/sharedCard.ts` (`getSharedCard`, `isShareKey`), lectures APRÈS la vérification de clé ; rendu pur : `src/components/profile/SharedFullCard.tsx` (+ `CelestialBody.tsx`, `ListenButton.tsx` restaurés). Toute URL avec `?k=` = `noindex, nofollow` + `referrer: no-referrer`. Image d'aperçu de lien : minimale (pas d'accès à la clé). Contenu exclusif créateur jamais lu (D6).
- Clause 5c complète en ligne, « Links you share » compris ; LAST_UPDATED = September 24, 2026.
- Garde : `src/__tests__/share-key1.test.ts` (31 tests au total) ; `lint:ci` couvre `sharedCard.ts` et ce test.
- PROUVÉ : preview à l'œil (carte minimale sans clé et avec fausse clé, 5c) ; production par `curl -L` (5c, date, sans clé indexable, fausse clé noindex + no-referrer), CI main verte ; à l'œil sur l'A54 : carte complète avec la vraie clé, puis carte minimale après révocation.
- Étiquettes : WEB-PRIV1 et SHARE-KEY1 PRISES (consignées aussi dans le MEMORY.md de Zik4U, gravure `63a6bf8`).
- Constat : l'app partage `zik4u.com/playlist/<id>`, page absente du site (surface morte).

## B2B-OFF1 (2026-09-24 soir) — CLOSE EN PRODUCTION (PR #4, commit `7a4c090`, merge `e2f6b9c`)
- Issu de l'audit des 4 dépôts du 24/09. Décisions de Bertrand : D1 = A (offre labels ni vendue ni promise avant le lancement) ; D2 = A (le B2B vit UNIQUEMENT dans Zik4U-api, en sommeil ; Zik4U-admin = back-office interne seul) ; D3 = A (paiements directs créateurs à 70/30 retirés) ; D4 = B (compte admin dédié) ; D5 = B (back-office sur le poste d'administration seulement, jamais publié) ; D6 = A (pouvoirs admin retirés de l'app) ; D7 = A (kit de secours scellé confié à un tiers).
- Retiré du site : pages `/partner` (dashboard, success, cancel, layout), 6 routes `/api/partner/*`, rewrites `/api/partner/*` et `/api/creator/*` vers `api.zik4u.com`, `lib/stripe-server.ts`, `lib/redis.ts`, `lib/rate-limit.ts`, `createPartnerClient`, lien de pied de page « For labels & researchers », section B2B de `public/llms.txt`. `/partner` et `/partner/*` → 307 vers `/`. CSP : `connect-src` Supabase seul, `frame-src 'none'`. Textes légaux NON modifiés (mention du programme partenaires = information sur un partage possible, à revoir avec l'avocat).
- MESURÉ : le formulaire `/partner` postait vers `admin.zik4u.com` (NEXT_PUBLIC_ADMIN_URL inliné), domaine sans DNS ; `api.zik4u.com` sans DNS. `partner_requests` = 1 ligne (clé de test active), 0 demande réelle ; `creator_direct_payments` = 0.
- Zik4U-admin et Zik4U-api tournaient sur Render (`zik4u-admin.onrender.com`, `zik4u-api.onrender.com`) ; la route de paiement direct de l'api répondait sans authentification. Les deux services sont SUSPENDUS depuis le 24/09 (503 prouvé). Tout secret qui a vécu sur Render sera régénéré (SEC-COCKPIT, sous-lot g).
- Garde : `src/__tests__/b2b-off1.test.ts` (5 tests, échouent 5/5 sur l'ancien état), couvert par `lint:ci`. 30 tests web.
- PROUVÉ : preview à l'œil (redirection, pied de page, /creators) ; production par `curl -L` (`/partner` → 200 sur www, `/api/partner/me` 404, llms.txt sans B2B, CSP) ; CI main verte (run 36059522468).
- PIÈGE DE BANC : `.env.example` est SUIVI malgré la règle `.env*` du `.gitignore`. Un banc fait `git add -A` PUIS `git add -f .env.example`, sinon l'empreinte d'arbre diverge de celle du dépôt.
- Variables Vercel devenues inutiles : STRIPE_* (dont STRIPE_PRICE_*), ANTHROPIC_API_KEY, RESEND_API_KEY, UPSTASH_REDIS_REST_*, NEXT_PUBLIC_ADMIN_URL, NEXT_PUBLIC_API_URL — à supprimer au sous-lot g de SEC-COCKPIT, en vérifiant qu'aucun webhook Stripe ne vise encore le site.
- CONSTAT C8 → WEB-TRUTH1 (AVANT LANCEMENT, textes arbitrés par Bertrand) : `llms.txt` (connexion OAuth Spotify/SoundCloud/Deezer, app « disponible » sur les stores, « Zik4U LLC », écoutes « anonymisées avant stockage »), `/creators` (« Connect your streaming services », « Exclusive Drops ») et l'accueil (boutons stores, « 14+ music sources ») décrivent ce qui n'existe pas ou contredit le zéro API tierce.
- Consignes partagées `.claude/SHARED_CONTEXT.md` et `.claude/REVENUE_FLOW.md` : 4 versions différentes dans les 4 dépôts, périmées — lot d'unification à venir (source unique dans Zik4U).
- Étiquettes : B2B-OFF1 PRISE (web #4) ; SEC-COCKPIT et WEB-TRUTH1 réservées. Consignées aussi dans le MEMORY.md de Zik4U.

## SEC-COCKPIT c2 (2026-10-08) — CLOSE EN PRODUCTION (PR #5, merge `9396ccb`)
- Décisions de Bertrand du 08/10 (toutes A) : un compte suspendu se montre comme un compte supprimé (app : « This account is not available. », sans Retry). Côté base : migration 00198 de Zik4U (déclencheur sur users.is_banned qui bloque la connexion, politiques et fonctions qui masquent le compte).
- Le site lit avec la clé de service (aucune politique ne s'applique) : `src/lib/publicProfile.ts` et `src/lib/sharedCard.ts` lisent `is_banned` et le traitent comme `deleted_at` — pas de page de profil, pas de carte partagée même avec la clé vivante, jamais dans le plan du site (`.eq('is_banned', false)` + filtre). Aucun texte neuf sur le site (introuvable = comme supprimé).
- Garde : `src/__tests__/sec-cockpit-c2.test.ts` (3 tests, échouent 3/3 sur l'ancien état), ajouté à `lint:ci`. 33 tests web.
- PROUVÉ : preview à l'œil (accueil, /@bertrand) ; production success, www 200, zik4u.com 307, /@bertrand 200 ; CI main verte (run 37795465044). Éprouvé dans l'app le 08/10 avec le compte de test réellement suspendu puis levé.
- RÈGLE : toute nouvelle lecture d'un compte par le site (clé de service) filtre `deleted_at` ET `is_banned`.
- Étiquette : SEC-COCKPIT c2 PRISE (web #5). Consignée aussi dans le MEMORY.md de Zik4U.

## LOGO-2 lot b (2026-10-10) — CLOSE EN PRODUCTION (PR #6, merge `471d52c`)
- Décision de Bertrand du 10/10 : logo = Empreinte « A · Trois sillons » (doc projet claude/LOGO-2-EMPREINTE.md) ; le soleil ÉCLAT est abandonné partout.
- Site : fichiers de `public/`, favicon, SEO, manifeste et page d'accueil passés à l'Empreinte. Garde `src/__tests__/logo2.test.ts`.
- RESTE (WEB-TRUTH1, rang 54) : le JSON-LD de `layout.tsx` pointe le logo `https://zik4u.com/opengraph-image`, qui répond 404 depuis LOGO-2.

## DNA-SILLON site (2026-10-12/13) — CLOSE EN PRODUCTION (PR #7, commit `52c6c12`, merge `e6ad55e`, arbre `a82c2084c8c73b5c06a225922a7f814961a2169a`)
- Décisions de Bertrand du 12/10 (toutes A) : 44 carte partagée = miroir de la carte Music DNA de l'app ; 45 titres nettoyés par le serveur (*_normalized), sinon captés ; 46 aperçu de lien AVEC clé = disque + archétype + écoutes réelles (sans clé : minimal inchangé).
- `src/lib/sharedCard.ts` lit `get_listening_fingerprint` (la clé de service passe can_see_listening), `get_user_top_artists` (4 artistes × 7 j), ON REPEAT par la règle de get_defining_tracks réécrite en TS (`onRepeatOf`), titres par `displayTrack` (D45). `SillonDisc.tsx` : 1 tour / 40 s, arrêt si « réduire les animations », onglet masqué ou hors écran, bulle « Drawn from {n} real listens ». `ListenButton` pill/row (plateformes sous la ligne).
- `CelestialBody.tsx` et `card/[username]/opengraph-image.tsx` SUPPRIMÉS. L'aperçu de lien passe par la route `card/[username]/preview` (reçoit la clé, vérifiée par getSharedCard, private no-store ; sinon MinimalPreview). Police Bebas Neue en TTF.
- RÈGLE : `globals.css` zoome tout le site de 1,25 ; la carte l'annule (`CARD_ZOOM = 0.8` dans `SharedFullCard.tsx`) pour garder les proportions de l'app.
- Garde : `src/__tests__/dna-sillon-site.test.ts` (6 suites, 56 tests web au total).
- Incident Vercel du 12/10 (Git Integrations) : aucun aperçu créé pendant l'incident ; RÈGLE : lire vercel-status.com avant tout diagnostic ; relance par Deployments › « … » › Create Deployment › nom de branche. Aperçu créé à la main le 12/10 ~23:10 Paris (Ready).
- PROUVÉ (13/10) : déploiement Production success, `/@bertrand` 200, CI main verte ; à l'œil sur l'A54 : carte avec la vraie clé conforme à la planche (1 048 real listens, Cultural Nomad) ; aperçu WhatsApp = disque + CULTURAL NOMAD + 1,048 REAL LISTENS + For real. PIÈGE : WhatsApp réutilise l'aperçu d'une adresse déjà envoyée → ajouter un paramètre (`&v=2`).
- Mise en production sans vérification de l'aperçu, à la demande de Bertrand (même commit déjà construit, retour arrière immédiat possible).
- PIÈGE gh : dans statusCheckRollup, le statut Vercel (StatusContext) porte son résultat dans `state`, pas dans `conclusion`.
- SIGNALÉ, NON TRAITÉ : WhatsApp affiche « bbr (@bertrand) » + « the social network built on real listens » à côté de l'image (planche : « Zik4U ») — préco : garder ; bas de carte « Listen to what bbr hears » (nom affiché).
- Branches `dna-sillon-site` et `feat/dna-sillon-site` supprimées. Étiquettes : LOGO-2 (web #6) et DNA-SILLON (web #7) PRISES ; consignées aussi dans le MEMORY.md de Zik4U.
