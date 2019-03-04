<template>
    <md-menu class="app-user-menu"
             v-if="user !== null">
        <md-button :disabled="isLoading"
                   class="md-icon-button"
                   md-menu-trigger>
            <md-icon v-if="isLoading">account_circle</md-icon>
            <span v-else>
                <img :alt="user.displayName"
                     :src="user.photoURL"
                     class="photo"/>
            </span>
            <md-tooltip>{{ user.displayName }}</md-tooltip>
        </md-button>

        <md-menu-content>
            <md-subheader>{{ user.displayName }}</md-subheader>
            <md-menu-item @click="signOut">{{ $t('APP_USER_MENU.SIGN_OUT') }}</md-menu-item>
        </md-menu-content>
    </md-menu>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'AppUserMenu',
  data() {
    return {
      isLoading: true,
      user: null,
    };
  },
  created() {
    firebase.auth()
    .onAuthStateChanged(user => {
      this.user = user;
      this.isLoading = false;
    });
  },
  methods: {
    signOut() {
      this.$router.push({ name: 'sign-out' });
    },
  },
};
</script>

<style scoped lang="scss">
.app-user-menu {
    .photo {
        height: 24px;
        max-width: 100%;
        border-radius: 50%;
    }
}
</style>
