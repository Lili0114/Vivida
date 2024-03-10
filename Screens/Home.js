import { Text, StyleSheet, View, Animated, Pressable } from 'react-native';
import React, { Component, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { Button, Image } from 'react-native-elements';
import { db } from '../Services/firebase';
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
    const [progress, setProgress] = useState(0);

    const counter = useRef(new Animated.Value(0)).current;
    const width = counter.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp"
      })

    const handlePress = () => {
      setProgress((prevProgress) => prevProgress + 0.1);
    };

    async function listUsers() {
        const collectionRef = collection(db, "users");
        const snapshot = await getDocs(collectionRef);
        snapshot.forEach(doc => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Kezdőlap</Text>
            </View>

            <View style={styles.progressContainer}>
                <Text style={styles.regularText}>Tekintsd meg mennyit haladtál:</Text>
                <View style={styles.progressBar}>
                    <Animated.View style={{ ...StyleSheet.absoluteFill, borderRadius: 10, backgroundColor: "#1989DF", width: "70%" }}/>
                </View>
            </View>

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
                    <Image 
                        source={require('../assets/images/triangle.png')}
                        style={styles.categoryCardImage}/>
                    <Text style={styles.iconText}>Egyéb</Text>
                </View>
            </View>

            <View style={styles.quizContainer}>
                <Text style={[styles.header, styles.boldText]}>Ajánlott feladatok</Text>
                <Text style={styles.regularText}>Végezd el a napi feladatokat, hogy minél több jutalmat és jelvényt szerezhess!</Text>
            </View>
        {/*<View>
          <Progress.Bar progress={progress} width={200} height={20} />
          <Button onPress={handlePress} title="Increase progress" />
          <Text>Progress: {(progress * 100).toFixed(0)}%</Text>
        </View>*/}
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
        paddingHorizontal: 15
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
        fontSize: 10
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
    }
})

export default Home