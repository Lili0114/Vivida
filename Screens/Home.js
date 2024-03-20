import { Text, StyleSheet, View, Animated, Pressable } from 'react-native';
import React, { Component, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image } from 'react-native-elements';
import { db, auth } from '../Services/firebase';
import { collection, updateDoc, getDoc, doc, onSnapshot } from "firebase/firestore";
import StepCounter from './StepCounter';
import storage from '@react-native-firebase/storage';
//import Notifications from 'react-native-notifications';

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    /*PushNotification.localNotificationSchedule({
        message: "Hello, this is a scheduled notification!", 
        date: new Date(Date.now() + (10 * 1000)) // 10 mp múlva
    });*/

    useEffect(() => {
        const images = ['test_badge.png'];
    
        const fetchImage = async (imageName) => {
            const url = await storage().ref('/badges/' + imageName).getDownloadURL();
            return url;
        };
    
        const fetchAllImages = async () => {
            const urls = await Promise.all(images.map(fetchImage));
            setImageUrls(urls);
        };
    
        fetchAllImages().catch((e) => console.log('Errors while downloading => ', e));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Kezdőlap</Text>
            </View>

            <StepCounter/>

            <View style={styles.iconsContainer}>
                <View style={styles.icons}>
                    <Image 
                        source={require('../assets/images/triangle.png')}
                        style={styles.categoryCardImageInCaseOfLongText}/>
                    <Text style={styles.iconText}>Napi {"\n"}mérések</Text>
                </View>
                <View style={styles.icons}>
                    <Image 
                        source={require('../assets/images/triangle.png')}
                        style={styles.categoryCardImage}/>
                    <Text style={styles.iconText}>Statisztikák</Text>
                </View>
                <View style={styles.icons}>
                    {imageUrls[0] && <Image source={{ uri: imageUrls[0] }} style={styles.categoryCardImage} />}
                    <Text style={styles.iconText}>Egyéb</Text>
                </View>
            </View>

            <View style={styles.taskContainer}>
                <Text style={[styles.header, styles.boldText]}>Ajánlott feladatok</Text>
                <Text style={styles.regularText}>Végezd el a napi feladatokat, hogy minél több jutalmat és jelvényt szerezhess!</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ADCEE8',
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