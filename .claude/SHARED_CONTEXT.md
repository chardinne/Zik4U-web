# ZIK4U SHARED CONTEXT — Source of Truth
> Lire ce fichier EN PREMIER avant toute session dans n'importe quel repo Zik4U.
> Mis à jour : 2026-04-15

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
- Mobile : `npx jest --passWithNoTests` doit passer (826 tests)

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
| zik4u-admin | 0 audit trail · 0 tests · 0 Sentry · pas d'error boundaries | 🟠 |
| zik4u-api | Mirror zik4u-web — décision suppression en attente | 🟡 |
| mobile | Real google-services.json manquant · RESEND_API_KEY non configuré | 🟡 |
