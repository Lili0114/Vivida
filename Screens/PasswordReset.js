import React, { useState } from 'react';
import { IconButton, TextInput } from 'react-native-paper';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { auth } from '../Services/firebase';
import { updatePassword } from 'firebase/auth';
import 'firebase/firestore';

const PasswordReset = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  
  const changePasswordVisibility = () => { 
    setShowPassword(!showPassword);
  };
  const changePasswordAgainVisibility = () => { 
    setShowPasswordAgain(!showPasswordAgain);
};
 
  function AlertWindow (title, message) {
    Alert.alert(title, message, [
        {
            text: 'OK',
        }
    ]);
  };

  const validateInputs = (password, passwordAgain) => {
    if (password.trim() === '' || passwordAgain.trim() === '') {
        AlertWindow('Hiba','Jelszó nem lehet üres!');
        return false;
    }
    else if(password !== passwordAgain){
        AlertWindow('Hiba','A két jelszó nem egyezik!');
        return false;
    }
    else if(password.length < 6 || passwordAgain.length < 6){
        AlertWindow('Hiba','A jelszó legalább 6 karakter hosszú legyen!');
        return false;
    }
    return true;
  };
  
  const changePassword = () => {
    if (!validateInputs(password, passwordAgain)) {
      return;
    }
    else {
      updatePassword(auth.currentUser, password)
        .then(() => {
          AlertWindow('Siker',"Sikeres módosítás!");
        })
        .catch((error) => {
          AlertWindow('Hiba', "Valami hiba történt, kérlek próbáld meg újra.");
        });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleText}>Új jelszó megadása</Text>
        <Text style={styles.caption}>
          Jegyezd meg az új jelszavad, és ügyelj, {'\n'} 
          hogy más ne férjen hozzá!</Text>
        <View style={styles.passwordContainer}>
            <TextInput 
                label="Új jelszó"
                keyboardType='password'
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
        <View style={styles.passwordContainer}>
            <TextInput 
                label="Új jelszó megismétlése"
                textContentType='password'
                value={passwordAgain}
                onChangeText={text => setPasswordAgain(text)}
                style={styles.passwordField}
                secureTextEntry={!showPasswordAgain}
                theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                textColor='#FFF'
            />
            <IconButton
              icon={showPasswordAgain ? 'eye-off' : 'eye'}
              color="#8562AC"
              size={20}
              onPress={changePasswordAgainVisibility}
              style={styles.icon}
            />
        </View>
      </View>

      <TouchableOpacity >
        <Pressable style={styles.loginButton} onPress={() => changePassword()}>
          <Text style={styles.loginButtonText}>MENTÉS</Text>
        </Pressable>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

export default PasswordReset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0B0A0C',
    justifyContent: 'center',
    alignItems: 'center'
  },

  inputContainer:{
    margin: 15,
    width: 350,
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  titleText: {
    fontSize: 28,
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 10
  },

  caption: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    paddingBottom: 10
  },

  emailField: {
    borderColor: '#4632A1',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#0B0A0C',
    paddingHorizontal: 10
  },

  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  icon: {
    position: 'absolute',
    right: 5,
    top: 25,
  },

  passwordField: {
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#0B0A0C',
    paddingHorizontal: 10,
    width: 350
  },

  loginButton: {
    width: 350,
    margin: 4,
    padding: 20,
    backgroundColor: '#0B0A0C',
    borderWidth: 1,
    borderColor: '#C5FE37',
    borderRadius: 10
  },

  loginButtonText: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

})