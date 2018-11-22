<template>
  <div class="editions mw-basic-layout">
    <div class="mw-content">
      <app-title :is-loading="isLoading"
                 :with-back-btn="false"
                 :title="$tc('EDITIONS.LABEL', Object.keys(editions).length)" />

      <md-progress-bar v-if="isLoading"
                       class="md-accent"
                       md-mode="indeterminate">
      </md-progress-bar>

      <md-list v-else-if="Object.keys(editions).length > 0"
               class="md-elevation-2">
        <md-list-item v-for="(edition, id) in editions"
                      :key="`edition_${id}`">
          <div class="md-list-item-text">
            <span>{{ edition.name }}</span>
          </div>

          <md-button :to="{ name: 'editions-dashboard', params: { editionId: id } }">{{ $t('ACTIONS.SEE') }}</md-button>

          <md-menu>
            <md-button class="md-icon-button"
                       md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item :to="{ name: 'editions-edit', params: { editionId: id } }">{{ $t('ACTIONS.MODIFY') }}</md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-list-item>
      </md-list>
    </div>

    <md-button class="md-fab md-accent add-btn"
               :to="{ name: 'editions-edit' }">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import EditionsService from '@/services/EditionsService';
import AppTitle from '@/components/app-title/AppTitle';

export default {
  name: 'editions',
  components: {AppTitle},
  data() {
    return {
      isLoading: false,
      editions: {}
    }
  },
  created() {
    this.getEditions()
  },
  methods: {
    getEditions() {
      this.isLoading = true;

      EditionsService.findAllForCurrentUser()
        .then(editions => {
          this.isLoading = false;
          this.editions = editions;
        })
        .catch(err => {
          console.error(err);
          this.isLoading = false;
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('EDITIONS.ERROR'),
            action: {
              label: this.$t('ACTIONS.RETRY'),
              handler: () => this.getEditions()
            }
          });
        })
    },
  }
}
</script>

<style scoped lang="scss">
  .editions {
    .add-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
</style>
