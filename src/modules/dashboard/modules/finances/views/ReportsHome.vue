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
import { mapActions, mapState } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import RecordsService from '../services/records-service'
import ToolbarByMonth from '../components/ToolbarByMonth'

export default {
  name: 'ReportsHome',
  components: { ToolbarByMonth },
  data () {
    return {
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
    setCharts () {
      const context = this.$refs.chartIncomesExpenses[0].getContext('2d')
      const myChart = new Chart(context, {
        type: 'bar',
        data: {
          datasets: [
            {
              data: [500],
              label: 'Receitas',
              backgroundColor: [
                'blue'
              ]
            },
            {
              data: [250],
              label: 'Despesas',
              backgroundColor: [
                'red'
              ]
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })

      console.log(myChart)
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
