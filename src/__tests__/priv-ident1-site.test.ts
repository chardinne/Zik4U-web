// PRIV-IDENT1 (session 71, 30/10/2026) — the Privacy Policy says what the app now does:
// links to other networks, relationship status (18+), free-text location.
// Decisions 208 = A (contract), 209 = A (no new acceptance), 210 = A (texts validated),
// 211 (text A without naming a streaming service: Decision 106).
// claude/PRIV-IDENT1-TEXTES.md in the project.
import fs from 'fs';
import path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const en = flat(read('app/legal/privacy/page.tsx'));
const fr = flat(read('app/fr/legal/privacy/page.tsx'));

describe('PRIV-IDENT1 — privacy policy', () => {
  it('no longer says relationship status is not collected (false since migration 00237)', () => {
    expect(en).not.toContain('We do not collect relationship status');
    expect(fr).not.toContain('Nous ne collectons pas de situation amoureuse');
    expect(en).toContain('your location, or your relationship status.');
    expect(fr).toContain('ni votre localisation, ni votre situation amoureuse.');
  });

  it('lists the optional profile details (text A)', () => {
    expect(en).toContain(
      'If you add them in Edit profile: your location (shown only to you), your usernames on other networks offered in the app (for example Instagram, TikTok, X, Snapchat or Facebook) and, if you are 18 or older, your relationship status (single or in a relationship). All three are optional, and you can remove them at any time.',
    );
    expect(fr).toContain(
      'Si vous les ajoutez dans « Edit profile » : votre localisation (visible de vous seul), vos noms d&apos;utilisateur sur d&apos;autres réseaux proposés dans l&apos;app (par exemple Instagram, TikTok, X, Snapchat ou Facebook) et, si vous avez 18 ans ou plus, votre situation amoureuse (célibataire ou en couple). Ces trois informations sont facultatives et vous pouvez les retirer à tout moment.',
    );
  });

  it('states the legal basis (text B, Decision 208 = A)', () => {
    expect(en).toContain("'Performance of our contract with you: you choose to add them, and you can remove them at any time'");
    expect(fr).toContain("'Exécution de notre contrat avec vous : vous choisissez de les ajouter et pouvez les retirer à tout moment'");
  });

  it('says who can see them (text D)', () => {
    expect(en).toContain(
      'If you add them, they are shown on your profile in the app to signed-in members only, never to visitors without an account and never on our website. On a private account, only followers you have approved see them. Your relationship status is shown only if you are 18 or older.',
    );
    expect(fr).toContain(
      'Si vous les ajoutez, ils sont affichés sur votre profil dans l&apos;app, aux membres connectés seulement : jamais aux visiteurs sans compte, jamais sur notre site.',
    );
  });

  it('has no long dash in the new texts (site rule)', () => {
    for (const s of [en, fr]) {
      const i = s.indexOf('relationship status') >= 0 ? s.indexOf('Links to your other networks') : s.indexOf('Liens vers vos autres réseaux');
      expect(s.slice(i, i + 600)).not.toMatch(/—/);
    }
  });

  it('is dated 30 October 2026 in both languages', () => {
    expect(en).toContain("const LAST_UPDATED = 'October 30, 2026';");
    expect(fr).toContain("const LAST_UPDATED = '30 octobre 2026';");
  });
});
