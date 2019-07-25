<template>
  <div class="app-title">
    <h2>
      <slot name="back" />
      <span class="edition" v-if="edition !== null">
        {{ edition.name }} &nbsp;/&nbsp;
      </span>
      <span v-if="isLoading">{{ $t('ACTIONS.IS_LOADING') }}</span>
      <span v-else>{{ title }}</span>
    </h2>
    <h4 v-if="description !== ''">{{ description }}</h4>
    <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="isLoading">
    </md-progress-bar>
  </div>
</template>

<script>
export default {
  name: 'AppTitle',
  props: {
    edition: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
.app-title {
  h2 {
    display: flex;
    align-items: center;

    .edition {
      color: rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
  }

  h4 {
    font-weight: normal;
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>
