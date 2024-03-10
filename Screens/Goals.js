import { Text, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Goals = () => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={[styles.header, styles.boldText]}>Célok</Text>
                <Text style={styles.regularText}>Tűzz ki célokat, és szerezz jelvényeket!</Text>
            </View>
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

export default Goals