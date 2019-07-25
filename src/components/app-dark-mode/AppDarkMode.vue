<template>
  <div class="app-dark-mode">
    <md-button @click="toggleDarkMode" class="md-icon-button">
      <md-icon v-if="isDarkMode">brightness_2</md-icon>
      <md-icon v-else>wb_sunny</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'AppDarkMode',
  data() {
    return {
      isDarkMode: false
    };
  },
  watch: {
    isDarkMode() {
      if (this.isDarkMode) {
        this.$material.theming.theme = 'default-dark';
      } else {
        this.$material.theming.theme = 'default';
      }
    }
  },
  created() {
    this.isDarkMode =
      window.localStorage &&
      window.localStorage.getItem('dark-mode') === 'true';
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;

      if (window.localStorage) {
        window.localStorage.setItem('dark-mode', this.isDarkMode);
      }
    }
  }
};
</script>
