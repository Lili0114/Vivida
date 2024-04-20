import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { Component, useState, useEffect, useReducer } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import { addDoc, collection, query, where, getDocs, setDoc, doc, CollectionReference } from 'firebase/firestore';
import { db, auth } from '../Services/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AlertWindow } from './Alert';

const initialState = {
    advancedGoals: [],
    plans: [],
    beginnerGoals: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_BEGINNER_GOALS':
            return { ...state, beginnerGoals: action.payload };
        case 'SET_ADVANCED_GOALS':
            return { ...state, advancedGoals: action.payload };
        case 'SET_PLANS':
            return { ...state, plans: action.payload };
        default:
            throw new Error();
    }
}

const PlanDetails = ({navigation, route}) => {
    const [state, setState] = useReducer(reducer, initialState);
    const { planType } = route.params;
 
    useEffect(() => {

        const fetchGoals = async () => {
            if (state.beginnerGoals.length > 0 || state.advancedGoals.length > 0) {
                return;
            }

            const plansCollection = collection(db, 'plans');
            const q = query(plansCollection, where('type', '==', planType));
            const plansSnapshot = await getDocs(q);
            const plans = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            for (const plan of plans) {
                const goalsCollection = collection(db, `plans/${plan.id}/goals`);
                const goalsSnapshot = await getDocs(goalsCollection);
                const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (plan.difficulty === 'Kezdő') {
                    setState({ type: 'SET_BEGINNER_GOALS', payload: [...state.beginnerGoals, ...goalsData] });
                } else if (plan.difficulty === 'Haladó') {
                    setState({ type: 'SET_ADVANCED_GOALS', payload: [...state.advancedGoals, ...goalsData] });
                }
            }
            setState({ type: 'SET_PLANS', payload: plans });
        };
    
        fetchGoals();
    }, [state.beginnerGoals, state.advancedGoals]);

    const totalBeginnerXP = state.beginnerGoals.reduce((total, goal) => total + goal.xp, 0);
    const totalAdvancedXP = state.advancedGoals.reduce((total, goal) => total + goal.xp, 0);

    const handleSave = async (difficulty) => {
        // Választott-e már a user tervet - 1 lehet egyszerre folyamatban (completed=false)
        const userPlanCollection = collection(db, 'user_plan');
        const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid), where('completed', '==', false));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            AlertWindow("Hiba", 'Már választottál tervet.');
            return;
        };

        for (const plan of state.plans) {

            if (plan.difficulty !== difficulty) {
                continue;
            }

            const userPlanRef = await addDoc(userPlanCollection, {
                user_id: auth.currentUser.uid,
                plan_id: plan.id,
                completed: false
            });
    
            // plans/{id}/goals --> user_plans/{id}/goals
            const planGoalsCollection = collection(db, `plans/${plan.id}/goals`);
            const planGoalsSnapshot = await getDocs(planGoalsCollection);
            planGoalsSnapshot.forEach(async (docSnapshot) => {
                const goalId = docSnapshot.id;
                const goalData = docSnapshot.data();
                await setDoc(doc(db, `user_plan/${userPlanRef.id}/goals/${goalId}`), { 
                    ...goalData,
                    completed: false,
                    burned_calories: 0, 
                });
            });
        };
    
        navigation.navigate('PlanClosing');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>{`${planType}`.toUpperCase()}</Text>
            </View>
            <Text style={styles.category}>KEZDŐ</Text>
            <View style={{borderWidth: 1, borderColor: '#C5FE37', borderRadius: 10, paddingVertical: 10}}>
                <View style={styles.goals}>
                    {state.beginnerGoals.map((goal) => (
                        <View key={goal.id} style={styles.goalContainer}>
                            <Text style={styles.goalText}>{goal.description}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={styles.rewardText}>Teljesítésért járó jutalom összesen:</Text>
                    <View style={styles.goalContainer}>
                        <Text style={styles.xpText}>{totalBeginnerXP} xp</Text>
                    </View>
                </View>
                <View style={[styles.startContainer,{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text style={styles.regularText}>ELKEZDEM</Text>
                    <View style={[styles.iconContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                        <Ionicons
                            name='flag'
                            size={30}
                            color={'#C5FE37'}
                            onPress={() => handleSave('Kezdő')}
                        />
                    </View>
                </View>
            </View>
            
            <Text style={styles.category}>HALADÓ</Text>
            <View style={{borderWidth: 1, borderColor: '#C5FE37', borderRadius: 10, paddingVertical: 10}}>
                <View style={styles.goals}>
                    {state.advancedGoals.map((goal) => (
                        <View key={goal.id} style={styles.goalContainer}>
                            <Text style={styles.goalText}>{goal.description}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={styles.rewardText}>Teljesítésért járó jutalom összesen:</Text>
                    <View style={styles.goalContainer}>
                        <Text style={styles.xpText}>{totalAdvancedXP} xp</Text>
                    </View>
                </View>
                <View style={[styles.startContainer,{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text style={styles.regularText}>ELKEZDEM</Text>
                    <View style={[styles.iconContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                        <Ionicons
                            accessibilityLabel='handleSaveAdvanced'
                            name='flag'
                            size={30}
                            color={'#C5FE37'}
                            onPress={() => handleSave('Haladó')}
                        />
                    </View>
                </View>
            </View>
            
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
        paddingHorizontal: 15
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
        paddingLeft: 15,
        color: "#FFFFFF",
    },

    goalContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        padding: 5,
        marginTop: 2
    },

    startContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 140,
        marginRight: 5,
        marginVertical: 5
    },

    boldText: {
        fontWeight: 'bold',
    },

    header: {
        fontSize: 26,
        paddingTop: 5,
        textAlign: 'center',
        color: '#C5FE37'
    },

    category: {
        fontSize: 24,
        marginTop: 20,
        color: '#fff'
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

    iconContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        //marginRight: 20,
        flex: 1,
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

    goals: {
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 10,
        borderRadius: 5,
    },

    goalText: {
        fontSize: 14,
        color: '#fff'
    },

    rewardText: {
        fontSize: 14,
        color: '#C5FE37',
        marginRight: 10
    },

    xpText: {
        fontSize: 14,
        color: '#C5FE37',
    },

    saveButton: {
        width: 150,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 4,
      },
    
      btnText: {
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#FFFFFF'
      },

      buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
})

export default PlanDetails