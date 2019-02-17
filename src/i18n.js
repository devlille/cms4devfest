import {Settings} from 'luxon';
import moment from 'moment';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import fr from './i18n/fr.js';

Vue.use(VueI18n);

Settings.defaultLocale = 'fr';
moment.locale('fr');

const i18n = new VueI18n({
  locale: 'fr',
  messages: {
    fr,
  },
});

export default i18n;
