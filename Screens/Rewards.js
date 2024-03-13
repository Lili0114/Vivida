import { Text, StyleSheet, View, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from '../Services/firebase';

const Rewards = () => {

    const [userData, setUserData] = useState(null);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
          const userDocSnap = await getDoc(currentUserDoc);
    
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("A felhasználó dokumentuma nem található.");
          }
        };

        const fetchLevels = async () => {
            const levelsCollection = collection(db, 'levels');
            const levelsSnapshot = await getDocs(levelsCollection);
            setLevels(levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          };

        console.log("Szintek: ", levels);
        fetchLevels();
    
        fetchData();
      }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Jutalmak</Text>
                <Text style={[styles.header, styles.boldText]}>Jelenlegi szint</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View style={{ ...StyleSheet.absoluteFill, borderRadius: 10, backgroundColor: "#1989DF", width: "70%" }}/>
                    </View>
                </View>

                <Text style={styles.regularText}>{userData && userData.level ? `${userData.level}. szint` : "0. szint"}</Text>
                <Text style={styles.regularText}>{userData && userData.xp ? `${userData.xp} XP` : "-"}</Text>               
                <Text style={[styles.header, styles.boldText]}>Kitűzők</Text>
                <Text style={styles.regularText}>Itt találod az eddig megszerzett kitűzőidet</Text>
                <Text style={[styles.header, styles.boldText]}>Beváltható kuponok</Text>
                <Text style={styles.regularText}>Itt találod az elérhető kuponokat, amiket pontjaid felhasználásával tudsz megszerezni</Text>
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
        flexDirection: 'column',
    },

    progressContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15
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

    quizCards: {
        height: 200,
        width: 180
    }
})

export default Rewards