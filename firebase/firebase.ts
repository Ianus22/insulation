// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA6AjLvuoXCfsJHI8mf8ln2LOasqk1Fq0k',
  authDomain: 'insulation-568c4.firebaseapp.com',
  projectId: 'insulation-568c4',
  storageBucket: 'insulation-568c4.appspot.com',
  messagingSenderId: '702561150066',
  appId: '1:702561150066:web:81d6f9a5d0ec7a74244eeb',
  measurementId: 'G-PLRKGZ4GK7'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);

export { app, auth };
