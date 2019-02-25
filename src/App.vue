<template>
    <div class="app">
        <md-toolbar class="md-primary toolbar"
                    md-elevation="0">
            <div class="md-toolbar-section-start">
                <app-brand></app-brand>
            </div>

            <div class="md-toolbar-section-end">
                <app-dev-fest v-if="$route.params.editionId"></app-dev-fest>
                <app-dark-mode></app-dark-mode>
                <app-user-menu></app-user-menu>
                <app-more-menu url-code="https://github.com/GDG-Lille/cms4devfest"></app-more-menu>
            </div>
        </md-toolbar>

        <router-view/>

        <app-notification/>
    </div>
</template>
<script>
import AppBrand from '@/components/app-brand/AppBrand';
import AppDevFest from '@/components/app-devfest/AppDevFest';
import AppMoreMenu from '@/components/app-more-menu/AppMoreMenu';
import AppNotification from '@/components/app-notification/AppNotification';
import AppUserMenu from '@/components/app-user-menu/AppUserMenu';
import AppDarkMode from './components/app-dark-mode/AppDarkMode.vue';

export default {
  components: { AppDarkMode, AppDevFest, AppMoreMenu, AppNotification, AppBrand, AppUserMenu },
};
</script>

<style scoped lang="scss">
.toolbar {
    z-index: unset;
}
</style>
