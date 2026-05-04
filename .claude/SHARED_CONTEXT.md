# ZIK4U SHARED CONTEXT — Source of Truth
> Lire ce fichier EN PREMIER avant toute session dans n'importe quel repo Zik4U.
> Mis à jour : 2026-05-02

---

## 🗄️ SUPABASE — Instance de production
- **Project ID** : qjrwjdlqlmyliinfjjic (us-east-1)
- **PostgreSQL** : 17
- **Migrations** : 00001 → 00100 toutes appliquées en DB
- **Edge Functions** : 22 actives
- **Crons actifs** : notify-convergence (4h) · refresh-compatibility (0 */6 * * *) · compute-archetypes (daily) · seed-official-posts (lundi 10h UTC) · notify-daily-digest (9h UTC) · creator-milestone-check (9h) · notify-creator-progress (11h UTC) · compute-emotional-profile (3h UTC)
- **RPC Functions** : 60+ (voir CLAUDE.md mobile pour liste complète)
- ⚠️ JAMAIS utiliser eirkzsbjlwmflwhqihiw — c'est l'ancien projet (eu-central-1), plus actif.

---

## 📦 REPOS — Identités & règles

| Repo | Branche | Déploiement | Stack |
|---|---|---|---|
| chardinne/Zik4U | main | EAS (e52ddb31 / chardinne) | RN 0.79.6 / Expo SDK 53 / TS 5.8 |
| chardinne/Zik4U-web | main | Vercel → zik4u.com | Next.js 16 / Tailwind 4 |
| chardinne/Zik4U-admin | main | Render → admin.zik4u.com | Next.js 14 / Tailwind 3 |
| chardinne/Zik4U-api | main | Render (DÉCISION PENDING — Option B : suppression recommandée) | Next.js 16 |

---

## 🚦 RÈGLES CROSS-REPO NON-NÉGOCIABLES

### TypeScript
- Toujours vérifier `npx tsc --noEmit` → 0 errors avant tout commit (web/admin/api)
- Mobile : `npx jest --passWithNoTests` doit passer (851 tests)

### SQL / Migrations
- Dollar-quote : `$$` (jamais `$`)
- `CREATE INDEX IF NOT EXISTS` — JAMAIS `CREATE INDEX CONCURRENTLY` dans une transaction
- `SECURITY DEFINER SET search_path = public` sur TOUTES les RPCs et fonctions
- Pas de `DELETE` sur les données utilisateur — soft delete uniquement (`is_deleted = true`)

### Tailwind
- **Web (v4)** : `@tailwindcss/postcss` — JAMAIS de `tailwind.config.ts`
- **Admin (v3)** : `tailwind.config.ts` présent et requis — fonctionnement normal

### MMKV (mobile uniquement)
- `storage.remove(key)` — JAMAIS `storage.delete(key)`
- Pattern lazy getter OBLIGATOIRE (Android NitroModules crash sinon) :

```typescript
let _s: MMKV | null = null;
function getStorage(): MMKV {
  if (!_s) _s = createMMKV({ id: 'xxx' });
  return _s;
}
```

- `createMMKV()` JAMAIS au niveau module

### Paiements & compliance Apple/Google
- JAMAIS de paiement in-app direct pour les flux créateur-fan
- Tous les paiements directs → `Linking.openURL(stripeCheckoutUrl)` uniquement
- RevenueCat = UNIQUEMENT pour l'abonnement premium Zik4U

### Auth Supabase (web/admin/api)
- Routes intelligence partenaire → `createPartnerClient()` (anon key)
- Routes paiement/admin → `createServiceClient()` (service role)
- JAMAIS mélanger les deux dans le même handler

### Android (mobile)
- `newArchEnabled=false` dans `android/gradle.properties` — maintenu jusqu'à Expo SDK 55+
- Metro config : `expo/metro-config` — JAMAIS `@react-native/metro-config`

---

## 🎨 DESIGN SYSTEM

| Contexte | Couleur principale | Notes |
|---|---|---|
| Listener | Cyan / Mint | Profil identité passive |
| Creator | Pink / Purple gradient | #FF3CAC sidebar admin |
| Fan | Gold / Cyan badge | FanBadge BebasNeue |

- Slogan non-négociable : **"For real."** — présent sur toutes surfaces marketing
- UI langue : **anglais uniquement** (le français déclenche Chrome auto-translate et corrompt les labels)
- 3 tunnels toujours visibles et distincts : **LISTENERS / CREATORS / FANS**

---

## 🏢 ENTITÉ LÉGALE
- **Zik4U Inc.** — Florida C Corp (pas LLC) — formation via Firstbase
- **BLOQUANT** (jusqu'à formation confirmée) : Apple Developer Program · Google Play Console · RevenueCat prod · Stripe prod · Trolley KYC
- EIN en attente → toutes les intégrations production sont en standby

---

## ⚠️ GAPS CRITIQUES CONNUS (ne pas régresser)

| Repo | Gap | Criticité |
|---|---|---|
| zik4u-web | payment-webhook sans idempotency key → double insert possible | 🔴 |
| zik4u-admin | ~~0 audit trail · 0 tests · 0 Sentry~~ ✅ résolu sprint 2026-04-16 | ✅ |
| zik4u-api | Mirror zik4u-web — décision suppression en attente | 🟡 |
| mobile | Real google-services.json manquant · RESEND_API_KEY non configuré | 🟡 |

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
Current state (2026-05-02): SUPABASE_ANON_KEY, GOOGLE_WEB_CLIENT_ID,
SENTRY_DSN propagated to all 3 environments ✅.

**react-native-config + EAS (CRITIQUE — 2026-05-02):**
`dotenv.gradle` reads **ONLY `.env` files**, never OS environment variables.
EAS env section values and EAS Secrets are injected as OS env vars by EAS,
but `react-native-config` never reads them. Without a build hook, ALL
`Config.VAR` calls return empty strings in EAS builds.

**Fix applied (2026-05-02):** `eas-hooks/eas-build-post-install.sh` generates
`.env` from `$SUPABASE_URL`, `$SUPABASE_ANON_KEY`, `$SENTRY_DSN`, etc. before
the Gradle step. `eas.json` all 3 profiles: `hooks.post_install` → this script.

**Symptom if hook is missing:** `Config.SUPABASE_URL=""` →
`createClient('','')` throws → `supabase` export undefined →
`TypeError: Cannot read properties of undefined (reading 'from')` inside
`ConnectedServiceDataSource.getConnected()` at runtime.

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
