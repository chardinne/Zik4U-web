# ZIK4U REVENUE FLOW — Flux Financier Complet
> Source de vérité pour tout ce qui touche à l'argent.
> Mis à jour : 2026-04-15

---

## 💰 MONEY IN — Sources de revenus

### Canal 1 : Fan → Abonnement créateur (Web)
```
Fan → CreatorSubscribeScreen → create-stripe-checkout (Edge Function)
  lookup_key: zik4u_creator_{creatorId}_{revenueTierId}_{billingPeriod}
  Stripe Tax auto + customer_update: { address: 'auto' }
→ checkout.stripe.com
→ Webhook stripe-webhook → INSERT subscriptions + creator_subscriptions + revenue_events
```

### Canal 2 : Fan → Abonnement créateur (Mobile iOS/Android)
```
Fan → resolve_subscription_intent() → subscription_intents (expire 15min)
→ RevenueCat IAP (appleProductId / googleProductId)
→ Webhook revenuecat-webhook → résout subscription_intents → creator_subscriptions + revenue_events
```

### Canal 3 : Paiements directs créateur-fan
```
4 types : request · drop_unlock · pulse_session · tip
Table centrale : creator_direct_payments (migration 00085)
  payment_type IN ('request', 'drop_unlock', 'pulse_session', 'tip')
  status IN ('pending', 'paid', 'expired', 'cancelled')
  stripe_session_id TEXT UNIQUE  -- idempotency key
  creator_share_usd NUMERIC(8,2) -- 80%
  platform_share_usd NUMERIC(8,2) -- 20%
Tous via : POST /api/creator/payment (zik4u-web) → Stripe Checkout → Linking.openURL
Webhook : /api/creator/payment-webhook → UPDATE status='paid'
⚠️ Idempotency check OBLIGATOIRE avant tout UPDATE (Stripe peut rejouer)
```

### Canal 4 : B2B Partenaires
```
Stripe subscription via /api/partner/checkout
4 tiers : Discover · Insight · Intelligence · Enterprise
Webhook : /api/partner/webhook (vérification HMAC obligatoire)
```

---

## 💸 MONEY OUT — Paiements créateurs

### Split
- **80% créateur / 20% Zik4U** (net après frais store/Stripe)
- Frais Stripe web : 2.9% + $0.30 déduits avant calcul du split
- Frais stores (iOS/Android) : répercutés sur l'abonné via price_ios_30 / price_android (×1.15)
- Table `revenue_events` (log immutable — jamais de UPDATE/DELETE) :
  - `creator_share` = net × 0.80
  - `platform_share` = net × 0.20

### 10 paliers de revenus créateur (migration 00080)
| tier_key | Prix web | Revenu créateur/mois |
|---|---|---|
| tier_1 Starter | $1.00 | $0.80 |
| tier_2 Spark | $2.00 | $1.60 |
| tier_5 Fan | $5.00 | $4.00 |
| tier_10 Supporter | $10.00 | $8.00 |
| tier_15 Enthusiast | $15.00 | $12.00 |
| tier_20 Patron | $20.00 | $16.00 |
| tier_30 Devotee | $30.00 | $24.00 |
| tier_50 Superfan | $50.00 | $40.00 |
| tier_75 VIP | $75.00 | $60.00 |
| tier_100 Legend | $100.00 | $80.00 |

### Workflow Payout Trolley
```
Edge Function calculate-payouts (cron 1er du mois)
  → SELECT créateurs : solde ≥ $25 + kyc_status='verified' + trolley_recipient_id présent
  → Trolley API POST /v1/payments → virement Mercury (Zik4U Inc. Florida)
  → INSERT payouts_history (status: processing + trolley_payment_id)
  → ⚠️ Payouts > $500 : flag manuel requis dans admin.zik4u.com/creators
```

### Tables critiques
```
revenue_events          → log immutable (append-only, JAMAIS de UPDATE/DELETE)
creator_direct_payments → source de vérité paiements directs
payouts_history         → historique virements Trolley
creator_onboarding      → kyc_status + trolley_recipient_id + payout_method
subscriptions           → abonnements actifs
creator_revenue_tiers   → 10 paliers actifs (migration 00080)
```

---

## 🛡️ COMPLIANCE FISCALE
- 1099-K IRS : créateurs avec revenus ≥ $600/year (export CSV admin)
- W-8BEN : créateurs non-US (via Trolley)
- Stripe Tax : activé sur tous les checkouts web (customer_update: address auto)
- `profiles.tax_verified` : statut de vérification fiscale
- Formulaires auto-générés via Trolley (pas d'action manuelle requise)

---

## 🔑 CLÉS & WEBHOOKS — règles de sécurité
- `STRIPE_WEBHOOK_SECRET` : vérification signature OBLIGATOIRE avant tout traitement
- `REVENUECAT_WEBHOOK_SECRET` : idem
- `TROLLEY_API_KEY` : server-side uniquement, jamais exposé côté client
- Webhook Stripe peut rejouer → idempotency check sur `stripe_session_id` TOUJOURS
