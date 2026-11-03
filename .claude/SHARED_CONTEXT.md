# ZIK4U — CARTE COMMUNE AUX 5 DÉPÔTS

> Identique octet pour octet dans les 5 dépôts (D252), contrôlée par empreinte par `.claude/tools/etat.sh` de Zik4U.
> Source : dépôt `chardinne/Zik4U`, branche `develop`, `.claude/SHARED_CONTEXT.md`. Ne jamais modifier une copie : modifier la source, puis recopier.
> Cette carte dit OÙ sont les règles et l'état ; elle n'en porte pas (un fichier qui recopie l'état périme).

## Où est la vérité (dépôt `chardinne/Zik4U`, branche `develop`)

| Quoi | Fichier |
|---|---|
| Les règles du binôme Bertrand × Claude | `.claude/CANON.md` (+ `.claude/N2-BASE.md` pour tout travail sur la base) |
| L'état (commits, arbres, migration, APK, services) | `.claude/STATE.md`, contrôlé par `.claude/tools/etat.sh` |
| Les décisions de Bertrand | `.claude/DECISIONS.md` |
| La vision (écrite par Bertrand) | `.claude/VISION.md` |
| L'histoire | `.claude/JOURNAL.md` (`.claude/MEMORY.md` est GELÉ : on y cherche, on n'y écrit plus) |
| L'argent (les 4 dépôts de l'app) | `.claude/REVENUE_FLOW.md`, identique dans Zik4U, web, admin et api |

Depuis un autre dépôt : `git -C ~/projets/Zik4U show origin/develop:.claude/CANON.md`.
En cas d'écart entre ce dépôt et ces fichiers, ce sont eux qui font foi ; l'écart se signale.

## Les 5 dépôts

| Dépôt | Rôle |
|---|---|
| `chardinne/Zik4U` (privé, `develop`) | app mobile React Native, base Supabase de l'app (SEULE source du schéma : `supabase/migrations/`), fonctions Edge |
| `chardinne/Zik4U-web` (public, `main` = production Vercel) | site zik4u.com : vitrine, liste d'attente, cartes partagées, textes légaux |
| `chardinne/Zik4U-admin` (privé, `main`) | back-office interne, poste d'administration seulement ; service Render suspendu |
| `chardinne/Zik4U-api` (privé, `main`) | futur B2B, en sommeil ; service Render suspendu |
| `chardinne/zik4u-activation` (privé, `main`) | ZIK4U ACTIVATION OS (relations avec l'industrie musicale), sur son PROPRE projet Supabase ; cron et site Studio sur Render ; cockpit local, jamais déployé |

## Ce qui vaut partout

- Bertrand (CEO) tranche le produit ; Claude (CTO) tranche la technique et le dit. Un rapport sans sortie de terminal n'est pas une preuve.
- Zéro API tierce musicale ; Zik4U n'est pas un lecteur (PLAY = renvoi vers l'app de musique) ; 80/20 du net reçu après commission du store ; jamais de personne vendue (données agrégées seulement).
- Une fonctionnalité vit dans UN seul dépôt. Toute table ou RPC de l'app lue hors de Zik4U se confronte aux migrations et à la base avant usage.
- Aucun secret en clair dans un fichier suivi par git ; la clé de service ne sort jamais du serveur.
- Textes de l'app, des notifications et du site en anglais ; back-office en français ; code et commits en anglais.
- Entité : SAS française en formation, aucune entité américaine ; un fait d'entité ne s'écrit que dans sa source (canon §7).
