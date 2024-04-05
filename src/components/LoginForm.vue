<template>
  <!-- Login Form -->
  <div
    v-if="login_show_alert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="login_alert_variant"
  >
    {{ login_alert_message }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="login"
  >
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <VeeErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        :bails="false"
        :validate-on-input="true"
        v-slot="{ field, errors }"
      >
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          placeholder="Password"
          v-bind="field"
        >
        <div
          v-for="error in errors"
          :key="error"
          class="text-red-600"
        >
          {{ error }}
        </div>
      </vee-field>
      <button
        type="submit"
        class="block mt-6 w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="login_submission"
      >
        Submit
      </button>
    </div>
  </vee-form>
</template>

<script>
const LOGGING_IN_MESSAGE = 'Logging in...';
const BG_LOGGING_IN = 'bg-blue-500';

const LOGGED_MESSAGE = 'Success! You are now authenticated!';
const BG_LOGGED = 'bg-green-500';

const NOT_LOGGED_MESSAGE = 'Error! Try to authenticate again!';
const BG_NOT_LOGGED = 'bg-red-500';

export default {
  name: 'LoginForm',
  data() {
    return {
      schema: {
        email: 'required|email',
        password: 'required|min:6|max:100',
      },
      login_submission: false,
      login_show_alert: false,
      login_alert_variant: BG_LOGGING_IN,
      login_alert_message: LOGGING_IN_MESSAGE
    }
  },
  methods: {
    async login(loginForm) {
      this.login_show_alert = true;
      this.login_submission = true;
      this.login_alert_variant = BG_LOGGING_IN;
      this.login_alert_message = LOGGING_IN_MESSAGE;

      try {
        await this.$store.dispatch('login', loginForm);
      } catch (error) {
        this.login_submission = false;
        this.login_alert_variant = BG_NOT_LOGGED;
        this.login_alert_message = NOT_LOGGED_MESSAGE;

        return;
      }

      this.login_alert_variant = BG_LOGGED;
      this.login_alert_message = LOGGED_MESSAGE;
    }
  },
}
</script>