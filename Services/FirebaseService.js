import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASMlMI0gYfhD5fffYtv6fe2zU312RVcBM",
  authDomain: "vivida-bbab5.firebaseapp.com",
  projectId: "vivida-bbab5",
  storageBucket: "vivida-bbab5.appspot.com",
  messagingSenderId: "190460052739",
  appId: "1:190460052739:web:42bfbb2907d144b4701536",
  measurementId: "G-LGTB90Q8W6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//export default firebase;
