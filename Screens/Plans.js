import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Services/firebase';

const Plans = ({navigation}) => {

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            const plansCollection = collection(db, 'plans');
            const plansSnapshot = await getDocs(plansCollection);
            const plansData = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlans(plansData);
        };
    
        fetchPlans();
    }, []);

    const beginnerPlans = plans.filter(plan => plan.difficulty === 'Kezdő');
    const advancedPlans = plans.filter(plan => plan.difficulty === 'Haladó');

    const handlePlanDetails = (plan) => {
        navigation.navigate('PlanDetails', { plan });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Edzéstervek</Text>
                <Text style={styles.regularText}>Válassz a tervek közül!</Text>
            </View>
            <Text style={[styles.regularText, {fontSize: 18}]}>Kezdő</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.containerScrollView}>
                {beginnerPlans.map((plan) => (
                    <TouchableOpacity key={plan.id} onPress={() => handlePlanDetails(plan)}>
                        <Card containerStyle={styles.planCards}>
                            <Text style={styles.cardText}>{plan.type}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={[styles.regularText, {fontSize: 18}]}>Haladó</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.containerScrollView}>
                {advancedPlans.map((plan) => (
                    <TouchableOpacity key={plan.id} onPress={() => handlePlanDetails(plan)}>
                        <Card containerStyle={styles.planCards}>
                            <Text style={styles.cardText}>{plan.type}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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

    planCards: {
        height: 180,
        width: 200,           
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 15
    },

    cardText: {
        color: 'black',
        fontSize: 18
    },
})

export default Plans