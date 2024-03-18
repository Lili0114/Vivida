import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, updateProfile } from "firebase/auth";
import 'firebase/database';
import 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { db, auth } from '../Services/firebase';
import { doc, getDoc, collection } from "firebase/firestore";

const Account = ({navigation}) => {
  const [uId, setUId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [rewardNumber, setRewardNumber] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
      const userDocSnap = await getDoc(currentUserDoc);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }
      else throw Error();
    };

    fetchUserData();
  }, [userData]);

  /*const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      user.displayName = user.email.substring(0, user.email.indexOf("@"));
      setUser(user);
      setUsername(user.displayName);
      setEmail(user.email);
      setPoints(points);
      setProfilePic(user.photoURL);
      setNumberCurriculumDone(numberCurriculumDone);
    });

    return unsubscribe;
  }, []);*/


  const handleSave = () => {
    console.log(`Username: ${username}, Email: ${email}, Level: ${level}`);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Welcome');
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container}>

        <View style={styles.topContainer}>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Image
              style={styles.profilePicture}
              source={require('../assets/images/blank-profile-picture.png')} />
            <Text style={styles.usernameText}>{userData ? `${userData.username}` : "Betöltés..."}</Text>
            <Text style={styles.text}>{userData && userData.level ? `${userData.level}. szint` : "0. szint"}</Text>
            <Text style={styles.text}>{userData && userData.xp ? `${userData.xp} XP` : "-"}</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.text}>Email cím: {auth.currentUser.email}</Text>
          <Text style={styles.text} marginBottom={10}>Jelvények száma: {rewardNumber}</Text>
          <Text style={styles.text}>Teljes név: {userData && userData.fullName ? `${userData.fullName}` : "-"}</Text>
          <Text style={styles.text}>Születési idő: {userData ? `${userData.birthdate.toDate().toLocaleDateString()}` : "-"}</Text>
          <Text style={styles.text}>Nem: {userData && userData.gender ? `${ [userData.gender=='male' ? 'Férfi' : 'Nő'] }` : "-"}</Text>
          <Text style={styles.text}>Magasság: {userData && userData.height ? `${userData.height} cm` : "-"}</Text>
          <Text style={styles.text}>Testsúly: {userData && userData.weight ? `${userData.weight} kg` : "-"}</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.saveButton}>
              <Text style={styles.btnText} onPress={handleSave}>Mentés</Text>
            </Pressable>
          </View>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Pressable style={styles.uploadButton} onPress={handleLogout}>
              <Text style={styles.uploadText}>Kijelentkezés</Text>
            </Pressable>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default Account;

const styles = StyleSheet.create({
  //Külső összefogó
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5'
  },

  text: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    color: '#5E5E5E',
  },

  //Konténer, amiben a profilkép + 1-2 információ
  topContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    //marginLeft: 'auto',
    //marginRight: 'auto',
    //backgroundColor: '#F5F5F5'
    //backgroundColor: 'blue'
  },

  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 100,
    //marginBottom: 20
  },

  usernameText: {
    textAlign: 'center',
    padding: 5,
    fontSize: 22,
    color: '#6B6B6B',
    fontWeight: 'bold'
  },

  uploadButton: {
    width: 150,
    backgroundColor: '#C4A4E8',
    borderRadius: 7,
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10
  },

  uploadText: {
    fontSize: 13,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF'
  },

  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  saveButton: {
    width: 350,
    marginBottom: 4,
    marginTop: 4,
    padding: 13,
    backgroundColor: '#8562AC',
    color: '#8562AC',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },

  btnText: {
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF'
  },

  //Alsó konténer
  bottomContainer: {
    flex: 3,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#C9C9C9'
  }


})