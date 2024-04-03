import React, { useState, useEffect } from 'react';
import { IconButton, TextInput } from 'react-native-paper';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert, Linking } from 'react-native';
import { auth } from '../Services/firebase';
import { updatePassword, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';

const linking = {
    prefixes: ['vivida-57f19.firebaseapp://', 'https://vivida-57f19.firebaseapp.com'],
    config: {
      screens: {
        PasswordReset: 'reset-password/:oobCode',
      },
    },
  };

const PasswordReset = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  useEffect(() => {
    //const code = new URLSearchParams(useLocation().search).get('oobCode');
    const code = route.params.oobCode;
    Linking.getInitialURL().then(url => {
        code = new URL(url).searchParams.get('oobCode');
    });

    verifyPasswordResetCode(auth, code)
      .then((email) => {
        console.log("siker juhé");
      })
      .catch((error) => {
        console.log("nem jó");
      });
  }, []);
  
  const changePasswordVisibility = () => { 
      setShowPassword(!showPassword);
  };
  const changePasswordAgainVisibility = () => { 
    setShowPasswordAgain(!showPasswordAgain);
};
 
  function AlertWindow (message) {
    Alert.alert("Hiba", message, [
        {
            text: 'OK',
        }
    ]);
  };

  const validateInputs = (password, passwordAgain) => {
    if (password.trim() === '' || passwordAgain.trim() === '') {
        AlertWindow('Jelszó nem lehet üres!');
        return false;
    }
    else if(password !== passwordAgain){
        AlertWindow('A két jelszó nem egyezik!');
        return false;
    }
    else if(password.length < 6 || passwordAgain.length < 6){
        AlertWindow('Hiba','A jelszó legalább 6 karakter hosszú legyen!');
        return false;
    }
    return true;
  };
  
  const changePassword = () => {
    if (validateInputs(password, passwordAgain)) {
        const code = route.params.oobCode;

        confirmPasswordReset(auth, code, password)
        .then(() => {
          AlertWindow("Sikerrr");
          //navigation.navigate('Login');
        })
        .catch((error) => {
          AlertWindow("aaaa");
        });

        /*updatePassword(user, password)
            .then(() => {
            AlertWindow("Sikerrr");
            //navigation.navigate('Login');
            })*/
    }
    else{
        AlertWindow("Nem sikerült a jelszó megváltoztatása.");
    }
  }

  return (
    <NavigationContainer linking={linking}>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Pressable style={styles.loginButton} onPress={() => changePassword()}>
            <Text style={styles.loginButtonText}>MENTÉS</Text>
          </Pressable>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </NavigationContainer>
  )
}

export default PasswordReset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
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
    color: '#818181',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 10
  },

  caption: {
    fontSize: 18,
    color: '#818181',
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
    backgroundColor: '#E4E4E4',
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
    borderColor: '#4632A1',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#E4E4E4',
    width: 350,
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
    backgroundColor: '#E4E4E4',
    borderRadius: 10
  },

  loginButtonText: {
    fontSize: 15,
    color: '#818181',
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
    color: '#8562AC',
    textAlign: 'center'
  },

})