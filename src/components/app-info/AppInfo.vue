<template>
  <p class="app-info">
    <span>
      <slot></slot>
    </span>
    <span>
      <md-icon>info</md-icon>
    </span>
  </p>
</template>

<script>
export default {
  name: 'AppInfo'
};
</script>

<style scoped lang="scss">
.app-info {
  padding: 1rem;
  background-color: #1565c0;
  color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;

  display: flex;
  align-items: center;

  span:first-child {
    flex: 1;
  }

  span:last-child {
    margin-left: 1rem;

    .md-icon {
      color: white;
    }
  }
}
</style>
