import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Mail, A } from '@/components/legal/LegalPage';

// WEB-LEGAL1 (Decision 92 = B, texts validated by Bertrand on 18/10/2026) — legal notice
// required by French law (LCEN art. 1-1): publisher, publication director, host, data
// storage. Published before the company exists, without home address or phone number;
// completed on the day the SAS is registered. Guard: src/__tests__/web-legal1.test.ts.
//
// Day of registration (Jour J SAS): fill REGISTERED_COMPANY and submit the new wording of
// the "Publisher" section to Bertrand BEFORE publishing (company name, registered office,
// share capital, RCS city and SIREN, president = publication director, VAT number).
export const REGISTERED_COMPANY: null = null;

export const metadata = generatePageMetadata(
  'Legal notice',
  'Who publishes the Zik4U website, who hosts it and where its data is stored.',
  '/legal/notice',
);

const LAST_UPDATED = 'October 18, 2026';
const SUPPORT = 'support@zik4u.com';
const PRIVACY = 'privacy@zik4u.com';

export default function LegalNoticePage() {
  return (
    <LegalPage crumb="Legal notice" title="Legal notice" lastUpdated={LAST_UPDATED} current="notice" altHref="/fr/legal/notice">
      <Section title="Publisher">
        <P>
          This website is published by Bertrand Chardinne, founder, acting for Zik4U, a French simplified joint-stock
          company (SAS) in formation. Once the company is registered, its company name, registered office, share
          capital and registration number will be shown here.
        </P>
      </Section>

      <Section title="Publication director">
        <P>Bertrand Chardinne.</P>
      </Section>

      <Section title="Contact">
        <P>
          <Mail to={SUPPORT} />. For personal data: <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section title="Hosting">
        <P>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States.</P>
      </Section>

      <Section title="Data storage">
        <P>
          Supabase Pte. Ltd, 65 Chulia Street #38-02/03, OCBC Centre, Singapore 049513. Data is stored in the United
          States (Virginia).
        </P>
      </Section>

      <P>
        See also our <A href="/legal/privacy">Privacy Policy</A> and <A href="/legal/terms">Terms of Service</A>.
      </P>
    </LegalPage>
  );
}
