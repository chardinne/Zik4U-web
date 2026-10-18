/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// TRACK-CONSENT1 (18/10/2026, Decisions 95 = B and 96 = A) — the Privacy Policy says what
// analytics records: Firebase usage events AND the sphere interactions kept in Zik4U's
// database, 13 months, deleted when analytics is turned off.

const root = join(__dirname, '..', '..');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const privacy = flat(readFileSync(join(root, 'src/app/legal/privacy/page.tsx'), 'utf8'));

describe('TRACK-CONSENT1 — analytics in the Privacy Policy', () => {
  it('describes what is recorded, for how long, and what turning it off does', () => {
    expect(privacy).toContain(
      '<Strong>Analytics, only if you agree.</Strong> If you accept analytics, we record how you use the app. Firebase Analytics receives usage events linked to a pseudonymous identifier (a short code derived from your account, never your name or email). Our own database keeps how you interact with the music on profiles: the track you tap, preview or play, how long a preview stays open, and whose profile you were on. These records are deleted after 13 months. Analytics is off unless you accept. You can turn it off anytime in Settings, which stops recording and deletes these records.',
    );
  });

  it('lists the retention period', () => {
    expect(privacy).toContain(
      '<Strong>Usage analytics</Strong> (only if you accept): 13 months, and deleted at once when you turn analytics off.',
    );
  });

  it('drops the previous wording', () => {
    expect(privacy).not.toContain('a short hash, never your name or email). Off unless you accept;');
  });

  it('uses no long dash', () => {
    expect(privacy.replace(/\/\/.*$/gm, '')).not.toContain('—');
  });
});
