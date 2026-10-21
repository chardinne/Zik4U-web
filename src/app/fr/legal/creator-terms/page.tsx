import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1d (textes validés par Bertrand le 21/10/2026, claude/COMPLY1d-CREATEUR-TEXTES.md ;
// Décisions 109-111 et 116-118 = A) — version française des conditions créateurs.
// Guard: src/__tests__/comply1d-site.test.ts.

export const metadata = generatePageMetadata(
  'Conditions créateurs',
  'Les conditions créateurs de Zik4U : partage des revenus, versements, factures émises en votre nom et déclarations fiscales.',
  '/fr/legal/creator-terms',
);

const LAST_UPDATED = '21 octobre 2026';
const SUPPORT = 'support@zik4u.com';

export default function ConditionsCreateursPage() {
  return (
    <LegalPage
      crumb="Conditions créateurs"
      title="Conditions créateurs"
      lastUpdated={LAST_UPDATED}
      current="creator"
      lang="fr"
      altHref="/legal/creator-terms"
    >
      <P>
        Ces conditions créateurs s&apos;appliquent dès que vous activez votre compte créateur dans l&apos;app Zik4U.
        Elles complètent les <A href="/fr/legal/terms">Conditions d&apos;utilisation</A> de Zik4U ; sur une question
        propre aux créateurs, si les deux textes diffèrent, ces conditions créateurs s&apos;appliquent. Zik4U est exploité
        par Bertrand Chardinne, agissant pour Zik4U, société par actions simplifiée (SAS) en formation.
      </P>

      <Section title="1. Votre statut">
        <P>
          Vous agissez comme créateur indépendant, pour votre propre compte. Rien dans ces conditions ne fait de vous un
          salarié, un mandataire ou un associé de Zik4U. Vous décidez de ce que vous publiez et quand. Si vous percevez
          des revenus de façon régulière, la loi de votre pays peut vous obliger à déclarer une activité (en France, par
          exemple, comme micro-entrepreneur). Vous indiquez dans l&apos;app si vous agissez comme particulier ou comme
          professionnel, et vous tenez cette information à jour.
        </P>
      </Section>

      <Section title="2. Ce que vous proposez">
        <P>
          Vos abonnés paient, via Google Play ou l&apos;App Store, l&apos;accès à ce que vous partagez avec eux dans
          l&apos;app : vos publications exclusives, vos drops et les autres fonctions réservées aux abonnés présentées
          dans l&apos;app. Vous choisissez vos paliers parmi les options proposées dans l&apos;app. Vous devez proposer ce
          que décrivent vos paliers, respecter les Conditions d&apos;utilisation (en particulier la section 4, Uniquement
          des écoutes réelles, et la section 5, Règles de conduite), et ne publier que des contenus que vous avez le droit
          de partager. Nous pouvons refuser, suspendre ou clore un compte créateur dans les conditions de la section 11.
        </P>
      </Section>

      <Section title="3. Licence">
        <P>
          Vous restez propriétaire de vos contenus. Vous accordez à Zik4U une licence non exclusive, mondiale et gratuite
          pour les héberger, les afficher et les rendre accessibles à vos abonnés et, pour les contenus publics, aux
          autres membres, uniquement pour faire fonctionner le service et tant que le contenu est en ligne. La licence
          prend fin quand vous supprimez le contenu ou votre compte.
        </P>
      </Section>

      <Section title="4. Partage des revenus">
        <P>
          Pour chaque abonnement à vos paliers, vous recevez <Strong>80 % du montant net réellement perçu par
          Zik4U</Strong>, c&apos;est-à-dire après la commission du magasin d&apos;applications et les taxes qu&apos;il
          retient. Zik4U conserve 20 %. Vos gains apparaissent dans votre tableau de bord créateur. Nous vous prévenons au
          moins 30 jours à l&apos;avance de toute modification du partage, et vous pouvez cesser d&apos;être créateur
          avant qu&apos;elle s&apos;applique.
        </P>
      </Section>

      <Section title="5. Remboursements et fraude">
        <P>
          Si un magasin rembourse un abonnement, votre part est déduite de votre solde, y compris de vos gains futurs si
          elle vous a déjà été versée. Les gains liés à des écoutes fausses ou manipulées, à une fraude ou à des contenus
          contraires aux Conditions d&apos;utilisation ne sont pas dus : nous pouvons les retenir le temps de vérifier, et
          les annuler si le manquement est confirmé, en vous en donnant la raison. Vous pouvez contester une telle
          décision en écrivant à <Mail to={SUPPORT} /> : une personne la réexaminera.
        </P>
      </Section>

      <Section title="6. Versements">
        <P>
          Les versements sont effectués par notre prestataire de paiement, Trolley, une fois que vous avez terminé sa
          vérification d&apos;identité et fiscale. Chaque mois, nous calculons votre solde impayé du mois civil précédent
          et le versons s&apos;il atteint 25 dollars américains ; sinon, il est reporté au mois suivant.{' '}
          <Strong>Les versements sont faits en dollars américains</Strong> ; Trolley peut les convertir dans votre
          devise, au taux et aux frais qu&apos;il vous indique. Quand vous cessez d&apos;être créateur, un solde inférieur
          à 25 dollars américains vous est versé sur demande à <Mail to={SUPPORT} />, sous 30 jours.
        </P>
      </Section>

      <Section title="7. Factures émises en votre nom (autofacturation)">
        <P>
          Pour vous éviter de nous facturer chaque mois, vous donnez mandat à Zik4U d&apos;émettre, en votre nom et pour
          votre compte, la facture de chaque versement. Chaque facture porte la mention « Autofacturation », contient les
          mentions exigées par la loi et reflète le régime de TVA que vous déclarez : franchise en base (en France :
          « TVA non applicable, art. 293 B du CGI »), assujetti à la TVA (TVA ajoutée au taux applicable), ou établi hors
          de France (autoliquidation, la TVA étant acquittée par Zik4U lorsque la loi l&apos;exige). Nous vous envoyons
          une copie de chaque facture par e-mail. Vous pouvez contester une facture dans les 30 jours de sa réception ;
          passé ce délai, elle est réputée acceptée. Vous restez responsable de vos obligations de TVA et devez nous
          informer de tout changement de votre régime ou de vos coordonnées. Ce mandat commence quand vous acceptez ces
          conditions et prend fin quand vous cessez d&apos;être créateur.
        </P>
      </Section>

      <Section title="8. Vos impôts et cotisations sociales">
        <P>
          Vous êtes responsable de la déclaration de vos revenus et du paiement de vos impôts et cotisations sociales. À
          chaque versement, nous vous rappelons ces obligations avec des liens vers l&apos;information officielle (en
          France : <A href="https://www.impots.gouv.fr">impots.gouv.fr</A> et{' '}
          <A href="https://www.urssaf.fr">urssaf.fr</A>). Avant le 31 janvier de chaque année, nous vous envoyons un
          récapitulatif de ce que vous avez perçu via Zik4U l&apos;année précédente.
        </P>
      </Section>

      <Section title="9. Informations que nous devons recueillir et déclarer">
        <P>
          En tant qu&apos;opérateur de plateforme, Zik4U doit recueillir des informations sur les créateurs qu&apos;il
          paie et les déclarer chaque année à l&apos;administration fiscale française (DGFiP), en application des règles
          européennes dites DAC7 ; la DGFiP peut les transmettre à l&apos;administration fiscale du pays où vous vivez.
          Avant votre premier versement, vous fournissez via Trolley : vos nom et prénom, adresse, date de naissance,
          numéro d&apos;identification fiscale et pays de résidence fiscale ; pour une entreprise, ses numéros
          d&apos;immatriculation et de TVA ; et le compte sur lequel les versements sont faits. Nous déclarons vos gains
          par trimestre, le nombre de versements et les frais retenus. Si vous ne fournissez pas ces informations après
          deux relances, nous retenons vos versements jusqu&apos;à ce que vous le fassiez et pouvons mettre fin à votre
          statut de créateur.
        </P>
      </Section>

      <Section title="10. Résidence fiscale et retenue à la source">
        <P>
          Si vous n&apos;êtes pas résident fiscal en France, vous fournissez via Trolley une attestation de résidence
          fiscale avant votre premier versement. À défaut, la loi française peut nous obliger à retenir un impôt sur vos
          versements (25 %, ou 75 % pour un État ou territoire non coopératif) et à le reverser à l&apos;administration
          fiscale française. Si vous êtes une « United States person », vous fournissez un formulaire W-9 et Trolley
          établit pour notre compte le formulaire 1099 exigé par la loi américaine ; les autres créateurs fournissent un
          formulaire W-8BEN ou W-8BEN-E.
        </P>
      </Section>

      <Section title="11. Fin">
        <P>
          Vous pouvez cesser d&apos;être créateur à tout moment dans l&apos;app. Nous pouvons suspendre ou mettre fin à
          votre statut de créateur en cas de manquement grave ou répété à ces conditions ou aux Conditions
          d&apos;utilisation, en vous en donnant la raison, ou pour tout autre motif avec un préavis de 30 jours. Dans
          tous les cas, les gains qui vous sont dus à cette date restent dus, sous réserve de la section 5.
        </P>
      </Section>

      <Section title="12. Responsabilité">
        <P>
          Si vous agissez comme professionnel, la responsabilité totale de Zik4U envers vous est limitée aux sommes qui
          vous ont été versées dans les 12 mois précédant la réclamation. Rien dans ces conditions ne limite la
          responsabilité lorsque la loi l&apos;interdit, en particulier en cas de fraude ou de faute lourde, et rien
          n&apos;affecte vos droits de consommateur si vous agissez comme tel.
        </P>
      </Section>

      <Section title="13. Modifications">
        <P>
          Nous pouvons modifier ces conditions en vous prévenant au moins 30 jours à l&apos;avance, dans l&apos;app et par
          e-mail ; une modification imposée par la loi peut s&apos;appliquer plus tôt. Si vous n&apos;êtes pas
          d&apos;accord, vous pouvez cesser d&apos;être créateur avant qu&apos;elle s&apos;applique.
        </P>
      </Section>

      <Section title="14. Vos données personnelles">
        <P>
          L&apos;utilisation de vos données en tant que créateur, y compris pour les déclarations fiscales, est expliquée
          dans notre <A href="/fr/legal/privacy">Politique de confidentialité</A>.
        </P>
      </Section>

      <Section title="15. Droit applicable et litiges">
        <P>
          Ces conditions sont soumises au droit français. Avant toute action en justice, écrivez-nous à{' '}
          <Mail to={SUPPORT} /> pour que nous tentions de résoudre le problème. Si vous agissez comme professionnel, les
          tribunaux compétents du ressort du siège de Zik4U sont seuls compétents. Si vous agissez comme consommateur,
          vous gardez la protection des règles impératives du pays où vous vivez et pouvez saisir ses tribunaux.
        </P>
      </Section>
    </LegalPage>
  );
}
