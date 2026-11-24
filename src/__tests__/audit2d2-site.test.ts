import * as fs from 'fs';
import * as path from 'path';

// AUDIT2-d2 (D379 = A, D380 = B, 24/11/2026): the capture keeps how long a track was actually
// listened to and a coded fingerprint of the track's ID in the music app (never the ID itself);
// legal basis: legitimate interest (EDPB 2/2019: fraud prevention is not contractual necessity).
// Texts T4, T4-FR, T6, T6-FR validated by Bertrand.
const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8').replace(/\s+/g, ' ');
const en = read('app/legal/privacy/page.tsx');
const fr = read('app/fr/legal/privacy/page.tsx');

describe('AUDIT2-d2 — capture keeps listened time and a coded track fingerprint', () => {
  it('English §3 (T4)', () => {
    expect(en).toContain('keeps: track title, artist, album, duration, how long you actually listened, time played, the app you listened in, a coded fingerprint of the track&apos;s ID in that app when the app provides one (never the ID itself), and a link to the cover art. How long you listened tells a real listen from a track skipped or left running; the fingerprint tells two versions of a track apart. Other members never see either.');
    expect(en).not.toContain('keeps: track title, artist, album, duration, time played');
  });

  it('English §4 legal basis (T6)', () => {
    expect(en).toContain("['Telling real listens apart and recognizing the exact track you played', \"How long you listened, coded fingerprint of the track's ID\", 'Legitimate interest: making sure listens counted on Zik4U, and paid to creators, are real, and recognizing the exact version you played. You can object by writing to us.']");
  });

  it('French §3 (T4-FR)', () => {
    expect(fr).toContain("titre, artiste, album, durée, durée réellement écoutée, heure d&apos;écoute, application utilisée, une empreinte codée de l&apos;identifiant du titre dans cette application quand elle le fournit (jamais l&apos;identifiant lui-même) et lien vers la pochette. La durée écoutée distingue une vraie écoute d&apos;un titre zappé ou laissé tourner ; l&apos;empreinte distingue deux versions d&apos;un même titre. Les autres membres ne voient ni l&apos;une ni l&apos;autre.");
    expect(fr).not.toContain("durée, heure d&apos;écoute, application utilisée et lien");
  });

  it('French §4 legal basis (T6-FR)', () => {
    expect(fr).toContain("['Distinguer les vraies écoutes et reconnaître le titre exact que vous avez écouté', \"Durée écoutée, empreinte codée de l'identifiant du titre\", \"Intérêt légitime : s'assurer que les écoutes comptées sur Zik4U, et payées aux créateurs, sont réelles, et reconnaître la version exacte que vous avez écoutée. Vous pouvez vous y opposer en nous écrivant.\"]");
  });
});
