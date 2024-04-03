import React from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Welcome from './Screens/Welcome';
import Home from './Screens/Home';
import Account from './Screens/Account';
import Stopwatch from './Screens/StopWatch';
import Plans from './Screens/Plans';
import ForgotPassword from './Screens/ForgotPassword';
import Goals from './Screens/Goals';
import StepCounter from './Screens/StepCounter';
import Rewards from './Screens/Rewards';
import PlanDetails from './Screens/PlanDetails';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AfterRegister from './Screens/AfterRegister';
import AfterRegisterDetails from './Screens/AfterRegisterDetails';
import PasswordReset from './Screens/PasswordReset';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B0A0C'
  },
};
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
  
function Tabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        tabBarStyle: { 
          backgroundColor: '#0B0A0C',
          borderRadius: 30,
          borderColor: '#C5FE37',
          borderWidth: 1,
          borderTopWidth: 1,
          marginHorizontal: 5,
          marginBottom: 15,
          height: 60
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name='Kezdőlap' component={Home} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <Ionicons name="home-outline" color={'#958CAB'} size={30} />
            </View>
          ),
        }} 
      />
      <Tab.Screen name='Tervek' component={Plans}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <Ionicons name="barbell-outline" color={'#958CAB'} size={30} />
            </View>
          ),
        }}  
      />
      <Tab.Screen name='Célok' component={Goals} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <Ionicons name="flag-outline" color={'#958CAB'} size={30} />
            </View>
          ),
        }}  
      />
      <Tab.Screen name='Stopper' component={Stopwatch} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <Ionicons name="barbell" color={'#958CAB'} size={30} />
            </View>
          ),
        }}  
      />
      <Tab.Screen name='Jutalmak' component={Rewards}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <MaterialCommunityIcons name="medal-outline" color={'#958CAB'} size={30} />
            </View>
          ),
        }}  
      />
      <Tab.Screen name='Profil' component={Account}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <View style={{ 
              borderRadius: 30,
              borderWidth: 1,
              borderColor: focused ? '#C5FE37' : 'transparent',
              padding: 5
            }}>
              <Ionicons name="settings-outline" color={'#958CAB'} size={30} />
            </View>
          ),
        }}  
      />
    </Tab.Navigator>
  );
}

const App = () => {

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false
          }} />
        
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.LoginHeader}>
                  <Text style={styles.HeaderText}>Még nincsen fiókod? </Text>
                  <GestureHandlerRootView>
                    <Pressable onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.Button}>REGISZTRÁLJ</Text>
                    </Pressable>
                  </GestureHandlerRootView>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          })} />
        
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          }} />
        
        <Stack.Screen
          name="PasswordReset"
          component={PasswordReset}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          }} />

        <Stack.Screen
          name="Register"
          component={Register}
          options={({navigation}) => ({
            headerTitle: () => (
              <View style={styles.RegisterHeader}>
                  <Text style={styles.HeaderText}>Már van fiókod? </Text>
                  <GestureHandlerRootView>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.Button}>LÉPJ BE</Text>
                    </Pressable>
                  </GestureHandlerRootView>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          })} />
        
        <Stack.Screen
          name="AfterRegister"
          component={AfterRegister}
          options={{
            headerShown: false
          }} />
        
        <Stack.Screen
          name="AfterRegisterDetails"
          component={AfterRegisterDetails}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="StepCounter"
          component={StepCounter}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="HomePage"
          component={Tabs}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="Plans"
          component={Plans}
          options={{
            headerShown: false
          }} />
        
        <Stack.Screen
          name="PlanDetails"
          component={PlanDetails}
          options={{
            title: 'Terv részletei',
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          }} />

        <Stack.Screen
          name="Goals"
          component={Goals}
          options={{
            headerShown: false
          }} />
        
        <Stack.Screen
          name="Workout"
          component={Stopwatch}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="Rewards"
          component={Rewards}
          options={{
            headerShown: false
          }} />
        
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#0B0A0C'
            },
            headerTintColor: '#FFF'
          }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0A0C',
  },

  LoginHeader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingHorizontal: 70
  },

  HeaderText:{
    textAlign: 'right',
    padding: 3,
    color: '#958CAB'
  },

  Button: {
    color: '#FFF', 
    textAlign: 'center', 
    fontSize: 12, 
    borderWidth: 1, 
    borderColor: '#FFF', 
    borderRadius: 5, 
    paddingHorizontal: 7, 
    paddingVertical: 5
  },

  RegisterHeader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingHorizontal: 150
  },

})