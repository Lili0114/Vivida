import React, { useState } from "react";
import { IconButton, TextInput } from 'react-native-paper';
import { StyleSheet, Text, TouchableOpacity, View, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Services/firebase';


const Register = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
  
    function AlertWindow (title, message) {
        Alert.alert(title, message, [
            {
                text: 'OK',
            }
        ]);
    };

    const validateInputs = async (email, password) => {

        if (email.trim() === '') {
            AlertWindow('Hiba','Email cím nem lehet üres!');
            return false;
        }
        if(password.trim() === ''){
            AlertWindow('Hiba','Jelszó nem lehet üres!');
            return false;
        }
        if(password.length < 6){
            AlertWindow('Hiba','A jelszó legalább 6 karakter hosszú legyen!');
            return false;
        }


        return true;
    };

    const changePasswordVisibility = () => { 
        setShowPassword(!showPassword);
    };

    const signUp = async (email, password) => {
        if (!await validateInputs(email, password) ) {
            return;
        }
        else{
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
   
                AlertWindow('Siker',"Sikeres regisztráció!");
                navigation.navigate('Login');
                return user;
            } catch (error) {
                AlertWindow('Hiba',`Már létezik a megadott email címmel fiók.`);
            }
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.appName}>Vivida</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.welcomeText}>Örülök, hogy belevágsz!</Text>
                <Text style={styles.regularText}>A motivációról gondoskodunk</Text>
                <View style={styles.field}>
                    <TextInput 
                        label="Email cím"
                        textContentType='emailAddress'
                        value={email} 
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        style={styles.fieldInside}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#FFF'
                    />
                </View>
                
                <View style={styles.field}>
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            label="Jelszó"
                            textContentType='password'
                            value={password}
                            onChangeText={setPassword}
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
                    <Pressable style={styles.regButton} onPress={() => signUp(email,password)}>
                        <Text style={styles.regButtonText}>REGISZTRÁLOK</Text>
                    </Pressable>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>Az alábbiak közül választok - FB, Google</Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Register

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

      regularText: {
        fontSize: 18,
        color: '#958CAB',
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
    
      regButton: {
        width: 350,
        margin: 4,
        padding: 20,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 10
      },
    
      regButtonText: {
        fontSize: 15,
        color: '#FFF',
        marginLeft: 'auto',
        marginRight: 'auto'
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
        color: '#FFF'
      },
})