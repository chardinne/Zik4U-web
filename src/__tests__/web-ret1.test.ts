/**
 * WEB-RET1 (24/10/2026) — Privacy Policy retention lines, EN and FR.
 * - Decision 138: inactive accounts are warned by e-mail 30 days before (INACT1, Zik4U 00228).
 * - Decision 140: usage analytics separates our records (13 months, deleted at withdrawal)
 *   from events already sent to Google Analytics (2 months, Decision 139); crash and error
 *   reports up to 90 days (Sentry: 30 days free plan, 90 days paid plans).
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const en = read('app/legal/privacy/page.tsx');
const fr = read('app/fr/legal/privacy/page.tsx');

describe('WEB-RET1 — retention lines', () => {
  it('EN says the validated sentences', () => {
    expect(en).toContain('<Strong>Inactive accounts</Strong>: deleted after 3 years without any activity. We email you 30 days before, so you can keep your account by opening the app.');
    expect(en).toContain('<Strong>Usage analytics</Strong> (only if you accept): the records in our database are kept 13 months and deleted at once when you turn analytics off; events already sent to Google Analytics are kept 2 months by Google.');
    expect(en).toContain('<Strong>Crash and error reports</Strong>: up to 90 days.');
    expect(en).not.toContain('13 months, and deleted at once when you turn analytics off.');
  });

  it('FR says the validated sentences', () => {
    expect(fr).toContain('<Strong>Comptes inactifs</Strong> : supprimés après 3 ans sans aucune activité. Nous vous écrivons 30 jours avant ; il suffit d&apos;ouvrir l&apos;app pour garder votre compte.');
    expect(fr).toContain('<Strong>Mesure d&apos;audience</Strong> (uniquement si vous l&apos;acceptez) : les enregistrements de notre base sont conservés 13 mois et effacés dès que vous la désactivez ; les événements déjà envoyés à Google Analytics sont conservés 2 mois par Google.');
    expect(fr).toContain('<Strong>Rapports de plantage et d&apos;erreur</Strong> : 90 jours au plus.');
    expect(fr).not.toContain('13 mois, et supprimée aussitôt que vous la désactivez.');
  });

  it('dates the change and keeps the site rule (no long dash in the new lines)', () => {
    expect(en).toContain("const LAST_UPDATED = 'October 30, 2026';");
    expect(fr).toContain("const LAST_UPDATED = '30 octobre 2026';");
    for (const line of [...en.split('\n'), ...fr.split('\n')].filter((l) => /Google Analytics are kept|Comptes inactifs|Crash and error|plantage et d&apos;erreur/.test(l))) {
      expect(line).not.toMatch(/—/);
    }
  });
});
