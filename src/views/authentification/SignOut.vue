<template>
    <div></div>
</template>
<script>
import firebase from 'firebase/app';

export default {
  name: 'sign-out',
  created() {
    firebase.auth()
    .signOut()
    .then(() => this.$router.push({ name: 'sign-in' }))
    .catch(err => console.error(err));
  },
};
</script>
