import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1d (texts validated by Bertrand on 21/10/2026, claude/COMPLY1d-CREATEUR-TEXTES.md;
// Decisions 109-111 and 116-118 = A) — Creator Terms: revenue share, payouts in US dollars,
// self-billing, tax information (art. 242 bis CGI), DAC7 reporting, withholding (art. 182 B
// CGI), 1099. Guard: src/__tests__/comply1d-site.test.ts.

export const metadata = generatePageMetadata(
  'Creator Terms',
  'The Zik4U Creator Terms: revenue share, payouts, invoices issued on your behalf and tax reporting.',
  '/legal/creator-terms',
);

const LAST_UPDATED = 'October 21, 2026';
const SUPPORT = 'support@zik4u.com';

export default function CreatorTermsPage() {
  return (
    <LegalPage crumb="Creator Terms" title="Creator Terms" lastUpdated={LAST_UPDATED} current="creator" altHref="/fr/legal/creator-terms">
      <P>
        These Creator Terms apply to you as soon as you activate your creator account in the Zik4U app. They add to the
        Zik4U <A href="/legal/terms">Terms of Service</A>; on any creator matter where the two differ, these Creator Terms
        apply. Zik4U is operated by Bertrand Chardinne, acting for Zik4U, a French simplified joint-stock company (SAS) in
        formation.
      </P>

      <Section title="1. Your status">
        <P>
          You act as an independent creator, on your own account. Nothing in these terms makes you an employee, agent or
          partner of Zik4U. You decide what you publish and when. If you earn money regularly, your local law may require
          you to register a business activity (in France, for example, as a micro-entrepreneur). You tell us in the app
          whether you act as an individual or as a business, and keep this information up to date.
        </P>
      </Section>

      <Section title="2. What you offer">
        <P>
          Your subscribers pay, through Google Play or the App Store, for access to what you share with them in the app:
          your exclusive posts, drops and the other subscriber features shown in the app. You choose your tiers among the
          options offered in the app. You must offer what your tiers describe, follow the Terms of Service (in particular
          section 4, Real listens only, and section 5, Rules of conduct), and publish only content you have the right to
          share. We may refuse, suspend or end a creator account under section 11.
        </P>
      </Section>

      <Section title="3. Licence">
        <P>
          You keep ownership of your content. You give Zik4U a non-exclusive, worldwide, royalty-free licence to host,
          display and make it available to your subscribers and, for public content, to other members, only to operate
          the Service and for as long as the content is online. The licence ends when you delete the content or your
          account.
        </P>
      </Section>

      <Section title="4. Revenue share">
        <P>
          For each subscription to your tiers, you receive <Strong>80% of the net amount Zik4U actually receives</Strong>,
          meaning after the app store&apos;s commission and the taxes the store withholds. Zik4U keeps 20%. Your earnings
          are shown in your creator dashboard. We will tell you at least 30 days in advance of any change to the share,
          and you can stop being a creator before it applies.
        </P>
      </Section>

      <Section title="5. Refunds and fraud">
        <P>
          If a store refunds a subscription, your share of it is deducted from your balance, including from future
          earnings if it was already paid. Earnings linked to fake or manipulated listens, to fraud, or to content that
          breaks the Terms of Service are not owed: we may hold them while we check, and cancel them if the breach is
          confirmed, telling you why. You can contest any such decision by writing to <Mail to={SUPPORT} />, and a person
          will review it.
        </P>
      </Section>

      <Section title="6. Payouts">
        <P>
          Payouts are made by our payout provider, Trolley, once you have completed its identity and tax verification.
          Each month, we calculate your unpaid balance for the previous calendar month and send it if it reaches US$25;
          otherwise it carries over to the next month. <Strong>Payouts are made in US dollars</Strong>; Trolley may
          convert them into your currency, at the rate and fees it shows you. When you stop being a creator, a balance
          below US$25 is paid on request to <Mail to={SUPPORT} /> within 30 days.
        </P>
      </Section>

      <Section title="7. Invoices we issue on your behalf (self-billing)">
        <P>
          So that you do not have to invoice us each month, you authorise Zik4U to issue, in your name and on your
          behalf, the invoice for each payout. Each invoice bears the mention &quot;Autofacturation&quot; (self-billing),
          contains the information required by law and reflects the VAT status you declare: small business exempt from
          VAT (in France: &quot;TVA non applicable, art. 293 B du CGI&quot;), VAT-registered (VAT added at the applicable
          rate), or established outside France (reverse charge, VAT accounted for by Zik4U where the law requires it).
          We send you a copy of each invoice by email. You can contest an invoice within 30 days of receiving it; after
          that, it is considered accepted. You remain responsible for your VAT obligations and must tell us of any change
          to your VAT status or details. This authorisation starts when you accept these terms and ends when you stop
          being a creator.
        </P>
      </Section>

      <Section title="8. Your taxes and social contributions">
        <P>
          You are responsible for declaring your income and paying your taxes and social contributions. With each
          payout, we remind you of these obligations and give you links to the official information (in France:{' '}
          <A href="https://www.impots.gouv.fr">impots.gouv.fr</A> and <A href="https://www.urssaf.fr">urssaf.fr</A>). By
          31 January each year, we send you a summary of what you earned through Zik4U the previous year.
        </P>
      </Section>

      <Section title="9. Information we must collect and report">
        <P>
          As a platform operator, Zik4U must collect information about the creators it pays and report it each year to
          the French tax authority (DGFiP), under the EU rules known as DAC7; the DGFiP may share it with the tax
          authority of the country where you live. Before your first payout, you provide through Trolley: your full name,
          address, date of birth, tax identification number and country of tax residence; for a business, its
          registration and VAT numbers; and the account to which payouts are sent. We report your earnings per quarter,
          the number of payouts and the fees we kept. If you do not provide this information after two reminders, we hold
          your payouts until you do, and may end your creator status.
        </P>
      </Section>

      <Section title="10. Tax residence and withholding">
        <P>
          If you are not tax resident in France, you provide a certificate of tax residence through Trolley before your
          first payout. Without it, French law may require us to withhold tax from your payouts (25%, or 75% for a
          non-cooperative state or territory) and pay it to the French tax authority. If you are a United States person,
          you provide a form W-9, and Trolley issues on our behalf the form 1099 required by US law; other creators
          provide a form W-8BEN or W-8BEN-E.
        </P>
      </Section>

      <Section title="11. Ending">
        <P>
          You can stop being a creator at any time in the app. We may suspend or end your creator status if you seriously
          or repeatedly break these terms or the Terms of Service, telling you why, or for any other reason with 30
          days&apos; notice. In every case, the earnings you are owed up to that date remain due, subject to section 5.
        </P>
      </Section>

      <Section title="12. Liability">
        <P>
          If you act as a business, Zik4U&apos;s total liability to you is limited to the amounts paid to you in the 12
          months before the claim. Nothing in these terms limits liability where the law does not allow it, in particular
          for fraud or gross negligence, and nothing affects your rights as a consumer if you act as one.
        </P>
      </Section>

      <Section title="13. Changes">
        <P>
          We may change these terms by telling you at least 30 days in advance, in the app and by email; a change
          required by law may apply sooner. If you do not agree, you can stop being a creator before the change applies.
        </P>
      </Section>

      <Section title="14. Your personal data">
        <P>
          How we use your data as a creator, including for tax reporting, is explained in our{' '}
          <A href="/legal/privacy">Privacy Policy</A>.
        </P>
      </Section>

      <Section title="15. Law and disputes">
        <P>
          These terms are governed by French law. Before any court action, please write to <Mail to={SUPPORT} /> so we
          can try to solve the problem. If you act as a business, the courts with jurisdiction for Zik4U&apos;s registered
          office have exclusive jurisdiction. If you act as a consumer, you keep the protection of the mandatory law of
          the country where you live and can go to its courts.
        </P>
      </Section>
    </LegalPage>
  );
}
