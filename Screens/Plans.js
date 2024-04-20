import { Text, StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Plans = ({navigation}) => {

    const [visible, setVisible] = useState({});
    const openMenu = (id) => setVisible({ ...visible, [id]: true });
    const closeMenu = (id) => setVisible({ ...visible, [id]: false });

    const handlePlanDetails = (planType) => {
        navigation.navigate('PlanDetails', { planType });
    };

    return (
        <SafeAreaView style={styles.container}>
            <PaperProvider>
                <View style={{ height: 80, backgroundColor: '#0B0A0C' }}>
                    <Menu
                        visible={visible['Fogyókúrás']}
                        onDismiss={() => closeMenu('Fogyókúrás')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>FOGYÓKÚRÁS</Text>
                                <Pressable onPress={() => openMenu('Fogyókúrás')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>Hatékonyan segíti a zsírégetést és a testsúlycsökkentést.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Fogyókúrás')}
                                    />
                                </View>
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['Izomépítő']}
                        onDismiss={() => closeMenu('Izomépítő')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>IZOMÉPÍTŐ</Text>
                                <Pressable onPress={() => openMenu('Izomépítő')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>Az izomstimulációt maximalizálja, ezzel növelve az izomtömeget.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Izomépítő')}
                                    />
                                </View>
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['Sport specifikus']}
                        onDismiss={() => closeMenu('Sport specifikus')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>SPORT SPECIFIKUS</Text>
                                <Pressable onPress={() => openMenu('Sport specifikus')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>Specifikusan javítja az állóképességet és a sportteljesítményt.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Sport specifikus')}    
                                    />
                                </View>
                                
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['Erősítő']}
                        onDismiss={() => closeMenu('Erősítő')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>ERŐSÍTŐ</Text>
                                <Pressable onPress={() => openMenu('Erősítő')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>A test különböző részeit segít célzott gyakorlatokkal megerősíteni.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Erősítő')}
                                    />
                                </View>
                                
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['Kardió']}
                        onDismiss={() => closeMenu('Kardió')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>KARDIÓ</Text>
                                <Pressable onPress={() => openMenu('Kardió')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>Ez az edzés segít javítani az állóképességen és a kitartáson.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Kardió')}
                                    />
                                </View>
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['Funkcionális']}
                        onDismiss={() => closeMenu('Funkcionális')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>FUNKCIONÁLIS</Text>
                                <Pressable onPress={() => openMenu('Funkcionális')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>A test koordinációjának és mobilitásának fejlesztésében vesz részt.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('Funkcionális')}
                                    />
                                </View>
                                
                            </View>
                        </View>
                    </Menu>
                </View>

                <View style={{ height: 80 }}>
                    <Menu
                        visible={visible['HIIT']}
                        onDismiss={() => closeMenu('HIIT')}
                        style={{ backgroundColor: '#0B0A0C', alignContent: 'center', marginLeft: 12, width: 352.7}}
                        anchor={
                            <View style={styles.rewardContainer}>
                                <Text style={styles.categoryText}>HIIT</Text>
                                <Pressable onPress={() => openMenu('HIIT')}>
                                    <View style={{ marginRight: 10 }}>
                                        <Ionicons 
                                            name='arrow-down-outline'
                                            size={20}
                                            color={'#C5FE37'}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        anchorPosition='down'
                    >
                        <View style={styles.dropDown}>
                            <Text style={styles.text}>Rövid és magas intenzitású intervallumokat tartalmazó edzés.</Text>
                            <View style={styles.chooseButton}>
                                <Text style={styles.text}>Kiválasztom!</Text>
                                <View style={[styles.arrowContainer, {borderColor: '#C5FE37', marginLeft: 20}]}>
                                    <Ionicons
                                        name='arrow-forward-outline'
                                        size={30}
                                        color={'#C5FE37'}
                                        onPress={() => handlePlanDetails('HIIT')}
                                    />
                                </View>
                            </View>
                        </View>
                    </Menu>
                </View>
            </PaperProvider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0B0A0C',
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

    planCards: {
        height: 180,
        width: 200,           
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 15
    },

    cardText: {
        color: 'black',
        fontSize: 18
    },

    rewardContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 20,
        padding: 5,
        backgroundColor: '#0B0A0C',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
    },

    dropDown: {
        backgroundColor: '#0B0A0C', 
        marginVertical: -10, 
        borderBottomWidth: 1, 
        borderRightWidth: 1, 
        borderLeftWidth: 1, 
        borderColor: '#958CAB', 
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        //paddingHorizontal: 5
    },

    categoryText: {
        textAlign: 'left',
        padding: 10,
        fontSize: 16,
        color: '#fff',
    },

    arrowContainer: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        paddingVertical: 5,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    chooseButton: {
        borderWidth: 1,
        borderColor: '#958CAB',
        borderRadius: 10,
        marginVertical: 10,
        marginLeft: 15,
        backgroundColor: '#0B0A0C',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        width: 180
    },

    text: {
        textAlign: 'left',
        paddingLeft: 15,
        paddingVertical: 10,
        fontSize: 14,
        color: '#fff',
      },
})

export default Plans