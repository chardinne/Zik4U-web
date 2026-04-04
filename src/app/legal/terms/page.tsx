import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Terms of Service',
  'Read the Zik4U Terms of Service: your rights and responsibilities as a listener or creator.',
  '/legal/terms',
);

const LAST_UPDATED = 'March 28, 2026';
const CONTACT_EMAIL = 'legal@zik4u.com';
const SITE_URL = 'https://zik4u.com';

export default function TermsOfServicePage() {
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
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>/ Terms of Service</span>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)' }}>

          {/* Intro */}
          <section style={{ backgroundColor: '#12122A', borderRadius: '12px', padding: '24px', borderLeft: '3px solid #FF3CAC' }}>
            <p>
              Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using Zik4U. By creating an account or accessing
              the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
            <p>
              These Terms constitute a legally binding agreement between you and Zik4U (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
              They govern your access to and use of our website at{' '}
              <a href={SITE_URL} style={{ color: '#00D4FF', textDecoration: 'none' }}>{SITE_URL}</a>{' '}
              and our mobile application (collectively, the &ldquo;Service&rdquo;). You must be at least 13 years old (16 in the EEA)
              to use the Service.
            </p>
            <p style={{ marginTop: '12px' }}>
              Zik4U Inc. is a corporation registered in the State of Florida, United States.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>2. Account Registration</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>You may register with an email address or through OAuth providers (Google, Apple).</li>
              <li>You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>Zik4U reserves the right to suspend or terminate accounts that violate these Terms.</li>
              <li>You may not create more than one account per person without our prior written consent.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>3. The Service</h2>
            <p style={{ marginBottom: '12px' }}>
              Zik4U is a music social platform that allows users to:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Connect music streaming services and automatically track listening history (Captation)</li>
              <li>Discover other users with compatible music taste</li>
              <li>Share posts, playlists, and music discoveries with followers</li>
              <li>Subscribe to creators&apos; exclusive musical content</li>
              <li>Earn revenue as a creator through paid subscriptions</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We reserve the right to modify, suspend, or discontinue any feature of the Service at any time, with or without notice.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>4. User Conduct</h2>
            <p style={{ marginBottom: '12px' }}>You agree <strong style={{ color: '#FFFFFF' }}>not</strong> to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Post content that is illegal, harmful, abusive, harassing, defamatory, or obscene</li>
              <li>Infringe any third-party intellectual property, privacy, or publicity rights</li>
              <li>Use the Service to distribute spam, malware, or unauthorized advertising</li>
              <li>Attempt to gain unauthorized access to other accounts or our systems</li>
              <li>Scrape, crawl, or systematically extract data from the Service without written permission</li>
              <li>Create fake accounts, impersonate others, or manipulate metrics</li>
              <li>Use automated bots, scripts, or tools to interact with the Service</li>
              <li>Reverse engineer, decompile, or disassemble the application</li>
              <li>Violate any applicable law or regulation</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Violation of these rules may result in immediate account suspension or termination, with or without warning.
            </p>
          </section>

          {/* 4b */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
              Music Match — Terms of Use
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Music Match is an optional feature enabling users to discover other members
              based on music compatibility for social or romantic connections.
            </p>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', marginTop: '16px' }}>
              Eligibility
            </h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <li>You must be at least <strong style={{ color: '#FFFFFF' }}>17 years old</strong> to activate Music Match.</li>
              <li>You must have a verified Zik4U account in good standing.</li>
              <li>You must activate Music Match explicitly via Settings → Privacy (double opt-in required).</li>
            </ul>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', marginTop: '16px' }}>
              Acceptable use
            </h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <li>Music Match is intended for genuine social and romantic connections.</li>
              <li>You may not use Music Match to harass, stalk, or intimidate other users.</li>
              <li>You may not create fake profiles or misrepresent your identity or relationship status.</li>
              <li>You may not use Music Match for commercial solicitation or spam.</li>
              <li>You may not attempt to extract personal data from other users through Music Match.</li>
            </ul>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', marginTop: '16px' }}>
              Safety
            </h3>
            <p style={{ marginBottom: '12px' }}>
              We provide blocking and reporting tools. Any user can block another user at any time,
              which immediately removes them from all Music Match results and prevents all contact.
              Abuse of the Music Match feature may result in immediate account suspension.
            </p>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', marginTop: '16px' }}>
              Disclaimer
            </h3>
            <p>
              Zik4U does not guarantee romantic or social outcomes from Music Match.
              We are not responsible for interactions that take place outside of the Zik4U platform.
              Always exercise caution and good judgment when meeting people online.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>5. User Content</h2>
            <p style={{ marginBottom: '12px' }}>
              You retain ownership of content you post (&ldquo;User Content&rdquo;). By posting, you grant Zik4U a non-exclusive,
              royalty-free, worldwide, sublicensable license to use, display, reproduce, and distribute your User Content solely to
              operate and improve the Service.
            </p>
            <p style={{ marginBottom: '12px' }}>You represent and warrant that:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>You own or have the rights to post all User Content</li>
              <li>Your User Content does not infringe any third-party rights</li>
              <li>Your User Content complies with these Terms and applicable law</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We reserve the right to remove any User Content that violates these Terms, at our sole discretion.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>6. Creator Program</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#12122A', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Becoming a Creator</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                  Any user may apply to become a Creator and offer paid subscription tiers to fans. Zik4U reserves the right to
                  accept or reject Creator applications at its discretion.
                </p>
              </div>
              <div style={{ backgroundColor: '#12122A', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Revenue Share</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                  Creators receive their net revenue after platform fees and payment processor fees. The standard creator
                  revenue share is approximately 80% of net revenue received by Zik4U. For iOS and Android in-app
                  subscriptions, the effective creator share is approximately 70% of gross (after Apple or Google&apos;s
                  30% commission, or 15% under their Small Business Program), then 80% of the remaining net amount.
                  The exact revenue share applicable to your account is displayed in Creator Studio. We reserve the right
                  to modify the revenue share with 30 days&apos; written notice to active creators.
                </p>
              </div>
              <div style={{ backgroundColor: '#12122A', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Payouts</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                  Payouts are processed monthly via Trolley, subject to a minimum threshold of $25. Creators must complete
                  KYC (Know Your Customer) verification and provide tax information before receiving payouts. We may withhold
                  payments if we suspect fraudulent activity.
                </p>
              </div>
              <div style={{ backgroundColor: '#12122A', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Creator Responsibilities</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                  Creators are responsible for the content they provide to subscribers, including compliance with applicable
                  laws. Creators are independent contractors, not employees of Zik4U. Creators are responsible for reporting
                  and paying taxes on earnings received through the platform.
                </p>
              </div>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>7. Subscriptions & Payments</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong style={{ color: '#FFFFFF' }}>Billing:</strong> Subscriptions are billed on a recurring basis (monthly or annually)
                starting on the date of purchase. Payments are processed by Stripe (web) or through your device&apos;s app store (iOS/Android).
              </li>
              <li>
                <strong style={{ color: '#FFFFFF' }}>Cancellation:</strong> You may cancel a subscription at any time. Access continues
                until the end of the current billing period. No partial refunds are provided for unused time.
              </li>
              <li>
                <strong style={{ color: '#FFFFFF' }}>Refunds:</strong>
                {' '}For subscriptions purchased through our website via Stripe, contact us at{' '}
                <a href="mailto:support@zik4u.com" style={{ color: '#00D4FF', textDecoration: 'none' }}>support@zik4u.com</a>
                {' '}within 7 days of a charge for refund consideration, subject to our discretion.
                For purchases made through Apple App Store or Google Play, refunds are governed solely and exclusively by
                those platforms&apos; refund policies. Zik4U has no ability to issue refunds for in-app purchases &mdash;
                please contact Apple or Google directly.
              </li>
              <li>
                <strong style={{ color: '#FFFFFF' }}>Price Changes:</strong> We will notify you at least 30 days before any subscription
                price increase. Continued use after the notice period constitutes acceptance.
              </li>
              <li>
                <strong style={{ color: '#FFFFFF' }}>Failed Payments:</strong> If a payment fails, we will retry and notify you.
                Continued failure may result in subscription suspension.
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>8. Intellectual Property</h2>
            <p style={{ marginBottom: '12px' }}>
              The Zik4U name, logo, design, software, and all platform content (excluding User Content) are the exclusive property
              of Zik4U and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for
              personal, non-commercial purposes. This license does not include the right to resell, sublicense, or commercially
              exploit any part of the Service.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party music platforms (Spotify, Apple Music, YouTube, Deezer, SoundCloud) and payment
              processors (Stripe, RevenueCat). Your use of these services is subject to their respective terms and privacy policies.
              Zik4U is not responsible for the availability, content, or practices of third-party services. Connecting a third-party
              service constitutes your consent to our accessing data from that service as described in our Privacy Policy.
            </p>
          </section>

          {/* 9b */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
              9b. Partner Program &amp; API Access
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Zik4U offers a Partner Program providing access to aggregated, anonymized music intelligence
              data (&ldquo;Zik4U Intelligence&rdquo;) via API to verified business entities
              (&ldquo;Partners&rdquo;).
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Eligibility:</strong>
                {' '}Partner access is restricted to verified legal entities (companies, research
                institutions, registered organizations). Individual consumers are not eligible.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>API Key:</strong>
                {' '}Each Partner receives a unique API key. Keys must not be shared, resold, or used
                by third parties. Zik4U reserves the right to revoke keys at any time.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Data Use:</strong>
                {' '}Intelligence data provided via the Partner API is aggregated and anonymized.
                Partners may not attempt to re-identify individual users. Data may not be resold,
                sublicensed, or incorporated into competing products without prior written consent.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>No Warranties:</strong>
                {' '}Intelligence data is provided &ldquo;as is.&rdquo; Zik4U makes no guarantees
                regarding accuracy, completeness, or fitness for any particular commercial purpose
                including A&amp;R decisions or investment strategies.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Termination:</strong>
                {' '}Zik4U may suspend or terminate Partner access immediately for breach of these
                terms or misuse of data.
              </li>
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>10. Disclaimers & Limitation of Liability</h2>
            <p style={{ marginBottom: '12px' }}>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES
              OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p style={{ marginBottom: '12px' }}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZIK4U SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A)
              $100 OR (B) THE AMOUNT YOU PAID TO ZIK4U IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>11. Termination</h2>
            <p style={{ marginBottom: '12px' }}>
              You may delete your account at any time via Settings → Delete Account. Upon deletion, your personal data will be
              removed within 30 days, except where retention is required by law.
            </p>
            <p>
              We may suspend or terminate your account immediately, with or without notice, if you violate these Terms or engage
              in conduct we deem harmful to other users or the Service. Upon termination, all licenses granted to you immediately cease.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>12. Governing Law & Disputes</h2>
            <p style={{ marginBottom: '12px' }}>
              These Terms are governed by the laws of the State of Florida, United States, without regard to conflict of law principles.
            </p>
            <p style={{ marginBottom: '12px' }}>
              Any disputes shall be resolved exclusively in the courts of Florida. You consent to the personal jurisdiction of such
              courts and waive any objection to venue or inconvenient forum.
            </p>
            <p style={{ marginTop: '12px' }}>
              <strong style={{ color: '#FFFFFF' }}>For users in the EU/EEA:</strong>
              {' '}Notwithstanding the above, if you are a consumer located in the European Union or European Economic Area,
              mandatory consumer protection laws of your country of residence apply and cannot be excluded by these Terms.
              The jurisdiction clause above does not limit your right to bring proceedings before the courts of your country
              of habitual residence, nor does it limit any rights you have under applicable EU law, including but not limited
              to Directive 93/13/EEC on unfair contract terms and Regulation (EU) 2016/679 (GDPR).
            </p>
            <p style={{ marginTop: '12px' }}>
              EU users may also submit complaints to their local data protection authority (DPA). A list of EU DPAs is
              available at{' '}
              <a
                href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00D4FF', textDecoration: 'none' }}
              >
                edpb.europa.eu
              </a>.
            </p>
          </section>

          {/* Contact */}
          <section
            style={{
              backgroundColor: '#12122A',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255,60,172,0.2)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>Questions?</h2>
            <p style={{ marginBottom: '16px' }}>
              For questions about these Terms, contact our Legal Team:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                borderRadius: '8px',
                color: '#FFFFFF',
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
          <a href="/legal/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
          <a href="/legal/terms" style={{ color: '#00D4FF', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>Home</a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '12px' }}>
          © {new Date().getFullYear()} Zik4U. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
