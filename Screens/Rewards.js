import { Text, StyleSheet, View, Animated, Pressable, Alert, TouchableOpacity, Button, Image } from 'react-native';
import React, { useState, useEffect, useReducer } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, getDocs, updateDoc, where } from "firebase/firestore";
import { db, auth } from '../Services/firebase';
import { showToast } from './Notification';

const initialState = {
    badges: [],
    completedPlans: [],
    planDetails: [],
    lastFetch: new Date(),
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_BADGES':
            return { ...state, badges: action.payload };
        case 'SET_COMPLETED_PLANS':
            return { ...state, completedPlans: action.payload };
        case 'SET_PLAN_DETAILS':
            return { ...state, planDetails: action.payload };
        case 'SET_LAST_FETCH':
            return { ...state, lastFetch: action.payload };
        default:
            throw new Error();
    }
}

const Rewards = () => {

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        try {
            const badgesAndPlans = async () => {
                const userPlansSnap = await getDocs(collection(db, 'user_plan'), 
                    where('user_id', '==', auth.currentUser.uid)
                );

                const completedPlans = userPlansSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(plan => plan.completed === true);
    
                const planDetails = [];
                for (let plan of completedPlans) {
                    const planRef = doc(db, 'plans', plan.plan_id);
                    const planSnapshot = await getDoc(planRef);
                    planDetails.push({ id: planSnapshot.id, ...planSnapshot.data() });
                }
    
                setState({ type: 'SET_PLAN_DETAILS', payload: planDetails});
                setState({ type: 'SET_COMPLETED_PLANS', payload: completedPlans});
    
                const badgesSnap = await getDocs(collection(db, 'badges'));
                const allBadges = badgesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const goalPromises = completedPlans.map(async (plan) => {
                    const userPlanRef = doc(db, 'user_plan', plan.id);
                    const goalsSnap = await getDocs(collection(userPlanRef, 'goals'), 
                        where('completed', '==', true)
                    );
                
                    return goalsSnap.docs.map(goalDoc => goalDoc.data().badge_id);
                });

                const completedGoalBadgeIds = await Promise.all(goalPromises);

                const badgeIds = [].concat(...completedGoalBadgeIds);
                const badges = allBadges.filter(badge => badgeIds.includes(badge.id));

                dispatch({ type: 'SET_BADGES', payload: badges });
                console.log(badges);
            };
    
            const fetchData = async () => {
                await badgesAndPlans();
                setState({ type: 'SET_LAST_FETCH', payload: Date.now() });
            };
                    
            const intervalId = setInterval(() => {
                fetchData();
            }, 10000);
            
            return () => {
                clearInterval(intervalId);
            };
        } catch (error) {
            console.log(error);
        }
    
    }, [state.badges, state.completedPlans]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.header}>BEGYŰJTÖTT KITŰZŐK</Text>
                <View style={styles.rewardContainer}>      
                    {state.badges ? (
                    <>
                        {state.badges.map((badge) => (
                            <Image source={{ uri: badge.image }} style={{ width: 50, height: 50 }} key={badge.id}/>
                        ))} 
                    </>) 
                    : (<Text style={styles.regularText}>Még nincsenek kitűzőid.</Text>)
                    }
                </View>
            </View>
            <View style={styles.taskContainer}>
                <Text style={styles.header}>TELJESÍTETT TERVEK</Text>
                <View style={styles.rewardContainer}>
                {state.completedPlans ? (
                    <>
                    {state.completedPlans.map((plan) => {
                        const planDetails = state.planDetails.find(details => details.id === plan.plan_id);

                        return (
                            <View key={plan.id} style={{ flexDirection: 'column'}}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center'}} >
                                    {planDetails && <Text style={[styles.boxText, {color: "#C5FE37"}]}>{planDetails.type}</Text>}
                                    {planDetails && <Text style={[styles.boxText, {color: "#fff"}]}>-</Text>}
                                    {planDetails && <Text style={[styles.boxText, {color: "#fff"}]}>{planDetails.difficulty} szint</Text>}
                                </View>
                            </View>
                        );
                    })}
                    </>) 
                    : (<Text style={styles.regularText}>Még nincs teljesített terved.</Text>)
                }
                </View>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
    },

    header: {
        fontSize: 30,
        paddingTop: 20,
        paddingHorizontal: 15,
        color: '#fff'
    },
    
    rewardContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5,
        height: 200
    },

    boxText: {
        fontSize: 20,
        paddingHorizontal: 5,
        textAlign: 'center',
        textAlignVertical: 'center'
    },

    regularText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        textAlign: 'center',
        textAlignVertical: 'center'
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
})

export default Rewards