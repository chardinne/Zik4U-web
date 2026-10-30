/**
 * COMPLY1-EXPO (Decision 126 = A, texts validated by Bertrand on 22/10/2026) — Expo's
 * data processing addendum makes it an independent controller of device technical data
 * (IP address) used for its own aggregate statistics, and requires us to say so.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..', '..');
const en = readFileSync(join(root, 'src/app/legal/privacy/page.tsx'), 'utf8').replace(/\s+/g, ' ');
const fr = readFileSync(join(root, 'src/app/fr/legal/privacy/page.tsx'), 'utf8').replace(/\s+/g, ' ');

describe('COMPLY1-EXPO — privacy policy §9', () => {
  it('EN states Expo own use', () => {
    expect(en).toContain(
      'We never sell your personal data. We share it only with the providers below, which process it on our instructions (Expo also has a limited use of its own, described below), and with the app stores as independent companies.',
    );
    expect(en).toContain(
      'Expo also uses technical information about your device, such as its IP address, for its own aggregate statistics, as an independent controller under its own privacy policy (expo.dev/privacy).',
    );
    expect(en).not.toContain('We share it only with providers who process it on our instructions, and');
  });

  it('FR states Expo own use', () => {
    expect(fr).toContain(
      'Nous ne vendons jamais vos données personnelles. Nous les partageons uniquement avec les prestataires ci-dessous, qui les traitent sur nos instructions (Expo en a aussi un usage limité qui lui est propre, décrit plus bas), et avec les magasins d&apos;applications en tant que sociétés indépendantes.',
    );
    expect(fr).toContain(
      'Expo utilise aussi des informations techniques sur votre appareil, comme son adresse IP, pour ses propres statistiques agrégées, en tant que responsable indépendant, selon sa propre politique (expo.dev/privacy).',
    );
    expect(fr).not.toContain('Nous ne les partageons qu&apos;avec des prestataires');
  });

  it('re-dates both texts', () => {
    expect(en).toContain("const LAST_UPDATED = 'October 30, 2026';");
    expect(fr).toContain("const LAST_UPDATED = '30 octobre 2026';");
  });
});
