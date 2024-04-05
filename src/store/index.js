import { createStore } from 'vuex'
import { auth, db } from '@/includes/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    }
  },
  getters: {
    authModalShow: (state) => state.authModalShow
  },
  actions: {
    async register({ commit }, userForm) {
        let userCredentials = await createUserWithEmailAndPassword(auth, userForm.email, userForm.password);

        let userDocContent = Object(userForm);
        delete userDocContent.password;
        delete userDocContent.confirm_password;

        await setDoc(doc(db, "users", userCredentials.user.uid), userDocContent);
        
        commit('toggleAuth');
    }
  }
})
