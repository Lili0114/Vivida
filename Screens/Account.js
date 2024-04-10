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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Switch} from 'react-native-switch';

const Account = ({navigation}) => {

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
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

        <View style={styles.taskContainer}>
          <Text style={styles.header}>BIZTONSÁG</Text>
          <TouchableOpacity>
              <Pressable onPress={() => navigation.navigate('PasswordReset')}>
                <View style={styles.rewardContainer}>
                  <Text style={[styles.rewardText, {marginRight: 164}]}>Jelszó módosítása</Text>
                  <MaterialIcons 
                    name='keyboard-arrow-right'
                    size={20}
                    color='#C5FE37'
                    style={{ marginLeft: 10}}
                  />
                </View>
              </Pressable>
          </TouchableOpacity>
        </View>

        <View style={styles.taskContainer}>
          <Text style={styles.header}>ÉRTESÍTÉSEK</Text>
          <View style={{flex: 1, padding: 20 }}>
          <Switch
            /*value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            circleStyle={{ backgroundColor: notificationsEnabled ? '#C5FE37' : '#958CAB' }}*/
            value={false}
            onValueChange={(val) => console.log(val)}
            disabled={false}
            barHeight={35}
            circleBorderWidth={0}
            containerStyle={{ borderWidth: 1, borderColor: '#958CAB'}}
            backgroundActive={'#0B0A0C'}
            backgroundInactive={'#0B0A0C'} 
            circleActiveColor={'#C5FE37'}
            circleInActiveColor={'#958CAB'}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2}
            changeValueImmediately={true}
            innerCircleStyle={{ alignItems: "center", justifyContent: "center", borderRadius: 10, height: 35 }}
            renderActiveText={false}
            renderInActiveText={false}
            switchBorderRadius={10} 
          />
          </View>
        </View>

        <View style={styles.taskContainer}>
          <Text style={styles.header}>FIÓK</Text>
          <TouchableOpacity>
            <Pressable onPress={() => navigation.navigate('AccountEdit', { userData: userData })}>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardText}>Adataim módosítása</Text>
                <MaterialIcons 
                  name='keyboard-arrow-right'
                  size={20}
                  color='#C5FE37'
                  style={{ marginLeft: 10}}
                />
              </View>
            </Pressable>
          </TouchableOpacity>

          <TouchableOpacity>
            <Pressable onPress={handleLogout}>
              <View style={[styles.rewardContainer, {marginTop: 20}]}>
                <Text style={[styles.rewardText, {marginRight: 202}]}>Kijelentkezés</Text>
                <MaterialIcons 
                  name='keyboard-arrow-right'
                  size={20}
                  color='#C5FE37'
                  style={{ marginLeft: 10}}
                />
              </View>
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
    backgroundColor: '#0B0A0C',
    justifyContent: 'center',
    marginVertical: 20
  },

  text: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    color: '#fff',
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

  rewardContainer: {
    borderWidth: 1,
    borderColor: '#958CAB',
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
    padding: 5,
    flexDirection: 'row'
},

rewardText: {
  fontSize: 15,
  paddingHorizontal: 5,
  color: "#FFFFFF",
  marginRight: 150,
},

taskContainer: {
  flex: 2,
  flexDirection: 'column',
},

header: {
  fontSize: 24,
  paddingTop: 20,
  paddingHorizontal: 15,
  color: '#fff'
},


})