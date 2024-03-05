import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, KeyboardAvoidingView, Pressable, TextInput, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../Services/firebase';
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const Register = ({navigation}) => {

    //Kötelező
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState(''); //new Date()

    //Opcionális
    const [fullName, setFullName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [gender, setGender] = useState();
    const [height, setHeight] = useState(0.0);
    const [weight, setWeight] = useState(0.0);

    const signUp = (email, password, username, birthdate, fullName, profilePic, gender, height, weight) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return updateProfile(userCredential.user, {
                displayName: username,
                photoURL: profilePic
            }).then(() => {
                return userCredential;
            });
        })
        .then((userCredential) => {
            console.log(userCredential);
            const newUser = {
                uID: userCredential.user.uid,
                email: userCredential.user.email,
                username: username,
                birthdate: birthdate,
                fullName: fullName,
                profilePic: profilePic,
                gender: gender,
                height: height,
                weight: weight
            };
            
            setDoc(doc(db, "users", newUser.uID), newUser)
            .then(() => {
                console.log("User saved successfully!");
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error("Error saving user: ", error);
                AlertWindow(error);
            });
        });
    }

    const AlertWindow = (error) => {
        Alert.alert("Hiba", error.message, [
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

    return (
        <SafeAreaView style={styles.Container}>
            <View style={styles.InputContainer}>
                <TextInput
                    style={styles.InputTop}
                    placeholder="Email *"
                    placeholderTextColor={'#B7B7B7'}
                    value={email}
                    onChangeText={setEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    keyboardType="email-address"
                />
                
                <TextInput
                    style={styles.Input}
                    placeholder="Username *"
                    placeholderTextColor={'#B7B7B7'}
                    value={username}
                    onChangeText={setUsername}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextInput
                    style={styles.Input}
                    placeholder="Password *"
                    placeholderTextColor={'#B7B7B7'}
                    value={password}
                    onChangeText={setPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    secureTextEntry
                />

                <TextInput
                    style={styles.Input}
                    placeholder="Full name"
                    placeholderTextColor={'#B7B7B7'}
                    value={fullName}
                    onChangeText={setFullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <Picker selectedValue={gender} onValueChange={(itemValue, itemIndex) => setGender(itemValue) /*kicsit szofisztikáltabban */}>
                    <Picker.Item label="Female" value="female" color="#B7B7B7"/>
                    <Picker.Item label="Male" value="male" color="#B7B7B7"/>
                    <Picker.Item label="Prefer not to say" value=" " color="#B7B7B7"/>
                </Picker>

                <TextInput
                    style={styles.Input}
                    placeholder="Birthdate * --> datetimepicker kell"
                    placeholderTextColor={'#B7B7B7'}
                    value={birthdate}
                    onChangeText={setBirthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                />

                <TextInput
                    style={styles.Input}
                    placeholder="Height"
                    placeholderTextColor={'#B7B7B7'}
                    value={height.toString()}
                    onChangeText={(value) => setHeight(Number(value))}
                    onChange={(e) => setHeight(e.target.value)}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.Input}
                    placeholder="Weight"
                    placeholderTextColor={'#B7B7B7'}
                    value={weight.toString()}
                    onChangeText={(value) => setWeight(Number(value))}
                    onChange={(e) => setWeight(e.target.value)}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.InputBottom}
                    placeholder="Profile picture --> képkiválasztó kell (image/document-picker)"
                    placeholderTextColor={'#B7B7B7'}
                    value={profilePic}
                    onChangeText={setProfilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                />
            </View>

            <View style={styles.ButtonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.RegisterButton} onPress={signUp(email, password, username, birthdate, fullName, profilePic, gender, height, weight)}>
                        <Text style={styles.RegisterButtonText}>REGISZTRÁCIÓ</Text>
                    </Pressable>
                    <Pressable style={styles.LoginButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.LoginButtonText}>MÁR VAN PROFILOM</Text>
                    </Pressable>
                </TouchableOpacity>
            </View>

            <View style={styles.BottomContainer}>
                <Text style={styles.BottomText}>A Vivida-ra való regisztrációval elfogadod a Használati feltételeinket és az Adatvédelmi nyilatkozatunkat.</Text>
            </View>
        </SafeAreaView>
    )
}

const validateInputs = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Email cannot be empty.');
      return false;
    }
    if(username.trim() === ''){
        Alert.alert('Error', 'Username cannot be empty.');
        return false;
    }
    if(password.trim() === ''){
        Alert.alert('Error', 'Password cannot be empty.')
        return false;
    }

    return true;
};

export default Register

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
        height: 'auto'
    },

    InputContainer: {
        //height: 500,
        margin: 15,
        width: 300,
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

    Input: {
        borderWidth: 1,
        //borderTopWidth: 1,
        //borderBottomWidth: 1,
        borderColor: '#C9C9C9',
        //borderRadius: 7,
        padding: 13,
        fontSize: 14,
        color: '#BBBBBB',
        height: 40,
    },

    InputTop: {
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        padding: 13,
        fontSize: 14,
        color: '#818181',
        height: 40,
    },

    InputBottom: {
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        padding: 13,
        fontSize: 14,
        color: '#BBBBBB',
        height: 40,
    },

    ButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    RegisterButton: {
        width: 300,
        margin: 4,
        padding: 13,
        backgroundColor: '#E4E4E4',
        borderRadius: 7
    },

    RegisterButtonText: {
        fontSize: 18,
        color: '#818181',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    LoginButton: {
        width: 300,
        margin: 4,
        padding: 13,
        backgroundColor: '#8562AC',
        borderRadius: 7
    },

    LoginButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    BottomContainer: {
        marginBottom: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },

    BottomText: {
        width: 300,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#6D6D6D'
    },

})