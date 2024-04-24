import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQVpGsmqRuq1sf2lL_Tup_cU_JE0ig4Q8",
  authDomain: "vivida-57f19.firebaseapp.com",
  projectId: "vivida-57f19",
  storageBucket: "vivida-57f19.appspot.com",
  messagingSenderId: "416030693399",
  appId: "1:416030693399:web:326a80230893ce1ce26452",
  measurementId: "G-T0DWV30SV3"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

export const storage = getStorage(app);