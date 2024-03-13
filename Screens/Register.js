import React, { useState } from "react";
import { PermissionsAndroid, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, KeyboardAvoidingView, Pressable, TextInput, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../Services/firebase';
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = ({navigation}) => {

    //Kötelező
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [birthdateString, setBirthdateString] = useState('');

    //Opcionális    
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState();
    const [height, setHeight] = useState(0.0);
    const [weight, setWeight] = useState(0.0);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    const changePasswordVisibility = () => { 
        setShowPassword(!showPassword);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthdate;
        setShowDatePicker(false);
        setBirthdate(currentDate);
    };

    const signUp = async (email, password, username, birthdate, fullName, gender, height, weight) => {
        if (!validateInputs(email, password, username, birthdate)) {
            return;
        }

        const query = await getDocs(collection(db, "users"));
        const users = query.docs.map(doc => doc.data());
        const emailExists = users.some(user => user.email === email);
        const usernameExists = users.some(user => user.username === username);
    
        if (emailExists) {
            AlertWindow('Már létezik felhasználó a megadott email címmel!');
            return;
        }
    
        if (usernameExists) {
            AlertWindow('Már létezik felhasználó a megadott felhasználónévvel!');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const newUser = {
                uID: userCredential.user.uid,
                email: userCredential.user.email,
                username: username,
                birthdate: birthdate,
                fullName: fullName,
                gender: gender,
                height: height,
                weight: weight
            };
            setDoc(doc(db, "users", newUser.uID), newUser)
            .then(() => {
                console.log("sikeres regisztráció");
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.log("nemjó");
                AlertWindow(error);
            });
        });
    };

    const validateInputs = (email, password, username, birthdate) => {
        //const today = new Date(Date.now()).toLocaleString();
        if (email.trim() === '') {
            AlertWindow('Email cím nem lehet üres!');
            return false;
        }
        if(username.trim() === ''){
            AlertWindow('Felhasználónév nem lehet üres!');
            return false;
        }
        if(password.trim() === ''){
            AlertWindow('Jelszó nem lehet üres!');
            return false;
        }
        if(password.length < 6){
            AlertWindow('A jelszó legalább 6 karakter hosszú legyen!');
            return false;
        }
        if(birthdate == null){
            AlertWindow('Születési dátum nem lehet üres!');
            return false;
        }
        if(birthdate > Date.now()){
            AlertWindow('Születési dátum nem megfelelő!');
            return false;
        }
        return true;
    };

    function AlertWindow (message) {
        Alert.alert("Hiba", message, [
            {
                text: 'OK',
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.Container}>
            <View style={styles.InputContainer}>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Email cím:</Text>
                    <TextInput
                        style={styles.Input}
                        placeholderTextColor={'#B7B7B7'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Felhasználónév:</Text>
                    <TextInput
                        style={styles.Input}
                        placeholderTextColor={'#B7B7B7'}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Jelszó:</Text>
                    <TextInput
                        style={styles.InputWithIcon}
                        placeholderTextColor={'#B7B7B7'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        color="#8562AC"
                        size={20}
                        onPress={changePasswordVisibility}
                        style={styles.PasswordIconButton}
                    />
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Teljes név:</Text>
                    <TextInput
                        style={styles.Input}
                        placeholderTextColor={'#B7B7B7'}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Nem:</Text>
                    <View style={styles.PickerContainer}>
                        <Picker
                            selectedValue={gender}
                            dropdownIconColor={'#8562AC'}
                            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                        >
                            <Picker.Item label="Nő" value="female" color="#B7B7B7"/>
                            <Picker.Item label="Férfi" value="male" color="#B7B7B7"/>
                        </Picker>
                    </View>
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Születési idő:</Text>
                    <TextInput
                        style={styles.InputWithIcon}
                        value={birthdateString}
                        editable={false}
                    />
                    <TouchableOpacity style={[styles.IconButton, {flex: 0.5}]} onPress={showDatepicker}>
                        <Icon name="calendar" size={20} color='#8562AC' />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthdate}
                            mode={'date'}
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setBirthdate(selectedDate);
                                    setBirthdateString(selectedDate.toLocaleDateString());
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Magasság:</Text>
                    <TextInput
                        style={styles.Input}
                        placeholderTextColor={'#B7B7B7'}
                        value={height.toString()}
                        onChangeText={(value) => setHeight(Number(value))}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.InputRow}>
                    <Text style={styles.InputLabel}>Testsúly:</Text>
                    <TextInput
                        style={styles.Input}
                        placeholderTextColor={'#B7B7B7'}
                        value={weight.toString()}
                        onChangeText={(value) => setWeight(Number(value))}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.ButtonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.RegisterButton} onPress={() => signUp(email, password, username, birthdate, fullName, gender, height, weight)}>
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
        borderRadius: 7,
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
    InputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    InputLabel: {
        flex: 2,
        textAlign: 'left',
        color: '#8562AC',
        paddingLeft: 10,
        paddingRight: 30
    },
    Input: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderRadius: 5,
        fontSize: 14,
        marginRight: 10,
        color: '#BBBBBB',
        height: 40,
        textAlign: 'left',
    },
    InputWithIcon: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderRadius: 5,
        fontSize: 14,
        color: '#BBBBBB',
        height: 40,
        textAlign: 'left',
        marginLeft: 22,
    },
    PasswordIconButton: {
        paddingRight: 3,
        paddingLeft: 3,
        marginRight: 6
    },
    IconButton: {
        paddingRight: 5,
        paddingLeft: 5
    },
    PickerContainer: {
        flex: 2,
        height: 50,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderRadius: 5,
        marginRight: 10,
        paddingLeft: 8
    },
})