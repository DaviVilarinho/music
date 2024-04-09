import { createStore } from 'vuex'
import { auth, db, storage } from '@/includes/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore"; 
import { deleteObject, ref } from 'firebase/storage';

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
    addSong: (state, {docID , song}) => {
      state.songs[docID] = song;
    },
    setSongs: (state, { newSongs }) => { state.songs = newSongs; },
    delSong: (state, { docID }) => { delete state.songs[docID] }
  },
  getters: {
    authModalShow: (state) => state.authModalShow,
    songs: (state) => state.songs
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

      commit('setSongs', { newSongs: newSongs } );
    },
    async deleteSongById({ commit, getters }, { docID }) {
      await deleteObject(ref(storage, `songs/${getters.songs[docID]['original_name']}`));
      await deleteDoc(doc(db, `songs/${docID}` ));
      commit('delSong', { docID: docID });
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
