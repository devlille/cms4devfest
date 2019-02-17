<template>
    <div class="editions mw-basic-layout">
        <div class="mw-content">
            <app-title :is-loading="isLoading"
                       :title="$tc('EDITIONS.LABEL', Object.keys(editions).length)"/>

            <md-list class="md-elevation-2"
                     v-if="Object.keys(editions).length > 0">
                <md-list-item :key="`edition_${id}`"
                              v-for="(edition, id) in editions">
                    <div class="md-list-item-text">
                        <span>{{ edition.name }}</span>
                    </div>

                    <md-button :to="{ name: 'editions-dashboard', params: { editionId: id } }">{{
                        $t('ACTIONS.SEE') }}
                    </md-button>

                    <md-menu>
                        <md-button class="md-icon-button"
                                   md-menu-trigger>
                            <md-icon>more_vert</md-icon>
                        </md-button>

                        <md-menu-content>
                            <md-menu-item
                                    :to="{ name: 'editions-edit', params: { editionId: id } }">{{
                                $t('ACTIONS.MODIFY') }}
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>
                </md-list-item>
            </md-list>
        </div>

        <md-button :to="{ name: 'editions-edit' }"
                   class="md-fab md-accent md-fab-bottom-right">
            <md-icon>add</md-icon>
        </md-button>
    </div>
</template>

<script>
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';

export default {
  name: 'editions',
  components: { AppTitle },
  data() {
    return {
      isLoading: false,
      editions: {},
    };
  },
  created() {
    this.getEditions();
  },
  methods: {
    getEditions() {
      this.isLoading = true;

      EditionsService.findAllForCurrentUser()
      .then(editions => this.editions = editions)
      .catch(() => {
        this.$store.commit('notification/setNotification', {
          active: true,
          message: this.$t('EDITIONS.ERROR'),
          action: {
            label: this.$t('ACTIONS.RETRY'),
            handler: () => this.getEditions(),
          },
        });
      })
      .finally(() => this.isLoading = false);
    },
  },
};
</script>
