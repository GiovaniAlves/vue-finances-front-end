<template>
  <div>
    <RecordsList />
  </div>
</template>

<script>

import { mapActions } from 'vuex'

import RecordsList from '../components/RecordsList'
export default {
  name: 'RecordsHome',
  components: { RecordsList },
  created () {
    this.setTitle({ title: 'Lançamentos' })
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>

<style scoped>

</style>
