import { Text, StyleSheet, View } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { auth, db } from '../Services/firebase';

const Goals = () => {

    const [chosenPlan, setChosenPlan] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const fetchPlanAndGoals = async () => {
            // Kiválasztott terv
            const userPlanCollection = collection(db, 'user_plan');
            const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return;
            }
    
            const userPlan = querySnapshot.docs[0].data();
            const planRef = doc(db, 'plans', userPlan.plan_id);
            const planSnapshot = await getDoc(planRef);
            const plan = { id: planSnapshot.id, ...planSnapshot.data() };
            setChosenPlan(plan);
    
            // A terv céljai, adatai
            const goalsCollection = collection(planRef, 'goals');
            const goalsSnapshot = await getDocs(goalsCollection);
            const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGoals(goalsData);
        };
    
        fetchPlanAndGoals();
    }, [chosenPlan, goals]);

    /* TODO: Teljesített és nem teljesített célok alapján különválogatni, illetve a jutalmakat kezelni, 
    hogy kapja meg a felhasználó, hogy jelenik meg és hol

    const goalRef = doc(db, `user_plan/${user_plan.id}/goals/${user_plan.}`);
    await setDoc(doc(db, "someCollection/someDocument"), {
        goal: goalRef
    }); */

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Célok</Text>
            </View>
                {chosenPlan ? (
                    <>
                        <Text style={styles.header}>{chosenPlan.type} - {chosenPlan.difficulty} szint</Text>
                        {goals.map((goal) => (
                            <View key={goal.id} style={styles.goalContainer}>
                                <Text style={styles.goalText}>{goal.description}</Text>
                            </View>
                        ))}
                    </>
                ) : (
                    <Text style={styles.regularText}>Válassz ki egy tervet, hogy tudj célokat teljesíteni!</Text>
                )}
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
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
        paddingHorizontal: 15,
        color: '#FFF'
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

    quizCards: {
        height: 200,
        width: 180
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
})

export default Goals