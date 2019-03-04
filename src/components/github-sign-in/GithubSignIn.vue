<template>
    <button @click="signIn"
            class="github-sign-in">
        <div class="logo"></div>
        <div class="text">{{ $t('GITHUB_SIGN_IN.LABEL') }}</div>
    </button>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'GithubSignIn',
  methods: {
    signIn() {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth()
      .signInWithPopup(provider)
      .then(res => this.$emit('success', res.user))
      .catch(err => {
        console.error(err);
        this.$emit('error', err);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.github-sign-in {
    display: flex;
    align-items: center;
    border: none;
    border-radius: 2px;
    padding: 1px;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    color: white;
    background-color: #171516;

    &:active {
        background-color: #EEEEEE;
    }

    &:hover {
        cursor: pointer;
    }

    &:focus {
        outline: 4px solid #C6DAFB;
    }

    .logo {
        width: 39px;
        height: 39px;
        background: url('./assets/logo.png') center center no-repeat;
        background-size: 20px;
        border-radius: 2px;
    }

    .text {
        padding: 0 8px 0 3px;
        line-height: 38px;
        font-size: 14px;
        font-family: 'Roboto';
        font-weight: bold;
    }
}
</style>
