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
                        <md-field :class="$v.talk.title.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('TALK.TITLE') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="talk.title">
                            </md-input>
                            <span class="md-error"
                                  v-if="!$v.talk.title.required">
                                {{ $t('TALKS_EDIT.ERRORS.REQUIRED') }}
                            </span>
                        </md-field>
                        <md-field :class="$v.talk.abstract.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('TALK.ABSTRACT') }}</label>
                            <md-textarea :disabled="isSaving"
                                         v-model.trim="talk.abstract">
                            </md-textarea>
                            <span class="md-error"
                                  v-if="!$v.talk.abstract.required">
                                {{ $t('TALKS_EDIT.ERRORS.REQUIRED') }}
                            </span>
                        </md-field>
                        <md-field :class="$v.talk.level.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('TALK.LEVEL') }}</label>
                            <md-select :disabled="isSaving"
                                       v-model="talk.level">
                                <md-option value="beginner">
                                    {{ $t('TALKS_EDIT.LEVEL.BEGINNER') }}
                                </md-option>
                                <md-option value="intermediate">
                                    {{ $t('TALKS_EDIT.LEVEL.INTERMEDIATE') }}
                                </md-option>
                                <md-option value="advanced">
                                    {{ $t('TALKS_EDIT.LEVEL.ADVANCED') }}
                                </md-option>
                            </md-select>
                            <span class="md-error"
                                  v-if="!$v.talk.level.required">
                                {{ $t('TALKS_EDIT.ERRORS.REQUIRED') }}
                            </span>
                        </md-field>
                        <md-field :class="$v.talk.room.$invalid ? 'md-invalid' : ''">
                            <label>{{ $t('TALK.ROOM') }}</label>
                            <md-select :disabled="isSaving"
                                       v-model="talk.room">
                                <md-option value="room-1">
                                    {{ $t('TALKS_EDIT.ROOM.ONE') }}
                                </md-option>
                                <md-option value="room-2">
                                    {{ $t('TALKS_EDIT.ROOM.TWO') }}
                                </md-option>
                                <md-option value="room-3">
                                    {{ $t('TALKS_EDIT.ROOM.THREE') }}
                                </md-option>
                                <md-option value="room-4">
                                    {{ $t('TALKS_EDIT.ROOM.FOUR') }}
                                </md-option>
                                <md-option value="room-5">
                                    {{ $t('TALKS_EDIT.ROOM.FIVE') }}
                                </md-option>
                            </md-select>
                            <span class="md-error"
                                  v-if="!$v.talk.room.required">
                                {{ $t('TALKS_EDIT.ERRORS.REQUIRED') }}
                            </span>
                        </md-field>
                        <md-field :class="$v.talk.hour.$invalid ? 'md-invalid' : ''">
                            <app-datetime mode="time"
                                          v-model="talk.hour">
                            </app-datetime>
                            <span class="md-error"
                                  v-if="!$v.talk.hour.required">
                            {{ $t('TALKS_EDIT.ERRORS.REQUIRED') }}
                        </span>
                        </md-field>
                        <md-autocomplete :md-fuzzy-search="false"
                                         :md-input-placeholder="$t('TALKS_EDIT.SPEAKERS')"
                                         :md-open-on-focus="false"
                                         :md-options="speakersNames"
                                         @md-selected="selectSpeaker"
                                         md-dense
                                         v-model="selectedSpeakersName">
                        </md-autocomplete>
                        <md-chips @md-delete="deselectSpeaker"
                                  md-check-duplicated
                                  v-model="selectedSpeakersNames"
                                  v-show="selectedSpeakersNames.length > 0">
                        </md-chips>
                    </md-card-content>
                    <md-card-actions>
                        <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
                        <md-button :disabled="$v.talk.$invalid || isSaving"
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
import AppBack from '@/components/app-back/AppBack';
import AppDatetime from '@/components/app-datetime/AppDatetime';
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import SpeakersService from '@/services/SpeakersService';
import TalksService from '@/services/TalksService';
import {required} from 'vuelidate/lib/validators';

export default {
  name: 'TalksEdit',
  components: { AppDatetime, AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      isLoadingSpeakers: false,
      edition: {},
      speakers: {},
      speakersNames: [],
      selectedSpeakersNames: [],
      selectedSpeakersName: '',
      talk: {
        title: '',
        abstract: '',
        level: '',
        room: '',
        hour: new Date(),
        speakers: {},
        edition: '',
      },
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
    };
  },
  validations: {
    talk: {
      title: { required },
      level: { required },
      abstract: { required },
      room: { required },
      hour: { required },
    },
  },
  async beforeRouteEnter(to, from, next) {
    const promises = [
      EditionsService.findOneForCurrentUser(to.params.editionId),
      SpeakersService.findAllForEdition(to.params.editionId),
    ];

    if (to.params.talkId !== undefined) {
      promises.push(TalksService.findOne(to.params.talkId));
    }

    Promise
      .all(promises)
      .then(datas => next(vm => {
        vm.edition = datas[0];
        vm.speakers = datas[1];
        vm.speakersNames = Object.values(datas[1]).map(speaker => speaker.displayName).filter(speaker => speaker !== null);

        if (datas.length === 3) {
          vm.talk = datas[2];
          vm.selectedSpeakersNames = Object.keys(vm.talk.speakers).map(speakerId => vm.speakers[speakerId].displayName);
          vm.isUpdatingMode = true;
        } else {
          vm.talk.edition = to.params.editionId;
        }
      }))
      .catch(() => next({ name: 'editions' }));
  },
  methods: {
    selectSpeaker() {
      this.selectedSpeakersNames.push(this.selectedSpeakersName);

      const speakerId = Object.keys(this.speakers).find(speakerId => this.speakers[speakerId].displayName === this.selectedSpeakersName);
      this.talk.speakers[speakerId] = true;

      this.selectedSpeakersName = '';
    },
    deselectSpeaker(text, index) {
      const speakerId = Object.keys(this.speakers).find(speakerId => this.speakers[speakerId].displayName === text);
      delete this.talk.speakers[speakerId];

      this.selectedSpeakersNames.splice(index, 1);
    },
    save() {
      this.isSaving = true;
      let promise;

      if (this.isUpdatingMode) {
        promise = TalksService.update(this.$route.params.talkId, this.talk);
      } else {
        promise = TalksService.create(this.talk);
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
