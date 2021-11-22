<template>
  <v-card :color="color">

    <v-card-title>
      <v-spacer></v-spacer>
      <h3 class="display-1 font-weight-light pt-3">{{ displayValue }}</h3>
    </v-card-title>

    <v-card-text>
      <v-layout
        row
        wrap
        justify-end>

        <v-flex
          v-for="btn in buttons"
          :key="btn"
          xs4
          @click="change(btn, 'add')"
          pa-1>
            <v-btn
              :color="color"
              class="headline">{{ btn }}
            </v-btn>
        </v-flex>

        <v-flex
          xs4
          @click="change"
          pa-1>
            <v-btn icon>
              <v-icon>backspace</v-icon>
            </v-btn>
        </v-flex>

      </v-layout>
    </v-card-text>

  </v-card>
</template>

<script>

import formatCurrencyMixin from '@/mixins/format-currency'

export default {
  name: 'NumericDisplay',
  props: {
    color: String,
    value: Number
  },
  mixins: [
    formatCurrencyMixin
  ],
  data () {
    return {
      buttons: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
    }
  },
  computed: {
    displayValue () {
      return this.formatCurrency(this.value || 0)
    }
  },
  methods: {
    change (btnValue, operation) {
      const currrentValue = this.value.toFixed(2)
      const total = operation === 'add'
        ? +(currrentValue + btnValue) * 10
        : +(currrentValue.slice(0, -1)) / 10

      this.$emit('input', total)
    }
  }
}
</script>
