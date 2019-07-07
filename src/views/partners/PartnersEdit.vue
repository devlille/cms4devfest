<template>
  <div class="partners-edit mw-basic-layout">
    <div class="mw-content">
      <app-title
        :edition="edition"
        :title="isUpdatingMode ? $t('PARTNERS_EDIT.LABEL.UPDATE') : $t('PARTNERS_EDIT.LABEL.CREATE')"
      >
        <template slot="back">
          <app-back :to="back"></app-back>
        </template>
      </app-title>

      <md-steppers :md-active-step.sync="activeStep" class="md-elevation-2" md-linear md-vertical>
        <md-step :md-done="doneSteps.infos" :md-label="$t('PARTNERS_EDIT.INFOS')" id="infos">
          <md-field :class="$v.partner.name.$invalid ? 'md-invalid' : ''">
            <label>{{ $t('PARTNER.NAME') }}</label>
            <md-input autofocus name="partnerName" v-model.trim="partner.name"></md-input>
            <span
              class="md-error"
              v-if="!$v.partner.name.required"
            >{{ $t('PARTNERS_EDIT.ERRORS.REQUIRED') }}</span>
          </md-field>
          <md-field :class="$v.partner.url.$invalid ? 'md-invalid' : ''">
            <label>{{ $t('PARTNER.URL') }}</label>
            <span class="md-prefix">https://</span>
            <md-input name="partnerUrl" type="url" v-model.trim="partner.url"></md-input>
            <span
              class="md-error"
              v-if="!$v.partner.url.required"
            >{{ $t('PARTNERS_EDIT.ERRORS.REQUIRED') }}</span>
          </md-field>

          <app-file-uploader
            :disabled="$v.partner.name.$invalid"
            :path-on-cloud-storage="`editions/${partner.edition}/partners/${partner.name}`"
            v-model="partner.logoUrl"
          ></app-file-uploader>
          <md-button
            :disabled="$v.partner.name.$invalid || $v.partner.url.$invalid || $v.partner.logoUrl.$invalid"
            @click="markStepAsDoneAndGo('infos', 'administrative')"
            class="md-primary md-raised"
          >{{ $t('ACTIONS.CONTINUE') }}</md-button>
        </md-step>

        <md-step
          :md-done="doneSteps.administrative"
          :md-label="$t('PARTNERS_EDIT.ADMINISTRATIVE')"
          id="administrative"
        >
          <md-field>
            <label>{{ $t('PARTNER.SIRET') }}</label>
            <md-input name="partnerSiret" v-model.trim="partner.siret"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.ADDRESS.ROAD') }}</label>
            <md-input name="partnerAddressRoad" v-model.trim="partner.address.road"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.ADDRESS.ZIP_CODE') }}</label>
            <md-input name="partnerAddressZipCode" v-model.trim="partner.address.zipCode"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.ADDRESS.TOWN') }}</label>
            <md-input name="partnerAddressTown" v-model.trim="partner.address.town"></md-input>
          </md-field>
          <md-button
            @click="markStepAsDoneAndGo('administrative', 'contact')"
            class="md-primary md-raised"
          >{{ $t('ACTIONS.CONTINUE') }}</md-button>
        </md-step>

        <md-step :md-done="doneSteps.contact" :md-label="$t('PARTNERS_EDIT.CONTACT')" id="contact">
          <md-field>
            <label>{{ $t('PARTNER.CONTACT.NAME') }}</label>
            <md-input name="partnerContactName" v-model.trim="partner.contact.name"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.CONTACT.FUNCTION') }}</label>
            <md-input name="partnerContactFunction" v-model.trim="partner.contact.function"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.CONTACT.PHONE') }}</label>
            <md-input name="partnerContactPhone" v-model.trim="partner.contact.phone"></md-input>
          </md-field>
          <md-field>
            <label>{{ $t('PARTNER.CONTACT.EMAILS') }}</label>
            <md-input
              autocomplete="nope"
              name="mail"
              type="email"
              v-model.trim="email"
              @keypress.13="addEmail"
            ></md-input>
          </md-field>
          <ul class="emails-chips">
            <li :key="email.value" v-for="email of emails">
              <md-chip
                :class="email.invalid && 'md-invalid'"
                md-deletable
                @md-delete="deleteEmail"
              >{{ email.value }}</md-chip>
            </li>
          </ul>
          <md-button
            @click="markStepAsDoneAndGo('contact', 'options')"
            class="md-primary md-raised"
          >{{ $t('ACTIONS.CONTINUE') }}</md-button>
        </md-step>
        <md-step :md-label="$t('PARTNERS_EDIT.OPTIONS')" id="options">
          <md-field :class="$v.partner.level.$invalid ? 'md-invalid' : ''">
            <label>{{ $t('PARTNER.LEVEL') }}</label>
            <md-select name="partnerLevel" v-model="partner.level">
              <md-option
                :key="`level_${idx}`"
                :value="level"
                v-for="(level, idx) in levels"
              >{{ $t(`PACK.${level}`) }}</md-option>
            </md-select>
            <span
              class="md-error"
              v-if="!$v.partner.level.required"
            >{{ $t('PARTNERS_EDIT.ERRORS.REQUIRED') }}</span>
          </md-field>
          <md-field :class="$v.partner.activeOn.$invalid ? 'md-invalid' : ''">
            <app-datetime v-model="partner.activeOn"></app-datetime>
            <span
              class="md-error"
              v-if="!$v.partner.activeOn.required"
            >{{ $t('PARTNERS_EDIT.ERRORS.REQUIRED') }}</span>
          </md-field>
          <md-button
            :disabled="$v.partner.$invalid || isSaving"
            @click="save"
            class="md-raised md-primary"
          >{{ $t('ACTIONS.VALID') }}</md-button>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script>
import AppBack from "@/components/app-back/AppBack.vue";
import AppDatetime from "@/components/app-datetime/AppDatetime.vue";
import AppFileUploader from "@/components/app-file-uploader/AppFileUploader.vue";
import AppTitle from "@/components/app-title/AppTitle";
import EditionsService from "@/services/EditionsService";
import PartnersService from "@/services/PartnersService";
import { required } from "vuelidate/lib/validators";

const emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

export default {
  name: "PartnersEdit",
  components: { AppFileUploader, AppDatetime, AppBack, AppTitle },
  computed: {
    emails() {
      return this.partner.emails.map(email => {
        return {
          invalid: !emailRegexp.test(email),
          value: email
        };
      });
    }
  },
  data() {
    return {
      isSaving: false,
      isUpdatingMode: false,
      activeStep: "infos",
      email: "",
      doneSteps: {
        first: false,
        second: false
      },
      edition: {},
      partner: {
        activeOn: new Date(),
        address: {},
        contact: {},
        emails: []
      },
      levels: ["GOLD", "SILVER", "BRONZE", "CONTRIBUTEUR"],
      back: {
        name: "editions-dashboard",
        params: { editionId: this.$route.params.editionId }
      }
    };
  },
  validations: {
    partner: {
      name: { required },
      url: { required },
      level: { required },
      activeOn: { required },
      logoUrl: { required }
    }
  },
  beforeRouteEnter(to, from, next) {
    const promises = [
      EditionsService.findOneForCurrentUser(to.params.editionId)
    ];

    if (to.params.partnerId !== undefined) {
      promises.push(PartnersService.findOne(to.params.partnerId));
    }

    Promise.all(promises)
      .then(datas =>
        next(vm => {
          vm.edition = datas[0];

          if (datas.length === 2) {
            vm.partner = {
              ...vm.partner,
              ...datas[1]
            };
            vm.isUpdatingMode = true;
          } else {
            vm.partner.edition = to.params.editionId;
          }
        })
      )
      .catch(() => next({ name: "editions" }));
  },
  methods: {
    deleteEmail(text, index) {
      this.partner.emails.splice(index, 1);
    },
    addEmail() {
      this.partner.emails.push(this.email);
      this.email = "";
    },
    markStepAsDoneAndGo(stepDone, stepToGo) {
      this.doneSteps[stepDone] = true;
      this.activeStep = stepToGo;
    },
    save() {
      const partner = this.partner;
      this.isSaving = true;
      let promise;

      if (this.email) {
        partner.emails.push(this.email);
      }
      if (this.isUpdatingMode) {
        promise = PartnersService.update(
          this.$route.params.partnerId,
          this.partner
        );
      } else {
        promise = PartnersService.create(this.partner);
      }

      promise
        .then(() => this.$router.push(this.back))
        .catch(() => {
          this.$store.commit("notification/setNotification", {
            active: true,
            message: this.$t("PARTNERS_EDIT.ERRORS.SAVING")
          });
        })
        .finally(() => (this.isSaving = false));
    }
  }
};
</script>

<style lang="scss" scoped>
ul.emails-chips {
  list-style: none;
  padding-left: 0;

  li {
    display: inline;
    margin-right: 5px;
  }
}

.md-theme-default.md-chip.md-invalid {
  background: var(--md-theme-default-fieldvariant, #ff1744);
}
</style>

