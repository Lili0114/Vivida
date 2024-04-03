//Home.js
import { Text, StyleSheet, View, Animated, Pressable, ScrollView } from 'react-native';
import React, { Component, useEffect, useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image } from 'react-native-elements';
import { db, auth } from '../Services/firebase';
import { collection, updateDoc, getDoc, doc, onSnapshot } from "firebase/firestore";
import StepCounter from './StepCounter';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import { NotificationContext } from '../NotificationProvider';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const list = await storage().ref('/badges').listAll();
            const urls = await Promise.all(list.items.map(async (ref) => {
                const url = await ref.getDownloadURL();
                return { name: ref.name, url: url };
            }));
            const imageUrlMap = urls.reduce((acc, { name, url }) => {
                acc[name] = url;
                return acc;
            }, {});
            setImageUrls(imageUrlMap);
        };
    
        fetchImages().catch((e) => console.log('Errors while downloading => ', e));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <StepCounter/>

                {/* Csak akkor kell ezt megjeleníteni, ha van aktuális, VAGY ha nincs, kiírni, hogy jelenleg nincsen kihívás. */}
                <View style={styles.taskContainer}>
                    <Text style={styles.header}>NAPI KIHÍVÁS ÉRHETŐ EL!</Text>
                    <View style={styles.goalContainer}>
                        <Text style={styles.xpText}>35 xp</Text>
                        <Text style={styles.goalText}>
                            A héten fuss le 15 km-t! </Text>
                        <Text style={[styles.goalText, {color: '#958CAB'}]}> 6 / 15</Text>
                        {/*<Text style={styles.goalText}>{'\n'}Hátralévő idő: x</Text>*/}
                    </View>
                </View>

                <View style={styles.taskContainer}>
                    <Text style={styles.header}>KIEMELT JUTALMAK</Text>
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>10%-os kuponod van a {'\n'}Gymesco edzőterembe.</Text>
                    </View>
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>
                            Tegnapi nap folyamán {'\n'}
                            megszerezted a "lelkes {'\n'}
                            sportoló" kitüntetést.</Text>
                    </View>
                </View>

                <View style={styles.taskContainer}>
                    <Text style={styles.header}>AKTUÁLIS CÉLOK</Text>
                    <View style={styles.goalContainer}>
                        <Text style={styles.xpText}>35 xp</Text>
                        <Text style={styles.goalText}>
                            A héten fuss le 15 km-t! </Text>
                        <Text style={[styles.goalText, {color: '#958CAB'}]}> 6 / 15</Text>
                    </View>
                </View>

                <View style={styles.taskContainer}>
                    <Text style={styles.header}>HETI STATISZTIKÁK</Text>
                    <View style={styles.rewardContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.statText}>Elégetett kalória:</Text>
                                <Text style={styles.statText}>Teljesített kihívások:</Text>
                            </View>
                            <View>
                                <Text style={styles.statText}> x kcal </Text>
                                <Text style={styles.statText}> y db </Text>
                            </View>
                        </View>
                        <Pressable /*onPress*/>
                            <Text style={[styles.statText, { fontStyle: 'italic', marginTop: 10, fontSize: 14 }]}> További elemzések {'>'}</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={[styles.regularText, {marginTop: 30}]}>
                        Megjegyzés: a konkrét értékeket 
                        - százalék, kitüntetés neve - változókkal kell majd helyettesíteni 
                        + kitüntetésnél esetleges ikont elhelyezni.
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
        marginBottom: 20
    },

    topContainer: {
        //flex: 1,
        marginVertical: 15,
        flexDirection: 'column'
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

    rewardContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5
    },

    goalContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        
    },

    xpText:{
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#958CAB',
        color: '#C5FE37',
        paddingHorizontal: 5,
        paddingVertical: 12,
        textAlign: 'center'
    },

    rewardText: {
        fontSize: 15,
        paddingHorizontal: 5,
        color: "#FFFFFF",
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
        marginLeft: 10
    },

    boldText: {
        fontWeight: 'bold',
        color: "#FFFFFF",
    },

    header: {
        fontSize: 20,
        paddingTop: 20,
        paddingHorizontal: 15,
        color: '#C5FE37'
    },

    progressBar: {
        height: 20,
        width: 'auto',
        borderRadius: 10,
        marginVertical: 15,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ADCEE8'
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
        flexDirection: 'column'
    },

    containerScrollView: {
        flexDirection: 'row',

    },

    quizCards: {
        height: 200,
        width: 180
    }
})

export default Home