import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1c — Terms of Service rewritten (texts validated by Bertrand on 16/10/2026,
// claude/COMPLY1c-TEXTES.md v2.1; Decisions 82 = A and 84 = A; long dashes replaced per
// the site rule). Guard: src/__tests__/comply1c-site.test.ts.

export const metadata = generatePageMetadata(
  'Terms of Service',
  'The Zik4U Terms of Service: what Zik4U is, the rules, creators, subscriptions and your rights.',
  '/legal/terms',
);

const LAST_UPDATED = 'October 31, 2026';
const SUPPORT = 'support@zik4u.com';

export default function TermsOfServicePage() {
  return (
    <LegalPage crumb="Terms of Service" title="Terms of Service" lastUpdated={LAST_UPDATED} current="terms" altHref="/fr/legal/terms">
      <Section title="1. Agreement">
        <P>
          These Terms are an agreement between you and <Strong>Bertrand Chardinne, founder, acting for Zik4U, a French
          simplified joint-stock company (SAS) in formation</Strong> (&ldquo;Zik4U&rdquo;, &ldquo;we&rdquo;). Once the
          company is registered, it takes over this agreement. By creating an account or using the Zik4U app or website
          (the &ldquo;Service&rdquo;), you accept these Terms. Our <A href="/legal/privacy">Privacy Policy</A> explains
          how we handle your data.
        </P>
      </Section>

      <Section title="2. Who can use Zik4U">
        <List
          items={[
            <>You must be <Strong>16 or older</Strong>. Music Match and music research require you to be <Strong>18 or older</Strong>.</>,
            'One account per person. You are responsible for activity on your account and for keeping your sign-in details safe.',
            'Give accurate information, and do not impersonate anyone.',
          ]}
        />
      </Section>

      <Section title="3. What Zik4U is, and is not">
        <List
          items={[
            'Zik4U captures what you listen to in your music apps and turns it into your music identity, social features, and creator subscriptions.',
            <><Strong>Zik4U is not a music player.</Strong> Play buttons open the track in your own music app. We do not stream, host or sell music.</>,
            'Zik4U is not affiliated with, endorsed or sponsored by any music streaming service or music app. Their names and trademarks belong to their owners.',
            'Capture on Android requires notification access, which you can revoke at any time.',
          ]}
        />
      </Section>

      <Section title="4. Real listens only">
        <P>
          Zik4U is built on real listening, and creators may be paid based on it. You must not create fake or automated
          listens, loop tracks to inflate counts, use bots or scripts, or otherwise manipulate listening data, metrics
          or rankings. We may discard suspicious listens and suspend accounts involved.
        </P>
      </Section>

      <Section title="5. Rules of conduct">
        <P>
          Do not post or send anything illegal, hateful, harassing, threatening, sexually explicit involving minors,
          defamatory, or that infringes someone else&apos;s rights. Do not spam, scrape the Service, attempt to access
          other accounts or our systems, reverse-engineer the app, or use the Service to collect other members&apos;
          personal data.
        </P>
      </Section>

      <Section title="6. Your content">
        <P>
          You keep ownership of what you post. You give Zik4U a non-exclusive, worldwide, royalty-free license to host,
          display and distribute it within the Service, only to operate it. The license ends when you delete the content
          or your account, except for copies other members already received in messages.
        </P>
      </Section>

      <Section title="7. Reporting, moderation and suspension">
        <P>
          You can report any post, comment or profile in the app, and anything else (a message) by writing to{' '}
          <Mail to={SUPPORT} />. We review reports and may remove content or suspend accounts that break these Terms or the law. When we remove your content or restrict your account, we
          tell you why. If you disagree, write to <Mail to={SUPPORT} /> and a person will review the decision. Our
          contact point for authorities and users under the EU Digital Services Act is <Mail to={SUPPORT} /> (English or
          French).
        </P>
      </Section>

      <Section title="8. Music Match">
        <P>
          Music Match is an optional feature for adults to discover people with compatible music tastes. It is not a
          dating service. Use it respectfully: no harassment, stalking, solicitation or spam. You can block anyone at
          any time. We are not responsible for interactions that happen outside Zik4U.
        </P>
      </Section>

      <Section title="9. Creators">
        <List
          items={[
            'Any member can apply to become a creator; we may accept or refuse an application.',
            'Creators set subscription tiers within the options offered in the app.',
            <><Strong>Revenue share: creators receive 80% of the net amount Zik4U actually receives for their subscriptions, after the app store&apos;s commission and applicable taxes.</Strong> The share is shown in the creator dashboard. We will give active creators at least 30 days&apos; notice before any change.</>,
            'Payouts are made through our payout provider (Trolley) after identity and tax verification, on the schedule and minimum shown in the app. Creators are responsible for their own taxes. We may hold payments linked to fraud or fake listens (section 4).',
            'Creators are independent; nothing in these Terms makes them our employees or partners. They are responsible for what they offer subscribers.',
          ]}
        />
      </Section>

      <Section title="10. Subscriptions and payments">
        <List
          items={[
            'Subscriptions to creators are bought through the Apple App Store or Google Play and billed by them, on a recurring basis, until you cancel.',
            <>Cancel in your App Store or Google Play account settings. Access continues until the end of the paid period. <Strong>Deleting your Zik4U account does not cancel a store subscription</Strong>: cancel it in the store first.</>,
            "Refunds are handled by Apple or Google under their policies. Your statutory rights as a consumer, including any right of withdrawal, apply as provided by law and by the store's process.",
            "Price changes follow the store's rules, which include notifying you in advance.",
          ]}
        />
      </Section>

      <Section title="11. Our intellectual property">
        <P>
          The Zik4U name, logo, design and software belong to Zik4U. We give you a personal, non-transferable, revocable
          right to use the Service under these Terms.
        </P>
      </Section>

      <Section title="12. Availability and changes to the Service">
        <P>
          We work to keep Zik4U available and accurate, but we cannot guarantee it will always be uninterrupted or
          error-free. We may change or stop features; if a change materially reduces a paid feature, we will tell you in
          advance.
        </P>
      </Section>

      <Section title="13. Liability">
        <P>
          Nothing in these Terms limits or excludes our liability where the law does not allow it, in particular for
          death or personal injury, fraud or gross negligence, and nothing in these Terms affects your statutory rights
          as a consumer. If you use Zik4U as a consumer, we are responsible for the damage you suffer as a direct and
          foreseeable result of our failure to meet our obligations, as provided by law. If you use Zik4U for your
          business, including as a creator acting in a professional capacity, our total liability to you is limited to
          the amounts paid between you and Zik4U in the 12 months before the claim.
        </P>
      </Section>

      <Section title="14. Ending your account">
        <P>
          You can delete your account at any time in <Strong>Settings › Delete account</Strong> or at{' '}
          <A href="/delete-account">zik4u.com/delete-account</A>. We may suspend or close an account that seriously or
          repeatedly breaks these Terms, telling you why.
        </P>
      </Section>

      <Section title="15. Changes to these Terms">
        <P>
          If we change these Terms in a way that matters, the app shows you the new Terms before they apply and asks you
          to agree. If you do not agree, you can delete your account.
        </P>
      </Section>

      <Section title="16. Governing law and disputes">
        <P>
          These Terms are governed by French law. If you are a consumer, you keep the protection of the mandatory laws
          of the country where you live, and you can bring a claim before the courts of that country. Before going to
          court, please write to <Mail to={SUPPORT} /> so we can try to solve the problem.
        </P>
      </Section>

      <Section title="17. Contact">
        <P>
          <Mail to={SUPPORT} />: Bertrand Chardinne, for Zik4U (French SAS in formation).
        </P>
      </Section>
    </LegalPage>
  );
}
