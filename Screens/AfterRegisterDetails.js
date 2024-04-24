import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Pressable, KeyboardAvoidingView, Alert, ScrollView, PermissionsAndroid } from 'react-native';
import { auth, db } from '../Services/firebase';
import { IconButton, TextInput } from 'react-native-paper';
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native-elements';
import { AlertWindow } from "./Alert";

const AfterRegisterDetails = ({navigation}) => {

    //Kötelező
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [birthdateString, setBirthdateString] = useState('');

    //Opcionális    
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('female');
    const [height, setHeight] = useState(0.0);
    const [weight, setWeight] = useState(0.0);
    const [imageUri, setImageUri] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);

    const showDatepicker = () => { 
        setShowDatePicker(true);
    };

    const uploadImage = async () => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: "Tárhely engedélykérés",
                message: "Az applikációnak szüksége van, hogy a tárhelyedhez hozzáférjen."
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchImageLibrary({}, async (response) => {
                    if (response.didCancel) {
                      console.log('User cancelled image picker');
                    } else if (response.error) {
                      console.log('ImagePicker Error: ', response.error);
                    } else {
                      
                      const uploadUri = response.assets[0].uri;
                      let filename = response.assets[0].fileName;
                      const uploadRef = storage().ref(`profile_pictures/${auth.currentUser.uid}/${filename}`);
                      const task = uploadRef.putFile(uploadUri);

                      try {
                        await task;
                        const url = await uploadRef.getDownloadURL();
                        setImageUri(url);
                        return url;
                
                      } catch (e) {
                        AlertWindow("Hiba", e)
                        return null;
                      }
                    }
                  });
            } else {
              AlertWindow("Hiba", "Nem sikerült hozzáférni a galériához.")
              return;
            }
          } catch (err) {
            AlertWindow("Hiba", err);
            return;
          }
    };

    const usernameAlreadyExists = async (username) => {
        const usernameQuery = query(collection(db, "users"), where("username", "==", username));
        const usernameExists = (await getDocs(usernameQuery)).docs.length > 0;
        
        if (usernameExists) {
            AlertWindow('Hiba','Már létezik felhasználó a megadott felhasználónévvel!');
            return true;
        }
        return false;
    };

    const validateInputs = async (username, birthdate, fullName, gender) => {
        const today = new Date().setHours(0,0,0,0);
        if(username.trim() === ''){
            AlertWindow('Hiba','Felhasználónév nem lehet üres!');
            return false;
        }

        if(birthdate >= today){
            AlertWindow('Hiba','Születési dátum nem megfelelő!');
            return false;
        }

        if(fullName.trim() === ''){
            AlertWindow('Hiba','Teljes név nem lehet üres!');
            return false;
        }

        if(gender.trim() === ''){
            AlertWindow('Hiba','Nem ne legyen üres!');
            return false;
        }
        return true;
    };

    const setDetails = async (username, birthdate, fullName, gender, height, weight) => {

        if (auth.currentUser == null || await validateInputs(username, birthdate, fullName, gender) == false 
            || await usernameAlreadyExists(username)) {
            return;
        }
        else{
            try {
                const newUser = {
                    email: auth.currentUser.email,
                    username: username,
                    birthdate: birthdate,
                    fullName: fullName,
                    gender: gender,
                    height: height,
                    weight: weight,
                    level: 1,
                    xp: 0,
                    profilePicture: imageUri
                };
                setDoc(doc(db, "users", auth.currentUser.uid), newUser)
                .then(() => {    
                    navigation.navigate('HomePage');
                });
            } catch (error) {
                AlertWindow('Hiba',`Hiba lépett fel az adatok megadása során!`);
                return;
            }
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
            <View style={styles.inputContainer}>
                <View style={styles.topContainer}>
                    <Image
                        style={{ borderRadius: 100, width: 130, height: 130 }}
                        source={imageUri ? {uri: imageUri} : require('../assets/images/blank-profile-picture.png')}
                    />
                    <Pressable accessibilityLabel="UploadImage" onPress={uploadImage}>
                        <Text style={{color: '#48454c', fontSize: 12, padding: 10}}>Profilkép feltöltése</Text>
                    </Pressable>
                </View>
                <View style={styles.field}>
                    <TextInput
                        accessibilityLabel="Felhasználónév"
                        label={"Felhasználónév *"}
                        placeholderTextColor={'#B7B7B7'}
                        value={username}
                        onChangeText={setUsername}
                        style={styles.fieldInside}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#958CAB'
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        accessibilityLabel="Teljes név"
                        label={"Teljes név *"}
                        placeholderTextColor={'#B7B7B7'}
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.fieldInside}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#958CAB'
                    />
                </View>
                <View style={[styles.field, {height: 75}]}>
                    <Text style={{color: '#48454c', fontSize: 12, marginTop: 10, marginLeft: 4}}>Nem *</Text>
                    <Picker        
                        accessibilityLabel="Nem"
                        accessible={true}
                        accessibilityValue={'nem'}
                        selectedValue={gender}
                        dropdownIconColor={'#FFF'}
                        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                    >
                        <Picker.Item label="Nő" value="female" color="#958CAB" style={{fontSize: 16}}/>
                        <Picker.Item label="Férfi" value="male" color="#958CAB" style={{fontSize: 16}}/>
                    </Picker>
                </View>
                <View style={styles.field}>
                    <View style={styles.passwordContainer}>
                    <TextInput
                        label={"Születési idő *"}
                        style={styles.passwordField}
                        value={birthdateString}
                        editable={false}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#958CAB'
                    />
                    <IconButton
                        accessibilityLabel="calendar"
                        icon="calendar"
                        size={20}
                        onPress={showDatepicker}
                        style={styles.icon}
                    />
                    </View>
                </View>
                    {showDatePicker && (
                        <DateTimePicker
                            accessible={true}
                            accessibilityLabel="Születési dátum"
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
                <View style={styles.field}> 
                    <TextInput
                        accessibilityLabel="Magasság"
                        label={"Magasság (cm)"}
                        placeholderTextColor={'#B7B7B7'}
                        value={height.toString()}
                        onChangeText={(value) => setHeight(Number(value))}
                        keyboardType="numeric"
                        style={styles.fieldInside}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#958CAB'
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        accessibilityLabel="Testsúly"
                        label={"Testsúly (kg)"}
                        placeholderTextColor={'#B7B7B7'}
                        value={weight.toString()}
                        onChangeText={(value) => setWeight(Number(value))}
                        keyboardType="numeric"
                        style={styles.fieldInside}
                        theme={{ colors: { primary: '#958CAB', underlineColor: 'transparent' }}}
                        textColor='#958CAB'
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity>
                    <Pressable accessibilityLabel="SetDetails" style={styles.loginButton} onPress={() => setDetails(username, birthdate, fullName, gender, height, weight)}>
                        <Text style={styles.loginButtonText}>TOVÁBB</Text>
                    </Pressable>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AfterRegisterDetails

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
    
      inputContainer:{
        marginHorizontal: 15,
        marginVertical: 50,
        width: 350,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    
      field: {
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: '#0B0A0C',
        paddingHorizontal: 10
      },

      dropdownField: {
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
        height: 100,
        //width: 350
        marginRight: 50
    },
      
      icon: {
        position: 'absolute',
        top: 5,
        right: 1,
        color: '#48454c'
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

      passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      },

      passwordField: {
        width: 340,
        backgroundColor: '#0B0A0C',
        paddingHorizontal: 10
      },

      fieldInside: { 
        backgroundColor: '#0B0A0C', 
        paddingHorizontal: 5
    },
})