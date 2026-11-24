import * as fs from 'fs';
import * as path from 'path';

// AUDIT2-d1 (D365, D376 = A, 24/11/2026): research reports use listening PATTERNS (when and how
// people listen), never "moods"; texts T2 / T3 validated by Bertrand ("textes d1 OK").
const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8').replace(/\s+/g, ' ');
const en = read('app/legal/privacy/page.tsx');
const fr = read('app/fr/legal/privacy/page.tsx');

describe('AUDIT2-d1 — research reports describe listening patterns', () => {
  it('English §7', () => {
    expect(en).toContain('<Strong>What we use.</Strong> The songs you play after you turn it on, when you play them, the listening patterns derived from when and how you play them (for example late at night, on repeat, or exploring new artists), and your archetype. Never listens made in private mode. Never your listening patterns or archetype if your listening mood profile is off.');
    expect(en).toContain('at what times of day and in which listening patterns people listened)');
    expect(en).not.toContain('in which listening moods');
  });

  it('French §7', () => {
    expect(fr).toContain("les habitudes d&apos;écoute déduites du moment et de la façon dont vous écoutez (par exemple tard le soir, en boucle, ou en découvrant de nouveaux artistes), et votre archétype. Jamais les écoutes faites en mode privé. Jamais vos habitudes d&apos;écoute ni votre archétype si votre profil d&apos;humeurs d&apos;écoute est désactivé.");
    expect(fr).toContain("ou à quelles heures et selon quelles habitudes d&apos;écoute les gens ont écouté)");
    expect(fr).not.toContain('dans quelles humeurs');
  });
});
