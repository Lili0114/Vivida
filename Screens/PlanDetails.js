import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { Component, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import { addDoc, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../Services/firebase';


const PlanDetails = ({route}) => {

    const { plan } = route.params;
    const [ goals, setGoals ] = useState([]);

    useEffect(() => {
        const fetchGoals = async () => {
            const goalsCollection = collection(db, `plans/${plan.id}/goals`);
            const goalsSnapshot = await getDocs(goalsCollection);
            const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGoals(goalsData);
        };
    
        fetchGoals();
    }, []);

    const handleSave = async () => {
        // Választott-e már a user tervet - 1 lehet egyszerre
        const userPlanCollection = collection(db, 'user_plan');
        const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            Alert.alert("Hiba", 'Már választottál tervet.', [
                {
                    text: 'OK',
                }
            ]);
            return;
        }

        const userPlanRef = await addDoc(userPlanCollection, {
            user_id: auth.currentUser.uid,
            plan_id: plan.id,
        });
    
        // plans/{id}/goals --> user_plans/{id}/goals
        const planGoalsCollection = collection(db, `plans/${plan.id}/goals`);
        const planGoalsSnapshot = await getDocs(planGoalsCollection);
        planGoalsSnapshot.forEach(async (docSnapshot) => {
            const goalId = docSnapshot.id;
            await setDoc(doc(db, `user_plan/${userPlanRef.id}/goals/${goalId}`), { completed: false });
        });
    
        Alert.alert("Siker", 'Terv kiválasztva!', [
            {
                text: 'OK',
            }
        ]);
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Terv céljai</Text>
                <Text style={styles.regularText}>Tekintsd meg, milyen célokat kell teljesítened, majd válassz egy neked illő tervet!</Text>
            </View>
            {goals.map((goal) => (
                <View key={goal.id} style={styles.goalContainer}>
                    <Text style={styles.goalText}>{goal.description}</Text>
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.btnText} onPress={handleSave}>Kiválaszt</Text>
                </Pressable>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DDC0FA',
    },

    topContainer: {
        //flex: 1,
        marginVertical: 15,
        flexDirection: 'column',
    },

    progressContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },

    regularText: {
        fontSize: 15,
        paddingHorizontal: 15,
        color: "#FFFFFF",
    },

    boldText: {
        fontWeight: 'bold',
        color: "#FFFFFF",
    },

    header: {
        fontSize: 30,
        paddingTop: 20,
        paddingHorizontal: 15
    },

    progressBar: {
        height: 20,
        width: 'auto',
        borderRadius: 10,
        marginVertical: 15,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#C9C9C9'
    },

    iconsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },

    icons: {
        height: 90,
        width: 70,
        //borderColor: 'black',
        //borderWidth: 2,
        marginVertical: 5,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconText: {
        textAlign: 'center',
        alignContent: 'center',
        fontSize: 12
    },

    categoryCardImage: {
        height: 50,
        width: 50,
        marginBottom: 10
    },

    categoryCardImageInCaseOfLongText: {
        height: 50,
        width: 50,
        marginBottom: 10,
        marginTop: 15
    },

    quizContainer: {
        flex: 2,
        flexDirection: 'column'
    },

    containerScrollView: {
        flexDirection: 'row',

    },

    goalContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },

    goalText: {
        fontSize: 16,
        color: 'black'
    },

    saveButton: {
        width: 300,
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

      buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
      },
})

export default PlanDetails