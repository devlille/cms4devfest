<template>
    <div class="talks-edit mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :title="isUpdatingMode ? $t('TALKS_EDIT.LABEL.UPDATE') : $t('TALKS_EDIT.LABEL.CREATE')">
                <template slot="back">
                    <app-back :to="back"></app-back>
                </template>
            </app-title>

            <form @submit.prevent="save"
                  novalidate>
                <md-card>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('TALK.TITLE') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="talk.title">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('SPEAKER.ROLE') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.role">
                            </md-input>
                        </md-field>
                        <md-field :class="$v.speaker.company.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('SPEAKER.COMPANY') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="speaker.company">
                            </md-input>
                            <span class="md-error"
                                  v-if="!$v.speaker.company.required">
                                {{ $t('SPEAKERS_EDIT.ERRORS.REQUIRED') }}
                            </span>
                        </md-field>
                        <md-field :class="$v.speaker.bio.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('SPEAKER.BIO') }}</label>
                            <md-textarea :disabled="isSaving"
                                         v-model.trim="speaker.bio">
                            </md-textarea>
                            <span class="md-error"
                                  v-if="!$v.speaker.bio.required">
                                {{ $t('SPEAKERS_EDIT.ERRORS.REQUIRED') }}
                            </span>
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
import TalksService from '@/services/TalksService';
import {required} from 'vuelidate/lib/validators';

export default {
  name: 'TalksEdit',
  components: { AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      edition: {},
      talk: {},
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
    };
  },
  validations: {
    talk: {
      title: { required },
      level: { required },
      abstract: { required },
    },
  },
  beforeRouteEnter(to, from, next) {
    const promises = [EditionsService.findOneForCurrentUser(to.params.editionId)];

    if (to.params.talkId !== undefined) {
      promises.push(TalksService.findOne(to.params.talkId));
    }

    Promise
      .all(promises)
      .then(datas => next(vm => {
        vm.edition = datas[0];

        if (datas.length === 2) {
          vm.talk = datas[1];
          vm.isUpdatingMode = true;
        } else {
          vm.talk.edition = to.params.editionId;
        }
      }))
      .catch(() => next({ name: 'editions' }));
  },
  methods: {
    save() {
      this.isSaving = true;
      let promise;

      if (this.isUpdatingMode) {
        promise = TalksService.update(this.$route.params.talkId, this.talk);
      } else {
        promise = TalksService.create(this.speaker);
      }

      promise
        .then(() => this.$router.push(this.back))
        .catch(() => {
          this.$store.commit('notification/setNotification', {
            active: true,
            message: this.$t('TALKS_EDIT.ERRORS.SAVING'),
          });
        })
        .finally(() => this.isSaving = false);
    },
  },
};
</script>
