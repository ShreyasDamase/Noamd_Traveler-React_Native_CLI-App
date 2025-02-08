import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import CreateTrip from '../screens/CreateTrip';
import TripPlanScreen from '../screens/TripPlanScreen';
import Logincreen from '../screens/Logincreen';
import ChooseImage from '../screens/ChooseImage';
import MapScreen from '../screens/MapScreen';
import Profile from '../screens/Profile';
import About from '../screens/About';

import {AuthContext} from '../AuthContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerType="slide"
      drawerStyle={{
        backgroundColor: '#0e0d0d', // Change this for visibility
        width: 250,
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={Logincreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    {/* Home Screen now wrapped inside Drawer */}
    <Stack.Screen
      name="HomeDrawer"
      component={HomeDrawer}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CreateTrip"
      component={CreateTrip}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ImagePicker"
      component={ChooseImage}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="TripPlan"
      component={TripPlanScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="map"
      component={MapScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const StackNavigator = () => {
  const {token} = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;
