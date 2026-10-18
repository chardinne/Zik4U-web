/// <reference types="node" />
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// WEB-LEGAL1 (18/10/2026) — Decision 92 = B: a legal notice page (publisher, publication
// director, contact, host, data storage) published before the company is registered,
// without home address or phone number. Decision 93 = A: the Privacy Policy says that the
// sign-in system keeps the IP address and device type of each signed-in session.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const visible = (src: string) => src.replace(/^\s*\/\/.*$/gm, '');
const NOTICE = 'src/app/legal/notice/page.tsx';

describe('WEB-LEGAL1 — legal notice (Decision 92 = B)', () => {
  it('exists', () => {
    expect(existsSync(join(root, NOTICE))).toBe(true);
  });

  it('carries the validated texts word for word', () => {
    const s = flat(read(NOTICE));
    for (const t of [
      'This website is published by Bertrand Chardinne, founder, acting for Zik4U, a French simplified joint-stock company (SAS) in formation. Once the company is registered, its company name, registered office, share capital and registration number will be shown here.',
      '<Section title="Publication director"> <P>Bertrand Chardinne.</P>',
      '<Mail to={SUPPORT} />. For personal data: <Mail to={PRIVACY} />.',
      'Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States.',
      'Supabase Pte. Ltd, 65 Chulia Street #38-02/03, OCBC Centre, Singapore 049513. Data is stored in the United States (Virginia).',
      'See also our <A href="/legal/privacy">Privacy Policy</A> and <A href="/legal/terms">Terms of Service</A>.',
    ]) {
      expect(s).toContain(t);
    }
    expect(s).toContain("const SUPPORT = 'support@zik4u.com';");
    expect(s).toContain("const PRIVACY = 'privacy@zik4u.com';");
  });

  it('publishes no home address, phone number or company identifiers before registration', () => {
    const s = visible(read(NOTICE));
    expect(s).toContain('export const REGISTERED_COMPANY: null = null;');
    expect(s).not.toMatch(/SIREN|SIRET|RCS|\+33|Zik4U Inc|Florida/);
  });

  it('is linked from the legal footer, the home footer and the sitemap', () => {
    expect(read('src/components/legal/LegalPage.tsx')).toContain("footerLink('notice', '/legal/notice', 'Legal notice')");
    expect(read('src/app/page.tsx')).toContain("{label:'Legal notice',href:'/legal/notice'}");
    expect(read('src/app/sitemap.ts')).toContain('`${BASE_URL}/legal/notice`');
  });

  it('uses no long dash in visible text (site rule)', () => {
    expect(visible(read(NOTICE))).not.toContain('—');
  });
});

describe('WEB-LEGAL1 — IP addresses in the Privacy Policy (Decision 93 = A)', () => {
  const privacy = flat(read('src/app/legal/privacy/page.tsx'));

  it('says what the sign-in system keeps', () => {
    expect(privacy).toContain(
      'Our hosting providers process IP addresses in their technical logs. Our sign-in system also keeps the IP address and device type of each signed-in session to protect your account; this record is deleted when you sign out or delete your account.',
    );
    expect(privacy).toContain("const LAST_UPDATED = 'October 18, 2026';");
  });

  it('no longer claims that no IP address is stored', () => {
    expect(privacy).not.toContain('we do not store IP addresses in our own database');
  });
});
