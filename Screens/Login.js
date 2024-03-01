import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import auth from '@react-native-firebase/auth';
//import { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import { auth, db } from '../Services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'firebase/firestore';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const changePasswordVisibility = () => { 
      setShowPassword(!showPassword);
  };

  const AlertWindow = (error) => {
    Alert.alert("Error", error, [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
        },
    ]);
  }

  /*async function FacebookSignIn() {
    let cred = await onFacebookButtonPress();
    console.log("cred: ", cred);
  }
  
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }
  <View>
      <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log('Facebook login error:', error);
          } else if (result.isCancelled) {
            console.log('Facebook login cancelled.');
          } else {
            FacebookSignIn();
          }
        }}
        onLogoutFinished={() => console.log('Facebook logout finished.')}
      />
      </View>
  
  */
  
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Sikeres bejelentkezés:', user.email);
      navigation.navigate('HomePage');
      return user;
    } catch (error) {
      console.error('Bejelentkezési hiba:', error.message);
      throw error;
    }
  };

  const handleFacebookLogin = () => {
    signInWithFacebook();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          textContentType='emailAddress'
          placeholder="Email"
          placeholderTextColor={'#B7B7B7'}
          value={email}
          onChangeText={text => setEmail(text)}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.inputTop}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            textContentType='password'
            placeholder="Password"
            placeholderTextColor={'#B7B7B7'}
            value={password}
            onChangeText={text => setPassword(text)}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputBottom}
            secureTextEntry={!showPassword}
          />
          <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              color="#8562AC"
              size={20}
              onPress={changePasswordVisibility}
              style={styles.iconContainer}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Pressable style={styles.loginButton} onPress={() => signIn(email,password)}>
            <Text style={styles.loginButtonText}>BEJELENTKEZÉS</Text>
          </Pressable>
        </TouchableOpacity>
        <TouchableOpacity>
          <Pressable style={styles.passwordForgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.passwordForgotButtonText}>ELFELEJTETTEM A JELSZAVAM</Text>
          </Pressable>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>A Vivida-ba való bejelentkezéssel elfogadod a Használati feltételeinket és az Adatvédelmi nyilatkozatunkat.</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  inputContainer: {
    margin: 15,
    width: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#C9C9C9',
    borderRadius: 7
  },

  inputTop: {
    borderWidth: 1,
    borderColor: '#C9C9C9',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    padding: 13,
    fontSize: 17,
    color: '#818181'
  },

  inputBottom: {
    borderWidth: 1,
    borderColor: '#C9C9C9',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    padding: 13,
    fontSize: 17,
    color: '#BBBBBB',
    paddingRight: 210,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    paddingLeft: 5,
  },

  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  loginButton: {
    width: 300,
    margin: 4,
    padding: 13,
    backgroundColor: '#E4E4E4',
    borderRadius: 7
  },

  loginButtonText: {
    fontSize: 18,
    color: '#818181',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  passwordForgotButton: {
    width: 300,
    margin: 4,
    padding: 13,
    //backgroundColor: '#E4E4E4',
    //borderRadius: 7
  },

  passwordForgotButtonText: {
    fontSize: 18,
    color: '#8562AC',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  bottomContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },

  logoStyle: {
    width: 150,
    height: 150,
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  bottomText: {
    width: 300,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#6D6D6D'
  }
})