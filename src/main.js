import Vue from 'vue'
import App from './App.vue'

import Vuelidate from 'vuelidate'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import moment from 'moment'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

import router from './router'
import store from './stores'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import './theme.scss'

import VueI18n from 'vue-i18n'
import fr from './i18n/fr'
import { Settings } from 'luxon'

import './registerServiceWorker'
import './filters'

// Theming
Vue.use(VueMaterial);

// Form
Vue.use(Vuelidate);
Vue.use(Datetime)

// i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: {
    fr,
  },
});
Settings.defaultLocale = 'fr'

moment.locale('fr');

// Firebase
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

Vue.config.productionTip = false;

if(process.env.NODE_ENV === 'production') {
  // Google Analytics only on Prod
  document.write(
    '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-124200391-3"></script>' +
    '<script>' +
    '  window.dataLayer = window.dataLayer || [];' +
    '  function gtag(){dataLayer.push(arguments);}' +
    '  gtag(\'js\', new Date());' +
    '  gtag(\'config\', \'UA-124200391-3\');' +
    '</script>');
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
