import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import type { App } from 'vue';

export default (app: App) => {

  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })

}

