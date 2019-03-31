<template>
    <div class="editions-import mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :is-loading="isLoading"
                       :title="$t('EDITIONS_IMPORT.LABEL.IMPORT')">
                <template slot="back">
                    <app-back :to="back"></app-back>
                </template>
            </app-title>

            <div v-if="!isLoading">
                <app-info>{{ $t('EDITIONS_IMPORT.INFO') }}</app-info>
                <md-list class="md-elevation-2">
                    <md-list-item :md-expand="!isSaving">
                        <md-icon>record_voice_over</md-icon>
                        <span class="md-list-item-text">{{ $tc('EDITIONS_IMPORT.SPEAKERS.LABEL', speakers.length, [speakers.length]) }}</span>

                        <md-list class="md-dense long-list"
                                 slot="md-expand">
                            <md-list-item :key="`speaker_${idx}`"
                                          v-for="(speaker, idx) in speakers">
                                <md-avatar>
                                    <img :src="speaker.photoURL"
                                         alt="">
                                </md-avatar>
                                <span class="md-list-item-text">{{ speaker.displayName }}</span>
                            </md-list-item>
                        </md-list>
                    </md-list-item>

                    <md-list-item :md-expand="!isSaving">
                        <md-icon>event</md-icon>
                        <span class="md-list-item-text">{{ $tc('EDITIONS_IMPORT.TALKS.LABEL', talks.length, [talks.length]) }}</span>

                        <md-list class="md-dense long-list"
                                 slot="md-expand">
                            <md-list-item :key="`talk_${idx}`"
                                          v-for="(talk, idx) in talks">
                                <span class="md-list-item-text">{{ talk.title }}</span>
                            </md-list-item>
                        </md-list>
                    </md-list-item>
                </md-list>

                <div class="actions">
                    <div>
                        <md-progress-spinner :md-diameter="20"
                                             :md-stroke="2"
                                             class="md-accent"
                                             md-mode="indeterminate"
                                             v-if="isSaving">
                        </md-progress-spinner>
                    </div>

                    <div>
                        <md-button :disabled="isSaving"
                                   :to="back">
                            {{ $t('ACTIONS.CANCEL') }}
                        </md-button>

                        <md-button :disabled="isSaving"
                                   @click="save"
                                   class="md-primary md-raised">
                            {{ $t('ACTIONS.VALID') }}
                        </md-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppBack from '@/components/app-back/AppBack';
import AppInfo from '@/components/app-info/AppInfo';
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import SpeakersService from '@/services/SpeakersService';
import TalksService from '@/services/TalksService';

export default {
  name: 'EditionsImport',
  components: { AppInfo, AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isLoading: false,
      edition: {},
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
      speakers: [],
      talks: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    EditionsService.findOneForCurrentUser(to.params.editionId)
      .then(datas => next(vm => vm.edition = datas[0]))
      .catch(() => next({ name: 'editions' }));
  },
  created() {
    this.findOneFromConferenceHall();
  },
  methods: {
    findOneFromConferenceHall() {
      this.isLoading = true;

      EditionsService.findOneFromConferenceHall(this.$route.params.editionId)
        .then(res => {
          this.speakers = res.speakers;
          this.talks = res.talks;
        })
        .finally(() => this.isLoading = false);
    },
    async save() {
      this.isSaving = true;

      try {
        const speakers = await this.saveSpeakers();
        await this.saveTalks(speakers);

        this.$store.commit('notification/setNotification', {
          active: true,
          message: this.$t('EDITIONS_IMPORT.SUCCESS'),
        });

        window.setTimeout(() => this.$router.push(this.back), 1000);
      } catch (e) {
        this.$store.commit('notification/setNotification', {
          active: true,
          message: this.$t('EDITIONS_IMPORT.ERROR'),
        });
      }

      this.isSaving = false;
    },
    async saveSpeakers() {
      const speakersToCreate = [];
      const speakersToUpdate = {};

      const speakers = await SpeakersService.findAllForEdition(this.$route.params.editionId);
      const speakerIds = Object.keys(speakers);

      this.speakers.forEach(speakerToImport => {
        const speakerIdToUpdate = speakerIds.find(speakerId => speakers[speakerId].displayName === speakerToImport.displayName);

        if (speakerIdToUpdate) {
          speakersToUpdate[speakerIdToUpdate] = Object.assign(speakers[speakerIdToUpdate], speakerToImport);
        } else {
          speakerToImport.edition = this.$route.params.editionId;
          speakersToCreate.push(speakerToImport);
        }
      });

      await SpeakersService.createAll(speakersToCreate);
      await SpeakersService.updateAll(speakersToUpdate);

      return await SpeakersService.findAllForEdition(this.$route.params.editionId);
    },
    async saveTalks(speakers) {
      const talksToCreate = [];
      const talksToUpdate = {};

      const talks = await TalksService.findAllForEdition(this.$route.params.editionId);
      const talkIds = Object.keys(talks);
      const speakerIds = Object.keys(speakers);

      this.talks.forEach(talkToImport => {
        talkToImport.speakers = speakerIds.filter(speakerId => talkToImport.speakers.indexOf(speakers[speakerId].uidFromConferenceHall) !== -1);

        const talkIdToUpdate = talkIds.find(talkId => talks[talkId].displayName === talkToImport.displayName);

        if (talkIdToUpdate) {
          talksToUpdate[talkIdToUpdate] = Object.assign(talks[talkIdToUpdate], talkToImport);
        } else {
          talkToImport.edition = this.$route.params.editionId;
          talksToCreate.push(talkToImport);
        }
      });

      await TalksService.createAll(talksToCreate);
      await TalksService.updateAll(talksToUpdate);
    },
  },
};
</script>

<style scoped lang="scss">
.editions-import {
    .long-list {
        max-height: 300px;
        overflow: auto;
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
    }
}
</style>
