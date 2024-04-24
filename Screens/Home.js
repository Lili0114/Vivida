import { Text, StyleSheet, View, Animated, Pressable, ScrollView } from 'react-native';
import React, { Component, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image } from 'react-native-elements';
import { db, auth } from '../Services/firebase';
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import StepCounter from './StepCounter';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import { NotificationContext } from '../NotificationProvider';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showToast } from './Notification';

const initialState = {
    userData: null,
    chosenPlan: null,
    goals: [],
    length: 0,
    progress: 0,
    planProgress: 0,
    previousUserLevel: null,
    currentUserLevel: null,
    totalHours: 0,
    totalWorkoutSessions: 0,
    totalBurnedCalories: 0,
    lastPlanUpdate: Date.now(),
    lastFetch: new Date(),
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_USER_DATA':
            return { ...state, userData: action.payload };
        case 'SET_CHOSEN_PLAN':
            return { ...state, chosenPlan: action.payload };
        case 'SET_GOALS':
            return { ...state, goals: action.payload };
        case 'SET_LENGTH':
            return { ...state, length: action.payload };
        case 'SET_PROGRESS':
            return { ...state, progress: action.payload };
        case 'SET_PLAN_PROGRESS':
            return { ...state, planProgress: action.payload };
        case 'SET_PREVIOUS_USER_LEVEL':
            return { ...state, previousUserLevel: action.payload };
        case 'SET_CURRENT_USER_LEVEL':
            return { ...state, currentUserLevel: action.payload };
        case 'SET_TOTAL_HOURS':
            return { ...state, totalHours: action.payload };        
        case 'SET_TOTAL_WORKOUT_SESSIONS':
            return { ...state, totalWorkoutSessions: action.payload };
        case 'SET_TOTAL_BURNED_CALORIES':
            return { ...state, totalBurnedCalories: action.payload };
        case 'LAST_PLAN_UPDATE':
            return { ...state, lastPlanUpdate: action.payload };
        case 'SET_LAST_FETCH':
            return { ...state, lastFetch: action.payload };
        default:
            throw new Error();
    }
}

const Home = ({navigation}) => {

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {

        const userData = async () => {
            const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
            const userDocSnap = await getDoc(currentUserDoc);
        
            if (userDocSnap.exists()) {
                setState({ type: 'SET_USER_DATA', payload: userDocSnap.data() });
        
                const levelsCollection = collection(db, 'levels');
                const levelsSnapshot = await getDocs(levelsCollection);
                const levelsData = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));    
                const currentLevel = levelsData.find(level => parseInt(level.id, 10) == userDocSnap.data().level);
                const currentLevelDocSnap = await getDoc(doc(collection(db, "levels"), currentLevel.id));
        
                if (currentLevel.id > 1) {
                    const previousLevel = levelsData.find(level => parseInt(level.id, 10) == userDocSnap.data().level-1);
                    const previousLevelDocSnap = await getDoc(doc(collection(db, "levels"), previousLevel.id));
                    
                    const length = currentLevel.requiredXP - previousLevel.requiredXP;
                    const progress = ((userDocSnap.data().xp - previousLevel.requiredXP) / length) * 100;
                    setState({ type: 'SET_LENGTH', payload: length });
                    setState({ type: 'SET_PROGRESS', payload: progress });
                    setState({ type: 'SET_CURRENT_USER_LEVEL', payload: currentLevelDocSnap.data() });
                    setState({ type: 'SET_PREVIOUS_USER_LEVEL', payload: previousLevelDocSnap.data() });
                }
                else{
                    const previousLevel = { id: '0', requiredXP: 0 };
                    const length = currentLevel.requiredXP;
                    const progress = (userDocSnap.data().xp / length) * 100;
                    setState({ type: 'SET_LENGTH', payload: length });
                    setState({ type: 'SET_PROGRESS', payload: progress });
                    setState({ type: 'SET_CURRENT_USER_LEVEL', payload: currentLevelDocSnap.data() });
                    setState({ type: 'SET_PREVIOUS_USER_LEVEL', payload: previousLevel });
                }

            } else {
                console.log("A felhasználó dokumentuma nem található.");
            }
        };

        const planAndGoals = async () => {
            // Kiválasztott terv
            const userPlanCollection = collection(db, 'user_plan');
            const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid), where('completed', '==', false));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return;
            }
            setState({ type: 'LAST_PLAN_UPDATE', payload: Date.now() });
            
            const userPlan = querySnapshot.docs[0];
            const plan = { id: userPlan.id, ...userPlan.data() };
            setState({ type: 'SET_CHOSEN_PLAN', payload: plan });
            
            // A terv céljai, adatai
            const goalsCollection = collection(doc(db, 'user_plan', querySnapshot.docs[0].id), 'goals');
            const goalsSnapshot = await getDocs(goalsCollection);
            const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setState({ type: 'SET_GOALS', payload: goalsData });

            const totalGoals = goalsData.length;
            const completedGoals = goalsData.filter(goal => goal.completed).length;
            const planProgress = (completedGoals / totalGoals) * 100;
            setState({ type: 'SET_PLAN_PROGRESS', payload: planProgress });

            // Össz kalória
            const userplansCollection = collection(db, 'user_plan');
            const p = query(userplansCollection, where('user_id', '==', auth.currentUser.uid));
            const pSnapshot = await getDocs(p);
            
            let totalBurnedCalories = 0;
            for (const doc of pSnapshot.docs) {
                const goalsCollection = collection(doc.ref, 'goals');
                const goalsSnapshot = await getDocs(goalsCollection);
                for (const goalDoc of goalsSnapshot.docs) {
                    const goalData = goalDoc.data();
                    totalBurnedCalories += goalData.burned_calories;
                }
            }                    
            setState({ type: 'SET_TOTAL_BURNED_CALORIES', payload: totalBurnedCalories });

        };

        const workouts = async () => {
            const workoutsCollection = collection(db, 'workouts');
            const q = query(workoutsCollection, where('user_id', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return;
            }

            let totalMinutes = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                totalMinutes += parseFloat(data.elapsed_minutes);
            });

            setState({ type: 'SET_TOTAL_HOURS', payload: (totalMinutes / 60).toFixed(1) });
            setState({ type: 'SET_TOTAL_WORKOUT_SESSIONS', payload: querySnapshot.size });
        };

        const fetchData = async () => {
            await userData();
            await planAndGoals();
            await workouts();
            setState({ type: 'SET_LAST_FETCH', payload: Date.now() });
        };
                
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);
        
        return () => {
            clearInterval(intervalId);
        };
        
    }, [state.userData, state.chosenPlan, state.lastPlanUpdate]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topContainer}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            style={{ borderRadius: 100, width: 100, height: 100 }}
                            source={ state.userData && state.userData.profilePicture !== "" 
                            ? {uri: state.userData.profilePicture} 
                            : require('../assets/images/blank-profile-picture.png')  } />
                        <Text style={{ color: '#FFF', fontSize: 16, marginTop: 10}}>{state.userData ? `${state.userData.username}` : "Betöltés..."}</Text>
                        <Text style={{ color: '#FFF', fontSize: 16}}>{state.userData && state.userData.level ? `${state.userData.level}. szint` : "0. szint"}</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progress, { width: `${state.progress}%` }]} />
                        </View>
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={{ color: '#C5FE37', fontSize: 12, fontStyle: 'italic'}}>{state.userData ? `${state.userData.xp} XP ` : "-"}</Text>
                            <Text style={{ color: '#958CAB', fontSize: 12, fontStyle: 'italic'}}>/</Text>
                            <Text style={{ color: '#958CAB', fontSize: 12, fontStyle: 'italic'}}>{state.userData && state.currentUserLevel ? ` ${state.currentUserLevel.requiredXP} XP` : "-"}</Text>
                        </View>
                    </View>
                </View>

                <StepCounter/>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 40, padding: 5 }}>
                    <View style={{ alignItems: 'center'}}>
                        <MaterialCommunityIcons
                            name='clock-outline'
                            size={50}
                            color='#FFF'
                        />
                        <Text style={[styles.statText, { color: '#C5FE37'}]}>
                            { state.totalHours ? state.totalHours : 0}
                        </Text>
                        <Text style={[styles.statText, { color: '#958CAB'}]}>óra</Text>
                    </View>
                    <View style={{ alignItems: 'center'}}>
                        <MaterialCommunityIcons
                            name='heart-pulse'
                            size={50}
                            color='#FFF'
                        />
                        <Text style={[styles.statText, { color: '#C5FE37'}]}>
                            { state.totalWorkoutSessions ? state.totalWorkoutSessions : 0}
                        </Text>
                        <Text style={[styles.statText, { color: '#958CAB'}]}>edzés</Text>
                    </View>
                    <View style={{ alignItems: 'center'}}>
                        <MaterialCommunityIcons
                            name='fire'
                            size={50}
                            color='#FFF'
                        />
                        <Text style={[styles.statText, { color: '#C5FE37'}]}>
                           {state.totalBurnedCalories ? state.totalBurnedCalories : 0}
                        </Text>
                        <Text style={[styles.statText, { color: '#958CAB'}]}>kcal</Text>
                    </View>
                </View>

                {/* 
                <View style={styles.taskContainer}>
                    <Text style={styles.header}>KIHÍVÁS ELÉRHETŐ</Text>
                    <View style={styles.challengeContainer}>
                        <Text style={styles.challengeXp}>70 xp</Text>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-around', width: 220}}>
                            <Text style={styles.challengeText}>Hajts végre 50 darab felülést!</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.challengeText, {color: '#958CAB', marginRight: 10}]}>22ó 40p maradt</Text>
                            </View>
                        </View>
                        <View style={[styles.arrowContainer, { maxHeight: 60}]}>
                            <Ionicons
                                name='arrow-forward-outline'
                                size={30}
                                color={'#C5FE37'}/>
                        </View>
                    </View>
                    
                </View>*/}

                {/* Max 2 display */}
                <View style={[styles.taskContainer, {marginTop: 30}]}>
                    <Text style={styles.header}>LEGÚJABB JUTALMAK</Text>
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>10%-os kuponod van a Gymesco edzőterembe.</Text>
                    </View>
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>
                            Tegnapi nap folyamán
                            megszerezted a "lelkes
                            sportoló" kitüntetést.</Text>
                    </View>
                </View>

                <View style={styles.taskContainer}>
                    <Text style={styles.header}>ELŐREHALADÁS</Text>
                    {state.chosenPlan ? (
                    <View style={{alignItems: 'center', marginVertical: 25}}>
                        <View style={[styles.planProgressBar,]}>
                            <View style={[styles.planProgress, { width: `${state.planProgress}%` }]} />
                        </View>
                        <Text style={styles.planProgressText}>Edzésterv {state.planProgress}%-a teljesítve</Text>
                    </View> )
                    : (<Text style={styles.regularText}>Még nincs kiválasztva terved.</Text>)
                    }
                </View>

                <View style={styles.taskContainer}>
                    <Text style={styles.header}>AKTUÁLIS CÉLOK</Text>

                    {state.chosenPlan ? (
                    <>
                        {state.goals.slice(0,3).map((goal) => (

                            <View key={goal.id} style={styles.goalContainer}>
                                <Text style={styles.xpText}>{goal.xp} xp</Text>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <Text style={styles.goalText}>{goal.description}</Text>
                                    <Text style={[styles.goalText, {color: '#958CAB'}]}>{goal.calories} kcal</Text>
                                </View>
                            </View>
                        ))} 

                        {state.goals.length > 3 && 
                            <View style={styles.otherGoals}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.regularText}>Tekintsd meg az összes célt!</Text>
                                    <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 50}]}>
                                        <Ionicons
                                            name='arrow-forward-outline'
                                            size={30}
                                            color={'#C5FE37'}
                                            onPress={() => navigation.navigate('Célok')}/>
                                    </View>
                                </View>
                            </View>
                        }
                    </>
                    ) : (
                        <Text style={styles.regularText}>Válassz ki egy tervet, hogy tudj célokat teljesíteni!</Text>
                    )}

                </View>

                {/*<View style={styles.taskContainer}>
                    <Text style={styles.header}>HETI STATISZTIKÁK</Text>
                    <View style={styles.rewardContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                            <View style={{ alignItems: 'center'}}>
                                <MaterialCommunityIcons
                                    name='clock-outline'
                                    size={50}
                                    color='#FFF'
                                />
                                <Text style={[styles.statText, { color: '#C5FE37'}]}>8</Text>
                                <Text style={[styles.statText, { color: '#958CAB'}]}>óra</Text>
                            </View>
                            <View style={{ alignItems: 'center'}}>
                                <MaterialCommunityIcons
                                    name='heart-pulse'
                                    size={50}
                                    color='#FFF'
                                />
                                <Text style={[styles.statText, { color: '#C5FE37'}]}>3</Text>
                                <Text style={[styles.statText, { color: '#958CAB'}]}>edzés</Text>
                            </View>
                            <View style={{ alignItems: 'center'}}>
                                <MaterialCommunityIcons
                                    name='fire'
                                    size={50}
                                    color='#FFF'
                                />
                                <Text style={[styles.statText, { color: '#C5FE37'}]}>760</Text>
                                <Text style={[styles.statText, { color: '#958CAB'}]}>kcal</Text>
                            </View>
                        </View>
                        <Pressable >//onPress
                            <Text style={[styles.statText, { fontStyle: 'italic', marginTop: 10, fontSize: 14 }]}> További elemzések {'>'}</Text>
                        </Pressable>
                    </View>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
        //backgroundColor: 'red',
        marginBottom: 20
    },

    topContainer: {
        //flex: 1, 3?
        marginVertical: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },

    progressContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },

    regularText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        textAlign: 'center',
        textAlignVertical: 'center'
    },

    rewardContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5,
    },

    otherGoals: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 20,
        paddingLeft: 5
    },

    arrowContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        padding: 10,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        //marginRight: 20,
        flex: 1,
    },

    goalContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    challengeContainer: {
        marginTop: 10,
        marginHorizontal: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    xpText:{
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#958CAB',
        color: '#C5FE37',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 50,
        height: 50,
    },

    challengeXp: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#958CAB',
        color: '#C5FE37',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 50,
        height: 50,
        
        //flex: 1,
    },

    rewardText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        marginRight: 150,
    },

    statText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
    },

    goalText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        marginLeft: 10,
        marginRight: 70
    },

    planProgressText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        textAlign: 'center',
        justifyContent: 'center'    
    },

    challengeText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        marginLeft: 10,

        flex: 3
    },

    boldText: {
        fontWeight: 'bold',
        color: "#FFFFFF",
    },

    header: {
        fontSize: 24,
        paddingTop: 20,
        paddingHorizontal: 15,
        color: '#C5FE37'
    },

    progressBar: {
        marginVertical: 15,
        height: 3,
        backgroundColor: '#958CAB',
        borderRadius: 5,
        width: '50%',
    },

    planProgressBar: {
        marginVertical: 15,
        height: 8,
        backgroundColor: '#958CAB',
        borderRadius: 5,
        width: '50%',
    },

    iconsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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
        fontSize: 10,
        color: "#FFFFFF",
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

    taskContainer: {
        flex: 2,
        flexDirection: 'column',
    },

    containerScrollView: {
        flexDirection: 'row',

    },

    quizCards: {
        height: 200,
        width: 180
    },

    progress: {
        height: '100%',
        borderRadius: 5,
        backgroundColor: '#C5FE37',
    },

    planProgress: {
        height: '100%',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
})

export default Home