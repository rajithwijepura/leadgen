import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDgng8CcKazfgCnNxcxL2wPXXP3KDpCR28",
  authDomain: "ringed-reach-673.firebaseapp.com",
  databaseURL: "https://ringed-reach-673.firebaseio.com",
  projectId: "ringed-reach-673",
  storageBucket: "ringed-reach-673.firebasestorage.app",
  messagingSenderId: "819715151882",
  appId: "1:819715151882:web:e2939130efc3165055e7f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
