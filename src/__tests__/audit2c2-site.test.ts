import * as fs from 'fs';
import * as path from 'path';

// AUDIT2-c2 (D373 = A, 23/11/2026): the Privacy Policy describes the daily app-open count
// BEFORE the app sends it (texts N6 validated by Bertrand; French version and legal-basis row
// added with them). App side: Zik4U migration 00267 and src/core/hooks/useAppOpenCount.ts.

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8').replace(/\s+/g, ' ');
const en = read('app/legal/privacy/page.tsx');
const fr = read('app/fr/legal/privacy/page.tsx');

describe('AUDIT2-c2 — app opens in the Privacy Policy', () => {
  it('English: what is kept, why, how long, legal basis', () => {
    expect(en).toContain("<Strong>App opens.</Strong> When you open the app, our server notes the date of your last visit (one date, replaced each day). We use it only to count how many members use Zik4U each day, as totals that name no one, and to apply the 3-year inactivity rule. It is never used to send you notifications, never combined with other data and never shared.");
    expect(en).toContain("['Counting how many members use Zik4U each day; the 3-year inactivity rule', 'Date of your last visit', 'Legitimate interest: knowing how many people use Zik4U and deleting inactive accounts'],");
    expect(en).toContain('<Strong>Daily totals of app opens</Strong>: 25 months. <Strong>The date of your last visit</Strong>: until your account is deleted.');
    expect(en).toContain('Analytics (Firebase) run only if you accept them.');
    expect(en).toContain("const LAST_UPDATED = 'November 24, 2026';");
  });

  it('French: the same, word for word as validated', () => {
    expect(fr).toContain("<Strong>Ouvertures de l&apos;app.</Strong> Quand vous ouvrez l&apos;app, notre serveur note la date de votre dernière visite (une seule date, remplacée chaque jour). Elle sert uniquement à compter combien de membres utilisent Zik4U chaque jour, sous forme de totaux qui ne nomment personne, et à appliquer la règle des 3 ans d&apos;inactivité. Elle n&apos;est jamais utilisée pour vous envoyer des notifications, jamais croisée avec d&apos;autres données et jamais partagée.");
    expect(fr).toContain(`["Compter combien de membres utilisent Zik4U chaque jour ; règle des 3 ans d'inactivité", 'Date de votre dernière visite', 'Intérêt légitime : savoir combien de personnes utilisent Zik4U et supprimer les comptes inactifs'],`);
    expect(fr).toContain('<Strong>Totaux quotidiens des ouvertures de l&apos;app</Strong> : 25 mois. <Strong>Date de votre dernière visite</Strong> : jusqu&apos;à la suppression de votre compte.');
    expect(fr).toContain('La mesure d&apos;audience (Firebase) ne fonctionne que si vous l&apos;acceptez.');
    expect(fr).toContain("const LAST_UPDATED = '24 novembre 2026';");
  });
});
