<template>
    <div class="partners-edit mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :title="isUpdatingMode ? $t('PARTNERS_EDIT.LABEL.UPDATE') : $t('PARTNERS_EDIT.LABEL.CREATE')"
                       :back="back"/>

            <form novalidate
                  @submit.prevent="save">
                <md-card>
                    <md-card-header>
                        <div class="md-title">{{ $t('PARTNERS_EDIT.INFOS') }}</div>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('PARTNER.NAME') }}</label>
                            <md-input v-model.trim="partner.name"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.SIRET') }}</label>
                            <md-input v-model.trim="partner.siret"
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
                            <label>{{ $t('PARTNER.LOGO') }}</label>
                            <md-file v-model.trim="logos.name"
                                     :disabled="isSaving"
                                     accept="image/*"
                                     @md-change="setLogos">
                            </md-file>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.ROAD') }}</label>
                            <md-input v-model.trim="partner.address.road"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.ZIP_CODE') }}</label>
                            <md-input v-model.trim="partner.address.zipCode"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.TOWN') }}</label>
                            <md-input v-model.trim="partner.address.town"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header>
                        <div class="md-title">{{ $t('PARTNERS_EDIT.CONTACT') }}</div>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('PARTNER.CONTACT.NAME') }}</label>
                            <md-input v-model.trim="partner.contact.name"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.CONTACT.FUNCTION') }}</label>
                            <md-input v-model.trim="partner.contact.function"
                                      :disabled="isSaving">
                            </md-input>
                        </md-field>
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header>
                        <div class="md-title">{{ $t('PARTNERS_EDIT.ADMIN') }}</div>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('PARTNER.LEVEL') }}</label>
                            <md-select v-model="partner.level"
                                       :disabled="isSaving">
                                <md-option v-for="(level, idx) in levels"
                                           :key="`level_${idx}`"
                                           :value="level">
                                    {{ $t(`PACK.${level}`) }}
                                </md-option>
                            </md-select>
                        </md-field>
                        <md-field>
                            <datetime :value="partner.activeOn.toISOString()"
                                      @input="partner.activeOn = new Date($event)"
                                      type="datetime"
                                      :disabled="isSaving"
                                      input-class="md-input"
                                      :auto="true"
                                      :min-datetime="new Date().toISOString()"></datetime>
                        </md-field>
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
        partner: {
          activeOn: new Date(),
          address: {},
          contact: {}
        },
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
        siret: {
          required
        },
        url: {
          required
        },
        address: {
          road: {
            required
          },
          zipCode: {
            required
          },
          town: {
            required
          }
        },
        contact: {
          name: {
            required
          },
          function: {
            required
          }
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
      this.levels = ['GOLD', 'SILVER', 'BRONZE', 'CONTRIBUTEUR'];
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

<style scoped lang="scss">
    .partners-edit {
        .md-card + .md-card {
            margin-top: 20px;
        }
    }
</style>
