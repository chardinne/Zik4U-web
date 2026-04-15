# MEMORY — Zik4U Web
> Mis à jour après chaque session. Source de vérité de l'état réel du projet.

## État actuel (2026-04-15)
- TypeScript : 0 erreur
- Déploiement : Vercel → zik4u.com (auto-deploy sur push main)
- Stack : Next.js 16.1.6 / Tailwind 4 / App Router

## Chantiers en cours
- C Corp Zik4U Inc. Florida — BLOQUANT Stripe prod
- Stripe prod webhooks en attente de C Corp

## Tests — Jest configuré (2026-04-15)
- **14 tests / 4 suites — 100% passants** (`npx jest --no-coverage`)
- Routes couvertes : payment-webhook (4), creator-payment (4), partner-webhook (3), partner-ai (3)
- Pattern de mock : `jest.mock('@/lib/stripe-server', ...)` + `jest.requireMock()`/`require()` dans `beforeEach`
- Supabase mock pattern : `createServiceClient: jest.fn()` → `.mockReturnValue({ from: jest.fn().mockReturnValue({ select, update, insert }) })`
- Tests ciblent auth/validation early-returns → aucun mock chain profond requis
- Idempotency testée : `update` non appelé si `status === 'paid'` déjà

## Gap critique non résolu
- /api/creator/payment-webhook : idempotency testée côté status=paid ✅ — vérifier stripe_session_id UNIQUE constraint côté DB

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
