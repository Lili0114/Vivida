import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const AlertWindow = (error) => {
    Alert.alert("Hiba", error, [
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

  /*const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        //const { uid, email } = userCredential.user;
        //saveUserData(uid, email);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }).catch((error) => {
        console.log(error);
        AlertWindow(error);
      });
  }*/


  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={'#B7B7B7'}
          value={email}
          onChangeText={text => setEmail(text)}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.inputTop}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={'#B7B7B7'}
          value={password}
          onChangeText={text => setPassword(text)}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.inputBottom}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Pressable style={styles.loginButton} onPress={() => navigation.navigate('Home')} /*onPress={signIn}*/>
            <Text style={styles.loginButtonText}>BEJELENTKEZÉS</Text>
          </Pressable>
        </TouchableOpacity>
        <TouchableOpacity>
          <Pressable style={styles.passwordForgotButton} /*onPress={() => navigation.navigate('ForgotPassword')}*/>
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
    //height: 500,
    margin: 15,
    width: 350,
    //flex: 1,
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
    color: '#BBBBBB'
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
    width: 350,
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
    width: 350,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#6D6D6D'
  }
})