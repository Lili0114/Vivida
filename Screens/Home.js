import { Text, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import * as Progress from 'react-native-progress';
import { auth } from '../Firebase';
import { Card, Image } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const Home = () => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Kezdőoldal</Text>
            </View>

            <View style={styles.progressContainer}>
                <Text style={styles.regularText}>Tekintsd meg, hogy hogyan teljesítesz:</Text>
                <Progress.Bar style={styles.progressBar} />
            </View>

            <View style={styles.iconsContainer}>
                <View style={styles.icons}>
                    <Text style={styles.iconText}>Kategóriák</Text>
                </View>
                <View style={styles.icons}>
                    <Text style={styles.iconText}>Ranglista</Text>
                </View>
                <View style={styles.icons}>
                    <Text style={styles.iconText}>Ingyenes kurzusok</Text>
                </View>
                <View style={styles.icons}>
                    <Text style={styles.iconText}>Egyéb</Text>
                </View>
            </View>

            <View style={styles.quizContainer}>
                <Text style={[styles.header, styles.boldText]}>Ajánlott kvízek</Text>
                <Text style={styles.regularText}>Próbáld ki magad az alábbi kvízek egyikében!</Text>
                <ScrollView
                    horizontal='true'
                    contentContainerStyle={styles.containerScrollView}>
                    <Card containerStyle={styles.quizCards}>
                        <Text style={styles.cardText}>Kvíz 1</Text>
                    </Card>
                    <Card containerStyle={styles.quizCards}>
                        <Text>Kvíz 2</Text>
                    </Card>
                    <Card containerStyle={styles.quizCards}>
                        <Text>Kvíz 3</Text>
                    </Card>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
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
        fontWeight: 'bold'
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

export default Home