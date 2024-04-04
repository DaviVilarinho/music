import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage, defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('VeeErrorMessage', VeeErrorMessage)

    defineRule('required', required);
  }
}