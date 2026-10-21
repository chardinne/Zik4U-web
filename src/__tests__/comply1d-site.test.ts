/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// COMPLY1d (texts validated by Bertrand on 21/10/2026, claude/COMPLY1d-CREATEUR-TEXTES.md;
// Decisions 116 = A US dollars, 117 = A residual balance on request, 118 = A acceptance) — the
// Creator Terms exist in English and French, are linked from the legal footer and the sitemap,
// and the Privacy Policy says what DAC7 makes us receive and report.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/\{' '\}/g, ' ').replace(/\s+/g, ' ');
const visible = (src: string) => src.replace(/^\s*\/\/.*$/gm, '');

const en = flat(read('src/app/legal/creator-terms/page.tsx'));
const fr = flat(read('src/app/fr/legal/creator-terms/page.tsx'));

describe('COMPLY1d — Creator Terms (EN)', () => {
  it.each([
    'You act as an independent creator, on your own account.',
    "For each subscription to your tiers, you receive <Strong>80% of the net amount Zik4U actually receives</Strong>, meaning after the app store's commission and the taxes the store withholds. Zik4U keeps 20%.",
    'Each month, we calculate your unpaid balance for the previous calendar month and send it if it reaches US$25; otherwise it carries over to the next month. <Strong>Payouts are made in US dollars</Strong>',
    'When you stop being a creator, a balance below US$25 is paid on request to <Mail to={SUPPORT} /> within 30 days.',
    'Each invoice bears the mention "Autofacturation" (self-billing)',
    'You can contest an invoice within 30 days of receiving it; after that, it is considered accepted.',
    'under the EU rules known as DAC7',
    'If you do not provide this information after two reminders, we hold your payouts until you do, and may end your creator status.',
    'Without it, French law may require us to withhold tax from your payouts (25%, or 75% for a non-cooperative state or territory)',
    'If you are a United States person, you provide a form W-9, and Trolley issues on our behalf the form 1099 required by US law',
    "If you act as a business, Zik4U's total liability to you is limited to the amounts paid to you in the 12 months before the claim.",
    'These terms are governed by French law.',
  ])('%s', (s) => expect(en).toContain(s));
  it('has 15 numbered sections', () => {
    for (let i = 1; i <= 15; i++) expect(en).toContain(`<Section title="${i}. `);
  });
});

describe('COMPLY1d — Conditions créateurs (FR)', () => {
  it.each([
    'Vous agissez comme créateur indépendant, pour votre propre compte.',
    "vous recevez <Strong>80 % du montant net réellement perçu par Zik4U</Strong>, c'est-à-dire après la commission du magasin d'applications et les taxes qu'il retient. Zik4U conserve 20 %.",
    '<Strong>Les versements sont faits en dollars américains</Strong>',
    "Quand vous cessez d'être créateur, un solde inférieur à 25 dollars américains vous est versé sur demande à <Mail to={SUPPORT} />, sous 30 jours.",
    'Chaque facture porte la mention « Autofacturation »',
    'en application des règles européennes dites DAC7',
    "À défaut, la loi française peut nous obliger à retenir un impôt sur vos versements (25 %, ou 75 % pour un État ou territoire non coopératif)",
    'Ces conditions sont soumises au droit français.',
  ])('%s', (s) => expect(fr).toContain(s));
  it('has 15 numbered sections and links the English version', () => {
    for (let i = 1; i <= 15; i++) expect(fr).toContain(`<Section title="${i}. `);
    expect(fr).toContain('altHref="/legal/creator-terms"');
  });
});

describe('COMPLY1d — footer, sitemap, privacy', () => {
  it('links the Creator Terms from the legal footer and the sitemap', () => {
    expect(read('src/components/legal/LegalPage.tsx')).toContain("footerLink('creator', `${L.prefix}/legal/creator-terms`, L.creator)");
    const sm = read('src/app/sitemap.ts');
    expect(sm).toContain('`${BASE_URL}/legal/creator-terms`');
    expect(sm).toContain('`${BASE_URL}/fr/legal/creator-terms`');
  });

  it('the Privacy Policy says what DAC7 makes us receive and report (EN + FR)', () => {
    const p = flat(read('src/app/legal/privacy/page.tsx'));
    expect(p).toContain("Because French law requires us to report creators' earnings to the French tax authority (EU rules known as DAC7), Trolley also passes to us your name, address, date of birth, tax identification number, country of tax residence, VAT status and number, business status, and the account to which your payouts are sent. We also keep the invoices issued on your behalf.");
    expect(p).not.toContain('We receive your payout status, not your bank details.');
    expect(p).toContain("[\"Reporting creators' earnings to the tax authority (DAC7) and issuing invoices on their behalf\", 'Creator identity, tax and payout information, invoices', 'Legal obligation']");
    expect(p).toContain('For creators who are paid, we send the information required by law to the French tax authority (DGFiP), which may share it with the tax authority of the country where they live.');
    expect(p).toContain('<Strong>Purchase, payout, invoice and tax reporting records</Strong>: kept as long as tax and accounting law requires (up to 10 years in France).');
    const f = flat(read('src/app/fr/legal/privacy/page.tsx'));
    expect(f).toContain("Parce que la loi française nous oblige à déclarer les gains des créateurs à l'administration fiscale (règles européennes dites DAC7), Trolley nous transmet aussi vos nom et prénom, adresse, date de naissance, numéro d'identification fiscale, pays de résidence fiscale, régime et numéro de TVA, statut de particulier ou de professionnel, et le compte sur lequel vos versements sont faits. Nous conservons aussi les factures émises en votre nom.");
    expect(f).not.toContain('Nous recevons le statut de vos paiements, pas vos coordonnées bancaires.');
    expect(f).toContain("Pour les créateurs que nous payons, nous transmettons les informations exigées par la loi à l'administration fiscale française (DGFiP), qui peut les communiquer à l'administration fiscale de leur pays de résidence.");
    expect(f).toContain("<Strong>Achats, versements, factures et déclarations fiscales</Strong> : conservés aussi longtemps que l'exigent les règles fiscales et comptables (jusqu'à 10 ans en France).");
  });

  it('no long dash in the visible text of the new pages', () => {
    for (const p of ['src/app/legal/creator-terms/page.tsx', 'src/app/fr/legal/creator-terms/page.tsx']) {
      expect(visible(read(p))).not.toMatch(/—/);
    }
  });
});
