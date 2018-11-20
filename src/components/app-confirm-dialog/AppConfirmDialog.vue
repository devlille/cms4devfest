<template>
  <md-dialog-confirm class="app-confirm-dialog"
                     :md-active.sync="confirmDialog.active"
                     :md-title="$t('CONFIRM_DIALOG.LABEL')"
                     :md-confirm-text="$t('ACTIONS.VALID')"
                     :md-cancel-text="$t('ACTIONS.CANCEL')"
                     @md-cancel="close"
                     @md-confirm="confirmDialog.action" />
</template>

<script>
  export default {
    name: 'AppConfirmDialog',
    computed: {
      confirmDialog() {
        return this.$store.state.confirmDialog;
      },
    },
    methods: {
      close() {
        this.$store.commit('confirm-dialog/setConfirmDialog', { active: false });
      }
    }
  }
</script>
