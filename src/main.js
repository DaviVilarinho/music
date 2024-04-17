import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import veeValidation from './includes/validation'
import {auth} from './includes/firebase'
import './assets/tailwind.css'
import './assets/main.css'
import icon from './directives/icon'
import i18n from './i18n'

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(i18n)
      .use(router)
      .use(store)
      .use(veeValidation)
      .directive('icon', icon)
      .mount('#app');
  }
});
