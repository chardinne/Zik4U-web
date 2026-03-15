# CLAUDE.md — Zik4U-web

## Vue d'ensemble
Site public Next.js 14 App Router pour Zik4U.
Tunnels d'acquisition : listeners et créateurs.
Backend partagé avec l'app mobile via Supabase.

## Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase JS (auth + DB)
- Framer Motion (animations)
- Stripe (checkout abonnements créateurs)

## Supabase
- Project ID : eirkzsbjlwmflwhqihiw
- Même base que l'app mobile
- Auth partagée (même compte = app mobile + web)

## Structure
src/
  app/
    /                    → Landing (choix Users / Creators)
    /users               → Tunnel listener (browse créateurs)
    /creators            → Tunnel créateur (inscription)
    /creator/[username]  → Profil public créateur
    /subscribe/[creatorId] → Checkout Stripe
  components/
    landing/             → Composants landing page
    ui/                  → Composants réutilisables
    auth/                → Modals auth Google/Apple/Email
  lib/
    supabase.ts          → Client Supabase
  types/
    index.ts             → Types partagés

## Design System
- Palette : cyan #00D4FF, mint #00FFB2, pink #FF3CAC, violet #7B2FFF
- Background : #0A0A1A (dark mode uniquement)
- Police : Inter (web) — Bebas Neue pour titres impact
- Gradient signature : #00D4FF → #00FFB2 → #FF3CAC
- Gradient creator : #FF3CAC → #7B2FFF

## Conventions
- Tailwind pour tous les styles
- Framer Motion pour les animations
- Jamais de secrets dans le code client
- Auth Supabase partagée avec l'app mobile
