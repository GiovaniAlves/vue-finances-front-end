<template>
  <v-toolbar color="primary">
    <v-layout align-center>

      <v-flex xs1>
        <div class="text-xs-left">
          <v-btn icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs10>
          <v-toolbar-title class="flex text-center">
            <span>Novembro 2020</span>
          </v-toolbar-title>
      </v-flex>

      <v-flex xs1>
        <div class="text-xs-right">
          <v-btn icon>
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </div>
      </v-flex>

    </v-layout>
  </v-toolbar>
</template>

<script>
export default {
  name: 'ToolbarByMonth'
}
</script>

<style scoped>

</style>
