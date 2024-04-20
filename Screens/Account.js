import React, { useState, useEffect, useReducer, useContext } from 'react';
import { KeyboardAvoidingView, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/compat/firestore';
import { db, auth } from '../Services/firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Switch} from 'react-native-switch';
import { showToast } from './Notification';
import { NotificationsEnabledProvider, useNotificationsEnabled } from './NotificationsEnabledContext';

const initialState = {
  userData: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    default:
      throw new Error();
  }
}

const Account = ({navigation}) => {

  const [state, setState] = useReducer(reducer, initialState);
  const { notificationsEnabled, setNotificationsEnabled } = useNotificationsEnabled();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
      const userDocSnap = await getDoc(currentUserDoc);

      if (userDocSnap.exists()) {
        setState({ type: 'SET_USER_DATA', payload: userDocSnap.data() });
      }
    };

    fetchUserData();
  }, [state.userData]);


  const deleteUserPlan = async () => {
    const userPlanCollection = collection(db, 'user_plan');
    const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid), where('completed', '==', false));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      showToast('error', 'Nincs kiválasztott terved!', '', 4000, notificationsEnabled);
      return;
    }
    else{
      const userPlan = querySnapshot.docs[0];

      Alert.alert(
        "Terv törlése",
        "Biztos törölni akarod a terved? Ezzel elveszted az eddigi előrehaladásodat.",
        [
          { 
            text: "Törlés", 
            onPress: async () => {
              const goalsCollection = collection(db, `user_plan/${userPlan.id}/goals`);
              const goalsSnapshot = await getDocs(goalsCollection);
              goalsSnapshot.docs.forEach(async (d) => {
                await deleteDoc(doc(db, `user_plan/${userPlan.id}/goals`, d.id));
              });

              await deleteDoc(doc(db, 'user_plan', userPlan.id));
              showToast('success', 'Terv törölve!', '', 4000, notificationsEnabled);
              
            } 
          },
          {
            text: "Mégsem",
            style: "cancel"
          }
        ]
      );
    }
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
          <Text style={styles.header}>TERVEK</Text>
          <TouchableOpacity>
              <Pressable onPress={() => deleteUserPlan()}>
                <View style={styles.rewardContainer}>
                  <Text style={[styles.rewardText, {marginRight: 153}]}>Jelenlegi terv törlése</Text>
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
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              /*circleStyle={{ backgroundColor: notificationsEnabled ? '#C5FE37' : '#958CAB' }}*/
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
            <Pressable onPress={() => navigation.navigate('AccountEdit', { userData: state.userData })}>
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
              <View style={[styles.rewardContainer, {marginTop: 10}]}>
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