/**
 * WEB-CGU1 (24/10/2026, Decision 146) — Terms of Service §7, EN and FR.
 * The app can report posts and comments only (reports.target_type IN ('post','comment'),
 * Zik4U migration 00193); anything else is reported by e-mail to support@. The Terms said
 * « any post, comment, message or account in the app », which was false.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const en = flat(read('app/legal/terms/page.tsx'));
const fr = flat(read('app/fr/legal/terms/page.tsx'));

describe('WEB-CGU1 — reporting sentence', () => {
  it('EN says what the app can report and where the rest goes', () => {
    expect(en).toContain("You can report any post or comment in the app, and anything else (a message, an account) by writing to{' '} <Mail to={SUPPORT} />.");
    expect(en).not.toContain('any post, comment, message or account in the app');
    expect(en).toContain("const LAST_UPDATED = 'October 24, 2026';");
  });

  it('FR says the same', () => {
    expect(fr).toContain('Vous pouvez signaler toute publication ou tout commentaire dans l&apos;app, et tout le reste (un message, un compte) en écrivant à <Mail to={SUPPORT} />.');
    expect(fr).not.toContain('tout commentaire, message ou compte dans l&apos;app');
    expect(fr).toContain("const LAST_UPDATED = '24 octobre 2026';");
  });
});
