/*import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import firebase from './FirebaseService';

const initializeAuthentication = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in:', user.uid);
    } else {
      console.log('User is signed out');
    }
  });
};

const signUpWithEmailAndPassword = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    console.log('User registered successfully');
  } catch (error) {
    console.error('Error during registration:', error);
  }
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    console.log('User signed in successfully');
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        // A felhasználó megszakította a bejelentkezést
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        console.error('Nem sikerült elérni az access tokent.');
        return;
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      await firebase.auth().signInWithCredential(facebookCredential);
      console.log('Bejelentkezés sikeres Facebookkal.');
    } catch (error) {
      console.error('Hiba a Facebook bejelentkezés során:', error);
    }
};

const signInWithGoogle = () => {
    const handleGoogleSignIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
  
        const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
        await firebase.auth().signInWithCredential(googleCredential);
  
        console.log('Bejelentkezés sikeres Google-fel.');
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('A felhasználó megszakította a bejelentkezést');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('A bejelentkezés már folyamatban van');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('A Google Play Services nem érhető el vagy elavult');
        } else {
          console.error('Hiba a Google bejelentkezés során:', error);
        }
      }
    }
};

export { initializeAuthentication, signUpWithEmailAndPassword, signInWithEmailAndPassword, signInWithFacebook, signInWithGoogle };*/
