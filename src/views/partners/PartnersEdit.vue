<template>
    <div class="partners-edit mw-basic-layout">
        <div class="mw-content">
            <app-title :edition="edition"
                       :title="isUpdatingMode ? $t('PARTNERS_EDIT.LABEL.UPDATE') : $t('PARTNERS_EDIT.LABEL.CREATE')">
                <template slot="back">
                    <app-back :to="back"></app-back>
                </template>
            </app-title>

            <form @submit.prevent="save"
                  novalidate>
                <app-info v-if="$v.partner.$invalid">{{ $t('PARTNERS_EDIT.INFO') }}</app-info>
                <md-card>
                    <md-card-content>
                        <md-field>
                            <label>{{ $t('PARTNER.NAME') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.name">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.URL') }}</label>
                            <span class="md-prefix">https://</span>
                            <md-input :disabled="isSaving"
                                      type="url"
                                      v-model.trim="partner.url">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.LOGO') }}</label>
                            <md-file :disabled="isSaving"
                                     @md-change="setLogos"
                                     accept="image/*"
                                     v-model.trim="logos.name">
                            </md-file>
                        </md-field>

                        <md-subheader>{{ $t('PARTNERS_EDIT.ADMINISTRATIVE') }}</md-subheader>
                        <md-field>
                            <label>{{ $t('PARTNER.SIRET') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.siret">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.ROAD') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.address.road">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.ZIP_CODE') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.address.zipCode">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.ADDRESS.TOWN') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.address.town">
                            </md-input>
                        </md-field>

                        <md-subheader>{{ $t('PARTNERS_EDIT.CONTACT') }}</md-subheader>
                        <md-field>
                            <label>{{ $t('PARTNER.CONTACT.NAME') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.contact.name">
                            </md-input>
                        </md-field>
                        <md-field>
                            <label>{{ $t('PARTNER.CONTACT.FUNCTION') }}</label>
                            <md-input :disabled="isSaving"
                                      v-model.trim="partner.contact.function">
                            </md-input>
                        </md-field>

                        <md-subheader>{{ $t('PARTNERS_EDIT.OPTIONS') }}</md-subheader>
                        <md-field>
                            <label>{{ $t('PARTNER.LEVEL') }}</label>
                            <md-select :disabled="isSaving"
                                       v-model="partner.level">
                                <md-option :key="`level_${idx}`"
                                           :value="level"
                                           v-for="(level, idx) in levels">
                                    {{ $t(`PACK.${level}`) }}
                                </md-option>
                            </md-select>
                        </md-field>
                        <md-field>
                            <app-datetime :disabled="isSaving"
                                          v-model="partner.activeOn">
                            </app-datetime>
                        </md-field>
                    </md-card-content>
                    <md-card-actions>
                        <md-button :to="back">{{ $t('ACTIONS.CANCEL') }}</md-button>
                        <md-button :disabled="$v.partner.$invalid || isSaving"
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
import AppInfo from '@/components/app-info/AppInfo.vue';
import AppTitle from '@/components/app-title/AppTitle';
import EditionsService from '@/services/EditionsService';
import PartnersService from '@/services/PartnersService';
import {required} from 'vuelidate/lib/validators';

export default {
  name: 'PartnersEdit',
  components: { AppDatetime, AppInfo, AppBack, AppTitle },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      edition: {},
      partner: {
        activeOn: new Date(),
        address: {},
        contact: {},
      },
      logos: {},
      levels: ['GOLD', 'SILVER', 'BRONZE', 'CONTRIBUTEUR'],
      back: { name: 'editions-dashboard', params: { editionId: this.$route.params.editionId } },
    };
  },
  validations: {
    partner: {
      name: {
        required,
      },
      siret: {
        required,
      },
      url: {
        required,
      },
      address: {
        road: {
          required,
        },
        zipCode: {
          required,
        },
        town: {
          required,
        },
      },
      contact: {
        name: {
          required,
        },
        function: {
          required,
        },
      },
      level: {
        required,
      },
      activeOn: {
        required,
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    const promises = [EditionsService.findOneForCurrentUser(to.params.editionId)];

    if (to.params.partnerId !== undefined) {
      promises.push(PartnersService.findOne(to.params.partnerId));
    }

    Promise
    .all(promises)
    .then(datas => next(vm => {
      vm.edition = datas[0];

      if (datas.length === 2) {
        vm.partner = datas[1];
        vm.isUpdatingMode = true;
      } else {
        vm.partner.edition = to.params.editionId;
      }
    }))
    .catch(() => next({ name: 'editions' }));
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

        if (this.isUpdatingMode) {
          return PartnersService.update(this.$route.params.partnerId, this.partner);
        } else {
          return PartnersService.create(this.partner);
        }
      })
      .then(() => this.$router.push(this.back))
      .catch(() => {
        this.$store.commit('notification/setNotification', {
          active: true,
          message: this.$t('PARTNERS_EDIT.ERROR'),
        });
      })
      .finally(() => this.isSaving = false);
    },
  },
};
</script>
