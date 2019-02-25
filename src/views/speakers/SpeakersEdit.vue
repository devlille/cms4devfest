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
                <md-card>
                    <md-card-content>
                        <md-autocomplete :md-open-on-focus="false"
                                         :md-options="availableSpeakers"
                                         @md-selected="initSpeakerFromConferenceHall"
                                         v-model.trim="speaker.displayName">
                            <label>{{ $t('SPEAKER.NAME') }}</label>

                            <template slot="md-autocomplete-item"
                                      slot-scope="{ item, term }">
                                <md-highlight-text :md-term="term">
                                    {{ item }}
                                </md-highlight-text>
                            </template>
                        </md-autocomplete>
                        <div class="field-img">
                            <div class="img">
                                <img :src="speaker.photoURL"
                                     alt=""
                                     v-if="speaker.photoURL"/>
                                <md-icon v-else>account_circle</md-icon>
                            </div>
                            <div class="field">
                                <md-field>
                                    <label>{{ $t('SPEAKER.PROFILE_URL') }}</label>
                                    <md-input :disabled="isSaving"
                                              v-model.trim="speaker.photoURL">
                                    </md-input>
                                </md-field>
                            </div>
                        </div>
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
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <div class="field-img">
                                    <div class="img">
                                        <img alt=""
                                             src="@/assets/logo-github.svg"/>
                                    </div>
                                    <div class="field">
                                        <md-field>
                                            <label>{{ $t('SPEAKER.GITHUB') }}</label>
                                            <md-input :disabled="isSaving"
                                                      v-model.trim="speaker.github">
                                            </md-input>
                                        </md-field>
                                    </div>
                                </div>
                            </div>
                            <div class="md-layout-item md-small-size-100">
                                <div class="field-img">
                                    <div class="img">
                                        <img alt=""
                                             src="@/assets/logo-twitter.svg"/>
                                    </div>
                                    <div class="field">
                                        <md-field>
                                            <label>{{ $t('SPEAKER.TWITTER') }}</label>
                                            <md-input :disabled="isSaving"
                                                      v-model.trim="speaker.twitter">
                                            </md-input>
                                        </md-field>
                                    </div>
                                </div>
                            </div>
                        </div>
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
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import SpeakersService from '@/services/SpeakersService';
import {required} from 'vuelidate/lib/validators';

export default {
  name: 'SpeakersEdit',
  components: { AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      edition: {},
      speaker: {},
      speakers: [],
      availableSpeakers: [],
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
    };
  },
  validations: {
    speaker: {
      displayName: {
        required,
      },
      photoURL: {
        required,
      },
      company: {
        required,
      },
      bio: {
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
  created() {
    this.findAllSpeakersFromConferenceHall();
  },
  methods: {
    findAllSpeakersFromConferenceHall() {
      this.isSaving = true;

      SpeakersService.findAllFromConferenceHall(this.$route.params.editionId)
      .then(res => {
        this.speakers = res.speakers;
        this.availableSpeakers = this.speakers.map(speaker => speaker.displayName);
      })
      .finally(() => this.isSaving = false);
    },
    initSpeakerFromConferenceHall(speakerName) {
      const speakerFound = this.speakers.find(speaker => speaker.displayName === speakerName);

      if (speakerFound) {
        this.$set(this.speaker, 'displayName', speakerFound.displayName);
        this.$set(this.speaker, 'photoURL', speakerFound.photoURL);
        this.$set(this.speaker, 'company', speakerFound.company);
        this.$set(this.speaker, 'bio', speakerFound.bio);
        this.$set(this.speaker, 'twitter', speakerFound.twitter);
        this.$set(this.speaker, 'github', speakerFound.github);
      }
    },
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

<style scoped lang="scss">
.speakers-edit {
    .field-img {
        display: flex;
        align-items: center;

        .img {
            img {
                height: 24px;
                max-width: 100%;
            }

            margin-right: 1rem;
        }

        .field {
            flex: 1;
        }
    }
}
</style>
