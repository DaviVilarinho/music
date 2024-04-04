import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage, defineRule } from 'vee-validate';
import { required, min, max, alpha_spaces as alphaSpaces, email, numeric, between, confirmed } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('VeeErrorMessage', VeeErrorMessage);

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('between', between);
    defineRule('numeric', numeric);
    defineRule('confirmed', confirmed);
  }
}