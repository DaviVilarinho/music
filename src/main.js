import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import veeValidation from './includes/validation'
import './assets/tailwind.css'
import './assets/main.css'

createApp(App)
  .use(store)
  .use(veeValidation)
  .mount('#app')
