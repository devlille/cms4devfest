import firebase from 'firebase/app';
import Vue from 'vue';
import Router from 'vue-router';
import Editions from './views/editions/Editions';
import EditionsDashboard from './views/editions/EditionsDashboard';
import EditionsEdit from './views/editions/EditionsEdit';
import PartnersEdit from './views/partners/PartnersEdit';
import SpeakersEdit from './views/speakers/SpeakersEdit.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/editions',
    },
    {
      path: '/editions',
      name: 'editions',
      component: Editions,
    },
    {
      path: '/editions/edit/:editionId?',
      name: 'editions-edit',
      component: EditionsEdit,
    },
    {
      path: '/editions/dashboard/:editionId',
      name: 'editions-dashboard',
      component: EditionsDashboard,
    },
    {
      path: '/partners/edit/:editionId/:partnerId?',
      name: 'partners-edit',
      component: PartnersEdit,
    },
    {
      path: '/speakers/edit/:editionId/:speakerId?',
      name: 'speakers-edit',
      component: SpeakersEdit,
    },
  ],
});

router.beforeEach((to, from, next) => {
  firebase.auth()
  .onAuthStateChanged(user => {
    if (user) {
      firebase.auth()
      .getRedirectResult()
      .then(() => next())
      .catch(() => next(false));
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  });
});

export default router;
