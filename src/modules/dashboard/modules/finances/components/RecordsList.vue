<template>
  <div>

    <ToolbarByMonth class="mb-2" />

    <v-card>

      <v-list two-line subheader>
        <template v-for="(groupedRec, dateKey, index) in groupedRecords">
          <v-subheader :key="dateKey">{{ dateKey }}</v-subheader>
          <RecordsListItem
            v-for="record in groupedRec"
            :key="record.id"
            :record="record"/>
          <v-divider :key="`${dateKey}-${index}`" v-if="showDivider(index, groupedRecords)"></v-divider>
        </template>
      </v-list>

      <v-footer class="pa-2">
        <v-flex flex text-right>
          <h5 class="font-weight-light">
            <span>Saldo do mês</span>
            <strong class="ml-5" :class="amountColor(totalAmount)">{{ formatCurrency(totalAmount) }}</strong>
          </h5>
        </v-flex>
      </v-footer>
    </v-card>

  </div>
</template>

<script>

import { groupBy } from '@/utils'

import amountColorMixin from './../mixins/amount-color'
import formatCurrencyMixin from '@/mixins/format-currency'

import moment from 'moment'
import RecordsListItem from './RecordsListItem'
import RecordsService from './../services/records-service'
import ToolbarByMonth from './ToolbarByMonth'

export default {
  name: 'RecordsList',
  components: { ToolbarByMonth, RecordsListItem },
  mixins: [
    amountColorMixin,
    formatCurrencyMixin
  ],
  data () {
    return {
      records: []
    }
  },
  computed: {
    groupedRecords () {
      return groupBy(this.records, 'date', (record, datekey) => {
        return moment(record[datekey]).format('DD/MM/YYYY')
      })
    },
    totalAmount () {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    }
  },
  async created () {
    this.records = await RecordsService.records()
  },
  methods: {
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    }
  }
}
</script>

<style scoped>

</style>
