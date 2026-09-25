# ZIK4U SHARED CONTEXT — consignes communes aux 4 dépôts
> SOURCE UNIQUE : dépôt `chardinne/Zik4U`, fichier `.claude/SHARED_CONTEXT.md`.
> Les copies de Zik4U-web, Zik4U-admin et Zik4U-api sont IDENTIQUES octet pour octet. Ne jamais modifier une copie : modifier la source, puis recopier dans les trois autres dépôts.
> Ce fichier porte des RÔLES et des RÈGLES. L'ÉTAT (crons, versions de fonctions, secrets, comptes, lignes en base) se lit à sa source, jamais ici : un fichier qui copie l'état périme.
> Mis à jour : 2026-09-25 (DOC-SHARED1). Historique des décisions : `.claude/MEMORY.md` du dépôt Zik4U.

---

## Non-négociables produit
- **Zéro API tierce musicale** : aucune connexion OAuth à Spotify, SoundCloud, Deezer, Apple Music ou autre. La captation est passive (notifications de lecture sur l'appareil).
- **Zik4U n'est pas un lecteur** : PLAY = renvoi (deeplink) vers l'application de l'utilisateur.
- **Partage 80/20 du NET** reçu après commission store (voir `.claude/REVENUE_FLOW.md`).
- **UI en anglais uniquement.**
- **Un texte public ou légal ne décrit que ce qui existe le jour où il est lu.**

## Identité de marque (décision de Bertrand du 25/09/2026)
- Slogan **« For real. »** présent sur les surfaces marketing (accueil, pages Listeners / Creators / Fans, cartes de profil partagées).
- **3 parcours toujours visibles et distincts** sur le site : **Listeners / Creators / Fans** (pages `/listeners`, `/creators`, `/fans`).
- Couleurs par profil : NON FIXÉES par cette consigne (à confirmer à l'œil lors d'un chantier d'interface).

---

## Rôles des 4 dépôts (arbitrés par Bertrand le 24/09/2026)

| Dépôt | Rôle | Hébergement |
|---|---|---|
| chardinne/Zik4U | app mobile + base + fonctions Edge, SEULE source de vérité du schéma | branche de travail `develop` (`main` volontairement en retard) ; APK par GitHub Actions « Android Local Build », builds EAS |
| chardinne/Zik4U-web (public) | vitrine publique, cartes partagées, textes légaux ; rien à vendre qui ne soit livré | Vercel, www.zik4u.com ; un push sur `main` = mise en production |
| chardinne/Zik4U-admin (privé) | back-office interne SEUL | poste d'administration uniquement, jamais publié ; service Render suspendu le 24/09/2026 |
| chardinne/Zik4U-api (privé) | seule maison du futur B2B (labels), EN SOMMEIL jusqu'au volume | jamais publié ; service Render suspendu le 24/09/2026 |

- **Une fonctionnalité vit dans UN seul dépôt.** Ne jamais recopier une fonctionnalité d'un dépôt à l'autre (le B2B a existé en 3 copies divergentes).
- **Aucune offre aux labels n'est vendue ni promise avant le lancement.**
- **Aucun paiement créateur hors store** : les paiements directs Stripe (70/30) ont été retirés des trois dépôts web/admin/api.
- Un service hébergé se constate dans sa console (Vercel, Render) et depuis l'extérieur (curl), jamais d'après la documentation ou un nom de domaine.

---

## Base Supabase
- **Un seul projet** : `qjrwjdlqlmyliinfjjic`. Ne jamais utiliser `eirkzsbjlwmflwhqihiw` (ancien projet).
- **Le schéma se lit dans `supabase/migrations/` du dépôt Zik4U et en base.** Aucun autre dépôt ne porte de migration.
- **Toute table, colonne ou RPC lue par le site, l'admin ou l'api se confronte à la base avant usage** (`information_schema.columns`, `pg_proc`). Une requête sur une colonne absente échoue en silence : supabase-js renvoie `{ error }`, il ne lève pas.
- **Crons** : lire `cron.job` en base (`SELECT jobid, jobname, schedule, active FROM cron.job ORDER BY jobid;`).
- **Nouvelle fonction SECURITY DEFINER** : `SET search_path = public`, puis `REVOKE EXECUTE … FROM PUBLIC, anon, authenticated` et `GRANT` explicite aux seuls rôles voulus.
- **Confidentialité** : toute lecture des écoutes, de l'activité ou de la compatibilité d'un autre utilisateur passe par `listening_visible_to` (ou `can_see_listening` en RLS) ; les listes d'abonnés par `follow_lists_visible_to` ; une fonction « pour » un utilisateur commence par `caller_is(...)` ; une paire fan ↔ créateur par `creator_pair_allowed`.
- **Site** : toute page lue avec la clé service passe par `src/lib/publicProfile.ts` (minimal) ; la carte complète SEULEMENT par `src/lib/sharedCard.ts` après vérification de la clé de partage.
- **Administration** : `is_admin()` lit `admin_users`. Un admin se nomme uniquement au SQL Editor, jamais depuis une interface.
- SQL : dollar-quote `$$` ; `CREATE INDEX CONCURRENTLY` jamais dans une transaction.

---

## Clés et secrets
- La clé service Supabase ne sort jamais du serveur (jamais dans un bundle client ni une variable `NEXT_PUBLIC_*`).
- Aucun secret ni clé d'accès écrit en clair dans un fichier suivi par git (fichiers `.claude/` compris).
- Un secret qui a vécu sur un service publié avec une porte ouverte se régénère, même sans preuve de fuite.
- Routes partenaires (api) : `createPartnerClient()` (anon + RPC `partner_get_*` gardées par clé) ; routes serveur privilégiées : `createServiceClient()`. Jamais les deux dans le même handler.

---

## Vérification avant commit, par dépôt

| Dépôt | Gestionnaire | Porte de vérification |
|---|---|---|
| Zik4U | yarn | CI « Lint, TypeScript, Tests » sur push/PR vers `main` et `develop` |
| Zik4U-web | npm (`npm ci`) | CI « Lint (scoped), TypeScript, Tests, Build » sur `main` ; tout nouveau fichier de garde s'ajoute à `npm run lint:ci` |
| Zik4U-admin | npm (`npm ci`) | aucune CI : `npm test`, `npx next build`, puis `npx tsc --noEmit` |
| Zik4U-api | npm (`npm ci`) | aucune CI : `npm run check:scope`, `npx next build`, puis `npx tsc --noEmit` |

Un nouveau test de garde doit échouer sur l'ancien état.

---

## Tailwind
- **Web (v4)** : `@tailwindcss/postcss`, pas de `tailwind.config.ts`.
- **Admin (v3)** : `tailwind.config.ts` présent et requis.

## Mobile (Zik4U)
- **MMKV** : `storage.remove(key)`, jamais `storage.delete(key)`. `createMMKV()` jamais au niveau module : accesseur paresseux obligatoire.

```typescript
let _s: MMKV | null = null;
function getStorage(): MMKV {
  if (!_s) _s = createMMKV({ id: 'xxx' });
  return _s;
}
```

- **Android** : `newArchEnabled=false` (ancienne architecture). Metro : `expo/metro-config`, jamais `@react-native/metro-config`.
- **Variables EAS** : le fichier `.env` n'est pas vu par EAS Build. Une variable publique va dans `eas.json`, une sensible dans les variables d'environnement expo.dev, pour chaque environnement concerné (development, preview, production). Symptôme d'un oubli : l'app démarre puis plante au premier usage de la variable.
- **Version Android** : `app.json` est la source unique ; `versionCode` se monte à la main.
- **Le manifeste réel se lit dans l'APK**, pas dans `app.json`.

## Entité juridique
Ne rien affirmer sur l'entité dans un texte public ou dans le code. La structure est en cours de décision ; les textes légaux du site sont à revoir avec l'avocat.
