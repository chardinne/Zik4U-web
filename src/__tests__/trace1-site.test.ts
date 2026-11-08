/**
 * TRACE1 (Zik4U session 78, Decisions 244 = B and 245 = A, 03/11/2026) — the sign-in log kept by
 * Zik4U (sign-ins, sign-outs, password and email changes: date, IP, app or browser; one year; deleted
 * with the account) and the IP address of each publication in the record French law requires of
 * hosting services (decree 2021-1362 art. 5). Texts T1-T5 word for word as validated by Bertrand.
 * The sessions sentence no longer says "device type": only the technical name of the client is kept.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8').replace(/&apos;/g, "'");
const flat = (s: string) => s.replace(/\s+/g, ' ');
const en = flat(read('app/legal/privacy/page.tsx'));
const fr = flat(read('app/fr/legal/privacy/page.tsx'));
const delEn = flat(read('app/delete-account/page.tsx'));
const delFr = flat(read('app/fr/delete-account/page.tsx'));

describe('TRACE1 — privacy policy EN', () => {
  it.each([
    'Our sign-in system also keeps the IP address and the name of the app or browser of each signed-in session to protect your account; this record is deleted when you sign out, when you delete your account, or after 12 months without using the app on that device. We also keep a log of the sign-ins, sign-outs and password or email changes on your account (date, IP address, app or browser) for one year, to protect your account and investigate misuse; it is deleted with your account.',
    "'Username, email address, account creation date, identifier, date and IP address of each post, comment or message you published'",
    'and the identifier, date and IP address of each post, comment or message you published (never their content, and none of your listening)',
    '<Strong>Sign-in log</Strong>: 1 year, deleted with your account.',
    "const LAST_UPDATED = 'November 8, 2026';",
  ])('%s', (s) => expect(en).toContain(s));
  it('drops the old wording', () => {
    expect(en).not.toContain('device type');
    expect(en).not.toContain('identifier and date of each post');
  });
});

describe('TRACE1 — politique de confidentialité FR', () => {
  it.each([
    "Notre système de connexion conserve aussi l'adresse IP et le nom de l'app ou du navigateur de chaque session ouverte, pour protéger votre compte ; cette trace est supprimée quand vous vous déconnectez, quand vous supprimez votre compte, ou après 12 mois sans utiliser l'app sur cet appareil. Nous tenons aussi un journal des connexions, déconnexions et changements de mot de passe ou d'adresse e-mail de votre compte (date, adresse IP, app ou navigateur), conservé un an pour protéger votre compte et enquêter sur un abus ; il est supprimé avec votre compte.",
    'identifiant, date et adresse IP de chaque publication, commentaire ou message publié',
    "et l'identifiant, la date et l'adresse IP de chaque publication, commentaire ou message que vous avez publié (jamais leur contenu, et aucune de vos écoutes)",
    '<Strong>Journal des connexions</Strong> : 1 an, supprimé avec votre compte.',
    "const LAST_UPDATED = '8 novembre 2026';",
  ])('%s', (s) => expect(fr).toContain(s));
  it("supprime l'ancienne formulation", () => {
    expect(fr).not.toContain("type d'appareil");
    expect(fr).not.toContain('identifiant et date de chaque publication');
  });
});

describe('TRACE1 — delete-account pages', () => {
  it('EN', () => expect(delEn).toContain('and the identifier, date and IP address of what you published, never its content'));
  it('FR', () => expect(delFr).toContain("et l'identifiant, la date et l'adresse IP de ce que vous avez publié, jamais son contenu"));
});
