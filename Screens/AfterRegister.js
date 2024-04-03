import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';

const AfterRegister = ({navigation}) => {
    return (
        <View style={styles.Container}>
            <View style={styles.TopContainer}>
                <Text style={styles.Caption}>
                    A TÖKÉLETES {'\n'}
                    EDZÉSTERV {'\n'}
                    ELKÉSZÍTÉSÉHEZ {''}
                    ADD MEG {'\n'}
                    ADATAID!
                </Text>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.LoginButton} onPress={() => navigation.navigate('AfterRegisterDetails')}>
                        <Text style={styles.LoginButtonText}>MEGADOM</Text>
                    </Pressable>
                </TouchableOpacity>                
            </View>
        </View>
    )
}

export default AfterRegister

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
    },

    TopContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 15
    },

    Caption: {
        fontSize: 36,
        color: '#FFF',
        textAlign: 'left',
    },

    ButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    LoginButton: {
        width: 350,
        margin: 4,
        padding: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 7,
        marginBottom: 10
    },

    LoginButtonText: {
        fontSize: 16,
        color: '#FFF',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    AppName: {
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
})