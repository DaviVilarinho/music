<template>
  <div
    v-if="reg_show_alert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="reg_alert_variant"
  >
    {{ reg_alert_message }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <VeeErrorMessage
        class="text-red-600"
        name="name"
      />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :validate-on-input="true"
      />
      <VeeErrorMessage
        class="text-red-600"
        name="age"
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
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :validate-on-input="true"
        placeholder="Confirm Password"
      />
      <VeeErrorMessage
        class="text-red-600"
        name="confirm_password"
      />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">
          USA
        </option>
        <option value="Mexico">
          Mexico
        </option>
        <option value="Germany">
          Germany
        </option>
        <option value="Antartica">
          Antartica
        </option>
      </vee-field>
      <VeeErrorMessage
        class="text-red-600"
        name="country"
      />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        value="1"
      />
      <label class="inline-block">Accept terms of service</label>
      <br>
      <VeeErrorMessage
        class="text-red-600"
        name="tos"
      />
    </div>
    <button
      type="submit"
      :disabled="reg_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { auth, db } from '@/includes/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

const CREATING_MESSAGE = 'Your account is being created';
const BG_CREATING = 'bg-blue-500';

const CREATED_MESSAGE = 'Success! Your account has been created.';
const BG_CREATED = 'bg-green-500';

const NOT_CREATED_MESSAGE = 'An error occured... Try submitting later!';
const BG_NOT_CREATED = 'bg-red-500';

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|numeric|between:12,150',
        password: 'required|min:6|max:100',
        confirm_password: 'required|passwords_match:@password',
        country: 'required|excluded_location:Antartica',
        tos: 'tos_required'
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: BG_CREATING,
      reg_alert_message: CREATING_MESSAGE
    }
  },
  methods: {
    async register(registrationForm) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = BG_CREATING;
      this.reg_alert_message = CREATING_MESSAGE;

      let userCredentials;
      try {
        userCredentials = await createUserWithEmailAndPassword(auth, registrationForm.email, registrationForm.password);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = BG_NOT_CREATED;
        this.reg_alert_message = NOT_CREATED_MESSAGE;
        return;
      }

      // skips the "Unused variable" warning
      let userDocContent = Object(registrationForm);
      delete userDocContent.password;
      delete userDocContent.confirm_password;

      await setDoc(doc(db, "users", userCredentials.user.uid), userDocContent);

      this.reg_alert_variant = BG_CREATED;
      this.reg_alert_message = CREATED_MESSAGE;
    }
  },
}
</script>