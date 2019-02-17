<template>
    <datetime :disabled="disabled"
              :max-datetime="max"
              :min-datetime="min"
              :type="mode"
              :value="value.toISOString()"
              @input="emit"
              input-class="md-input app-datetime"
              input-id="date">
        <label for="date"
               slot="before">
            <slot name="label"></slot>
        </label>
        <span class="description"
              slot="after">
            <slot name="description"></slot>
        </span>
        <template slot="button-cancel">
            <md-button>{{ $t('ACTIONS.CANCEL') }}</md-button>
        </template>
        <template slot="button-confirm">
            <md-button class="md-primary md-raised">{{ $t('ACTIONS.VALID') }}</md-button>
        </template>
    </datetime>
</template>

<script>
export default {
  name: 'AppDatetime',
  props: {
    value: {
      type: Date,
      default: () => new Date(),
    },
    min: {
      type: Date,
      default: null,
    },
    max: {
      type: Date,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'datetime',
    },
  },
  methods: {
    emit($event) {
      this.$emit('input', new Date($event));
    },
  },
};
</script>

<style lang="scss">
.vdatetime-overlay,
.vdatetime-popup {
    z-index: 10;
}

.vdatetime-popup__header {
    background-color: var(--md-theme-default-primary);
}

.vdatetime-popup__actions__button {
    color: var(--md-theme-default-primary);
}

.vdatetime-calendar__month__day--selected > span > span,
.vdatetime-calendar__month__day--selected:hover > span > span {
    background-color: var(--md-theme-default-accent);
}

.vdatetime-popup__actions {
    display: flex;
    justify-content: flex-end;
}

.vdatetime-popup__actions__button {
    padding: 0;
}
</style>

