<template>
    <div class="partners-edit mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :title="isUpdatingMode ? $t('PARTNERS_EDIT.LABEL.UPDATE') : $t('PARTNERS_EDIT.LABEL.CREATE')"
                       :back="back"/>

            <form novalidate
                  @submit.prevent="save">
                <md-card>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('PARTNER.NAME') }}</label>
                            <md-input v-model.trim="partner.name"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.URL') }}</label>
                            <span class="md-prefix">https://</span>
                            <md-input v-model.trim="partner.url"
                                      type="url"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.LEVEL') }}</label>
                            <md-select v-model="partner.level"
                                       :disabled="isSaving">
                                <md-option v-for="(level, idx) in levels"
                                           :key="`level_${idx}`"
                                           :value="level">
                                    {{ level }}
                                </md-option>
                            </md-select>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.LOGO') }}</label>
                            <md-file v-model.trim="logos.name"
                                     :disabled="isSaving"
                                     accept="image/*"
                                     @md-change="setLogos">
                            </md-file>
                        </md-field>
                        <md-datepicker v-model="partner.activeOn"
                                       :disabled="isSaving"
                                       :md-immediately="true">
                            <label>{{ $t('PARTNER.ACTIVE_ON') }}</label>
                        </md-datepicker>
                    </md-card-content>
                    <md-card-actions>
                        <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
                        <md-button class="md-raised md-primary"
                                   type="submit"
                                   :disabled="$v.partner.$invalid || isSaving">
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
  import AppTitle from '@/components/app-title/AppTitle';
  import EditionsService from '@/services/EditionsService';
  import PartnersService from '@/services/PartnersService';

  export default {
    name: 'PartnersEdit',
    components: {AppTitle},
    data() {
      return {
        isSaving: false,
        isUpdatingMode: false,
        edition: {},
        partner: {},
        logos: {},
        levels: []
      }
    },
    computed: {
      back() {
        return { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId }};
      }
    },
    validations: {
      partner: {
        name: {
          required
        },
        url: {
          required
        },
        level: {
          required
        },
        activeOn: {
          required
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      const promises = [EditionsService.findOneForCurrentUser(to.params.editionId)];

      if(to.params.partnerId !== undefined) {
        promises.push(PartnersService.findOne(to.params.partnerId))
      }

      Promise
        .all(promises)
        .then(datas => next(vm => {
          vm.edition = datas[0];

          if(datas.length === 2) {
            vm.partner = datas[1];
            vm.partner.activeOn = new Date(vm.partner.activeOn);
            vm.isUpdatingMode = true;
          }
          else {
            vm.partner.activeOn = new Date();
            vm.partner.edition = to.params.editionId;
          }
        }))
        .catch(err => {
          console.error(err);
          next({ name: 'editions' });
        });
    },
    created() {
      this.levels = ['Gold', 'Silver', 'Bronze'];

      this.$material.locale.dateFormat = 'DD/MM/YYYY';
      this.$material.locale.days = this.$t('PARTNERS_EDIT.DAYS');
      this.$material.locale.shortDays = this.$t('PARTNERS_EDIT.SHORT_DAYS');
      this.$material.locale.shorterDays = this.$t('PARTNERS_EDIT.SHORTER_DAYS');
      this.$material.locale.months = this.$t('PARTNERS_EDIT.MONTHS');
      this.$material.locale.shortMonths = this.$t('PARTNERS_EDIT.SHORT_MONTHS');
      this.$material.locale.shorterMonths = this.$t('PARTNERS_EDIT.SHORTER_MONTHS');
    },
    methods: {
      setLogos(logos) {
        this.logos = logos;
      },
      save() {
        this.isSaving = true;

        PartnersService.uploadLogo(this.partner, this.logos[0])
          .then(logo => logo.ref.getDownloadURL())
          .then(logoUrl => {
            this.partner.logoUrl = logoUrl;

            if(this.isUpdatingMode) {
              return PartnersService.update(this.$route.params.partnerId, this.partner);
            }
            else {
              return PartnersService.create(this.partner);
            }
          })
          .then(() => this.$router.push(this.back))
          .catch(err => {
            console.error(err);
            this.isSaving = false;
            this.$store.commit('notification/setNotification', {
              active: true,
              message: this.$t('PARTNERS_EDIT.ERROR')
            });
          });
      }
    }
  }
</script>
