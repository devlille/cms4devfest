<template>
  <div class="editions-edit mw-basic-layout">
    <div class="mw-content">
      <app-title :edition="edition"
                 :is-loading="isLoading"
                 :title="$t('EDITIONS_DASHBOARD.LABEL')" />

      <md-tabs md-alignment="fixed"
               class="md-elevation-2">
        <md-tab id="tab-partners"
                md-icon="business_center"
                :md-label="$tc('EDITIONS_DASHBOARD.PARTNERS', Object.keys(partners).length, [Object.keys(partners).length])">

        </md-tab>

        <md-tab id="tab-speakers"
                md-icon="record_voice_over"
                :md-label="$tc('EDITIONS_DASHBOARD.SPEAKERS', Object.keys(speakers).length, [Object.keys(speakers).length])">

        </md-tab>

        <md-tab id="tab-events"
                md-icon="event"
                :md-label="$tc('EDITIONS_DASHBOARD.EVENTS', Object.keys(events).length, [Object.keys(events).length])">

        </md-tab>
      </md-tabs>

    </div>
  </div>
</template>

<script>
  import EditionsService from '@/services/EditionsService';
  import PartnersService from '@/services/PartnersService';
  import AppTitle from '@/components/app-title/AppTitle';

  export default {
    name: 'editions-edit',
    components: {AppTitle},
    data() {
      return {
        isLoading: false,
        edition: null,
        partners: {},
        speakers: {},
        events: {}
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
            console.log(datas)
            this.isLoading = false;
          })
          .catch(err => console.error(err))
      }
    }
  }
</script>
