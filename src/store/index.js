import { createStore } from 'vuex'
import { auth, db } from '@/includes/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"; 

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    songs: {}
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    changeSong: (state, {i: docID, modified_name, genre}) => {
      state.songs[docID].modified_name = modified_name;
      state.songs[docID].genre = genre;
    },
    setSongs: (state, { newSongs }) => { state.songs = newSongs; }
  },
  getters: {
    authModalShow: (state) => state.authModalShow,
  },
  actions: {
    async querySongsByUser({ commit }) {
      const snapshots = await getDocs(
        query(collection(db, "songs"), where('uid', '==', auth.currentUser.uid)));

      const newSongs = {};
      snapshots.forEach(snapshot => {
        newSongs[snapshot.id] = {
          ...snapshot.data(),
          docID: snapshot.id
        }
      });
      console.log('query found ', newSongs);

      commit('setSongs', { newSongs: newSongs } );
    },
    async register({ commit }, userForm) {
        let userCredentials = await createUserWithEmailAndPassword(auth, userForm.email, userForm.password);

        let userDocContent = Object(userForm);
        delete userDocContent.password;
        delete userDocContent.confirm_password;

        await setDoc(doc(db, "users", userCredentials.user.uid), userDocContent);
        
        commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },
    async login({ commit }, loginForm) {
      await signInWithEmailAndPassword(auth, loginForm?.email ?? '', loginForm?.password ?? '');

      commit('toggleAuth');
    },
    async logout({ commit }, { router, route }) {
      const user = auth.currentUser;
      if (user) {
        await signOut(auth);

        commit('toggleAuth');
        
        if (route.meta?.requiresAuth) {
          router.push({ name: 'home' });
        }
      }
    },
  }
})
