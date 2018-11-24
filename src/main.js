import Vue from 'vue'
import App from './App.vue'

import Vuelidate from 'vuelidate'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import moment from 'moment'

import router from './router'
import store from './stores'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import './theme.scss'

import VueI18n from 'vue-i18n'
import fr from './i18n/fr'

import './registerServiceWorker'
import './filters'

// Theming
Vue.use(VueMaterial);

// Form
Vue.use(Vuelidate);

// i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: {
    fr,
  },
});

moment.locale('fr');

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtEVEnyA4c3YmRRBMu-ePB0KJA1ACgL-M",
  authDomain: "cms-devfest.firebaseapp.com",
  databaseURL: "https://cms-devfest.firebaseio.com",
  projectId: "cms-devfest",
  storageBucket: "cms-devfest.appspot.com",
  messagingSenderId: "56573248894"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
