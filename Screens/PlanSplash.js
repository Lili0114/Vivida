import { View, Text, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React from 'react';

const PlanSplash = ({navigation}) => {

    return (
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.inputContainer}>
              <Text style={styles.welcomeText}>Szuper döntés, hogy edzéstervet szeretnél választani!</Text>
              <Text style={styles.caption}>
                Tekintsd meg a kategóriákra bontott{'\n'} 
                feladatainkat, és találd meg a számodra{'\n'}
                legideálisabbat!</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity>
                  <Pressable style={styles.button} onPress={() => navigation.navigate('Plans')}>
                      <Text style={styles.buttonText}>MEGTEKINTEM</Text>
                  </Pressable>
              </TouchableOpacity>
              <TouchableOpacity>
                  <Pressable style={styles.button} onPress={() => navigation.navigate('HomePage')}>
                      <Text style={styles.buttonText}>MÉG VÁROK VELE</Text>
                  </Pressable>
              </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    )
}

export default PlanSplash

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