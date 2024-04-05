import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import veeValidation from './includes/validation'
import {auth} from './includes/firebase'
import './assets/tailwind.css'
import './assets/main.css'

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    createApp(App)
      .use(store)
      .use(veeValidation)
      .mount('#app')
  }
});
