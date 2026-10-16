import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Table, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1c — Privacy Policy rewritten to say what Zik4U does (texts validated by Bertrand
// on 16/10/2026, claude/COMPLY1c-TEXTES.md v2.1; long dashes replaced per the site rule).
// Guard: src/__tests__/comply1c-site.test.ts.

export const metadata = generatePageMetadata(
  'Privacy Policy',
  'How Zik4U collects, uses and protects your personal data, and the choices you have.',
  '/legal/privacy',
);

const LAST_UPDATED = 'October 17, 2026';
const PRIVACY = 'privacy@zik4u.com';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage crumb="Privacy Policy" title="Privacy Policy" lastUpdated={LAST_UPDATED} current="privacy">
      <Section title="1. Who we are">
        <P>
          Zik4U is a music social app and website (the &ldquo;Service&rdquo;). The person responsible for your data
          (the &ldquo;controller&rdquo;) is <Strong>Bertrand Chardinne, founder, acting for Zik4U, a French simplified
          joint-stock company (SAS) in formation</Strong>. Once the company is registered, it will take over this role
          and we will update this page.
        </P>
        <P>
          Contact for anything about your data: <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section title="2. The short version">
        <List
          items={[
            'Zik4U builds your music identity from what you really listen to.',
            'On Android, it reads only the "now playing" notifications of music apps, never your messages or other notifications.',
            'Your emotional music profile is on by default. You can turn it off at any time; turning it off deletes it.',
            'Your moods are never shared with anyone. Your listener archetype is shown on your Music DNA card.',
            'Music research is off unless you turn it on. Partners only ever receive trends computed over 100 people or more, never you.',
            'We do not sell your personal data. We do not show ads. We do not use advertising identifiers.',
            'Our database is hosted in the United States. Section 10 explains how your data is protected there.',
            'You can download or delete your data at any time from the app.',
          ]}
        />
      </Section>

      <Section title="3. Data we collect">
        <P>
          <Strong>Account.</Strong> Email address, password (stored by our authentication provider in hashed form),
          username, display name, profile photo, bio, and the sign-in method you use (email, Google or Apple). Your
          statement that you are 16 or older, and, if you give it, your confirmation that you are 18 or older. A record
          of each choice you make about your data (what you chose, when, which version of our terms, and where in the
          app).
        </P>
        <P>
          <Strong>Listening (capture).</Strong> On Android, if you grant Zik4U notification access, the app reads the
          playback notifications of a fixed list of music apps and keeps: track title, artist, album, duration, time
          played, the app you listened in, and a link to the cover art. It ignores every other notification. You can
          revoke notification access at any time in your phone settings; capture then stops. Listens made in private
          mode are marked private.
        </P>
        <P>
          <Strong>What you create and share.</Strong> Posts, comments, reactions, playlists, follows, direct messages,
          and reports you send to us.
        </P>
        <P>
          <Strong>Emotional music profile</Strong> (see section 5). Computed every night from your listening of the
          previous day: a dominant mood, a daily listening score (variety, repetition, regularity), the hours you
          listen at, how many posts and likes you made that day, and your top artists. A listener archetype is derived
          from the last 30 days.
        </P>
        <P>
          <Strong>Music Match</Strong> (see section 6) and <Strong>music research</Strong> (see section 7), only if you
          turn them on.
        </P>
        <P>
          <Strong>Purchases (when subscriptions open).</Strong> Subscriptions are bought through the Apple App Store or
          Google Play. We receive the product, its status and dates, and a store transaction reference, never your card
          details. Our purchase-management provider, RevenueCat, processes these receipts.
        </P>
        <P>
          <Strong>Creator payouts (when payouts open).</Strong> If you are a creator, our payout provider, Trolley,
          collects the identity, tax and bank information required to pay you. We receive your payout status, not your
          bank details.
        </P>
        <P>
          <Strong>Device and technical data.</Strong> Push notification token, device model, operating system, app
          version, and signals that show whether capture is working. Crash and error reports (the error, your device
          model and app version, never your name or email) through Sentry. Our hosting providers process IP addresses
          in their technical logs; we do not store IP addresses in our own database.
        </P>
        <P>
          <Strong>Analytics, only if you agree.</Strong> If you accept analytics, Firebase Analytics receives usage
          events linked to a pseudonymous identifier (a short hash, never your name or email). Off unless you accept;
          you can change it in Settings.
        </P>
        <P>
          <Strong>Website.</Strong> If you join a waitlist on zik4u.com: your email address, and for creators your
          artist name and main streaming platform. The website has no account login, no analytics and no advertising
          cookies (section 13).
        </P>
        <P>
          <Strong>Messages to us.</Strong> Emails you send to support or privacy.
        </P>
      </Section>

      <Section title="4. Why we use your data, and our legal basis (EU/EEA and UK)">
        <Table
          head={['Purpose', 'Data', 'Legal basis']}
          rows={[
            ['Run your account and the Service: capture, profile, feed, followers, messages, creator subscriptions', 'Account, listening, content, purchases', 'Performance of our contract with you'],
            ['Emotional music profile and listener archetype', 'Listening, emotional profile', 'Legitimate interest: personalizing your music identity, which is the purpose of Zik4U. You can object at any time by turning it off'],
            ['Music Match', 'Listening, Music Match setting, 18+ confirmation', 'Your consent (you turn it on)'],
            ['Music research reports', 'See section 7', 'Your consent (off by default)'],
            ['Analytics', 'Usage events', 'Your consent'],
            ['Notifications you allowed', 'Push token', "Performance of contract; your phone's permission"],
            ['Safety, moderation, fraud and abuse prevention, crash reports, service security', 'Content, reports, technical data', 'Legitimate interest: keeping Zik4U safe and working'],
            ['Paying creators, accounting and tax', 'Purchases, payouts', 'Legal obligation; performance of contract'],
            ['Waitlists', 'Email, artist name, platform', 'Your consent (you sign up)'],
          ]}
        />
        <P>
          We do not make decisions about you based solely on automated processing that have legal or similarly
          significant effects on you.
        </P>
      </Section>

      <Section id="emotional-profile" title="5. Your emotional music profile">
        <P>
          <Strong>What it is.</Strong> Every night, Zik4U reads the mood of the music you listened to the day before and
          computes the data listed in section 3. From your last 30 days, it derives a listener archetype.
        </P>
        <P>
          <Strong>Who sees it.</Strong> Your archetype is shown on your Music DNA card, which other members can see
          under your privacy settings (section 8). Your moods themselves are never shared with anyone: not other
          members, not partners.
        </P>
        <P>
          <Strong>What it is not.</Strong> It describes your music, not your health. Zik4U does not infer health or
          mental-health conditions.
        </P>
        <P>
          <Strong>Your choice.</Strong> It is on by default. Turn it off anytime in{' '}
          <Strong>Settings › Privacy › Emotional music profile</Strong>: your archetype and the moods behind it are
          deleted, and Zik4U stops computing them. Everything else works the same.
        </P>
      </Section>

      <Section id="music-match" title="6. Music Match">
        <List
          items={[
            'Music Match lets adults discover people with compatible music tastes. It is off unless you turn it on, and requires you to confirm you are 18 or older.',
            'It compares listening only: artists you have in common and the same track played at the same time. It does not use your moods, your photo, your location, or any relationship status. We do not collect relationship status.',
            'You are visible only to other members who turned Music Match on.',
            <>
              Turn it off anytime in <Strong>Settings › Privacy › Music Match</Strong>: you disappear from all results
              immediately.
            </>,
            'Blocking someone removes them from your results and prevents any contact.',
          ]}
        />
      </Section>

      <Section id="research" title="7. Music research">
        <P>
          <Strong>Off unless you turn it on.</Strong> Zik4U works exactly the same either way. Only members who
          confirmed they are 18 or older can turn it on.
        </P>
        <P>
          <Strong>What we use.</Strong> The songs you play after you turn it on, when you play them, the moods derived
          from them, and your archetype. Never listens made in private mode. Never your moods or archetype if your
          emotional profile is off.
        </P>
        <P>
          <Strong>What partners receive.</Strong> Weekly trends (for example, how many listeners an artist had, or how
          moods were distributed) computed only over groups of <Strong>100 people or more</Strong>, with statistical
          noise added and figures rounded. Never your name, your profile, your songs, or any data about you as an
          individual. Partners must contractually commit never to try to re-identify anyone.
        </P>
        <P>
          <Strong>Who receives them.</Strong> Music companies (labels, publishers) and, later, AI research
          organizations. Zik4U may be paid for these reports.
        </P>
        <P>
          <Strong>Your choice.</Strong> Turn it off anytime in <Strong>Settings › Privacy › Music research</Strong>:
          your data leaves all future reports. Reports already delivered cannot be changed, but they hold no data about
          you as an individual. Every report we produce is logged.
        </P>
      </Section>

      <Section id="public-profile" title="8. What other people can see">
        <P>
          <Strong>What anyone can see.</Strong> Your display name, avatar and bio are public. Anyone, including
          visitors without a Zik4U account, can see them on your profile page. If you are a creator, your subscription
          tiers and prices are also public.
        </P>
        <P>
          <Strong>Search engines and AI assistants.</Strong> This minimal public profile (name, avatar, bio) may be
          indexed by search engines such as Google and read by AI assistants and their crawlers (for example ChatGPT,
          Claude, Gemini or Perplexity). If your account is set to private, your profile is excluded from our sitemap
          and marked so that search engines and AI crawlers do not index it.
        </P>
        <P>
          <Strong>What stays protected.</Strong> Your listening history, top artists and tracks, music signature,
          listener archetype, activity and compatibility scores are never shown to visitors without an account. On a
          private account, they are visible only to followers you have approved. On a creator&apos;s &ldquo;subscribers
          only&rdquo; profile, they are visible only to active subscribers.
        </P>
        <P>
          <Strong>Links you share.</Strong> When you share your profile card from the app, the link shows your full
          card to anyone who opens it, even if your account is private. You choose to share it. Shared cards are marked
          so that search engines and AI crawlers do not index them. The card stays up to date with your activity. You
          can revoke all links you have shared at any time in the app&apos;s privacy settings; revoked links then show
          only your minimal public profile.
        </P>
        <P>
          <Strong>Creator content.</Strong> Sharing a creator card never gives access to exclusive posts, drops or
          listening rooms, which remain reserved for subscribers.
        </P>
      </Section>

      <Section id="providers" title="9. Who processes your data for us">
        <P>
          We never sell your personal data. We share it only with providers who process it on our instructions, and
          with the app stores as independent companies.
        </P>
        <Table
          head={['Provider', 'What for', 'Where']}
          rows={[
            ['Supabase', 'Database, sign-in, storage, server functions', 'United States (Virginia)'],
            ['Vercel', 'Website hosting', 'United States and global network'],
            ['Expo', 'Delivery of push notifications', 'United States'],
            ['Google Firebase', 'Push notification transport; analytics if you accept', 'United States'],
            ['Google / Apple', 'Sign-in, if you choose it', 'United States'],
            ['Sentry', 'Crash and error reports', 'United States'],
            ['Resend', 'Account emails (confirmation, password reset)', 'United States'],
            ['RevenueCat', 'Purchase receipts (when subscriptions open)', 'United States'],
            ['Apple App Store / Google Play', 'Payments, as independent controllers', 'Their own terms'],
            ['Trolley', 'Creator payouts and tax verification (when payouts open)', 'Canada'],
          ]}
        />
        <P>
          We may also disclose data when the law requires it, to protect people&apos;s safety, or to a successor if
          Zik4U&apos;s business is transferred (we would tell you first).
        </P>
      </Section>

      <Section id="transfers" title="10. International transfers">
        <P>
          Our main database is hosted in the United States, and several providers above are based there. When your data
          leaves the European Economic Area or the UK, it is protected by the European Commission&apos;s Standard
          Contractual Clauses included in our providers&apos; data processing agreements, and, where a provider is
          certified, by the EU–U.S. Data Privacy Framework. You can ask us for a copy of these safeguards at{' '}
          <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section id="retention" title="11. How long we keep your data">
        <List
          items={[
            <><Strong>Account and everything attached to it</Strong> (listening, content, messages, emotional profile, settings): as long as your account exists.</>,
            <><Strong>When you delete your account</Strong>: it is erased from our live database immediately. Residual copies in backups and technical logs disappear within 30 days.</>,
            <><Strong>Emotional profile</Strong>: deleted immediately when you turn it off.</>,
            <><Strong>Inactive accounts</Strong>: deleted after 3 years without any activity.</>,
            <><Strong>Purchase, payout and accounting records</Strong>: kept as long as tax and accounting law requires (up to 10 years in France).</>,
            <><Strong>Waitlists</Strong>: until we invite you at launch, and at most 24 months, or earlier if you ask us.</>,
            <><Strong>Emails to support</Strong>: up to 3 years after our last exchange.</>,
            <><Strong>Research reports</Strong>: contain no personal data.</>,
          ]}
        />
      </Section>

      <Section id="rights" title="12. Your rights">
        <P>
          <Strong>Everyone.</Strong> Wherever you live, you can:
        </P>
        <List
          items={[
            <><Strong>Download your data</Strong> in <Strong>Settings › My Data (GDPR / CCPA)</Strong>.</>,
            <><Strong>Delete your account</Strong> in <Strong>Settings › Delete account</Strong>, or from the web at <A href="/delete-account">zik4u.com/delete-account</A>.</>,
            <><Strong>Turn off</Strong> your emotional profile, Music Match, music research, analytics and notifications at any time.</>,
            <><Strong>Correct</Strong> your profile information in the app.</>,
            <><Strong>Ask us</Strong> anything at <Mail to={PRIVACY} />. We answer within one month.</>,
          ]}
        />
        <P>
          <Strong>EU/EEA and UK.</Strong> You also have the rights of access, rectification, erasure, restriction,
          portability, objection (including to the emotional profile, by turning it off) and to withdraw consent at
          any time without affecting what was done before. You can complain to the French data protection authority,
          the <Strong>CNIL</Strong> (<A href="https://www.cnil.fr">www.cnil.fr</A>), or to the authority of the country
          where you live.
        </P>
        <P>
          <Strong>California and other U.S. states.</Strong> You have the right to know what personal information we
          collect, use and disclose; to access, correct and delete it; and not to be discriminated against for
          exercising these rights. <Strong>We do not sell or share your personal information</Strong> for
          cross-context behavioral advertising, and we do not use sensitive personal information to infer
          characteristics about you beyond providing the Service. Research reports contain only de-identified,
          aggregated information. If your browser sends a Global Privacy Control signal, we treat it as a request to
          opt out of sale or sharing. You may use an authorized agent; we will verify the request. If we decline a
          request, you can appeal by replying to our answer.
        </P>
      </Section>

      <Section id="cookies" title="13. Cookies and similar technologies">
        <P>
          <Strong>Website.</Strong> zik4u.com uses no advertising or analytics cookies and has no login. If your
          browser sends a Global Privacy Control signal, we set one technical cookie to remember it. No cookie banner is
          needed because no cookie requires your consent.
        </P>
        <P>
          <Strong>App.</Strong> The app does not use advertising identifiers. Analytics run only if you accept them.
        </P>
      </Section>

      <Section id="age" title="14. Age">
        <P>
          Zik4U is for people <Strong>16 and older</Strong>. Music Match and music research are for people{' '}
          <Strong>18 and older</Strong>. Age is declared by you; we do not verify identity documents. If we learn that
          an account belongs to someone under 16, we delete it. To report one, write to <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section id="security" title="15. Security">
        <P>
          Data is encrypted in transit (TLS) and at rest by our hosting provider. Access rules in the database restrict
          each member to the data they are allowed to see. Administrative access requires a physical security key. If
          a data breach is likely to put your rights at risk, we notify the CNIL within 72 hours and tell you without
          undue delay when the risk is high.
        </P>
      </Section>

      <Section id="changes" title="16. Changes to this policy">
        <P>
          When we change this policy, we update the date at the top. When a change matters, the app shows it to you
          before it applies.
        </P>
      </Section>

      <Section id="contact" title="17. Contact">
        <P>
          <Mail to={PRIVACY} />: Bertrand Chardinne, for Zik4U (French SAS in formation).
        </P>
      </Section>
    </LegalPage>
  );
}
