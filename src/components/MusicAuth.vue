<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="{ hidden: !authModalShow }"
    id="modal"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">
              Your Account
            </p>
            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click.prevent="toggleAuthModal"
            >
              <i class="fas fa-times" />
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login',
                  'hover:text-blue-600': tab === 'register',
                }"
                href="#"
                @click.prevent="tab = 'login'"
              >Login</a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'register',
                  'hover:text-blue-600': tab === 'login',
                }"
                href="#"
                @click.prevent="tab = 'register'"
              >Register</a>
            </li>
          </ul>
          <login-form v-if="tab === 'login'" />
          <!-- Registration Form -->
          <div
            v-if="reg_show_alert"
            class="text-white text-center font-bold p-5 mb-4"
            :class="reg_alert_variant"
          >
            {{ reg_alert_message }}
          </div>
          <vee-form
            v-show="tab === 'register'"
            :validation-schema="schema"
            @submit="register"
            :initial-values="userData"
            v-if="tab === 'register'"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import LoginForm from './LoginForm.vue';

const CREATING_MESSAGE = 'Your account is being created';
const BG_CREATING = 'bg-blue-500';

const CREATED_MESSAGE = 'Success! Your account has been created.';
const BG_CREATED = 'bg-green-500';

export default {
  name: 'MusicAuth',
  data() {
    return {
      tab: 'login',
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|numeric|between:12,150',
        password: 'required|min:3|max:100',
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
    ...mapMutations(['toggleAuthModal']),
    register(registrationForm) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = BG_CREATING;
      this.reg_alert_message = CREATING_MESSAGE;

      console.log(registrationForm);
      this.reg_alert_variant = BG_CREATED;
      this.reg_alert_message = CREATED_MESSAGE;
    }
  },
  computed: {
    ...mapGetters(['authModalShow'])
  },
  components: {
    LoginForm
  }
}
</script>