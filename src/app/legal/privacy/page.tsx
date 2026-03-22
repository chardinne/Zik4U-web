import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Privacy Policy',
  'How Zik4U collects, uses, and protects your personal data. GDPR & CCPA compliant.',
  '/legal/privacy',
);

const LAST_UPDATED = 'March 15, 2026';
const CONTACT_EMAIL = 'privacy@zik4u.com';
const COMPANY = 'Zik4U LLC';
const SITE_URL = 'https://zik4u.com';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/"
            style={{
              background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              fontSize: '22px',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            ZIK4U
          </a>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>/ Privacy Policy</span>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)' }}>

          {/* 1 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>1. Who We Are</h2>
            <p>
              {COMPANY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website{' '}
              <a href={SITE_URL} style={{ color: '#00D4FF', textDecoration: 'none' }}>{SITE_URL}</a>{' '}
              and the Zik4U mobile application (collectively, the &ldquo;Service&rdquo;). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your personal information when you use our Service.
            </p>
            <p style={{ marginTop: '12px' }}>
              Zik4U LLC is a limited liability company registered in the State of Florida, United States.
            </p>
            <p style={{ marginTop: '12px' }}>
              For privacy inquiries, contact us at:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#00D4FF', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>2. Data We Collect</h2>
            <p style={{ marginBottom: '16px' }}>We collect the following categories of personal data:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  title: 'Account Information',
                  desc: 'Email address, display name, username, profile photo, and biography that you provide when creating an account.',
                },
                {
                  title: 'Music Listening Data',
                  desc: 'Track titles, artist names, listening timestamps, and streaming platform identifiers, collected via our music detection system (Captation) with your explicit consent.',
                },
                {
                  title: 'Connected Services',
                  desc: 'OAuth tokens and metadata for third-party music services you connect (Spotify, Apple Music, YouTube Music, Deezer, SoundCloud). We store only the minimum data required to provide the Service.',
                },
                {
                  title: 'Payment Information',
                  desc: 'Billing details for subscriptions are processed by Stripe. We do not store credit card numbers or CVVs. We receive only a tokenized payment reference.',
                },
                {
                  title: 'Social Data',
                  desc: 'Follows, posts, comments, reactions, and direct messages you create on the platform.',
                },
                {
                  title: 'Device & Usage Data',
                  desc: 'Device type, operating system, IP address (anonymized after 30 days), app version, session duration, and feature usage for analytics and crash reporting.',
                },
                {
                  title: 'Push Notification Tokens',
                  desc: 'Expo push tokens collected when you grant notification permission, used solely to deliver in-app notifications.',
                },
                {
                  title: 'Inferred Emotional Profile',
                  desc: 'We automatically derive an anonymized emotional music profile from your listening patterns, including a daily listening score, mood indicators (e.g., nocturnal, explorative), and behavioral metrics such as musical diversity and listening consistency. This profile is used solely to personalize your experience and improve our services. It is never sold or shared with third parties without your explicit consent.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: '#12122A',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    borderLeft: '3px solid #00D4FF',
                  }}
                >
                  <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>3. How We Use Your Data</h2>
            <p style={{ marginBottom: '12px' }}>We use your personal data for the following purposes:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Providing and improving the Service (account management, music detection, feed personalization)',
                'Enabling social features (follow, discover compatible listeners, messaging)',
                'Processing payments and managing creator subscriptions',
                'Sending push notifications you have opted into',
                'Computing music compatibility scores and personalized recommendations',
                'Detecting and preventing fraud, abuse, and security threats',
                'Complying with legal obligations',
                'Sending transactional emails (password reset, subscription confirmations)',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '15px' }}>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '16px' }}>
              We do <strong>not</strong> sell your personal data to third parties. We do not use your listening data for advertising targeting.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>4. Legal Basis for Processing (GDPR)</h2>
            <p style={{ marginBottom: '12px' }}>
              If you are located in the European Economic Area (EEA), our legal basis for processing your data is:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#FFFFFF' }}>Contract performance</strong>: to deliver the Service you signed up for</li>
              <li><strong style={{ color: '#FFFFFF' }}>Consent</strong>: for music detection, push notifications, and optional analytics</li>
              <li><strong style={{ color: '#FFFFFF' }}>Legitimate interests</strong>: for fraud prevention, security, and product improvement</li>
              <li><strong style={{ color: '#FFFFFF' }}>Legal obligation</strong>: for tax reporting, GDPR compliance, and law enforcement requests</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>5. Data Sharing & Third Parties</h2>
            <p style={{ marginBottom: '12px' }}>We share your data only with the following trusted service providers:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Supabase', role: 'Database hosting & authentication (EU region)', link: 'https://supabase.com/privacy' },
                { name: 'Stripe', role: 'Payment processing', link: 'https://stripe.com/privacy' },
                { name: 'RevenueCat', role: 'In-app purchase management', link: 'https://www.revenuecat.com/privacy' },
                { name: 'Sentry', role: 'Error tracking & crash reporting', link: 'https://sentry.io/privacy/' },
                { name: 'Firebase / Google', role: 'Analytics & crash reporting', link: 'https://firebase.google.com/support/privacy' },
                { name: 'Trolley', role: 'Creator payout processing (KYC)', link: 'https://trolley.com/privacy-policy/' },
                { name: 'Expo', role: 'Push notification delivery', link: 'https://expo.dev/privacy' },
              ].map((provider) => (
                <div key={provider.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#12122A', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{provider.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginLeft: '12px' }}>{provider.role}</span>
                  </div>
                  <a href={provider.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00D4FF', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    Privacy →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>5b. International Data Transfers</h2>
            <p>
              As a Florida LLC, your data is processed and stored in the United States. We comply with GDPR (EU users) and CCPA
              (California users) requirements. If you are located outside the United States, please be aware that your information
              may be transferred to, stored, and processed in the U.S. where our servers are located and our central database is
              operated. By using the Service, you consent to this transfer.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>6. Data Retention</h2>
            <p style={{ marginBottom: '12px' }}>We retain your personal data as follows:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#FFFFFF' }}>Account data:</strong> As long as your account is active. Deleted within 30 days of account deletion request.</li>
              <li><strong style={{ color: '#FFFFFF' }}>Music listening data:</strong> Rolling 12-month history for personalization; anonymized aggregate data retained indefinitely.</li>
              <li><strong style={{ color: '#FFFFFF' }}>IP addresses:</strong> Anonymized after 30 days.</li>
              <li><strong style={{ color: '#FFFFFF' }}>Payment records:</strong> 7 years for tax and legal compliance.</li>
              <li><strong style={{ color: '#FFFFFF' }}>Push tokens:</strong> Deleted when you revoke notification permission or delete your account.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>7. Your Rights</h2>
            <p style={{ marginBottom: '12px' }}>Depending on your jurisdiction, you have the following rights:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { right: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
                { right: 'Rectification', desc: 'Correct inaccurate or incomplete data.' },
                { right: 'Erasure', desc: 'Request deletion of your personal data ("right to be forgotten").' },
                { right: 'Portability', desc: 'Receive your data in a machine-readable format (JSON/CSV) via Settings → Export Data.' },
                { right: 'Restriction', desc: 'Request that we limit processing of your data.' },
                { right: 'Objection', desc: 'Object to processing based on legitimate interests.' },
                { right: 'Withdraw Consent', desc: 'Revoke consent for music detection or push notifications at any time via app Settings.' },
                { right: 'CCPA / California Rights', desc: 'Opt out of sale (we don\'t sell data). Request disclosure or deletion of personal information.' },
              ].map((item) => (
                <div key={item.right} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0A0A1A', flexShrink: 0, marginTop: '2px' }}>✓</span>
                  <div>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.right}:</span>{' '}
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '16px' }}>
              To exercise any right, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#00D4FF', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* 8b */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
              8b. Automated Processing &amp; Profiling
            </h2>
            <p style={{ marginBottom: '12px' }}>
              In accordance with Article 22 of the GDPR, we inform you that Zik4U uses
              automated processing to derive insights from your listening behavior.
              This includes:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Daily Emotional Score:</strong> A composite
                score (0–100) reflecting your listening diversity, activity patterns, and
                consistency. Used to personalize notifications and content.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Mood Indicators:</strong> Inferred listening
                moods (e.g., nocturnal, explorative, high energy) based on time-of-day patterns
                and artist diversity. Not used for external profiling or advertising.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Trajectory Analysis:</strong> Week-over-week
                comparison of listening patterns to personalize engagement notifications.
              </li>
            </ul>
            <p>
              This automated processing does not produce legal or similarly significant effects.
              You may opt out of emotional profiling at any time in Settings → Privacy.
              Opting out will disable personalized digest notifications but will not affect
              core app functionality.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>8. Cookies &amp; Tracking</h2>
            <p style={{ marginBottom: '12px' }}>Our website uses minimal cookies:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#FFFFFF' }}>Essential cookies:</strong> Authentication session management (Supabase auth token). Required for the Service to function.</li>
              <li><strong style={{ color: '#FFFFFF' }}>Analytics:</strong> Anonymous usage analytics via Firebase Analytics. No cross-site tracking.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We do not use third-party advertising cookies or pixel trackers.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>9. Data Security</h2>
            <p>
              We implement industry-standard security measures including TLS 1.3 encryption in transit, AES-256 encryption at rest (Supabase),
              Row-Level Security (RLS) policies on all database tables, and regular security audits. OAuth tokens for connected music services
              are stored encrypted and never exposed in plaintext. In the event of a data breach affecting your rights, we will notify you
              within 72 hours as required by GDPR.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>10. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to children under 13 years of age (or 16 in the EEA). We do not knowingly collect personal
              data from children. If you believe we have inadvertently collected data from a child, contact us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#00D4FF', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>{' '}
              and we will delete it promptly.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email or
              an in-app notification at least 14 days before the changes take effect. Continued use of the Service after the effective
              date constitutes acceptance of the updated policy. The &ldquo;Last updated&rdquo; date at the top of this page reflects
              the most recent revision.
            </p>
          </section>

          {/* Contact */}
          <section
            style={{
              backgroundColor: '#12122A',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>Questions?</h2>
            <p style={{ marginBottom: '16px' }}>
              If you have questions about this Privacy Policy or wish to exercise your rights, contact our Privacy Team:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
                borderRadius: '8px',
                color: '#0A0A1A',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '15px',
              }}
            >
              {CONTACT_EMAIL}
            </a>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/legal/privacy" style={{ color: '#00D4FF', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
          <a href="/legal/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>Home</a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '12px' }}>
          © {new Date().getFullYear()} Zik4U. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
