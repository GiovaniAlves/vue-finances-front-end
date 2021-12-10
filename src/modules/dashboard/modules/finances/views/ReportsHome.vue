<template>
  <v-layout
    row
    wrap>

    <v-flex
      sx12
      sm12
      md12>
      <ToolbarByMonth
        format="MM-YYYY"
        color="primary"
        :month="month || $route.query.month"
        @month="changeMonth"/>
    </v-flex>

    <v-flex
      v-for="chart in charts"
      :key="chart.title"
      xs12
      sm12
      md6
      lg6
      xl6>
      <v-card>
        <v-card-text>
          <h2 class="font-weight-light mb-4">{{ chart.title }}</h2>
          <canvas :ref="chart.refId"> </canvas>
        </v-card-text>
      </v-card>
    </v-flex>

  </v-layout>
</template>

<script>

import Chart from 'chart.js'
import colors from 'vuetify/es5/util/colors'
import { mapActions, mapState } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { generateChartConfigs } from '@/utils'
import RecordsService from '../services/records-service'
import ToolbarByMonth from '../components/ToolbarByMonth'

export default {
  name: 'ReportsHome',
  components: { ToolbarByMonth },
  data () {
    return {
      chartIncomesExpenses: undefined,
      chartCategoryExpenses: undefined,
      charts: [
        { title: 'Receita vs Despesas', refId: 'chartIncomesExpenses' },
        { title: 'Despesas por Categoria', refId: 'chartCategoryExpenses' }
      ],
      monthSubject$: new Subject(),
      records: [],
      subscriptions: []
    }
  },
  computed: {
    ...mapState('finances', ['month'])
  },
  created () {
    this.setTitle({ title: 'Relatórios' })
    this.setRecords()
  },
  destroyed () {
    this.subscriptions.forEach(subscriptions => subscriptions.unsubscribe())
  },
  methods: {
    ...mapActions(['setTitle']),
    ...mapActions('finances', ['setMonth']),
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month }
      }).catch(() => {})

      this.setMonth({ month })
      this.monthSubject$.next(month)
    },
    createOrUpdateChart (refIdChart, options) {
      if (this[refIdChart]) { // Se algum dos charts não for mais undefined entra no IF
        this[refIdChart].data.datasets = options.data.datasets

        if (options.data.labels) {
          this[refIdChart].data.labels = options.data.labels
        }
        this[refIdChart].update()
        return this[refIdChart] // Faço o retono para parar a execução no caso de uma atualização
      }

      const ref = Array.isArray(this.$refs[refIdChart])
        ? this.$refs[refIdChart][0]
        : this.$refs[refIdChart]

      const context = ref.getContext('2d')
      this[refIdChart] = new Chart(context, options)
      return this[refIdChart] // retorno opcional
    },
    setCharts () {
      // Receitas e despesas - chartIncomesExpenses
      this.createOrUpdateChart('chartIncomesExpenses', generateChartConfigs({
        type: 'bar',
        items: this.records,
        keyToGroup: 'type', // DEBIT OR CREDIT
        keyOfValue: 'amount',
        aliases: { CREDIT: 'Receitas', DEBIT: 'Despesas' },
        backgroundColors: [
          colors.pink.darken2,
          colors.teal.darken1
        ]
      }))

      // Despesas por categoria - chartCategoryExpenses
      this.createOrUpdateChart('chartCategoryExpenses', generateChartConfigs({
        type: 'doughnut',
        items: this.records.filter(record => record.type === 'DEBIT'),
        keyToGroup: 'category.description', // Aqui uso o idx
        keyOfValue: 'amount',
        backgroundColors: [
          colors.blue,
          colors.teal.lighten1,
          colors.purple.darken2,
          colors.purple.darken1
        ]
      }))
    },
    setRecords () {
      this.subscriptions.push(
        this.monthSubject$
          .pipe(
            mergeMap(month => (RecordsService.records({ month })))
          ).subscribe(records => {
            this.records = records
            this.setCharts()
          })
      )
    }
  }
}
</script>
