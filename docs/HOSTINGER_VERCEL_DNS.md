# Déploiement zik4u.com — Hostinger DNS → Vercel

## Contexte
Le domaine zik4u.com est acheté sur Hostinger.
Le site web Next.js est déployé sur Vercel.
Ces étapes connectent les deux.

## Étape 1 — Déployer sur Vercel

1. Aller sur vercel.com → New Project
2. Importer le repo GitHub : chardinne/Zik4U-web
3. Framework : Next.js (auto-détecté)
4. Variables d'environnement à configurer dans Vercel :
   - NEXT_PUBLIC_SUPABASE_URL = https://eirkzsbjlwmflwhqihiw.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = (depuis Supabase Dashboard → Settings → API)
   - NEXT_PUBLIC_SITE_URL = https://zik4u.com
5. Cliquer Deploy → noter l'URL Vercel (ex: zik4u-web.vercel.app)

## Étape 2 — Ajouter le domaine sur Vercel

1. Dans Vercel → Settings → Domains
2. Ajouter : zik4u.com
3. Vercel affiche 2 valeurs DNS à configurer :
   - Type A : 76.76.21.21
   - Type CNAME : cname.vercel-dns.com

## Étape 3 — Configurer Hostinger

1. Aller sur hpanel.hostinger.com
2. Domaines → zik4u.com → DNS Zone
3. Supprimer les enregistrements A et CNAME existants pour @ et www
4. Ajouter :
   - Type : A | Nom : @ | Valeur : 76.76.21.21 | TTL : 3600
   - Type : CNAME | Nom : www | Valeur : cname.vercel-dns.com | TTL : 3600
5. Sauvegarder

## Étape 4 — Admin sur admin.zik4u.com

Pour le sous-domaine admin :
- Dans Hostinger DNS, ajouter :
  - Type : CNAME | Nom : admin | Valeur : cname.vercel-dns.com | TTL : 3600
- Dans Vercel (repo Zik4U-admin) → Settings → Domains → ajouter admin.zik4u.com

## Délai de propagation
24-48h maximum. Vérifier sur dnschecker.org avec zik4u.com.

## Validation finale
- https://zik4u.com → landing page Zik4U ✅
- https://zik4u.com/legal/privacy → Privacy Policy ✅
- https://admin.zik4u.com → Login admin ✅
