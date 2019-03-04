import firebase from 'firebase/app';
import Vue from 'vue';
import Router from 'vue-router';
import AuthentificationLayout from './views/authentification/AuthentificationLayout.vue';
import SignIn from './views/authentification/SignIn.vue';
import SignOut from './views/authentification/SignOut.vue';
import Editions from './views/editions/Editions';
import EditionsDashboard from './views/editions/EditionsDashboard';
import EditionsEdit from './views/editions/EditionsEdit';
import PartnersEdit from './views/partners/PartnersEdit';
import SpeakersEdit from './views/speakers/SpeakersEdit';

Vue.use(Router);

const authenticating = (to, from, next) => {
  firebase.auth()
  .onAuthStateChanged(user => {
    if (user) {
      firebase.auth()
      .getRedirectResult()
      .then(() => next())
      .catch(() => next(false));
    } else {
      next({ name: 'sign-in' });
    }
  });
};

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      component: AuthentificationLayout,
      children: [
        {
          path: 'sign-in',
          name: 'sign-in',
          component: SignIn,
        },
        {
          path: 'sign-out',
          name: 'sign-out',
          component: SignOut,
        },
      ],
    },
    {
      path: '/',
      redirect: '/editions',
      beforeEnter: authenticating,
    },
    {
      path: '/editions',
      name: 'editions',
      component: Editions,
      beforeEnter: authenticating,
    },
    {
      path: '/editions/edit/:editionId?',
      name: 'editions-edit',
      component: EditionsEdit,
      beforeEnter: authenticating,
    },
    {
      path: '/editions/dashboard/:editionId',
      name: 'editions-dashboard',
      component: EditionsDashboard,
      beforeEnter: authenticating,
    },
    {
      path: '/partners/edit/:editionId/:partnerId?',
      name: 'partners-edit',
      component: PartnersEdit,
      beforeEnter: authenticating,
    },
    {
      path: '/speakers/edit/:editionId/:speakerId?',
      name: 'speakers-edit',
      component: SpeakersEdit,
      beforeEnter: authenticating,
    },
  ],
});

export default router;
