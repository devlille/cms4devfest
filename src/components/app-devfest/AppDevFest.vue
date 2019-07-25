<template>
  <div class="app-devfest">
    <md-button
      :href="`https://${edition.url}`"
      v-if="edition !== null && dday >= 0"
    >
      <strong>{{ $t('APP_DEVFEST.DDAY') }}-{{ dday }}</strong>
      {{ $t('APP_DEVFEST.DEVFEST') }}
    </md-button>
  </div>
</template>

<script>
import EditionsService from '@/services/EditionsService';
import moment from 'moment';

export default {
  name: 'AppDevFest',
  data() {
    return {
      edition: null
    };
  },
  computed: {
    dday() {
      const today = moment();
      return moment(this.edition.date).diff(today, 'days') + 1;
    }
  },
  created() {
    this.getEdition();
  },
  methods: {
    getEdition() {
      EditionsService.findOneForCurrentUser(this.$route.params.editionId).then(
        edition => (this.edition = edition)
      );
    },
    goToDevFestWebSite() {
      window.open(this.edition.url, '_blank');
    }
  }
};
</script>
