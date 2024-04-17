import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import veeValidation from './includes/validation'
import {auth} from './includes/firebase'
import './assets/tailwind.css'
import './assets/main.css'
import icon from './directives/icon'

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(store)
      .use(veeValidation)
      .directive('icon', icon)
      .mount('#app');
  }
});
