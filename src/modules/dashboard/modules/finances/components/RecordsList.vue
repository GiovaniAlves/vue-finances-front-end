<template>
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
</template>

<script>

import { groupBy } from '@/utils'
import moment from 'moment'
import RecordsListItem from './RecordsListItem'
import RecordsService from './../services/records-service'

export default {
  name: 'RecordsList',
  components: { RecordsListItem },
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
