import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Mail } from '@/components/legal/LegalPage';

// COMPLY1e (Decision 103 = A, 19/10/2026) — French version of zik4u.com/delete-account
// (claude/COMPLY1e-TEXTES-FR.md §3, validated by Bertrand on 19/10/2026). Both subjects,
// English and French, are accepted by the e-mail procedure.
// Guard: src/__tests__/comply1g-site.test.ts.

export const metadata = generatePageMetadata(
  'Supprimer votre compte',
  "Comment supprimer votre compte Zik4U et vos données, dans l'app ou sans elle.",
  '/fr/delete-account',
);

const PRIVACY = 'privacy@zik4u.com';

export default function SupprimerComptePage() {
  return (
    <LegalPage
      crumb="Supprimer votre compte"
      title="Supprimer votre compte Zik4U"
      current="delete"
      lang="fr"
      altHref="/delete-account"
    >
      <Section title="Dans l'app (le plus rapide)">
        <P>
          Ouvrez Zik4U › <Strong>« Settings › Delete account »</Strong>. Votre compte et vos données sont supprimés
          immédiatement.
        </P>
      </Section>

      <Section title="Sans l'app">
        <P>
          Envoyez un e-mail à <Mail to={PRIVACY} /> <Strong>depuis l&apos;adresse e-mail de votre compte Zik4U</Strong>,
          avec pour objet « Supprimer mon compte » et votre nom d&apos;utilisateur. Nous vérifions que la demande vient
          bien de l&apos;adresse du compte, supprimons le compte sous <Strong>30 jours</Strong> et vous le confirmons par
          e-mail.
        </P>
      </Section>

      <Section title="Ce qui est supprimé">
        <P>
          Votre profil, votre historique d&apos;écoute, vos publications, commentaires, réactions, playlists, les messages
          que vous avez envoyés, vos abonnés et abonnements, votre profil d&apos;humeurs d&apos;écoute et votre
          archétype, vos réglages Music Match et recherche, vos notifications et jetons push.
        </P>
      </Section>

      <Section title="Ce qui peut subsister">
        <P>
          Les copies résiduelles dans les sauvegardes et les journaux techniques, effacées sous 30 jours. Les enregistrements que la loi nous impose de garder : achats, versements et comptabilité ; et, pendant un an, l&apos;enregistrement minimal imposé aux hébergeurs par la loi française (votre pseudonyme, votre e-mail, la date de création du compte, et l&apos;identifiant et la date de ce que vous avez publié, jamais son contenu). Les rapports de recherche déjà livrés, qui ne contiennent aucune donnée sur vous en tant que personne.
        </P>
      </Section>

      <Section title="Avant de supprimer">
        <List
          items={[
            <>Désinstaller l&apos;app ne supprime <Strong>pas</Strong> votre compte.</>,
            <>Supprimer votre compte ne résilie <Strong>pas</Strong> un abonnement souscrit sur l&apos;App Store ou Google Play : résiliez-le d&apos;abord dans les réglages de votre store.</>,
            <>Vous pouvez d&apos;abord télécharger vos données dans <Strong>« Settings › My Data (GDPR / CCPA) »</Strong>.</>,
          ]}
        />
        <P>
          Questions : <Mail to={PRIVACY} />
        </P>
      </Section>
    </LegalPage>
  );
}
