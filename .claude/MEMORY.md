# MEMORY — Zik4U Web
> Mis à jour après chaque session. Source de vérité de l'état réel du projet.

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
