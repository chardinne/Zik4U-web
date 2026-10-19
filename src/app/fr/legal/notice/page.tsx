import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1e (Decision 103 = A, 19/10/2026) — French version of the legal notice
// (claude/COMPLY1e-TEXTES-FR.md §4, validated by Bertrand on 19/10/2026). Day of
// registration: complete with the English page (REGISTERED_COMPANY in
// src/app/legal/notice/page.tsx), wording submitted to Bertrand first.
// Guard: src/__tests__/comply1g-site.test.ts.

export const metadata = generatePageMetadata(
  'Mentions légales',
  "Qui édite le site Zik4U, qui l'héberge et où ses données sont stockées.",
  '/fr/legal/notice',
);

const LAST_UPDATED = '18 octobre 2026';
const SUPPORT = 'support@zik4u.com';
const PRIVACY = 'privacy@zik4u.com';

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      crumb="Mentions légales"
      title="Mentions légales"
      lastUpdated={LAST_UPDATED}
      current="notice"
      lang="fr"
      altHref="/legal/notice"
    >
      <Section title="Éditeur">
        <P>
          Ce site est édité par Bertrand Chardinne, fondateur, agissant pour Zik4U, société par actions simplifiée (SAS)
          de droit français en formation. Une fois la société immatriculée, sa dénomination, son siège social, son
          capital et son numéro d&apos;immatriculation figureront ici.
        </P>
      </Section>

      <Section title="Directeur de la publication">
        <P>Bertrand Chardinne.</P>
      </Section>

      <Section title="Contact">
        <P>
          <Mail to={SUPPORT} />. Pour les données personnelles : <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section title="Hébergement">
        <P>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.</P>
      </Section>

      <Section title="Stockage des données">
        <P>
          Supabase Pte. Ltd, 65 Chulia Street #38-02/03, OCBC Centre, Singapour 049513. Les données sont stockées aux
          États-Unis (Virginie).
        </P>
      </Section>

      <P>
        Voir aussi notre <A href="/fr/legal/privacy">Politique de confidentialité</A> et nos{' '}
        <A href="/fr/legal/terms">Conditions générales d&apos;utilisation</A>.
      </P>
    </LegalPage>
  );
}
