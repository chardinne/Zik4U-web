/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// COMPLY1i (texts validated 20/10/2026, Decisions 112-115; D115 = B, no re-acceptance) — the
// site states the one-year record French law (LCEN) requires of hosting services, the
// 12-month sign-in session limit, the retention of technical and admin logs, and that crash
// reports are not linked to an account. Same texts as the app and migration 00224.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/&apos;/g, "'").replace(/\s+/g, ' ');
const visible = (src: string) => src.replace(/^\s*\/\/.*$/gm, '');

const en = flat(read('src/app/legal/privacy/page.tsx'));
const fr = flat(read('src/app/fr/legal/privacy/page.tsx'));
const delEn = flat(read('src/app/delete-account/page.tsx'));
const delFr = flat(read('src/app/fr/delete-account/page.tsx'));

describe('COMPLY1i — privacy policy EN (validated text)', () => {
  it.each([
    'Crash and error reports (the error, your device model, operating system and app version) through Sentry; these reports are not linked to your account.',
    'this record is deleted when you sign out, when you delete your account, or after 12 months without using the app on that device.',
    "['Keeping the record French law requires of hosting services', 'Username, email address, account creation date, identifier and date of each post, comment or message you published', 'Legal obligation (French law on confidence in the digital economy, LCEN)']",
    "it is erased from our live database immediately, except a minimal record that French law requires hosting services to keep for one year, so that the author of published content can be identified at a judge's request: your username, email address, account creation date, and the identifier and date of each post, comment or message you published (never their content, and none of your listening). This record is locked, used only to answer a legal request, and deleted after one year. Residual copies in backups and our providers' technical logs disappear within 30 days.",
    '<Strong>Sign-in sessions</Strong>: closed and deleted after 12 months without use.',
    '<Strong>Technical logs we keep</Strong> (for example the health checks of the service): 1 year. <Strong>Records of actions taken in our administration tool</Strong>: 3 years, for security.',
  ])('%s', (s) => expect(en).toContain(s));

  it('drops the old wording', () => {
    expect(en).not.toContain('(the error, your device model and app version, never your name or email)');
    expect(en).not.toContain('it is erased from our live database immediately. Residual');
  });
});

describe('COMPLY1i — politique de confidentialité FR (texte validé)', () => {
  it.each([
    "Rapports de plantage et d'erreur (l'erreur, le modèle de votre appareil, son système et la version de l'app) via Sentry ; ces rapports ne sont pas reliés à votre compte.",
    "cet enregistrement est supprimé quand vous vous déconnectez, quand vous supprimez votre compte, ou après 12 mois sans utiliser l'app sur cet appareil.",
    "[\"Conserver l'enregistrement que la loi française impose aux hébergeurs\", 'Pseudonyme, adresse e-mail, date de création du compte, identifiant et date de chaque publication, commentaire ou message publié', \"Obligation légale (loi pour la confiance dans l'économie numérique, LCEN)\"]",
    "il est effacé immédiatement de notre base en service, à l'exception d'un enregistrement minimal que la loi française impose aux hébergeurs de conserver un an, pour qu'un juge puisse faire identifier l'auteur d'un contenu publié : votre pseudonyme, votre adresse e-mail, la date de création du compte, et l'identifiant et la date de chaque publication, commentaire ou message que vous avez publié (jamais leur contenu, et aucune de vos écoutes). Cet enregistrement est verrouillé, utilisé uniquement pour répondre à une demande légale, et supprimé au bout d'un an. Les copies résiduelles dans les sauvegardes et les journaux techniques de nos prestataires disparaissent sous 30 jours.",
    '<Strong>Sessions de connexion</Strong> : fermées et supprimées après 12 mois sans utilisation.',
    "<Strong>Journaux techniques que nous conservons</Strong> (par exemple les contrôles de bon fonctionnement du service) : 1 an. <Strong>Traces des actions réalisées dans notre outil d'administration</Strong> : 3 ans, pour la sécurité.",
  ])('%s', (s) => expect(fr).toContain(s));

  it("supprime l'ancienne formulation", () => {
    expect(fr).not.toContain("la version de l'app, jamais votre nom ni votre e-mail)");
    expect(fr).not.toContain('notre base active');
  });

  it('dates both texts on the publication day (D115 = B: no re-acceptance)', () => {
    // Re-dated by COMPLY1-EXPO (Decision 126, 22/10/2026).
    expect(en).toContain("const LAST_UPDATED = 'October 31, 2026';");
    expect(fr).toContain("const LAST_UPDATED = '31 octobre 2026';");
  });
});

describe('COMPLY1i — delete-account pages (validated text)', () => {
  it('EN', () => {
    expect(delEn).toContain(
      "Residual copies in backups and technical logs, erased within 30 days. Records we must keep by law: purchases, payouts and accounting; and, for one year, the minimal record French law requires of hosting services (your username, email, account creation date, and the identifier and date of what you published, never its content). Research reports already delivered, which contain no data about you as an individual.",
    );
  });
  it('FR', () => {
    expect(delFr).toContain(
      "Les copies résiduelles dans les sauvegardes et les journaux techniques, effacées sous 30 jours. Les enregistrements que la loi nous impose de garder : achats, versements et comptabilité ; et, pendant un an, l'enregistrement minimal imposé aux hébergeurs par la loi française (votre pseudonyme, votre e-mail, la date de création du compte, et l'identifiant et la date de ce que vous avez publié, jamais son contenu). Les rapports de recherche déjà livrés, qui ne contiennent aucune donnée sur vous en tant que personne.",
    );
  });
});

describe('COMPLY1i — no long dash (em dash) in the visible text of the four pages', () => {
  it.each([
    'src/app/legal/privacy/page.tsx',
    'src/app/fr/legal/privacy/page.tsx',
    'src/app/delete-account/page.tsx',
    'src/app/fr/delete-account/page.tsx',
  ])('%s', (p) => expect(visible(read(p))).not.toMatch(/\u2014/));
});
