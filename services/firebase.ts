// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyDaaFPnoKctYeVyGeVjFg_bVpV_2TpEiUw',
  authDomain: 'insulation-4b1dd.firebaseapp.com',
  databaseURL: 'https://insulation-4b1dd-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'insulation-4b1dd',
  storageBucket: 'insulation-4b1dd.appspot.com',
  messagingSenderId: '700829483614',
  appId: '1:700829483614:web:544e9ec8fd607703e8aacf',
  measurementId: 'G-4TRKTTD75Q'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const database = getDatabase(app);

// Sign up
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = async (router: any) => {
  try {
    router.push('/');
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export { app as firebaseApp, database };
