import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


/*import { getAnalytics } from "firebase/analytics";*/

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyA0s89bEeSaWU-dFH1javH-ILzv1LUwDDU",

  authDomain: "music-baf47.firebaseapp.com",

  projectId: "music-baf47",

  storageBucket: "music-baf47.appspot.com",

  appId: "1:482674714559:web:32dc3e3184fa23e9e3a30a",

  measurementId: "G-5N0J00917C"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  storage
}

/*const analytics = getAnalytics(app); */
