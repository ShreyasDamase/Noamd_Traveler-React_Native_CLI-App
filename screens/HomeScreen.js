import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ImageBackground,
  BackHandler,
} from 'react-native';
import {useState, useEffect, useContext} from 'react';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome

import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import CreateTrip from './CreateTrip';
import axios from 'axios';
import 'core-js/stable/atob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {AuthContext} from '../AuthContext';

const HomeScreen = () => {
  const currentYear = moment().year();
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const {userId, setUserId} = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  const fetchTrips = async () => {
    try {
      console.log('userdata', userId);
      const response = await axios.get(
        `https://localhost:8000/trips/${userId}`,
      );
      console.log(response.data);
      setTrips(response.data);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
    console.log('Trips:', JSON.stringify(trips));
  }, [userId]);

  return (
    <View>
      <ScrollView>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={30} color="orange" />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}></View>
        </View>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>My Trips</Text>
          <Text
            style={{
              marginTop: 6,
              fontSize: 16,
              fontWeight: 600,
              color: 'orange',
            }}>
            {currentYear}
          </Text>
        </View>
        <View>
          {trips?.map((item, index) => (
            <Pressable
              key={index}
              style={{
                padding: 2,
                borderRadius: 20,
                margin: 10,
              }}
              onPress={() => navigation.navigate('TripPlan', {item: item})}>
              <ImageBackground
                imageStyle={{borderRadius: 20}}
                source={{uri: item?.background}}
                style={{
                  width: '100%',
                  height: 220,
                  padding: 5,
                }}>
                
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'white',
                      padding: 10,
                    }}>
                    {item?.startDate}-{item?.endDate}
                  </Text>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 19,
                      fontWeight: 'bold',
                      color: 'white',
                      padding: 10,
                    }}>
                    {item?.tripName}
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 17, fontWeight: 600, textAlign: 'center'}}>
            Organize your next trip!
          </Text>
          <Text
            style={{
              marginTop: 15,
              color: 'gray',
              width: 250,
              textAlign: 'center',
            }}>
            Create your next trip and plan activities of your initinerary
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('CreateTrip')}
          style={{
            marginTop: 30,
            padding: 14,
            width: 280,
            backgroundColor: '#353574',
            borderRadius: 25,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 600,
            }}>
            Create a Trip
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
});
