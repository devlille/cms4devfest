<template>
    <div class="editions-edit mw-basic-layout">
        <div class="mw-content">
            <app-title
                    :title="isUpdatingMode ? $t('EDITIONS_EDIT.LABEL.UPDATE') : $t('EDITIONS_EDIT.LABEL.CREATE')">
                <template slot="back">
                    <app-back :to="back"></app-back>
                </template>
            </app-title>

            <form @submit.prevent="save"
                  novalidate>
                <app-info v-if="$v.edition.$invalid">{{ $t('EDITIONS_EDIT.INFO') }}</app-info>
                <md-card>
                    <md-card-content>
                        <md-field>
                            <label for="name">{{ $t('EDITION.NAME.LABEL') }}</label>
                            <md-input :disabled="isSaving"
                                      id="name"
                                      name="name"
                                      v-model.trim="edition.name"/>
                            <span class="md-helper-text"
                                  v-if="edition.name === ''">
                                {{ $t('EDITION.NAME.EXAMPLE') }}
                            </span>
                        </md-field>
                        <md-field>
                            <label for="url">{{ $t('EDITION.URL.LABEL') }}</label>
                            <span class="md-prefix">https://</span>
                            <md-input :disabled="isSaving"
                                      id="url"
                                      name="url"
                                      v-model.trim="edition.url"/>
                            <span class="md-helper-text"
                                  v-if="edition.url === ''">
                                {{ $t('EDITION.URL.EXAMPLE') }}
                            </span>
                        </md-field>
                        <md-field>
                            <app-datetime :disabled="isSaving"
                                          mode="date"
                                          v-model="edition.date">
                            </app-datetime>
                        </md-field>
                        <md-field>
                            <label for="conference-hall-api-key">
                                {{ $t('EDITION.CONFERENCE_HALL.LABEL') }}
                                -
                                {{ $t('EDITION.CONFERENCE_HALL.API_KEY.LABEL') }}
                            </label>
                            <md-input :disabled="isSaving"
                                      id="conference-hall-api-key"
                                      name="conference-hall-api-key"
                                      v-model.trim="edition.conferenceHallApiKey"/>
                            <span class="md-helper-text"
                                  v-if="edition.conferenceHallApiKey === ''">
                                {{ $t('EDITION.CONFERENCE_HALL.API_KEY.EXAMPLE') }}
                            </span>
                        </md-field>
                    </md-card-content>
                    <md-card-actions>
                        <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
                        <md-button :disabled="$v.edition.$invalid || isSaving"
                                   class="md-raised md-primary"
                                   type="submit">
                            {{ $t('ACTIONS.VALID') }}
                        </md-button>
                    </md-card-actions>
                </md-card>
            </form>
        </div>
    </div>
</template>

<script>
import AppBack from '@/components/app-back/AppBack.vue';
import AppDatetime from '@/components/app-datetime/AppDatetime.vue';
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import {required} from 'vuelidate/lib/validators';
import AppInfo from '../../components/app-info/AppInfo.vue';

export default {
  name: 'editions-edit',
  components: { AppInfo, AppDatetime, AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      edition: {
        name: '',
        url: '',
        date: new Date(),
        conferenceHallApiKey: '',
      },
      back: { name: 'editions' },
    };
  },
  validations: {
    edition: {
      name: {
        required,
      },
      url: {
        required,
      },
      date: {
        required,
      },
      conferenceHallApiKey: {
        required,
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.editionId === undefined) {
      next();
    } else {
      EditionsService.findOneForCurrentUser(to.params.editionId)
      .then(edition => next(vm => {
        vm.edition = edition;
        vm.isUpdatingMode = true;
      }))
      .catch(() => next({ name: 'editions' }));
    }
  },
  methods: {
    save() {
      this.isSaving = true;

      if (this.isUpdatingMode) {
        EditionsService.update(this.$route.params.editionId, this.edition)
        .then(() => this.$router.push(this.back))
        .catch(() => {
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('EDITIONS_EDIT.ERROR'),
          });
        })
        .finally(() => this.isSaving = false);
      } else {
        EditionsService.create(this.edition)
        .then(() => this.$router.push(this.back))
        .catch(() => {
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('EDITIONS_EDIT.ERROR'),
          });
        })
        .finally(() => this.isSaving = false);
      }
    },
  },
};
</script>
