import { generatePageMetadata } from '@/lib/seo';
import { LegalPage, Section, P, Strong, List, Table, Mail, A } from '@/components/legal/LegalPage';

// COMPLY1e (Decision 103 = A, 19/10/2026) — French version of the Privacy Policy
// (claude/COMPLY1e-TEXTES-FR.md, adjusted by claude/COMPLY1f-TEXTES-FR.md; texts validated
// by Bertrand on 19/10/2026; long dashes replaced per the site rule).
// Guard: src/__tests__/comply1g-site.test.ts.

export const metadata = generatePageMetadata(
  'Politique de confidentialité',
  'Comment Zik4U collecte, utilise et protège vos données personnelles, et les choix dont vous disposez.',
  '/fr/legal/privacy',
);

const LAST_UPDATED = '21 octobre 2026';
const PRIVACY = 'privacy@zik4u.com';

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      crumb="Politique de confidentialité"
      title="Politique de confidentialité"
      lastUpdated={LAST_UPDATED}
      current="privacy"
      lang="fr"
      altHref="/legal/privacy"
    >
      <Section title="1. Qui sommes-nous">
        <P>
          Zik4U est une application et un site de réseau social musical (le « Service »). La personne responsable de vos
          données (le « responsable de traitement ») est <Strong>Bertrand Chardinne, fondateur, agissant pour Zik4U,
          société par actions simplifiée (SAS) de droit français en formation</Strong>. Une fois la société immatriculée,
          elle reprendra ce rôle et nous mettrons cette page à jour.
        </P>
        <P>
          Contact pour toute question sur vos données : <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section title="2. L'essentiel">
        <List
          items={[
            'Zik4U construit votre identité musicale à partir de ce que vous écoutez vraiment.',
            "Sur Android, l'app lit uniquement les notifications « en cours de lecture » des applications musicales, jamais vos messages ni vos autres notifications.",
            "Votre profil d'humeurs d'écoute est activé par défaut si vous avez 18 ans ou plus, et désactivé tant que vous ne l'activez pas si vous avez 16 ou 17 ans. Vous pouvez le désactiver à tout moment ; le désactiver le supprime.",
            "Vos humeurs d'écoute ne sont jamais partagées avec qui que ce soit. Votre archétype d'auditeur apparaît sur votre carte Music DNA.",
            "La recherche musicale est désactivée tant que vous ne l'activez pas. Les partenaires ne reçoivent que des tendances calculées sur 100 personnes ou plus, jamais vous.",
            "Nous ne vendons pas vos données personnelles. Nous n'affichons pas de publicité. Nous n'utilisons pas d'identifiant publicitaire.",
            'Notre base de données est hébergée aux États-Unis. La section 10 explique comment vos données y sont protégées.',
            "Vous pouvez télécharger ou supprimer vos données à tout moment depuis l'app.",
          ]}
        />
      </Section>

      <Section title="3. Les données que nous collectons">
        <P>
          <Strong>Compte.</Strong> Adresse e-mail, mot de passe (conservé sous forme chiffrée irréversible par notre
          fournisseur d&apos;authentification), nom d&apos;utilisateur, nom affiché, photo de profil, bio, et le mode de
          connexion utilisé (e-mail, Google ou Apple). Votre tranche d&apos;âge (16 ou 17 ans, ou 18 ans et plus) et, si
          vous la donnez, votre confirmation d&apos;avoir 18 ans ou plus pour Music Match et la recherche musicale. Un
          enregistrement de chacun de vos choix sur vos données (ce que vous avez choisi, quand, quelle version de nos
          conditions, et à quel endroit de l&apos;app).
        </P>
        <P>
          <Strong>Écoutes (captation).</Strong> Sur Android, si vous accordez à Zik4U l&apos;accès aux notifications,
          l&apos;app lit les notifications de lecture d&apos;une liste fermée d&apos;applications musicales et conserve :
          titre, artiste, album, durée, heure d&apos;écoute, application utilisée et lien vers la pochette. Elle ignore
          toutes les autres notifications. Vous pouvez retirer l&apos;accès aux notifications à tout moment dans les
          réglages de votre téléphone ; la captation s&apos;arrête alors. Les écoutes faites en mode privé sont marquées
          comme privées.
        </P>
        <P>
          <Strong>Ce que vous créez et partagez.</Strong> Publications, commentaires, réactions, playlists, abonnements à
          d&apos;autres membres, messages privés et signalements que vous nous envoyez.
        </P>
        <P>
          <Strong>Profil d&apos;humeurs d&apos;écoute</Strong> (voir section 5). Calculé chaque nuit à partir de vos
          écoutes de la veille : une humeur d&apos;écoute dominante, déduite de quand et comment vous avez écouté (heure,
          nombre d&apos;artistes différents, réécoutes), et non de la musique elle-même ni de ce que vous ressentez ; un
          score d&apos;écoute du jour (variété, répétition, régularité) ; vos heures d&apos;écoute ; le nombre de
          publications et de mentions « j&apos;aime » faites ce jour-là ; et vos artistes principaux. Un archétype
          d&apos;auditeur est déduit de vos habitudes d&apos;écoute des 30 derniers jours.
        </P>
        <P>
          <Strong>Music Match</Strong> (voir section 6) et <Strong>recherche musicale</Strong> (voir section 7),
          uniquement si vous les activez.
        </P>
        <P>
          <Strong>Achats (à l&apos;ouverture des abonnements).</Strong> Les abonnements s&apos;achètent sur l&apos;App
          Store d&apos;Apple ou Google Play. Nous recevons le produit, son statut et ses dates, et une référence de
          transaction du store, jamais vos données de carte. Notre prestataire de gestion des achats, RevenueCat, traite
          ces reçus.
        </P>
        <P>
          <Strong>Paiements des créateurs (à l&apos;ouverture des paiements).</Strong> Si vous êtes créateur, notre
          prestataire de paiement, Trolley, collecte les informations d&apos;identité, fiscales et bancaires nécessaires
          pour vous payer. Parce que la loi française nous oblige à déclarer les gains des créateurs à
          l&apos;administration fiscale (règles européennes dites DAC7), Trolley nous transmet aussi vos nom et prénom,
          adresse, date de naissance, numéro d&apos;identification fiscale, pays de résidence fiscale, régime et numéro de
          TVA, statut de particulier ou de professionnel, et le compte sur lequel vos versements sont faits. Nous
          conservons aussi les factures émises en votre nom.
        </P>
        <P>
          <Strong>Données de l&apos;appareil et données techniques.</Strong> Jeton de notification push, modèle de l&apos;appareil, système d&apos;exploitation, version de l&apos;app et signaux indiquant si la captation fonctionne. Rapports de plantage et d&apos;erreur (l&apos;erreur, le modèle de votre appareil, son système et la version de l&apos;app) via Sentry ; ces rapports ne sont pas reliés à votre compte. Nos hébergeurs traitent les adresses IP dans leurs journaux techniques. Notre système de connexion conserve aussi l&apos;adresse IP et le type d&apos;appareil de chaque session connectée pour protéger votre compte ; cet enregistrement est supprimé quand vous vous déconnectez, quand vous supprimez votre compte, ou après 12 mois sans utiliser l&apos;app sur cet appareil.
        </P>
        <P>
          <Strong>Mesure d&apos;audience, uniquement si vous l&apos;acceptez.</Strong> Si vous acceptez la mesure
          d&apos;audience, nous enregistrons la façon dont vous utilisez l&apos;app. Firebase Analytics reçoit des
          événements d&apos;utilisation liés à un identifiant pseudonyme (un code court dérivé de votre compte, jamais
          votre nom ni votre e-mail). Notre propre base conserve la façon dont vous interagissez avec la musique sur les
          profils : le titre que vous touchez, écoutez en aperçu ou lancez, la durée d&apos;ouverture d&apos;un aperçu, et
          le profil sur lequel vous étiez. Ces enregistrements sont supprimés au bout de 13 mois. La mesure
          d&apos;audience est désactivée tant que vous ne l&apos;acceptez pas. Vous pouvez la désactiver à tout moment
          dans « Settings », ce qui arrête l&apos;enregistrement et supprime ces données.
        </P>
        <P>
          <Strong>Site.</Strong> Si vous vous inscrivez sur une liste d&apos;attente sur zik4u.com : votre adresse e-mail
          et, pour les créateurs, votre nom d&apos;artiste et votre principale plateforme de streaming. Le site n&apos;a
          ni connexion à un compte, ni mesure d&apos;audience, ni cookie publicitaire (section 13).
        </P>
        <P>
          <Strong>Vos messages.</Strong> Les e-mails que vous envoyez au support ou à l&apos;adresse privacy.
        </P>
      </Section>

      <Section title="4. Pourquoi nous utilisons vos données, et sur quelle base légale (UE/EEE et Royaume-Uni)">
        <Table
          head={['Finalité', 'Données', 'Base légale']}
          rows={[
            ['Faire fonctionner votre compte et le Service : captation, profil, fil, abonnés, messages, abonnements aux créateurs', 'Compte, écoutes, contenus, achats', 'Exécution de notre contrat avec vous'],
            ["Profil d'humeurs d'écoute et archétype d'auditeur", "Écoutes, profil d'humeurs d'écoute", "18 ans et plus : intérêt légitime (personnaliser votre identité musicale, qui est la raison d'être de Zik4U) ; vous pouvez vous y opposer à tout moment en le désactivant. 16 ou 17 ans : votre consentement (vous l'activez)"],
            ['Music Match', 'Écoutes, réglage Music Match, confirmation 18+', "Votre consentement (vous l'activez)"],
            ['Rapports de recherche musicale', 'Voir section 7', 'Votre consentement (désactivé par défaut)'],
            ["Mesure d'audience", "Événements d'utilisation", 'Votre consentement'],
            ['Notifications que vous avez autorisées', 'Jeton push', 'Exécution du contrat ; autorisation de votre téléphone'],
            ['Sécurité, modération, prévention de la fraude et des abus, rapports de plantage, sécurité du service', 'Contenus, signalements, données techniques', 'Intérêt légitime : garder Zik4U sûr et en état de marche'],
            ["Conserver l'enregistrement que la loi française impose aux hébergeurs", 'Pseudonyme, adresse e-mail, date de création du compte, identifiant et date de chaque publication, commentaire ou message publié', "Obligation légale (loi pour la confiance dans l'économie numérique, LCEN)"],
            ['Déclarer les gains des créateurs à l\'administration fiscale (DAC7) et émettre les factures en leur nom', 'Identité, informations fiscales et de versement des créateurs, factures', 'Obligation légale'],
            ['Paiement des créateurs, comptabilité et fiscalité', 'Achats, paiements', 'Obligation légale ; exécution du contrat'],
            ["Listes d'attente", "E-mail, nom d'artiste, plateforme", 'Votre consentement (vous vous inscrivez)'],
          ]}
        />
        <P>
          Nous ne prenons à votre sujet aucune décision fondée exclusivement sur un traitement automatisé produisant des
          effets juridiques ou vous affectant de manière significative de façon similaire.
        </P>
      </Section>

      <Section id="emotional-profile" title="5. Votre profil d'humeurs d'écoute">
        <P>
          <Strong>Ce que c&apos;est.</Strong> Chaque nuit, Zik4U classe les écoutes de la veille en humeurs
          d&apos;écoute (par exemple Late Night, Explorer ou Deep Focus) selon quand et comment vous avez écouté, et
          calcule les données listées en section 3. À partir de vos 30 derniers jours, il déduit un archétype
          d&apos;auditeur. Ces humeurs décrivent vos habitudes d&apos;écoute : Zik4U n&apos;analyse pas la musique
          elle-même, et ne lit ni ne déduit vos sentiments.
        </P>
        <P>
          <Strong>Qui le voit.</Strong> Votre archétype apparaît sur votre carte Music DNA, visible par les autres
          membres selon vos réglages de confidentialité (section 8). Zik4U ne partage jamais vos humeurs d&apos;écoute
          avec qui que ce soit : ni les autres membres, ni les partenaires. Si vous partagez vous-même votre carte depuis
          l&apos;app, elle montre ce que vous avez choisi de partager.
        </P>
        <P>
          <Strong>Ce que ce n&apos;est pas.</Strong> Il décrit votre façon d&apos;écouter, pas votre santé ni vos
          émotions. Zik4U ne déduit aucun état de santé, aucun trouble psychique ni aucun sentiment.
        </P>
        <P>
          <Strong>Votre choix.</Strong> Si vous avez 18 ans ou plus, il est activé par défaut ; si vous avez 16 ou 17
          ans, il reste désactivé tant que vous ne l&apos;activez pas. Désactivez-le à tout moment dans{' '}
          <Strong>« Settings › Privacy › Listening mood profile »</Strong> : votre archétype et les humeurs qui le
          fondent sont supprimés, et Zik4U cesse de les calculer. Tout le reste fonctionne de la même façon.
        </P>
      </Section>

      <Section id="music-match" title="6. Music Match">
        <List
          items={[
            "Music Match permet à des adultes de découvrir des personnes aux goûts musicaux compatibles. Il est désactivé tant que vous ne l'activez pas, et exige de confirmer que vous avez 18 ans ou plus.",
            "Il compare uniquement les écoutes : les artistes que vous avez en commun et le même titre écouté au même moment. Il n'utilise ni vos humeurs, ni votre photo, ni votre localisation, ni aucune situation amoureuse. Nous ne collectons pas de situation amoureuse.",
            "Vous n'êtes visible que des autres membres qui ont activé Music Match.",
            <>
              Désactivez-le à tout moment dans <Strong>« Settings › Privacy › Music Match »</Strong> : vous disparaissez
              immédiatement de tous les résultats.
            </>,
            "Bloquer quelqu'un le retire de vos résultats et empêche tout contact.",
          ]}
        />
      </Section>

      <Section id="research" title="7. Recherche musicale">
        <P>
          <Strong>Désactivée tant que vous ne l&apos;activez pas.</Strong> Zik4U fonctionne exactement de la même façon
          dans les deux cas. Seuls les membres qui ont confirmé avoir 18 ans ou plus peuvent l&apos;activer.
        </P>
        <P>
          <Strong>Ce que nous utilisons.</Strong> Les titres que vous écoutez après l&apos;avoir activée, le moment où
          vous les écoutez, les humeurs d&apos;écoute déduites de quand et comment vous les écoutez, et votre archétype.
          Jamais les écoutes faites en mode privé. Jamais vos humeurs ni votre archétype si votre profil d&apos;humeurs
          d&apos;écoute est désactivé.
        </P>
        <P>
          <Strong>Ce que reçoivent les partenaires.</Strong> Des tendances hebdomadaires (par exemple, le nombre
          d&apos;auditeurs d&apos;un artiste, ou à quelles heures et dans quelles humeurs d&apos;écoute les gens ont
          écouté) calculées uniquement sur des groupes de <Strong>100 personnes ou plus</Strong>, avec un bruit
          statistique ajouté et des chiffres arrondis. Jamais votre nom, votre profil, vos titres, ni aucune donnée vous
          concernant individuellement. Les partenaires doivent s&apos;engager par contrat à ne jamais chercher à
          ré-identifier qui que ce soit.
        </P>
        <P>
          <Strong>Qui les reçoit.</Strong> Des entreprises de la musique (labels, éditeurs) et, plus tard, des
          organisations de recherche en intelligence artificielle. Zik4U peut être rémunéré pour ces rapports.
        </P>
        <P>
          <Strong>Votre choix.</Strong> Désactivez-la à tout moment dans{' '}
          <Strong>« Settings › Privacy › Music research »</Strong> : vos données sortent de tous les rapports futurs. Les
          rapports déjà livrés ne peuvent pas être modifiés, mais ils ne contiennent aucune donnée vous concernant
          individuellement. Chaque rapport que nous produisons est journalisé.
        </P>
      </Section>

      <Section id="public-profile" title="8. Ce que les autres peuvent voir">
        <P>
          <Strong>Ce que tout le monde peut voir.</Strong> Votre nom affiché, votre photo et votre bio sont publics. Tout
          le monde, y compris les visiteurs sans compte Zik4U, peut les voir sur votre page de profil. Si vous êtes
          créateur, vos formules d&apos;abonnement et leurs prix sont aussi publics.
        </P>
        <P>
          <Strong>Moteurs de recherche et assistants d&apos;IA.</Strong> Ce profil public minimal (nom, photo, bio) peut
          être indexé par des moteurs de recherche comme Google et lu par des assistants d&apos;IA et leurs robots (par
          exemple ChatGPT, Claude, Gemini ou Perplexity). Si votre compte est privé, votre profil est exclu de notre plan
          du site et marqué pour que les moteurs de recherche et les robots d&apos;IA ne l&apos;indexent pas.
        </P>
        <P>
          <Strong>Ce qui reste protégé.</Strong> Votre historique d&apos;écoute, vos artistes et titres principaux, votre
          signature musicale, votre archétype d&apos;auditeur, votre activité et vos scores de compatibilité ne sont
          jamais montrés aux visiteurs sans compte. Sur un compte privé, ils ne sont visibles que des abonnés que vous
          avez acceptés. Sur le profil d&apos;un créateur réservé « aux abonnés », ils ne sont visibles que des abonnés
          actifs.
        </P>
        <P>
          <Strong>Les liens que vous partagez.</Strong> Quand vous partagez votre carte de profil depuis l&apos;app, le
          lien montre votre carte complète à toute personne qui l&apos;ouvre, même si votre compte est privé. C&apos;est
          vous qui choisissez de la partager. Les cartes partagées sont marquées pour que les moteurs de recherche et les
          robots d&apos;IA ne les indexent pas. La carte reste à jour de votre activité. Vous pouvez révoquer à tout
          moment tous les liens que vous avez partagés, dans les réglages de confidentialité de l&apos;app ; les liens
          révoqués ne montrent plus que votre profil public minimal.
        </P>
        <P>
          <Strong>Contenus des créateurs.</Strong> Partager la carte d&apos;un créateur ne donne jamais accès aux
          publications exclusives, drops ou salons d&apos;écoute, qui restent réservés aux abonnés.
        </P>
      </Section>

      <Section id="providers" title="9. Qui traite vos données pour nous">
        <P>
          Nous ne vendons jamais vos données personnelles. Nous ne les partageons qu&apos;avec des prestataires qui les
          traitent sur nos instructions, et avec les magasins d&apos;applications en tant qu&apos;entreprises
          indépendantes.
        </P>
        <Table
          head={['Prestataire', 'Pour quoi', 'Où']}
          rows={[
            ['Supabase', 'Base de données, connexion, stockage, fonctions serveur', 'États-Unis (Virginie)'],
            ['Vercel', 'Hébergement du site', 'États-Unis et réseau mondial'],
            ['Expo', 'Envoi des notifications push', 'États-Unis'],
            ['Google Firebase', "Transport des notifications push ; mesure d'audience si vous l'acceptez", 'États-Unis'],
            ['Google / Apple', 'Connexion, si vous la choisissez', 'États-Unis'],
            ['Sentry', "Rapports de plantage et d'erreur", 'États-Unis'],
            ['Resend', 'E-mails de compte (confirmation, réinitialisation du mot de passe)', 'États-Unis'],
            ['RevenueCat', "Reçus d'achat (à l'ouverture des abonnements)", 'États-Unis'],
            ["App Store d'Apple / Google Play", 'Paiements, en tant que responsables indépendants', 'Leurs propres conditions'],
            ['Trolley', "Paiement des créateurs et vérification fiscale (à l'ouverture des paiements)", 'Canada'],
          ]}
        />
        <P>
          Pour les créateurs que nous payons, nous transmettons les informations exigées par la loi à
          l&apos;administration fiscale française (DGFiP), qui peut les communiquer à l&apos;administration fiscale de
          leur pays de résidence.
        </P>
        <P>
          Nous pouvons aussi communiquer des données lorsque la loi l&apos;exige, pour protéger la sécurité des
          personnes, ou à un successeur si l&apos;activité de Zik4U est cédée (nous vous en informerions d&apos;abord).
        </P>
      </Section>

      <Section id="transfers" title="10. Transferts internationaux">
        <P>
          Notre base de données principale est hébergée aux États-Unis, et plusieurs prestataires ci-dessus y sont
          établis. Lorsque vos données quittent l&apos;Espace économique européen ou le Royaume-Uni, elles sont protégées
          par les clauses contractuelles types de la Commission européenne incluses dans les contrats de traitement de
          nos prestataires et, lorsqu&apos;un prestataire est certifié, par le cadre de protection des données
          UE–États-Unis (Data Privacy Framework). Vous pouvez nous demander une copie de ces garanties à{' '}
          <Mail to={PRIVACY} />.
        </P>
      </Section>

      <Section id="retention" title="11. Combien de temps nous conservons vos données">
        <List
          items={[
            <><Strong>Le compte et tout ce qui s&apos;y rattache</Strong> (écoutes, contenus, messages, profil d&apos;humeurs d&apos;écoute, réglages) : tant que votre compte existe.</>,
            <><Strong>Quand vous supprimez votre compte</Strong> : il est effacé immédiatement de notre base en service, à l&apos;exception d&apos;un enregistrement minimal que la loi française impose aux hébergeurs de conserver un an, pour qu&apos;un juge puisse faire identifier l&apos;auteur d&apos;un contenu publié : votre pseudonyme, votre adresse e-mail, la date de création du compte, et l&apos;identifiant et la date de chaque publication, commentaire ou message que vous avez publié (jamais leur contenu, et aucune de vos écoutes). Cet enregistrement est verrouillé, utilisé uniquement pour répondre à une demande légale, et supprimé au bout d&apos;un an. Les copies résiduelles dans les sauvegardes et les journaux techniques de nos prestataires disparaissent sous 30 jours.</>,
            <><Strong>Profil d&apos;humeurs d&apos;écoute</Strong> : vos humeurs d&apos;écoute quotidiennes sont conservées 13 mois, puis supprimées automatiquement ; tout est supprimé immédiatement quand vous le désactivez.</>,
            <><Strong>Comptes inactifs</Strong> : supprimés après 3 ans sans aucune activité.</>,
            <><Strong>Sessions de connexion</Strong> : fermées et supprimées après 12 mois sans utilisation.</>,
            <><Strong>Journaux techniques que nous conservons</Strong> (par exemple les contrôles de bon fonctionnement du service) : 1 an. <Strong>Traces des actions réalisées dans notre outil d&apos;administration</Strong> : 3 ans, pour la sécurité.</>,
            <><Strong>Achats, versements, factures et déclarations fiscales</Strong> : conservés aussi longtemps que l&apos;exigent les règles fiscales et comptables (jusqu&apos;à 10 ans en France).</>,
            <><Strong>Listes d&apos;attente</Strong> : jusqu&apos;à votre invitation au lancement, et au plus 24 mois, ou plus tôt si vous nous le demandez.</>,
            <><Strong>Mesure d&apos;audience</Strong> (uniquement si vous l&apos;acceptez) : 13 mois, et supprimée aussitôt que vous la désactivez.</>,
            <><Strong>E-mails au support</Strong> : jusqu&apos;à 3 ans après notre dernier échange.</>,
            <><Strong>Rapports de recherche</Strong> : ils ne contiennent aucune donnée personnelle.</>,
          ]}
        />
      </Section>

      <Section id="rights" title="12. Vos droits">
        <P>
          <Strong>Tout le monde.</Strong> Où que vous viviez, vous pouvez :
        </P>
        <List
          items={[
            <><Strong>Télécharger vos données</Strong> dans <Strong>« Settings › My Data (GDPR / CCPA) »</Strong>.</>,
            <><Strong>Supprimer votre compte</Strong> dans <Strong>« Settings › Delete account »</Strong>, ou depuis le web sur <A href="/fr/delete-account">zik4u.com/fr/delete-account</A>.</>,
            <><Strong>Désactiver</Strong> à tout moment votre profil d&apos;humeurs d&apos;écoute, Music Match, la recherche musicale, la mesure d&apos;audience et les notifications.</>,
            <><Strong>Corriger</Strong> les informations de votre profil dans l&apos;app.</>,
            <><Strong>Nous poser</Strong> toute question à <Mail to={PRIVACY} />. Nous répondons dans un délai d&apos;un mois.</>,
          ]}
        />
        <P>
          <Strong>UE/EEE et Royaume-Uni.</Strong> Vous disposez aussi des droits d&apos;accès, de rectification,
          d&apos;effacement, de limitation, de portabilité, d&apos;opposition (y compris au profil d&apos;humeurs
          d&apos;écoute, en le désactivant) et du droit de retirer votre consentement à tout moment, sans remettre en
          cause ce qui a été fait avant. Vous pouvez introduire une réclamation auprès de l&apos;autorité française de
          protection des données, la <Strong>CNIL</Strong> (<A href="https://www.cnil.fr">www.cnil.fr</A>), ou de
          l&apos;autorité du pays où vous vivez.
        </P>
        <P>
          <Strong>Californie et autres États américains.</Strong> Vous avez le droit de savoir quelles informations
          personnelles nous collectons, utilisons et communiquons ; d&apos;y accéder, de les corriger et de les
          supprimer ; et de ne pas subir de discrimination pour avoir exercé ces droits.{' '}
          <Strong>Nous ne vendons ni ne partageons vos informations personnelles</Strong> à des fins de publicité
          comportementale, et nous n&apos;utilisons pas d&apos;informations personnelles sensibles pour déduire des
          caractéristiques à votre sujet au-delà de la fourniture du Service. Les rapports de recherche ne contiennent
          que des informations agrégées et dé-identifiées. Si votre navigateur envoie un signal Global Privacy Control,
          nous le traitons comme une demande d&apos;opposition à la vente ou au partage. Vous pouvez passer par un
          mandataire ; nous vérifierons la demande. Si nous refusons une demande, vous pouvez faire appel en répondant à
          notre réponse.
        </P>
      </Section>

      <Section id="cookies" title="13. Cookies et technologies similaires">
        <P>
          <Strong>Site.</Strong> zik4u.com n&apos;utilise aucun cookie publicitaire ou de mesure d&apos;audience et
          n&apos;a pas de connexion à un compte. Si votre navigateur envoie un signal Global Privacy Control, nous
          déposons un cookie technique pour nous en souvenir. Aucun bandeau cookies n&apos;est nécessaire, car aucun
          cookie n&apos;exige votre consentement.
        </P>
        <P>
          <Strong>App.</Strong> L&apos;app n&apos;utilise pas d&apos;identifiant publicitaire. La mesure d&apos;audience
          ne fonctionne que si vous l&apos;acceptez.
        </P>
      </Section>

      <Section id="age" title="14. Âge">
        <P>
          Zik4U est destiné aux personnes de <Strong>16 ans et plus</Strong>. Music Match et la recherche musicale sont
          réservés aux personnes de <Strong>18 ans et plus</Strong>. L&apos;âge est déclaré par vous ; nous ne vérifions
          pas de pièce d&apos;identité. Si nous apprenons qu&apos;un compte appartient à une personne de moins de 16 ans,
          nous le supprimons. Pour en signaler un, écrivez à <Mail to={PRIVACY} />. Si vous nous indiquez avoir 16 ou 17
          ans, votre profil d&apos;humeurs d&apos;écoute reste désactivé tant que vous ne l&apos;activez pas.
        </P>
      </Section>

      <Section id="security" title="15. Sécurité">
        <P>
          Les données sont chiffrées pendant leur transport (TLS) et au repos par notre hébergeur. Des règles
          d&apos;accès dans la base limitent chaque membre aux données qu&apos;il a le droit de voir. L&apos;accès
          d&apos;administration exige une clé de sécurité physique. Si une violation de données est susceptible de porter
          atteinte à vos droits, nous la notifions à la CNIL dans les 72 heures et vous en informons dans les meilleurs
          délais lorsque le risque est élevé.
        </P>
      </Section>

      <Section id="changes" title="16. Modifications de cette politique">
        <P>
          Quand nous modifions cette politique, nous mettons à jour la date en haut de page. Quand une modification est
          importante, l&apos;app vous la présente avant qu&apos;elle ne s&apos;applique.
        </P>
      </Section>

      <Section id="contact" title="17. Contact">
        <P>
          <Mail to={PRIVACY} /> : Bertrand Chardinne, pour Zik4U (SAS de droit français en formation).
        </P>
      </Section>
    </LegalPage>
  );
}
