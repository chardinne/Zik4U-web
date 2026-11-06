# ZIK4U REVENUE FLOW — règles de l'argent
> SOURCE UNIQUE : dépôt `chardinne/Zik4U`, fichier `.claude/REVENUE_FLOW.md`. Les copies de Zik4U-web, Zik4U-admin et Zik4U-api sont IDENTIQUES ; ne jamais modifier une copie.
> Ce fichier porte les RÈGLES et les CHEMINS. Les montants, lignes et statuts se lisent en base ; le détail du calcul dans le code (`supabase/functions/calculate-payouts`, `revenuecat-webhook`).
> Mis à jour : 2026-11-02 (BLOCK1c, remboursement après blocage).

---

## Règle de partage
- **Le créateur reçoit 80 % du NET encaissé par Zik4U, après commission du store** : `creator_share = montant reçu du store × 0,80`. Zik4U garde 20 %.
- **Le chiffre « grille » (prix × 0,80) n'est PAS ce que reçoit le créateur** : mesuré ≈ 81 % de ce chiffre sur Android France (commission store et taxes). Tout écran, texte ou discours qui promet un montant se confronte au calcul réel.
- 10 paliers de prix (migration 00080) : lire la table en base, ne pas les recopier.

---

## Entrées d'argent

| Canal | État |
|---|---|
| Abonnement fan → créateur par achat intégré (Google Play puis App Store, via RevenueCat) | SEUL canal prévu. NON EN SERVICE : clés RevenueCat et produits store à créer (un produit par créateur, id `zik4u_c_<16 hex>_monthly`, dérivé en base) |
| Premium Zik4U | en sommeil (`PREMIUM_ENABLED`) |
| Abonnement fan par Stripe (web) | SUPPRIMÉ : `create-stripe-checkout` et `stripe-webhook` retirées du dépôt et de Supabase (STRIPE-OFF1, 27/09/2026). Ne pas réintroduire |
| Paiements directs créateur-fan (tip, drop, request, pulse) | RETIRÉS du site, de l'admin et de l'api (décision du 24/09/2026) ; UI mobile en pause ; table `creator_direct_payments` conservée. Ne pas réintroduire |
| Offre B2B aux labels (Stripe) | EN SOMMEIL, uniquement dans Zik4U-api, ni vendue ni promise avant le lancement |

Chemin de l'abonnement : achat store (RevenueCat) → `revenuecat-webhook` retrouve le créateur PAR LE PRODUIT (`resolve_store_product`, un produit par créateur, jamais par une donnée écrite par l'app) → écrit `subscriptions` et `revenue_events` (journal, rejeu ignoré par transaction). Le déclencheur `iap2_sync_creator_subscription` sur `subscriptions` est le SEUL écrivain de `creator_subscriptions` pour le store (une ligne par fan et créateur ; résiliation = accès jusqu'à `expires_at`, remboursement et expiration = coupure). L'abonné d'un créateur se lit dans `creator_subscriptions.subscriber_id` (jamais `user_id`). Aucun client n'écrit `subscriptions` ni `creator_subscriptions`.
Point ouvert : au premier achat de test, vérifier le format « produit:plan » renvoyé par le store (`resolve_store_product` accepte les deux formes) et l'accès du fan de bout en bout.

### Remboursement après blocage (BLOCK1c, Décisions 227 et 230-233, migration 00242)
- **Un créateur qui bloque un abonné payant** (période payée en cours) ouvre une affaire `block_refund_cases`, écrite par `block_user` seul (`block1c_open_refund_cases`). L'abonnement prend fin aussitôt : le miroir 00182 (`iap2_sync_creator_subscription`, toujours seul écrivain de `creator_subscriptions`) passe l'abonnement à `cancelled` tant qu'une affaire est ouverte (`block1c_case_open`), même si le store le dit encore actif. Débloquer ne le rétablit pas (D233).
- **Remboursement** (D230) : fait à la main dans la Play Console (« Rembourser » ET « Retirer les droits », sinon l'abonnement continue), puis enregistré au back-office (Finance › Remboursements après blocage, `admin_mark_block_refund`, journalisé). Le store confirme seul : son remboursement arrive par `revenuecat-webhook` (ligne négative au grand livre) et `block1c_store_closed` date la fermeture de l'abonnement. Remboursement automatique par RevenueCat : non retenu au lancement. Textes publics : CGU §9 et §10, conditions créateurs §5, EN + FR (D229, D234, D235), réécrits par D239 le 02/11/2026 (site main 872f1416) : sur Google Play, Zik4U met fin à l'abonnement et rembourse la période en cours ; sur l'App Store, Apple ne permet au développeur ni de résilier ni de rembourser : l'abonné résilie lui-même et demande le remboursement à Apple ; la part du créateur n'est pas versée sur les deux stores. Restent au chantier iOS : les deux lignes de confirmation de l'app (« refunds their current period », « Manage it in Google Play », vraies sur Android seulement) et le sort des renouvellements Apple d'un abonné bloqué qui ne résilie pas (créateur non payé ; argent reversé ou gardé par Zik4U : à trancher).
- **Le créateur n'est pas payé sur cette période** (D231) : `get_creator_payout_balance` retient sa part de chaque paiement couvert par une affaire (paiements de l'abonnement depuis le dernier encaissé avant le blocage, jusqu'à la fermeture par le store) tant que le remboursement n'est pas inscrit au grand livre ; ensuite la ligne négative prend le relais, sans double retenue. Un paiement jamais remboursé reste retenu.
- **Abonné qui bloque son créateur** : rien d'automatique, l'abonnement continue (résiliation dans Google Play). Les notifications du créateur ne lui parviennent plus (`active_creator_subscriber_ids`, lu par `notify-exclusive-post` et `broadcast-to-subscribers`).
- **Confirmation dans l'app** (D228, D232) : `get_block_context` sert les deux lignes (« @x pays a subscription to you… » si une période payée court ; « Your subscription to @x isn't cancelled… » si l'appelant paie et que son renouvellement est actif).
- Aucun client n'écrit `block_refund_cases` ni `revenue_events` (écritures client fermées par 00242).

---

## Sorties d'argent (versements créateurs)
- **Versement AUTOMATIQUE seulement** (décision du 25/09/2026) : back-office « Pay all » → route serveur `/api/admin/pay-all` de Zik4U-admin (contrôle `is_admin`, journal `admin_audit_logs`, aucun montant accepté du client) → fonction `calculate-payouts` (clé service) → Trolley → `payouts_history`. Aucun cron.
- Conditions d'éligibilité et seuil : lire `calculate-payouts` (au 25/09/2026 : `MINIMUM_PAYOUT_USD = 25`, `kyc_status = 'verified'`).
- **Demande de versement depuis l'app** (`submit_payout_request`, table `payout_requests`) : RETIRÉE (SEC-COCKPIT-APP, migration 00179 : service_role seul). Ne pas réintroduire : `calculate-payouts` ne la lit pas, ce serait un risque de double paiement.
- **Inscription du créateur au versement** (MONEY-OUT1, décisions du 25/09/2026) : proposée dès que le compte devient créateur, non bloquante, rappelée dans Revenus. L'app ouvre la page d'inscription HÉBERGÉE PAR TROLLEY par un lien signé de courte durée (fonction `trolley-onboarding-link`, créateurs seulement) ; identité et coordonnées bancaires se saisissent chez Trolley, jamais dans Zik4U. Trolley notifie `trolley-webhook` (signature vérifiée), seul écrivain de `creator_onboarding` via `apply_trolley_recipient_status` (service_role seul, migration 00180) : identifiant Trolley et statut (`not_started`, `pending`, `verified`, `rejected`). L'app ne fait que LIRE sa propre ligne. Tant que les clés Trolley ne sont pas posées, les deux fonctions répondent 503 et rien ne part.
- **Envoi** (MONEY-OUT1 lot b, migration 00181) : `calculate-payouts` paie par lots Trolley signés (`TROLLEY_ACCESS_KEY` / `TROLLEY_SECRET_KEY`) : création du lot, devis, lancement ; chaque ligne `payouts_history` est l'`externalId` de son paiement. Statuts : `pending` (issue inconnue, montant retenu, un humain vérifie chez Trolley), `processing` (parti), `completed` (arrivé), `failed` (refusé ou retourné). Une période n'est jamais rejouée par la fonction.
- **Solde à verser** (`get_creator_payout_balance`) : tout ce qui est gagné avant la fin de la période, moins tout versement qui n'est pas un échec confirmé. Un versement `failed` repart avec le versement suivant, sans geste humain (décision du 25/09/2026) ; un `pending` reste retenu (jamais payé deux fois).
- **Notifications de paiement** : `trolley-webhook` écrit l'état via `apply_trolley_payment_status` (service_role seul, 00181), seul écrivain des états Trolley ; un événement ancien n'écrase jamais un plus récent.
- **Alerte** : la vérification horaire `run_system_health_check` porte un contrôle `payouts` (échec dans les 24 h, `pending` depuis plus d'1 h, `processing` depuis plus de 14 jours) qui alerte par le moniteur Sentry. Aucun message au créateur dans l'app au lancement.
- Mécanismes Trolley tirés de sa documentation, NON MESURÉS avant le premier versement réel (bac à sable d'abord si possible).
- Aucun versement manuel d'un montant saisi à la main (route retirée de l'admin le 25/09/2026).

---

## Webhooks et secrets
- `revenuecat-webhook` et `trolley-webhook` : signature ou secret vérifié avant tout traitement ; traitement idempotent (un webhook peut être rejoué).
- Clés Trolley (`TROLLEY_ACCESS_KEY`, `TROLLEY_SECRET_KEY`, `TROLLEY_WEBHOOK_SECRET`), clés Stripe et RevenueCat : serveur uniquement, posées dans les secrets Supabase. Celles qui ont vécu sur les services Render (supprimés le 05/11/2026, D265) sont à régénérer avant tout usage.

## Fiscalité
Rien n'est affirmé ici : elle dépend de l'entité juridique, en cours de décision.
