/**
 * D239 (Zik4U session 76, D238 = A) — a creator blocking a subscriber, told truly for both stores:
 * Zik4U can refund and end a subscription on Google Play (Play Console, D230), never on the App Store
 * (only the subscriber cancels, only Apple refunds). Terms §9 and §10, Creator Terms §5, EN and FR,
 * word for word as validated by Bertrand on 02/11/2026.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');

const EN_TERMS = 'app/legal/terms/page.tsx';
const FR_TERMS = 'app/fr/legal/terms/page.tsx';
const EN_CREATOR = 'app/legal/creator-terms/page.tsx';
const FR_CREATOR = 'app/fr/legal/creator-terms/page.tsx';

const section = (p: string, n: number) => {
  const s = read(p);
  const i = s.indexOf(`<Section title="${n}.`);
  const j = s.indexOf(`<Section title="${n + 1}.`);
  expect(i).toBeGreaterThan(-1);
  expect(j).toBeGreaterThan(i);
  return flat(s.slice(i, j));
};

describe('D239 — Terms §9 Creators', () => {
  it('EN', () => {
    expect(section(EN_TERMS, 9)).toContain(
      "\"If a creator blocks a subscriber, the subscriber loses access to that creator's subscriber content and the creator is not paid for the current period. On Google Play, Zik4U ends the subscription and refunds the current period through Google Play. On the App Store, Apple does not let us cancel or refund a subscription: to stop renewals, the subscriber must cancel it in their App Store settings, and they can ask Apple for a refund at reportaproblem.apple.com.\",",
    );
  });
  it('FR', () => {
    expect(section(FR_TERMS, 9)).toContain(
      "\"Si un créateur bloque un abonné, l'abonné perd l'accès aux contenus réservés aux abonnés de ce créateur, et le créateur n'est pas payé pour la période en cours. Sur Google Play, Zik4U met fin à l'abonnement et rembourse la période en cours via Google Play. Sur l'App Store, Apple ne nous permet ni de résilier ni de rembourser un abonnement : pour arrêter les renouvellements, l'abonné doit le résilier dans les réglages de son compte App Store, et il peut demander un remboursement à Apple sur reportaproblem.apple.com.\",",
    );
  });
});

describe('D239 — Terms §10 Subscriptions and payments', () => {
  it('EN', () => {
    expect(section(EN_TERMS, 10)).toContain(
      '"Refunds are handled by Apple or Google under their policies, except the Google Play refund Zik4U makes when a creator blocks a subscriber (section 9). Your statutory rights as a consumer, including any right of withdrawal, apply as provided by law and by the store\'s process.",',
    );
  });
  it('FR', () => {
    expect(section(FR_TERMS, 10)).toContain(
      "\"Les remboursements sont gérés par Apple ou Google selon leurs règles, sauf le remboursement que Zik4U effectue sur Google Play quand un créateur bloque un abonné (section 9). Vos droits légaux de consommateur, y compris un éventuel droit de rétractation, s'appliquent comme le prévoient la loi et la procédure du store.\",",
    );
  });
});

describe('D239 — Creator Terms §5 Refunds and fraud', () => {
  it('EN', () => {
    expect(section(EN_CREATOR, 5)).toContain(
      'If you block a subscriber, your share of their current period is not paid, whether or not the store refunds it: on Google Play, Zik4U refunds that period; on the App Store, only Apple can refund it, at the subscriber&apos;s request (Terms of Service, section 9).',
    );
  });
  it('FR', () => {
    expect(section(FR_CREATOR, 5)).toContain(
      "Si vous bloquez un abonné, votre part de sa période en cours n&apos;est pas versée, que le magasin la rembourse ou non : sur Google Play, Zik4U rembourse cette période ; sur l&apos;App Store, seul Apple peut la rembourser, à la demande de l&apos;abonné (Conditions d&apos;utilisation, section 9).",
    );
  });
});

describe('D239 — the old promise is gone everywhere on the site', () => {
  const files = [EN_TERMS, FR_TERMS, EN_CREATOR, FR_CREATOR];
  it.each(files)('%s', (p) => {
    const s = flat(read(p));
    expect(s).not.toContain('the subscription ends and Zik4U refunds');
    expect(s).not.toContain("l'abonnement prend fin et Zik4U rembourse");
    expect(s).not.toContain('Zik4U refunds it');
    expect(s).not.toContain('Zik4U la rembourse');
  });
  it('dates unchanged (published on November 2, 2026)', () => {
    expect(read(EN_TERMS)).toContain("const LAST_UPDATED = 'November 2, 2026';");
    expect(read(FR_TERMS)).toContain("const LAST_UPDATED = '2 novembre 2026';");
  });
});
