<template>
  <div class="editions-dashboard mw-basic-layout">
    <div class="mw-content">
      <app-title :edition="edition"
                 :is-loading="isLoading"
                 :title="$t('EDITIONS_DASHBOARD.LABEL')"
                 :back="back"/>

      <md-progress-bar v-if="isLoading"
                       class="md-accent"
                       md-mode="indeterminate">
      </md-progress-bar>

      <md-tabs v-else
               md-alignment="fixed"
               class="md-elevation-2">
        <md-tab id="tab-partners"
                md-icon="business_center"
                :md-disabled="Object.keys(partners).length === 0"
                :md-label="$tc('EDITIONS_DASHBOARD.PARTNERS.LABEL', Object.keys(partners).length, [Object.keys(partners).length])">

          <md-list v-if="Object.keys(partners).length > 0"
                   class="md-triple-line">
            <md-list-item v-for="(partner, id) in partners"
                          :key="`partner_${id}`">
              <md-avatar>
                <img :src="partner.logoUrl"
                     alt=""/>
              </md-avatar>

              <div class="md-list-item-text">
                <span>{{ partner.name }}</span>
                <span>
                  <a :href="`https://${partner.url}`"
                     target="_blank">
                    {{ partner.url }}
                  </a>
                  &nbsp;-&nbsp;
                  {{ partner.level }}
                </span>
                <span>{{ $t('PARTNER.ACTIVE_ON') }} : {{ partner.activeOn | date('DD/MM/YYYY') }} ({{ partner.activeOn | date('v') }})</span>
              </div>

              <md-menu>
                <md-button class="md-icon-button"
                           md-menu-trigger>
                  <md-icon>more_vert</md-icon>
                </md-button>

                <md-menu-content>
                  <md-menu-item :to="{ name: 'partners-edit', params: { editionId: $route.params.editionId, partnerId: id } }">{{ $t('ACTIONS.MODIFY') }}</md-menu-item>
                </md-menu-content>
              </md-menu>
            </md-list-item>
          </md-list>

        </md-tab>

        <md-tab id="tab-speakers"
                md-icon="record_voice_over"
                :md-disabled="Object.keys(speakers).length === 0"
                :md-label="$tc('EDITIONS_DASHBOARD.SPEAKERS.LABEL', Object.keys(speakers).length, [Object.keys(speakers).length])">

        </md-tab>

        <md-tab id="tab-events"
                md-icon="event"
                :md-disabled="Object.keys(events).length === 0"
                :md-label="$tc('EDITIONS_DASHBOARD.EVENTS.LABEL', Object.keys(events).length, [Object.keys(events).length])">

        </md-tab>
      </md-tabs>
    </div>

    <md-speed-dial class="add-btn">
      <md-speed-dial-target>
        <md-icon>add</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button class="md-icon-button"
                   :disabled="true">
          <md-icon>event</md-icon>
        </md-button>
        <md-button class="md-icon-button"
                   :disabled="true">
          <md-icon>record_voice_over</md-icon>
        </md-button>
        <md-button class="md-icon-button"
                   @click="add('partners-edit')">
          <md-icon>business_center</md-icon>
          <md-tooltip md-direction="left">{{ $t('EDITIONS_DASHBOARD.PARTNERS.CREATE') }}</md-tooltip>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
  </div>
</template>

<script>
  import EditionsService from '@/services/EditionsService';
  import PartnersService from '@/services/PartnersService';
  import AppTitle from '@/components/app-title/AppTitle';

  export default {
    name: 'editions-dashboard',
    components: {AppTitle},
    data() {
      return {
        isLoading: false,
        edition: {},
        partners: {},
        speakers: {},
        events: {}
      }
    },
    computed: {
      back() {
        return { name: 'editions' };
      }
    },
    beforeRouteEnter(to, from, next) {
      EditionsService.findOneForCurrentUser(to.params.editionId)
        .then(edition => next(vm => vm.edition = edition))
        .catch(err => {
          console.error(err);
          next({ name: 'editions' });
        })
    },
    created() {
      this.getDatas()
    },
    methods: {
      getDatas() {
        this.isLoading = true;

        Promise
          .all([
            PartnersService.findAllForEdition(this.$route.params.editionId)
          ])
          .then(datas => {
            this.partners = datas[0];
            this.isLoading = false;
          })
          .catch(err => console.error(err))
      },
      add(name) {
        this.$router.push({ name: name, params: { editionId: this.$route.params.editionId }});
      }
    }
  }
</script>

<style scoped lang="scss">
  .editions-dashboard {
    .add-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
</style>
