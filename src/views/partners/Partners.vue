<template>
  <div class="partners">
    <!-- TABLE TO LIST ALL PARTNERS -->
    <md-table v-model="partners"
              md-sort="name"
              md-sort-order="asc"
              md-card>
      <md-table-row slot="md-table-row"
                    slot-scope="{ item }">
        <md-table-cell md-label="ID"
                       md-numeric>
          {{ item.id }}
        </md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
        <md-table-cell md-label="Job Title" md-sort-by="title">{{ item.title }}</md-table-cell>
      </md-table-row>
    </md-table>

    <!-- DIALOG TO EDIT PARTNER -->
    <partner-edit :active="showEdit"
                  :partner="partnerToEdit"
                  @valid="closeEdit"
                  @cancel="closeEdit">
    </partner-edit>

    <!-- BUTTON TO ADD NEW PARTNER -->
    <md-button class="md-fab md-accent add-btn"
                @click="openEdit()">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import PartnerEdit from './components/PartnerEdit';

export default {
  name: 'partners',
  components: {PartnerEdit},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      showEdit: false,
      partners: [],
      partnerToEdit: {}
    };
  },
  created() {
    this.getPartners()
  },
  methods: {
    getPartners() {
      this.isLoading = true

      firebase.database()
        .ref('/partners')
        .once('value')
        .then(res => {
          if(res.val() !== null) {
            this.partners = res.val()
          }
          this.isLoading = false
        });
    },
    openEdit(partnerToEdit = {}) {
      this.partnerToEdit = partnerToEdit
      this.showEdit = true
    },
    closeEdit() {
      this.showEdit = false
    }
  }
}
</script>

<style scoped lang="scss">
  .partners {
    .add-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
</style>
