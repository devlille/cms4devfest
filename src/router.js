import Vue from 'vue'
import Router from 'vue-router'
import Partners from './views/partners/Partners'
import Editions from './views/editions/Editions'
import EditionsEdit from './views/editions/EditionsEdit'
import EditionsDashboard from './views/editions/EditionsDashboard'

import firebase from 'firebase/app'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/editions'
    },
    {
      path: '/editions',
      name: 'editions',
      component: Editions
    },
    {
      path: '/editions/edit/:editionId?',
      name: 'editions-edit',
      component: EditionsEdit
    },
    {
      path: '/editions/dashboard/:editionId',
      name: 'editions-dashboard',
      component: EditionsDashboard
    },
    {
      path: '/partners',
      name: 'partners',
      component: Partners
    }
  ]
});

router.beforeEach((to, from, next) => {
  firebase.auth()
    .onAuthStateChanged(user => {
      if(user) {
        firebase.auth()
          .getRedirectResult()
          .then(() => next())
          .catch(() => next(false))
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider)
      }
    });
});

export default router
