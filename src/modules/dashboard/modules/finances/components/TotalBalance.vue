<template>
  <v-card :color="color">
    <v-card-title primary-title>
      <div class="flex text-center ma-auto">
        <p class="subheading">Saldo Atual</p>
        <h1 class="display-1"><b>{{ totalIncurrency }}</b></h1>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>

import formatCurrencyMixin from '@/mixins/format-currency'
import RecordsService from './../services/records-service'

export default {
  name: 'TotalBalance',
  mixins: [
    formatCurrencyMixin
  ],
  data () {
    return {
      total: 0
    }
  },
  computed: {
    color () {
      return this.total < 0 ? 'error' : 'primary'
    },
    totalIncurrency () {
      return this.formatCurrency(this.total)
    }
  },
  async created () {
    this.total = await RecordsService.totalBalance()
  }
}
</script>
