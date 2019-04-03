export default {
  APP: {
    NAME: 'CMS4DevFest',
    COMPANY: 'a GDG Lille project',
  },
  ACTIONS: {
    CLOSE: 'Fermer',
    CANCEL: 'Annuler',
    VALID: 'Valider',
    CONTINUE: 'Continuer',
    RETRY: 'Réessayer',
    MODIFY: 'Modifier',
    DELETE: 'Supprimer',
    SEE: 'Voir',
    IS_LOADING: 'Chargement en cours ...',
  },
  APP_USER_MENU: {
    SIGN_OUT: 'Se déconnecter',
  },
  APP_MORE_MENU: {
    CODE: {
      LABEL: 'Le projet',
      HOMEPAGE: 'Fork me on Github',
      FEAT_REQUEST: 'Proposer une fonctionnalité',
      BUG_REQUEST: 'Remonter un bug',
    },
    SOCIAL: {
      LABEL: 'Nous suivre',
      TWITTER: 'Twitter',
      LINKEDIN: 'LinkedIn',
    },
  },
  APP_DEVFEST: {
    DDAY: 'J',
    DEVFEST: 'DevFest',
  },
  APP_FILE_UPLOADER: {
    LABEL: 'Cliquer pour uploader une image',
  },
  EDITIONS: {
    LABEL: 'Aucune édition | Votre édition | Vos éditions',
    ERROR: 'Echec lors de la récupération de vos éditions.',
  },
  EDITIONS_EDIT: {
    LABEL: {
      CREATE: 'Créer une édition',
      UPDATE: 'Modifier une édition',
    },
    ERROR: 'Echec lors de la sauvegarde.',
    INFO: 'Tous les champs sont obligatoires.',
  },
  EDITIONS_DASHBOARD: {
    LABEL: 'Vue d\'ensemble',
    PARTNERS: {
      LABEL: '{0} partenaire | {0} partenaire | {0} partenaires',
      CREATE: 'Créer un partenaire',
    },
    SPEAKERS: {
      LABEL: '{0} speaker | {0} speaker | {0} speakers',
      CREATE: 'Créer un speaker',
    },
    TALKS: {
      LABEL: '{0} talk | {0} talk | {0} talks',
      CREATE: 'Créer un talk',
    },
    ERROR: 'Echec lors de la récupération de vos éditions.',
  },
  EDITION: {
    NAME: {
      LABEL: 'Nom',
      EXAMPLE: 'e.g. DevFest Lille 2019',
    },
    URL: {
      LABEL: 'URL',
      EXAMPLE: 'e.g. https://devfest.gdglille.org',
    },
    CONFERENCE_HALL: {
      LABEL: 'Conference Hall',
      EVENT: {
        LABEL: 'ID de l\'évènement',
        EXAMPLE: 'e.g. uzZ3ekhBTqMW4ejLDmy4',
      },
      API_KEY: {
        LABEL: 'Api Key',
        EXAMPLE: 'e.g. d773çfyrh-9dzd5-4dzd5-a5bf-b8dzdzdzddf',
      },
    },
  },
  PARTNERS_EDIT: {
    LABEL: {
      CREATE: 'Créer un partenaire',
      UPDATE: 'Modifier un partenaire',
    },
    ERRORS: {
      REQUIRED: 'Obligatoire',
      SAVING: 'Echec lors de la sauvegarde.',
    },
    INFOS: 'Informations générales',
    ADMINISTRATIVE: 'Informations administratives',
    CONTACT: 'Contact',
    OPTIONS: 'Options',
  },
  PARTNER: {
    NAME: 'Nom',
    SIRET: 'Numéro SIRET',
    ADDRESS: {
      ROAD: 'Rue, voie',
      ZIP_CODE: 'Code postal',
      TOWN: 'Ville',
    },
    CONTACT: {
      NAME: 'Prénom & NOM',
      FUNCTION: 'Rôle',
    },
    URL: 'Url',
    LOGO: 'Logo',
    ACTIVE_ON: 'Date d\'activation',
    LEVEL: 'Niveau',
  },
  PACK: {
    GOLD: 'Gold',
    SILVER: 'Silver',
    BRONZE: 'Bronze',
    CONTRIBUTEUR: 'Contributeur',
  },
  SPEAKERS_EDIT: {
    LABEL: {
      CREATE: 'Créer un speaker',
      UPDATE: 'Modifier un speaker',
    },
    CONFERENCE_HALL: {
      LOADING: 'Chargement des données depuis ConferenceHall, merci de patienter ...',
    },
    ERRORS: {
      REQUIRED: 'Obligatoire',
      SAVING: 'Echec lors de la sauvegarde.',
    },
    INFO: '@:EDITIONS_EDIT.INFO',
  },
  SPEAKER: {
    NAME: 'Prénom & Nom',
    ROLE: 'Rôle',
    PROFILE_URL: 'URL de l\'image de profil',
    COMPANY: 'Société',
    BIO: 'Biographie',
    GITHUB: 'GitHub',
    TWITTER: 'Twitter',
  },
  EDITIONS_IMPORT: {
    LABEL: {
      IMPORT: 'Importer depuis Conference Hall',
    },
    SPEAKERS: {
      LABEL: 'Aucun speaker | 1 speaker | {0} speakers',
    },
    TALKS: {
      LABEL: 'Aucune conférence | 1 conférence | {0} conférences',
    },
    INFO: 'Les speakers et/ou conférences déjà enregistrés dans le système seront mis à jour avec les données provenant de Conference Hall.',
    ERROR: 'Echec lors de l\'importation, merci de réessayer ultérieurement.',
    SUCCESS: 'Importation réussie.',
  },
  TALKS_EDIT: {
    LABEL: {
      CREATE: 'Créer une conférence',
      UPDATE: 'Modifier une conférence',
    },
    LEVEL: {
      BEGINNER: 'Débutant',
      INTERMEDIATE: 'Intermédiaire',
      ADVANCED: 'Avancée',
    },
    ROOM: {
      ONE: 'Salle 1',
      TWO: 'Salle 2',
      THREE: 'Salle 3',
      FOUR: 'Salle 4',
      FIVE: 'Salle 5',
    },
    SPEAKERS: 'Rechercher un speaker',
    ERRORS: {
      REQUIRED: 'Obligatoire',
      SAVING: 'Echec lors de la sauvegarde.',
    },
  },
  TALK: {
    TITLE: 'Titre',
    ABSTRACT: 'Description',
    LEVEL: 'Niveau',
    ROOM: 'Salle',
    SPEAKERS: 'Speaker(s)',
  },
};
