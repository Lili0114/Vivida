import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, KeyboardAvoidingView, Pressable } from 'react-native';

const Welcome = ({navigation}) => {
    return (
        <View style={styles.Container}>
            <View style={styles.TopContainer}>
                <Image 
                    source={require('../assets/images/logo.png')}
                    style={styles.LogoStyle}/>
                <Text style={styles.WelcomeText}>Lorem ipsum dolor sit amet, consectetur.</Text>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity>
                    <Pressable style={styles.RegisterButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.RegisterButtonText}>KEZDÉS</Text>
                    </Pressable>
                    <Pressable style={styles.LoginButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.LoginButtonText}>MÁR VAN PROFILOM</Text>
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
        backgroundColor: '#fff'
    },

    TopContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent:'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    LogoStyle: {
        width: 200,
        height: 200,
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    WelcomeText: {
        fontSize: 17,
        color: '#8562AC'
    },

    ButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    
    RegisterButton: {
        width: 350,
        margin: 4,
        padding: 15,
        backgroundColor: '#8562AC',
        color: '#FFF',
        borderRadius: 7
    },

    RegisterButtonText: {
        fontSize: 18,
        color: '#FFF',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    LoginButton: {
        width: 350,
        margin: 4,
        padding: 15,
        backgroundColor: '#E4E4E4',
        borderRadius: 7
    },

    LoginButtonText: {
        fontSize: 18,
        color: '#8562AC',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
})