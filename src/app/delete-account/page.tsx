import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Mail } from '@/components/legal/LegalPage';

// COMPLY1c — zik4u.com/delete-account, required by Google Play (decision D2 of 26/09/2026:
// way B, request by email from the account address, 30 days). Texts validated by Bertrand
// on 16/10/2026 (claude/COMPLY1c-TEXTES.md §3). Guard: src/__tests__/comply1c-site.test.ts.

export const metadata = generatePageMetadata(
  'Delete your account',
  'How to delete your Zik4U account and data, in the app or without it.',
  '/delete-account',
);

const PRIVACY = 'privacy@zik4u.com';

export default function DeleteAccountPage() {
  return (
    <LegalPage crumb="Delete your account" title="Delete your Zik4U account" current="delete" altHref="/fr/delete-account">
      <Section title="In the app (fastest)">
        <P>
          Open Zik4U › <Strong>Settings › Delete account</Strong>. Your account and data are deleted immediately.
        </P>
      </Section>

      <Section title="Without the app">
        <P>
          Send an email to <Mail to={PRIVACY} /> <Strong>from the email address of your Zik4U account</Strong>, with the
          subject &ldquo;Delete my account&rdquo; and your username. We check that the request comes from the
          account&apos;s address, delete the account within <Strong>30 days</Strong>, and confirm by email.
        </P>
      </Section>

      <Section title="What is deleted">
        <P>
          Your profile, listening history, posts, comments, reactions, playlists, messages you sent, followers and
          follows, listening mood profile and archetype, Music Match and research settings, notifications and push tokens.
        </P>
      </Section>

      <Section title="What may remain">
        <P>
          Residual copies in backups and technical logs, erased within 30 days. Records we must keep by law (purchases,
          payouts, accounting). Research reports already delivered, which contain no data about you as an individual.
        </P>
      </Section>

      <Section title="Before you delete">
        <List
          items={[
            <>Uninstalling the app does <Strong>not</Strong> delete your account.</>,
            <>Deleting your account does <Strong>not</Strong> cancel a subscription bought through the App Store or Google Play: cancel it in your store settings first.</>,
            <>You can download your data first in <Strong>Settings › My Data (GDPR / CCPA)</Strong>.</>,
          ]}
        />
        <P>
          Questions: <Mail to={PRIVACY} />
        </P>
      </Section>
    </LegalPage>
  );
}
