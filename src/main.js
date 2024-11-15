import '@/style/index.css'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTreeview } from 'vuetify/labs/VTreeview'

const vuetify = createVuetify({
  components: {
    components,
    VTreeview
  },
  directives
})

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import router from './router'

import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)

app.use(vuetify)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
