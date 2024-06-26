import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable, LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const Welcome = ({navigation}) => {
    return (
        <View style={styles.Container}>
            <View style={styles.TopContainer}>
                <Text style={styles.WelcomeText}>
                    ÖRÖMMEL {'\n'}
                    LÁTJUK, HOGY {'\n'}
                    A {''}
                    <Text style={styles.AppName}>VIVIDA</Text> {'\n'}
                    ALKALMAZÁST {'\n'}
                    VÁLASZTOTTA!
                </Text>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.LoginButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.LoginButtonText}>BELÉPEK</Text>
                    </Pressable>
                    <Pressable style={styles.RegisterButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.RegisterButtonText}>REGISZTRÁLOK</Text>
                    </Pressable>
                </TouchableOpacity>                
            </View>
        </View>
    )
}

export default Welcome

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

    WelcomeText: {
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
    
    RegisterButton: {
        width: 350,
        margin: 4,
        padding: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 7
    },

    RegisterButtonText: {
        fontSize: 16,
        color: '#FFF',
        marginLeft: 'auto',
        marginRight: 'auto'
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