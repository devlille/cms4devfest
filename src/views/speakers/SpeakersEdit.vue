<template>
    <div class="speakers-edit mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :title="isUpdatingMode ? $t('SPEAKERS_EDIT.LABEL.UPDATE') : $t('SPEAKERS_EDIT.LABEL.CREATE')">
                <template slot="back">
                    <app-back :to="back"></app-back>
                </template>
            </app-title>

            <form @submit.prevent="save"
                  novalidate>
                <app-info v-if="$v.speaker.$invalid">{{ $t('SPEAKERS_EDIT.INFO') }}</app-info>
                <md-card>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('SPEAKER.NAME') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.name">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.PROFILE_URL') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.profileUrl">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.COMPANY') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.company">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.BIO') }}</label>
                            <md-textarea :disabled="isSaving"
                                         v-model.trim="speaker.bio">
                            </md-textarea>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.GITHUB') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.github">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.TWITTER') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.twitter">
                            </md-input>
                        </md-field>
                    </md-card-content>
                    <md-card-actions>
                        <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
                        <md-button :disabled="$v.speaker.$invalid || isSaving"
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
import AppInfo from '@/components/app-info/AppInfo.vue';
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import SpeakersService from '@/services/SpeakersService';
import {required} from 'vuelidate/lib/validators';

export default {
  name: 'SpeakersEdit',
  components: { AppInfo, AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      edition: {},
      speaker: {},
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
    };
  },
  validations: {
    speaker: {
      name: {
        required,
      },
      profileUrl: {
        required,
      },
      company: {
        required,
      },
      bio: {
        required,
      },
      github: {
        required,
      },
      twitter: {
        required,
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    const promises = [EditionsService.findOneForCurrentUser(to.params.editionId)];

    if (to.params.speakerId !== undefined) {
      promises.push(SpeakersService.findOne(to.params.speakerId));
    }

    Promise
    .all(promises)
    .then(datas => next(vm => {
      vm.edition = datas[0];

      if (datas.length === 2) {
        vm.speaker = datas[1];
        vm.isUpdatingMode = true;
      } else {
        vm.speaker.edition = to.params.editionId;
      }
    }))
    .catch(() => next({ name: 'editions' }));
  },
  methods: {
    save() {
      this.isSaving = true;

      if (this.isUpdatingMode) {
        SpeakersService.update(this.$route.params.speakerId, this.speaker)
        .then(() => this.$router.push(this.back))
        .catch(() => {
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('SPEAKERS_EDIT.ERROR'),
          });
        })
        .finally(() => this.isSaving = false);
      } else {
        SpeakersService.create(this.speaker)
        .then(() => this.$router.push(this.back))
        .catch((err) => {
          console.log(err);
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('SPEAKERS_EDIT.ERROR'),
          });
        })
        .finally(() => this.isSaving = false);
      }

    },
  },
};
</script>
