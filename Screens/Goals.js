import { Text, StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useReducer } from 'react';
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Services/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from './Notification';
import { useNotificationsEnabled } from './NotificationsEnabledContext';

const initialState = {
    query: null,
    chosenPlan: null,
    planDetail: null,
    completedGoals: [],
    notCompletedGoals: [],
    lastFetch: new Date(),
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_QUERY':
            return { ...state, query: action.payload };
        case 'SET_CHOSEN_PLAN':
            return { ...state, chosenPlan: action.payload };
        case 'SET_PLAN_DETAIL':
            return { ...state, planDetail: action.payload };
        case 'SET_COMPLETED_GOALS':
            return { ...state, completedGoals: action.payload };
        case 'SET_NOT_COMPLETED_GOALS':
            return { ...state, notCompletedGoals: action.payload };
        case 'SET_LAST_FETCH':
            return { ...state, lastFetch: action.payload };
        default:
            throw new Error();
    }
}

const Goals = () => {

    const [state, setState] = useReducer(reducer, initialState);
    const { notificationsEnabled, setNotificationsEnabled } = useNotificationsEnabled();

    useEffect(() => {
        const planAndGoals = async () => {
            // Kiválasztott terv
            const userPlanCollection = collection(db, 'user_plan');
            const q = query(userPlanCollection, where('user_id', '==', auth.currentUser.uid), where('completed', '==', false));
            setState({ type: 'SET_QUERY', payload: q });
            const querySnapshot = await getDocs(q);            
            if (querySnapshot.empty) {
                return;
            }
    
            const userPlan = querySnapshot.docs[0];
            const plan = { id: userPlan.id, ...userPlan.data() };
            setState({ type: 'SET_CHOSEN_PLAN', payload: plan });
            
            const planData = querySnapshot.docs[0].data();
            const planRef = doc(db, 'plans', planData.plan_id);
            const planSnapshot = await getDoc(planRef);
            const p = { id: planSnapshot.id, ...planSnapshot.data() };
            setState({ type: 'SET_PLAN_DETAIL', payload: p });

            // A terv céljai, adatai

            const goalsCollection = collection(doc(db, 'user_plan', querySnapshot.docs[0].id), 'goals');
            const goalsSnapshot = await getDocs(goalsCollection);
            const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const completedGoals = goalsData.filter(goal => goal.completed);
            const notCompletedGoals = goalsData.filter(goal => !goal.completed);
            setState({ type: 'SET_COMPLETED_GOALS', payload: completedGoals });
            setState({ type: 'SET_NOT_COMPLETED_GOALS', payload: notCompletedGoals });

        };

        const fetchData = async () => {
            await planAndGoals();
            setState({ type: 'SET_LAST_FETCH', payload: Date.now() });
        };
                
        const intervalId = setInterval(() => {
            fetchData();
        }, 3000);
        
        return () => {
            clearInterval(intervalId);
        };
    
    }, [state.chosenPlan, state.completedGoals, state.notCompletedGoals, state.query]);

    const completeGoal = async (goal) => {
        try {
            const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
            const userDocSnap = await getDoc(currentUserDoc);
    
            if (userDocSnap.exists()) {
                const currentXP = userDocSnap.data().xp;
                const newXP = currentXP + goal.xp;
                const userLevel = userDocSnap.data().level;
                const levelsSnapshot = await getDocs(collection(db, 'levels'));
                const levelsData = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));    
                const currentLevel = levelsData.find(level => parseInt(level.id, 10) == userLevel); 

                // COMPLETED & CALORIES
                const goalRef = doc(db, `user_plan/${state.chosenPlan.id}/goals/${goal.id}`);
                await updateDoc(goalRef, {
                    completed: true,
                    burned_calories: goal.calories
                });

                // XP
                if (newXP >= currentLevel.requiredXP) {
                    await updateDoc(currentUserDoc, {
                        level: userLevel + 1,
                        xp: newXP
                    });
                    currentLevel.id = currentLevel.id + 1;
                    showToast('success', 'Szintet léptél', `${userLevel+1}. szintre léptél. Gratulálok!`, 5000, notificationsEnabled);
                } else {
                    await updateDoc(currentUserDoc, {
                        xp: newXP
                    });  
                }

                showToast('success', 'Cél teljesítve', 'Csak így tovább!', 4000, notificationsEnabled);

                // Teljesítve van-e minden cél -> teljesítve van-e a terv
                const goalsCollection = collection(doc(db, 'user_plan', state.chosenPlan.id), 'goals');
                const goalsSnapshot = await getDocs(goalsCollection);
                const goalsData = goalsSnapshot.docs.map(doc => doc.data());

                const allGoalsCompleted = goalsData.every(goal => goal.completed);

                if (allGoalsCompleted) {
                    const userPlanRef = doc(db, 'user_plan', state.chosenPlan.id);
                    await updateDoc(userPlanRef, {
                        completed: true
                    });
                    showToast('success', 'Terv teljesítve!', 'Minden célt befejeztél!', 5000, notificationsEnabled);
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    };

    return (
        <View style={styles.container}>
            <ScrollView>

                {state.chosenPlan && state.chosenPlan.completed == false ? (
                    <>
                        <Text style={styles.header}>{state.planDetail ? `${state.planDetail.type} - ${state.planDetail.difficulty} szint` : ''}</Text>
                        <Text style={styles.category}>Hátralévő</Text>
                        {state.notCompletedGoals.map((goal) => (
                            <View key={goal.id} style={styles.goalContainer}>
                                <Text style={styles.challengeXp}>{goal.xp} xp</Text>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', width: 220}}>
                                    <Text style={styles.challengeText}>{goal.description}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[styles.challengeText, {color: '#958CAB', marginRight: 10}]}>{goal.calories} kcal</Text>
                                    </View>
                                </View>
                                <View style={[styles.arrowContainer, { maxHeight: 60}]}>
                                    <Ionicons
                                        name='checkmark-circle-outline'
                                        size={40}
                                        color={'#C5FE37'}
                                        onPress={() => completeGoal(goal)}
                                    />
                                </View>
                            </View>
                        ))}

                        <Text style={styles.category}>Teljesített</Text>
                        {state.completedGoals.map((goal) => (
                            <View key={goal.id} style={styles.goalContainer}>
                                <Text style={styles.challengeXp}>{goal.xp} xp</Text>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', width: 220}}>
                                    <Text style={styles.challengeText}>{goal.description}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[styles.challengeText, {color: '#958CAB', marginRight: 10}]}>{goal.calories} kcal</Text>
                                    </View>
                                </View>
                                <View style={[styles.arrowContainer, { maxHeight: 60}]}>
                                    <Ionicons
                                        name='checkmark-circle-sharp'
                                        size={40}
                                        color={'#C5FE37'}
                                    />
                                </View>
                            </View>
                        ))}
                    </>
                ) : (
                    <Text style={styles.regularText}>Válassz ki egy tervet, hogy tudj célokat teljesíteni!</Text>
                )}        
            </ScrollView>
        </View>
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
        textAlign: 'center',
        paddingVertical: 15
    },

    boldText: {
        fontWeight: 'bold',
        color: "#FFFFFF",
    },

    header: {
        fontSize: 28,
        paddingTop: 20,
        paddingHorizontal: 15,
        color: '#C5FE37',
        textAlign: 'center'
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

    category: {
        fontSize: 24,
        marginTop: 20,
        color: '#fff',
        paddingHorizontal: 15
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
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#958CAB',
        flexDirection: 'row'
    },

    goalText: {
        fontSize: 15,
        color: '#fff'
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
        marginTop: 5
        //flex: 1,
    },

    challengeText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
        marginLeft: 10,

        flex: 3
    },

    arrowContainer: {
        padding: 10,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        //marginRight: 20,
        flex: 1,
    },
})

export default Goals