import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage, defineRule, configure } from 'vee-validate';
import { required, min, max, alpha_spaces as alphaSpaces, email, numeric, between, confirmed, not_one_of as excluded, } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('VeeErrorMessage', VeeErrorMessage);

    defineRule('required', required);
    defineRule('tos_required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('between', between);
    defineRule('numeric', numeric);
    defineRule('confirmed', confirmed);
    defineRule('passwords_match', confirmed);
    defineRule('excluded', excluded);
    defineRule('excluded_location', excluded);

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `The field ${context.field} is required.`,
          min: `The field ${context.field} is shorter than expected.`,
          max: `The field ${context.field} is longer than expected.`,
          alpha_spaces: `The field ${context.field} must contain only alphabetical characters and spaces.`,
          email: `The field ${context.field} must be a valid email.`,
          between: `The field ${context.field} is out of the expected range.`,
          excluded: `This value is not allowed for the field ${context.field}`,
          excluded_location: `Due to restrictions, this location is not allowed.`,
          passwords_match: `Passwords must match.`,
          tos_required: `You must accept the terms of service.`,
        };

        return messages[context.rule.name] ?? `The field ${context.field} is not valid.`;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    });
  }
}