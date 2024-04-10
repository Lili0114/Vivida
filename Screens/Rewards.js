import { Text, StyleSheet, View, Animated, Pressable, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from '../Services/firebase';

const Rewards = () => {

    const [userData, setUserData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [previousUserLevel, setPreviousUserLevel] = useState(null);
    const [currentUserLevel, setCurrentUserLevel] = useState(null);
    const [length, setLength] = useState(0);

    useEffect(() => {
        /*const fetchUserData = async () => {
            const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
            const userDocSnap = await getDoc(currentUserDoc);
    
            if (userDocSnap.exists()) {
                setUserData(userDocSnap.data());
    
                const levelsCollection = collection(db, 'levels');
                const levelsSnapshot = await getDocs(levelsCollection);
                const levelsData = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));    
                const currentLevel = levelsData.find(level => parseInt(level.id, 10) == userDocSnap.data().level);  //query(levelsCollection, where('3', "==", userDocSnap.data().level)); 
                const currentLevelDocSnap = await getDoc(doc(collection(db, "levels"), currentLevel.id));

                if (currentLevel.id > 1) {
                    const previousLevel = levelsData.find(level => parseInt(level.id, 10) == userDocSnap.data().level-1);
                    const previousLevelDocSnap = await getDoc(doc(collection(db, "levels"), previousLevel.id));
                    
                    setLength(currentLevel.requiredXP - previousLevel.requiredXP);
                    setProgress(((userDocSnap.data().xp - previousLevel.requiredXP) / length) * 100);
                    setCurrentUserLevel(currentLevelDocSnap.data());
                    setPreviousUserLevel(previousLevelDocSnap.data());
                }
                else{
                    const previousLevel = { id: '0', requiredXP: 0 };
                    setLength(currentLevel.requiredXP);
                    setProgress((userDocSnap.data().xp / length) * 100);
                    setCurrentUserLevel(currentLevelDocSnap.data());
                    setPreviousUserLevel(previousLevel);
                }
            } else {
                console.log("A felhasználó dokumentuma nem található.");
            }
        };
    
        fetchUserData();*/
    }, [userData]);

    const handleXPIncrease = async () => {
        const currentUserDoc = doc(collection(db, "users"), auth.currentUser.uid);
        const userDocSnap = await getDoc(currentUserDoc);
    
        if (userDocSnap.exists()) {
            const currentXP = userDocSnap.data().xp;
            const newXP = currentXP + 20;
            const userLevel = userDocSnap.data().level;
            const levelsSnapshot = await getDocs(collection(db, 'levels'));
            const levelsData = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));    
            const currentLevel = levelsData.find(level => parseInt(level.id, 10) == userLevel); 

            if (newXP >= currentLevel.requiredXP) {
                await updateDoc(currentUserDoc, {
                    level: userLevel + 1,
                    xp: newXP
                });
                currentLevel.id = currentLevel.id + 1;
                Alert.alert("Level up", `${userLevel+1}. szintre léptél. Csak így tovább!`, [
                    {
                        text: 'OK',
                    }
                ]);
            } else {
                await updateDoc(currentUserDoc, {
                    xp: newXP
                });  
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Jutalmak</Text>
                <Text style={[styles.header, styles.boldText]}>Jelenlegi szint</Text>

                <Text style={[styles.regularText, styles.boldText, {paddingTop: 10}]}>{userData && userData.level ? `${userData.level}. szint` : "0. szint"}</Text>
                <Text style={[styles.regularText, styles.boldText, {paddingBottom: 10}]}>{userData && userData.xp ? `${userData.xp} XP` : "-"}</Text>  

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View style={{ ...StyleSheet.absoluteFill, borderRadius: 10, backgroundColor: "#1989DF", width: `${progress}%` }}/>
                    </View>
                </View>
                <View style={styles.levelContainer}>                    
                    <Text style={styles.regularText}>{userData && previousUserLevel ? `${previousUserLevel.requiredXP} XP` : "-" }</Text>
                    <Text style={styles.regularText}>{userData && currentUserLevel ? `${currentUserLevel.requiredXP} XP` : "-"}</Text>
                </View>                    
               
                <Text style={[styles.header, styles.boldText]}>Kitűzők</Text>
                <Text style={styles.regularText}>Itt találod az eddig megszerzett kitűzőidet</Text>
                <Text style={[styles.header, styles.boldText]}>Beváltható kuponok</Text>
                <Text style={styles.regularText}>Itt találod az elérhető kuponokat, amiket pontjaid felhasználásával tudsz megszerezni</Text>
                <TouchableOpacity>
                    <Pressable style={styles.xpButton} onPress={handleXPIncrease}>
                        <Text style={{ padding: 10, color: 'white', textAlign: 'center'}}>Növeld az xp-d!</Text>
                    </Pressable>
                </TouchableOpacity>
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

    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    xpButton: {
        width: 150,
        backgroundColor: '#1989DF',
        borderRadius: 7,
        paddingVertical: 5,
        marginVertical: 15,
        marginHorizontal: 15
      },

})

export default Rewards