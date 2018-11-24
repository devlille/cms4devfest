<template>
  <div class="editions-edit mw-basic-layout">
    <div class="mw-content">
      <app-title :title="isUpdatingMode ? $t('EDITIONS_EDIT.LABEL.UPDATE') : $t('EDITIONS_EDIT.LABEL.CREATE')"
                 :back="back"/>

      <form novalidate
            @submit.prevent="save">
        <md-card>
          <md-card-content>
            <md-field>
              <label for="name">{{ $t('EDITION.NAME.LABEL') }}</label>
              <md-input name="name"
                        id="name"
                        v-model.trim="edition.name"
                        :disabled="isSaving" />
              <span class="md-helper-text">{{ $t('EDITION.NAME.EXAMPLE') }}</span>
            </md-field>
            <md-field>
              <label for="url">{{ $t('EDITION.URL.LABEL') }}</label>
              <span class="md-prefix">https://</span>
              <md-input name="url"
                        id="url"
                        v-model.trim="edition.url"
                        :disabled="isSaving" />
            </md-field>
          </md-card-content>
          <md-card-actions>
            <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
            <md-button class="md-raised md-primary"
                       type="submit"
                       :disabled="$v.edition.$invalid || isSaving">
              {{ $t('ACTIONS.VALID') }}
            </md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import EditionsService from '@/services/EditionsService';
  import AppTitle from '@/components/app-title/AppTitle';

  export default {
    name: 'editions-edit',
    components: {AppTitle},
    data() {
      return {
        isSaving: false,
        isUpdatingMode: false,
        edition: {}
      }
    },
    computed: {
      back() {
        return { name: 'editions' };
      }
    },
    validations: {
      edition: {
        name: {
          required
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if(to.params.editionId === undefined) {
        next();
      }
      else {
        EditionsService.findOneForCurrentUser(to.params.editionId)
          .then(edition => next(vm => {
            vm.edition = edition;
            vm.isUpdatingMode = true;
          }))
          .catch(err => {
            console.error(err);
            next({ name: 'editions' });
          });
      }
    },
    methods: {
      save() {
        this.isSaving = true;

        if(this.isUpdatingMode) {
          EditionsService.update(this.$route.params.editionId, this.edition)
            .then(() => this.$router.push(this.back))
            .catch(err => {
              console.error(err);
              this.isSaving = false;
              this.$store.commit('notification/setNotification', {
                active: true,
                message: this.$t('EDITIONS_EDIT.ERROR')
              });
            })
        }
        else {
          EditionsService.create(this.edition)
            .then(() => this.$router.push(this.back))
            .catch(err => {
              console.error(err);
              this.isSaving = false;
              this.$store.commit('notification/setNotification', {
                active: true,
                message: this.$t('EDITIONS_EDIT.ERROR')
              });
            })
        }
      }
    }
  }
</script>
