<template>
  <md-button class="app-back md-icon-button" @click="back">
    <md-icon>arrow_back</md-icon>
  </md-button>
</template>

<script>
export default {
  name: 'AppBack',
  props: {
    to: {
      type: Object,
      default: null
    }
  },
  methods: {
    back() {
      if (this.to === null) {
        this.$router.back();
      } else {
        this.$router.push(this.to);
      }
    }
  }
};
</script>
