<template>
  <div>

    <TotalBalance class="mb-2" />

    <ToolbarByMonth
      class="mb-2"
      format="MM-YYYY"
      @month="changeMonth"
      :month="$route.query.month"/>

    <v-card>

      <v-card-text
        class="flex text-center"
        v-if="groupedRecordsLenght === 0">
          <v-icon
            size="100"
            color="grey">
              assignment
          </v-icon>
          <p class="font-weight-light subheading grey-text">
            Nenhum lançamento no período.
          </p>
      </v-card-text>

      <v-list
        two-line
        subheader
        v-else>
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
import { mergeMap } from 'rxjs/operators'
import { Subject } from 'rxjs'

import moment from 'moment'
import RecordsListItem from './RecordsListItem'
import RecordsService from './../services/records-service'
import ToolbarByMonth from './ToolbarByMonth'
import TotalBalance from './TotalBalance'

export default {
  name: 'RecordsList',
  components: { TotalBalance, ToolbarByMonth, RecordsListItem },
  mixins: [
    amountColorMixin,
    formatCurrencyMixin
  ],
  data () {
    return {
      records: [],
      monthSubject$: new Subject() // É um tipo de observable do rxjs, e a partir dele podemos emitir eventos
    }
  },
  computed: {
    groupedRecords () {
      return groupBy(this.records, 'date', (record, datekey) => {
        return moment(record[datekey]).format('DD/MM/YYYY')
      })
    },
    groupedRecordsLenght () {
      return Object.keys(this.groupedRecords).length
    },
    totalAmount () {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    }
  },
  created () {
    this.setRecords()
  },
  methods: {
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month }
      }).catch(() => {})
      this.monthSubject$.next({ month })
    },
    setRecords (month) {
      console.log('Subscribing...')

      this.monthSubject$
        .pipe(
          mergeMap(variables => RecordsService.records(variables))
        ).subscribe(records => (this.records = records))
    },
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    }
  }
}
</script>

<style scoped>

</style>
