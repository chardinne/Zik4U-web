/**
 * BLOCK1d (Zik4U session 73, Decision 229 = A) — blocking a member, in the Privacy Policy §3 and the
 * Terms §7, EN and FR, word for word (project doc claude/BLOCK1-TEXTES.md). Blocking exists in the
 * app since Zik4U 00240 / APK bc2cbea7; the Terms §8 and the Music Match section of the Policy
 * already promised it. The §9 sentence on a creator blocking a subscriber comes with BLOCK1c.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');

describe('BLOCK1d — Privacy Policy §3', () => {
  it('EN', () => {
    expect(flat(read('app/legal/privacy/page.tsx'))).toContain(
      '<Strong>Accounts you block.</Strong> The list of members you have blocked. It is used only to keep you apart, is never shown to them, and is deleted when you unblock them or delete your account.',
    );
  });
  it('FR', () => {
    expect(flat(read('app/fr/legal/privacy/page.tsx'))).toContain(
      "<Strong>Comptes que vous bloquez.</Strong> La liste des membres que vous avez bloqués. Elle sert uniquement à vous tenir à distance l&apos;un de l&apos;autre, ne leur est jamais montrée, et est effacée quand vous les débloquez ou supprimez votre compte.",
    );
  });
});

describe('BLOCK1d — Terms §7', () => {
  it('EN', () => {
    expect(flat(read('app/legal/terms/page.tsx'))).toContain(
      'You can block any member from their profile, a post, a comment or a conversation: you will no longer see or contact each other, and they are not told.',
    );
  });
  it('FR', () => {
    expect(flat(read('app/fr/legal/terms/page.tsx'))).toContain(
      "Vous pouvez bloquer tout membre depuis son profil, une publication, un commentaire ou une conversation : vous ne vous verrez plus et ne pourrez plus vous contacter, et il n&apos;en est pas informé.",
    );
  });
  it('the creator refund sentence waits for BLOCK1c (no promise before the code)', () => {
    expect(read('app/legal/terms/page.tsx')).not.toContain('refunds the current period');
  });
});
