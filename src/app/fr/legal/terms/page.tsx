import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1e (Decision 103 = A, 19/10/2026) — French version of the Terms of Service
// (claude/COMPLY1e-TEXTES-FR.md §2 with §13 of Decision 102 and §3 of COMPLY1g; texts
// validated by Bertrand on 19/10/2026; long dashes replaced per the site rule).
// Guard: src/__tests__/comply1g-site.test.ts.

export const metadata = generatePageMetadata(
  "Conditions générales d'utilisation",
  "Les conditions générales d'utilisation de Zik4U : ce qu'est Zik4U, les règles, les créateurs, les abonnements et vos droits.",
  '/fr/legal/terms',
);

const LAST_UPDATED = '24 octobre 2026';
const SUPPORT = 'support@zik4u.com';

export default function ConditionsGeneralesPage() {
  return (
    <LegalPage
      crumb="Conditions générales d'utilisation"
      title="Conditions générales d'utilisation"
      lastUpdated={LAST_UPDATED}
      current="terms"
      lang="fr"
      altHref="/legal/terms"
    >
      <Section title="1. Accord">
        <P>
          Les présentes Conditions constituent un accord entre vous et <Strong>Bertrand Chardinne, fondateur, agissant
          pour Zik4U, société par actions simplifiée (SAS) de droit français en formation</Strong> (« Zik4U »,
          « nous »). Une fois la société immatriculée, elle reprend cet accord. En créant un compte ou en utilisant
          l&apos;app ou le site Zik4U (le « Service »), vous acceptez ces Conditions. Notre{' '}
          <A href="/fr/legal/privacy">Politique de confidentialité</A> explique comment nous traitons vos données.
        </P>
      </Section>

      <Section title="2. Qui peut utiliser Zik4U">
        <List
          items={[
            <>Vous devez avoir <Strong>16 ans ou plus</Strong>. Music Match et la recherche musicale exigent d&apos;avoir <Strong>18 ans ou plus</Strong>.</>,
            "Un compte par personne. Vous êtes responsable de l'activité de votre compte et de la sécurité de vos identifiants.",
            "Donnez des informations exactes et ne vous faites pas passer pour quelqu'un d'autre.",
          ]}
        />
      </Section>

      <Section title="3. Ce qu'est Zik4U, et ce qu'il n'est pas">
        <List
          items={[
            'Zik4U capte ce que vous écoutez dans vos applications musicales et en fait votre identité musicale, des fonctions sociales et des abonnements aux créateurs.',
            <><Strong>Zik4U n&apos;est pas un lecteur de musique.</Strong> Les boutons de lecture ouvrent le titre dans votre propre application musicale. Nous ne diffusons, n&apos;hébergeons ni ne vendons de musique.</>,
            "Zik4U n'est ni affilié à, ni approuvé ou parrainé par un service de streaming ou une application musicale. Leurs noms et marques appartiennent à leurs propriétaires.",
            "Sur Android, la captation exige l'accès aux notifications, que vous pouvez retirer à tout moment.",
          ]}
        />
      </Section>

      <Section title="4. Uniquement des écoutes réelles">
        <P>
          Zik4U repose sur des écoutes réelles, et des créateurs peuvent être rémunérés sur cette base. Vous ne devez pas
          créer d&apos;écoutes fausses ou automatisées, faire tourner des titres en boucle pour gonfler des compteurs,
          utiliser des robots ou des scripts, ni manipuler d&apos;une autre manière les données d&apos;écoute, les
          statistiques ou les classements. Nous pouvons écarter les écoutes suspectes et suspendre les comptes concernés.
        </P>
      </Section>

      <Section title="5. Règles de conduite">
        <P>
          Ne publiez et n&apos;envoyez rien d&apos;illégal, de haineux, de harcelant, de menaçant, de sexuellement
          explicite impliquant des mineurs, de diffamatoire, ou qui porte atteinte aux droits d&apos;autrui.
          N&apos;envoyez pas de spam, n&apos;aspirez pas le Service, ne tentez pas d&apos;accéder aux comptes
          d&apos;autres membres ou à nos systèmes, ne décompilez pas l&apos;app, et n&apos;utilisez pas le Service pour
          collecter les données personnelles d&apos;autres membres.
        </P>
      </Section>

      <Section title="6. Vos contenus">
        <P>
          Vous restez propriétaire de ce que vous publiez. Vous accordez à Zik4U une licence non exclusive, mondiale et
          gratuite pour héberger, afficher et diffuser vos contenus au sein du Service, dans le seul but de le faire
          fonctionner. Cette licence prend fin quand vous supprimez le contenu ou votre compte, sauf pour les copies que
          d&apos;autres membres ont déjà reçues en messages.
        </P>
      </Section>

      <Section title="7. Signalement, modération et suspension">
        <P>
          Vous pouvez signaler toute publication ou tout commentaire dans l&apos;app, et tout le reste (un message, un
          compte) en écrivant à <Mail to={SUPPORT} />. Nous examinons les signalements et pouvons retirer des contenus ou suspendre des comptes qui enfreignent ces Conditions ou la loi.
          Quand nous retirons votre contenu ou restreignons votre compte, nous vous en donnons la raison. Si vous
          n&apos;êtes pas d&apos;accord, écrivez à <Mail to={SUPPORT} /> : une personne réexaminera la décision. Notre
          point de contact pour les autorités et les utilisateurs au titre du règlement européen sur les services
          numériques est <Mail to={SUPPORT} /> (en français ou en anglais).
        </P>
      </Section>

      <Section title="8. Music Match">
        <P>
          Music Match est une fonction facultative qui permet à des adultes de découvrir des personnes aux goûts musicaux
          compatibles. Ce n&apos;est pas un service de rencontre. Utilisez-le avec respect : ni harcèlement, ni traque,
          ni sollicitation, ni spam. Vous pouvez bloquer qui vous voulez à tout moment. Nous ne sommes pas responsables
          des échanges qui ont lieu en dehors de Zik4U.
        </P>
      </Section>

      <Section title="9. Créateurs">
        <List
          items={[
            'Tout membre peut demander à devenir créateur ; nous pouvons accepter ou refuser une demande.',
            "Les créateurs fixent leurs formules d'abonnement parmi les options proposées dans l'app.",
            <><Strong>Partage des revenus : les créateurs reçoivent 80 % du montant net effectivement perçu par Zik4U pour leurs abonnements, après la commission du magasin d&apos;applications et les taxes applicables.</Strong> Ce partage est affiché dans le tableau de bord créateur. Nous préviendrons les créateurs actifs au moins 30 jours avant toute modification.</>,
            "Les paiements sont effectués par notre prestataire de paiement (Trolley) après vérification de l'identité et de la situation fiscale, selon le calendrier et le minimum indiqués dans l'app. Les créateurs sont responsables de leurs propres impôts. Nous pouvons retenir des paiements liés à une fraude ou à de fausses écoutes (section 4).",
            "Les créateurs sont indépendants ; rien dans ces Conditions n'en fait nos salariés ou nos associés. Ils sont responsables de ce qu'ils proposent à leurs abonnés.",
          ]}
        />
      </Section>

      <Section title="10. Abonnements et paiements">
        <List
          items={[
            "Les abonnements aux créateurs s'achètent sur l'App Store d'Apple ou Google Play, qui les facturent de façon récurrente jusqu'à votre résiliation.",
            <>Résiliez dans les réglages de votre compte App Store ou Google Play. L&apos;accès continue jusqu&apos;à la fin de la période payée. <Strong>Supprimer votre compte Zik4U ne résilie pas un abonnement souscrit sur un store</Strong> : résiliez-le d&apos;abord dans le store.</>,
            "Les remboursements sont gérés par Apple ou Google selon leurs règles. Vos droits légaux de consommateur, y compris un éventuel droit de rétractation, s'appliquent comme le prévoient la loi et la procédure du store.",
            "Les changements de prix suivent les règles du store, qui prévoient de vous prévenir à l'avance.",
          ]}
        />
      </Section>

      <Section title="11. Notre propriété intellectuelle">
        <P>
          Le nom, le logo, le design et le logiciel Zik4U appartiennent à Zik4U. Nous vous accordons un droit personnel,
          non transférable et révocable d&apos;utiliser le Service selon ces Conditions.
        </P>
      </Section>

      <Section title="12. Disponibilité et évolutions du Service">
        <P>
          Nous faisons en sorte que Zik4U soit disponible et exact, mais nous ne pouvons pas garantir qu&apos;il
          fonctionnera toujours sans interruption ni erreur. Nous pouvons modifier ou arrêter des fonctions ; si une
          modification réduit de façon importante une fonction payante, nous vous préviendrons à l&apos;avance.
        </P>
      </Section>

      <Section title="13. Responsabilité">
        <P>
          Rien dans ces Conditions ne limite ni n&apos;exclut notre responsabilité lorsque la loi ne le permet pas,
          notamment en cas de décès ou de dommage corporel, de fraude ou de faute lourde, et rien dans ces Conditions ne
          porte atteinte à vos droits légaux de consommateur. Si vous utilisez Zik4U en tant que consommateur, nous sommes
          responsables du dommage que vous subissez en conséquence directe et prévisible d&apos;un manquement à nos
          obligations, dans les conditions prévues par la loi. Si vous utilisez Zik4U pour votre activité
          professionnelle, y compris en tant que créateur agissant à titre professionnel, notre responsabilité totale
          envers vous est limitée aux sommes versées entre vous et Zik4U au cours des 12 mois précédant la réclamation.
        </P>
      </Section>

      <Section title="14. Fin de votre compte">
        <P>
          Vous pouvez supprimer votre compte à tout moment dans <Strong>« Settings › Delete account »</Strong> ou sur{' '}
          <A href="/fr/delete-account">zik4u.com/fr/delete-account</A>. Nous pouvons suspendre ou fermer un compte qui
          enfreint gravement ou de manière répétée ces Conditions, en vous en donnant la raison.
        </P>
      </Section>

      <Section title="15. Modifications de ces Conditions">
        <P>
          Si nous modifions ces Conditions de manière importante, l&apos;app vous présente les nouvelles Conditions avant
          leur application et vous demande de les accepter. Si vous ne les acceptez pas, vous pouvez supprimer votre
          compte.
        </P>
      </Section>

      <Section title="16. Droit applicable et litiges">
        <P>
          Ces Conditions sont régies par le droit français. Si vous êtes un consommateur, vous conservez la protection
          des dispositions impératives du pays où vous vivez, et vous pouvez saisir les tribunaux de ce pays. Avant toute
          action en justice, écrivez à <Mail to={SUPPORT} /> pour que nous tentions de résoudre le problème.
        </P>
      </Section>

      <Section title="17. Contact">
        <P>
          <Mail to={SUPPORT} /> : Bertrand Chardinne, pour Zik4U (SAS de droit français en formation).
        </P>
      </Section>
    </LegalPage>
  );
}
