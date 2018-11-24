<template>
  <div class="app-brand">
    <router-link :to="{ name: 'editions' }"
                  class="link">
        <img src="../../assets/logo.svg"
             alt=""/>
        &nbsp;&nbsp;
        <strong>{{ $t('APP.NAME') }}</strong>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'AppBrand',
}
</script>

<style scoped lang="scss">
  .app-brand {
    .link {
      display: flex;
      align-items: center;

      strong {
        text-transform: uppercase;
        color: black;
        position: relative;
        font-size: 1.2rem;
      }

      img {
        height: 24px;
        max-width: 100%;
      }
    }
  }
</style>
