<template>
    <md-dialog :md-active.sync="active" style="min-width: 400px;">
        <md-dialog-title>
            <span v-if="partner.id === undefined">{{ $t('PARTNER_EDIT.NEW') }}</span>
            <span v-else>{{ $t('PARTNER_EDIT.UPGRADE') }}</span>
        </md-dialog-title>

        <md-dialog-content>
            <form novalidate>
                <md-field>
                    <label>{{ $t('PARTNER.NAME') }} *</label>
                    <md-input v-model.trim="partner.name"
                              :disabled="isSaving">
                    </md-input>
                </md-field>
                <md-field>
                    <label>{{ $t('PARTNER.URL') }} *</label>
                    <md-input v-model.trim="partner.url"
                              type="url"
                              :disabled="isSaving">
                    </md-input>
                </md-field>
                <md-field>
                    <label>{{ $t('PARTNER.LEVEL') }} *</label>
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
                    <label>{{ $t('PARTNER.LOGO') }} *</label>
                    <md-file v-model.trim="partner.logo"
                             :disabled="isSaving"
                             accept="image/*"
                             @md-change="set">
                    </md-file>
                </md-field>
                <md-datepicker v-model.trim="partner.activeOn"
                               :disabled="isSaving"
                               :md-immediately="true">
                    <label>{{ $t('PARTNER.ACTIVE_ON') }}</label>
                </md-datepicker>
            </form>
        </md-dialog-content>

        <md-dialog-actions>
            <span v-if="isInError">{{ $t('PARTNER_EDIT.ERROR_WHILE_SAVING') }}</span>
            <md-button @click="cancel">{{ $t('ACTIONS.CLOSE') }}</md-button>
            <md-button class="md-raised md-primary"
                       type="submit"
                       :disabled="$v.partner.$invalid || isSaving"
                       @click="savePartner">
                <span v-if="isSaving">{{ $t('PARTNER_EDIT.IS_SAVING') }}</span>
                <span v-else>{{ $t('ACTIONS.VALID') }}</span>
            </md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import {required, url} from 'vuelidate/lib/validators'

  export default {
    name: 'PartnerEdit',
    props: {
      active: {
        type: Boolean,
        default: false
      },
      partner: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        isSaving: false,
        isInError: false,
        levels: []
      }
    },
    validations: {
      partner: {
        name: {
          required
        },
        url: {
          required,
          url
        },
        level: {
          required
        },
        logo: {
          required
        }
      }
    },
    created() {
      this.levels = ['Gold', 'Silver', 'Bronze']
      this.$material.locale.dateFormat = 'DD/MM/YYYY'
      this.$material.locale.days = this.$t('PARTNER_EDIT.DAYS')
      this.$material.locale.shortDays = this.$t('PARTNER_EDIT.SHORT_DAYS')
      this.$material.locale.shorterDays = this.$t('PARTNER_EDIT.SHORTER_DAYS')
      this.$material.locale.months = this.$t('PARTNER_EDIT.MONTHS')
      this.$material.locale.shortMonths = this.$t('PARTNER_EDIT.SHORT_MONTHS')
      this.$material.locale.shorterMonths = this.$t('PARTNER_EDIT.SHORTER_MONTHS')
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      },
      test(file) {
        console.log(file);
      },
      savePartner() {
        this.isInError = false
        this.isSaving = true

        console.log(this.partner.logo);

        /*firebase.storage()
          .ref()
          .child(`/partners/`)

        firebase.database()
          .ref('/partners')
          .set(this.partner)
          .then(res => {
            console.log(res)
            this.isSaving = false
            this.$emit('valid')
          })
          .catch(() => this.isInError = true)*/
      }
    }
  }
</script>

<style lang="scss" scoped>
    .md-radio {
        display: flex;
    }
</style>
