import React, { useState } from 'react';
import { IconButton, TextInput } from 'react-native-paper';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { auth, db } from '../Services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";
import { AlertWindow } from './Alert';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const changePasswordVisibility = () => { 
      setShowPassword(!showPassword);
  };

  const validateInputs = (email, password) => {
    if (email.trim() === '') {
        AlertWindow('Hiba','Email cím nem lehet üres!');
        return false;
    }
    else if(password.trim() === ''){
        AlertWindow('Hiba','Jelszó nem lehet üres!');
        return false;
    }
    else if(!email.includes('@')){
        AlertWindow('Hiba','Nem megfelelő az email cím!');
        return false;
    }

    return true;
  };
  
  const signIn = async (email, password) => {

    if (!validateInputs(email, password)) {
      return;
    }
    else{
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDoc);
        
        if (userDocSnapshot.exists()) {
          navigation.navigate('HomePage');
        } else {
          navigation.navigate('AfterRegister');
        }

        return user;
      } catch (error) {
        AlertWindow('Hiba',`A bejelentkezés nem sikerült. Kérjük, ellenőrizze, hogy az adatok helyesek-e.`);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.appName}>Vivida</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.welcomeText}>Üdv újra itt!</Text>
        <View style={styles.field}>
          <TextInput 
                accessibilityLabel='Email'
                label="Email cím"
                textContentType='emailAddress'
                value={email} 
                onChangeText={text => setEmail(text)}
                keyboardType='email-address'
                style={[styles.fieldInside]}
                theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                textColor='#FFF'
          />
        </View>
        <View style={styles.field}>
          <View style={styles.passwordContainer}>
              <TextInput 
                accessibilityLabel='Jelszó'
                label="Jelszó"
                textContentType='password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.passwordField}
                secureTextEntry={!showPassword}
                theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                textColor='#FFF'
              />
              <IconButton
                icon={showPassword ? 'eye-off' : 'eye'}
                color="#8562AC"
                size={20}
                onPress={changePasswordVisibility}
                style={styles.icon}
              />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Pressable accessibilityLabel='Login' style={styles.loginButton} onPress={() => signIn(email,password)}>
            <Text style={styles.loginButtonText}>FOLYTATOM A FEJLŐDÉST</Text>
          </Pressable>
        </TouchableOpacity>
        <TouchableOpacity>
          <Pressable style={styles.passwordForgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.passwordForgotButtonText}>Elfelejtetted a jelszavad?</Text>
          </Pressable>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}></View>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0B0A0C'
  },

  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  appName: {
    fontSize: 42,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 30
  },

  inputContainer:{
    margin: 15,
    width: 350,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  welcomeText: {
    fontSize: 28,
    color: '#FFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 10
  },

  field: {
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#0B0A0C',
    paddingHorizontal: 10
  },

  fieldInside: { 
    backgroundColor: '#0B0A0C', 
    paddingHorizontal: 5
  },

  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  icon: {
    position: 'absolute',
    right: 1,
    top: 5,
  },

  passwordField: {
    backgroundColor: '#0B0A0C',
    width: 340,
    paddingHorizontal: 10
  },

  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  loginButton: {
    width: 350,
    margin: 4,
    padding: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10
  },

  loginButtonText: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  passwordForgotButton: {
    width: 300,
    margin: 4,
    padding: 13,
    justifyContent: 'center', 
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  passwordForgotButtonText: {
    fontSize: 14,
    color: '#958CAB',
    textAlign: 'center'
  },

  bottomContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },

  bottomText: {
    width: 300,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#958CAB'
  },

})