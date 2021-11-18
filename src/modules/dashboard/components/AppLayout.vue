<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer"  />

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>

    <AppFloatActionButton />

  </div>
</template>

<script>
import AppToolbar from './AppToolbar'
import AppMenu from './AppMenu'
import AppFloatActionButton from './AppFloatActionButton'

export default {
  name: 'AppLayout',
  components: {
    AppFloatActionButton,
    AppMenu,
    AppToolbar
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style scoped>

</style>
