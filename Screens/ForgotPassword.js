import { View, Text, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../Services/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://vivida-57f19.firebaseapp.com/reset-password', // This should be a Dynamic Link
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.vivida.ios'
      },
      android: {
        packageName: 'com.vivida.android',
        installApp: true,
        minimumVersion: '12'
      }
    };

    const sendEmail = (e) => {
        sendPasswordResetEmail(auth, email, actionCodeSettings)
            .then(() => {
              Alert.alert("Siker", "Email elküldve!", [
                {
                    text: 'OK',
                }
              ]);
            })
            .catch((error) => {
              Alert.alert("Hiba", `Az emailt nem sikerült elküldeni. ${error}`, [
                {
                    text: 'OK',
                }
              ]);
            })
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.topContainer}>
            <MaterialCommunityIcons 
              name='form-textbox-password'
              size={50}
              color={'#FFF'}/>
          </View>
          <View style={styles.inputContainer}>
              <Text style={styles.welcomeText}>Elfelejtetted a jelszavad?</Text>
              <Text style={styles.caption}>
                Add meg a regisztrációnál használt {'\n'} 
                email címedet, és segítünk neked!</Text>
              <TextInput
                    label="Email cím"
                    keyboardType='email-address'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.emailField}
                    theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                    textColor='#FFF'
              />
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity>
                  <Pressable style={styles.button} onPress={sendEmail}>
                      <Text style={styles.buttonText}>KÜLDÉS</Text>
                  </Pressable>
              </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0B0A0C'
  },

  topContainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20
  },

  inputContainer:{
    margin: 15,
    width: 350,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10
  },

  welcomeText: {
    fontSize: 28,
    color: '#FFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 10
  },

  caption: {
    fontSize: 18,
    color: '#958CAB',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    paddingBottom: 10
  },

  emailField: {
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#0B0A0C',
    paddingHorizontal: 10
  },

  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  button: {
    width: 350,
    margin: 4,
    padding: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10
  },

  buttonText: {
    fontSize: 15,
    color: '#958CAB',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

})