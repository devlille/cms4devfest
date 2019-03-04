<template>
    <div class="sign-in">
        <div class="choices">
            <google-sign-in @error="showMessage($t('GOOGLE_SIGN_IN.ERROR'))"
                            @success="redirect">
            </google-sign-in>
            <twitter-sign-in @error="showMessage($t('TWITTER_SIGN_IN.ERROR'))"
                             @success="redirect">
            </twitter-sign-in>
            <github-sign-in @error="showMessage($t('GITHUB_SIGN_IN.ERROR'))"
                            @success="redirect">
            </github-sign-in>
        </div>

        <md-snackbar :md-active.sync="showSnackbar"
                     md-persistent
                     md-position="left">
            <span>{{ message }}</span>
        </md-snackbar>
    </div>
</template>

<script>
import GithubSignIn from '@/components/github-sign-in/GithubSignIn.vue';
import GoogleSignIn from '@/components/google-sign-in/GoogleSignIn.vue';
import TwitterSignIn from '@/components/twitter-sign-in/TwitterSignIn.vue';

export default {
  name: 'sign-in',
  components: { GithubSignIn, TwitterSignIn, GoogleSignIn },
  data() {
    return {
      showSnackbar: false,
      message: null,
    };
  },
  methods: {
    redirect() {
      this.$router.push({ name: 'editions' });
    },
    showMessage(message) {
      this.message = message;
      this.showSnackbar = true;
    },
  },
};
</script>

<style scoped lang="scss">
.sign-in {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;

    .choices {
        margin: auto;
        text-align: center;

        button + button {
            margin-top: 1rem;
        }
    }
}
</style>
