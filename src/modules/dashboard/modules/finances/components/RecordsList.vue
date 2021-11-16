<template>
  <v-list two-line>
    <RecordsListItem
      v-for="record in records"
      :key="record.id"
      :record="record"/>
  </v-list>
</template>

<script>

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
  async created () {
    this.records = await RecordsService.records()
  }
}
</script>

<style scoped>

</style>
