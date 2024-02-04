import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { createUser, fetchAllUsers } from './Functions/userFunctions';
import User from './Model/user';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Welcome from './Screens/Welcome';
import Home from './Screens/Home';
import Account from './Screens/Account';
import Stopwatch from './Screens/StopWatch';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
  
function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='FirstPage' component={Home} options={{ headerShown: false }} />
      <Tab.Screen name='Workout' component={Stopwatch} options={{ headerShown: false }} />
      <Tab.Screen name='Profile' component={Account} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const App = () => {
  //const User = require('./Model/user');
  /*const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const userList = await fetchAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await createUser('John', 'john@example.comm', 'passwordd');
      refreshUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };*/

  return (
    <NavigationContainer>
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
          options={{
            title: 'Add meg az adataid',
            headerStyle: {
              backgroundColor: '#fff'
            },
            headerTintColor: '#8562AC'
          }} />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: 'Add meg az adataid',
            headerStyle: {
              backgroundColor: '#fff'
            },
            headerTintColor: '#8562AC'
          }} />
        
        <Stack.Screen
          name="Home"
          component={Tabs}
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
          name="Account"
          component={Account}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#fff'
            },
            headerTintColor: '#8562AC'
          }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;