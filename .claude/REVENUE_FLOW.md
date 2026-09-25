# ZIK4U REVENUE FLOW — règles de l'argent
> SOURCE UNIQUE : dépôt `chardinne/Zik4U`, fichier `.claude/REVENUE_FLOW.md`. Les copies de Zik4U-web, Zik4U-admin et Zik4U-api sont IDENTIQUES ; ne jamais modifier une copie.
> Ce fichier porte les RÈGLES et les CHEMINS. Les montants, lignes et statuts se lisent en base ; le détail du calcul dans le code (`supabase/functions/calculate-payouts`, `revenuecat-webhook`).
> Mis à jour : 2026-09-25 (DOC-SHARED1).

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
| Abonnement fan par Stripe (web) | SUPPRIMÉ : `create-stripe-checkout` renvoie 410 |
| Paiements directs créateur-fan (tip, drop, request, pulse) | RETIRÉS du site, de l'admin et de l'api (décision du 24/09/2026) ; UI mobile en pause ; table `creator_direct_payments` conservée. Ne pas réintroduire |
| Offre B2B aux labels (Stripe) | EN SOMMEIL, uniquement dans Zik4U-api, ni vendue ni promise avant le lancement |

Chemin de l'abonnement : l'app enregistre une intention (`subscription_intents`) → achat store (RevenueCat) → `revenuecat-webhook` retrouve le créateur par `resolve_subscription_intent` → écrit `subscriptions` et `revenue_events` (journal, rejeu ignoré par transaction). L'abonné d'un créateur se lit dans `creator_subscriptions.subscriber_id` (jamais `user_id`).
Point ouvert : au premier achat de test, vérifier le format « produit:plan » renvoyé par le store face à `resolve_subscription_intent`.

---

## Sorties d'argent (versements créateurs)
- **Versement AUTOMATIQUE seulement** (décision du 25/09/2026) : back-office « Pay all » → route serveur `/api/admin/pay-all` de Zik4U-admin (contrôle `is_admin`, journal `admin_audit_logs`, aucun montant accepté du client) → fonction `calculate-payouts` (clé service) → Trolley → `payouts_history`. Aucun cron.
- Conditions d'éligibilité et seuil : lire `calculate-payouts` (au 25/09/2026 : `MINIMUM_PAYOUT_USD = 25`, `kyc_status = 'verified'`).
- **Demande de versement depuis l'app** (`submit_payout_request`, table `payout_requests`) : RETIRÉE (SEC-COCKPIT-APP, migration 00179 : service_role seul). Ne pas réintroduire : `calculate-payouts` ne la lit pas, ce serait un risque de double paiement.
- **Inscription du créateur au versement** : aucune surface n'écrit aujourd'hui `trolley_recipient_id` ni `kyc_status = 'verified'` ; sans elles, aucun créateur n'est payable. Décision du 25/09/2026 : inscription autonome dans l'app par la page d'inscription de Trolley, proposée dès que le compte devient créateur (chantier MONEY-OUT1). Zik4U ne stocke ni coordonnées bancaires ni pièce d'identité.
- Point ouvert : un rejet tardif de Trolley laisse la ligne en `processing`.
- Aucun versement manuel d'un montant saisi à la main (route retirée de l'admin le 25/09/2026).

---

## Webhooks et secrets
- `stripe-webhook` et `revenuecat-webhook` : signature ou secret vérifié avant tout traitement ; traitement idempotent (un webhook peut être rejoué).
- `TROLLEY_API_KEY`, clés Stripe et RevenueCat : serveur uniquement. Celles qui ont vécu sur les services Render suspendus sont à régénérer avant tout usage.

## Fiscalité
Rien n'est affirmé ici : elle dépend de l'entité juridique, en cours de décision.
