<template>
  <div class="app">
    <md-toolbar class="md-primary"
                md-elevation="0">
      <div class="md-toolbar-section-start">
        <app-brand/>
      </div>

      <div class="md-toolbar-section-end">
        <app-user-menu/>
      </div>
    </md-toolbar>

    <router-view/>

    <app-notification/>
  </div>
</template>
<script>
  import AppUserMenu from '@/components/app-user-menu/AppUserMenu';
  import AppBrand from '@/components/app-brand/AppBrand';
  import AppNotification from '@/components/app-notification/AppNotification';

  export default {
    components: {AppNotification, AppBrand, AppUserMenu}
  }
</script>
