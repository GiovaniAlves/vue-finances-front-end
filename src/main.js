import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { errorHandler } from '@/utils'
import moment from '@/plugins/moment'
import vuetify from '@/plugins/vuetify'
import vuelidate from '@/plugins/vuelidate'

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

new Vue({
  router,
  store,
  vuetify,
  vuelidate,
  moment,
  render: h => h(App)
}).$mount('#app')
