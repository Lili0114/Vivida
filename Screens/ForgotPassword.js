import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Pressable, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../Services/firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const sendEmail = (e) => {
        //console.log('woohoo');
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Email küldve woohoo');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.inputTop}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.loginButton} onPress={sendEmail}>
                        <Text style={styles.loginButtonText}>KÜLDÉS</Text>
                    </Pressable>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logoStyle} />
                </View>
        </SafeAreaView>
    )
}

export default ForgotPassword

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
        borderRadius: 7,
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