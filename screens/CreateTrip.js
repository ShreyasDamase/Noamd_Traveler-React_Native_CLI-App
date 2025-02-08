import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  Button,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {
  BottomModal,
  Modal,
  ModalContent,
  ModalTitle,
  SlideAnimation,
} from 'react-native-modals';
import React, {useContext, useEffect, useState} from 'react';
import DateRangePicker from 'react-native-daterange-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import moment from 'moment'; // Single import
import moment from 'moment-timezone';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {images} from '../components/Images';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
const CreateTrip = () => {
  const route = useRoute();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(moment());
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [tripName, setTripName] = useState('');
  const {userId, setUserId} = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false); // State for error modal

  const urlimage =
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm9ydGhlcm4lMjBsaWdodHN8ZW58MHx8MHx8fDA%3D';
  const [backgroundImage, setBackgroundImage] = useState(urlimage);
  const navigation = useNavigation();
  const setDate = dates => {
    if (dates.startDate) {
      setStartDate(dates.startDate);
      setStartDay(moment(dates.startDate).format('dddd'));
    }
    if (dates.endDate) {
      setEndDate(dates.endDate);
      setEndDay(moment(dates.endDate).format('dddd'));
    }
    if (dates.displayedDate) {
      setDisplayedDate(dates.displayedDate);
    }
  };

  const formData = date => {
    if (date) {
      return moment(date).format('DD MMMM YYYY');
    }
    return '';
  };

  const handleCreateTrip = async () => {
    if (!tripName || !startDate || !endDate) {
      setErrorModalVisible(true);
      return;
    }

    // Format everything in the frontend
    const tripData = {
      tripName,
      startDate: moment(startDate).format('YYYY-MM-DD'), // ISO format
      endDate: moment(endDate).format('YYYY-MM-DD'), // ISO format
      startDay: moment(startDate).format('dddd'),
      endDay: moment(endDate).format('dddd'),
      background: backgroundImage,
      host: userId,
    };

    try {
      const response = await axios.post(
        'https://localhost:8000/trip',
        tripData,
      );
      console.log('Trip created successfully', response.data);
      navigation.navigate('HomeDrawer');
    } catch (error) {
      console.log('Error in creating trip', error);
      Alert.alert('Error', 'Failed to create trip');
    }
  };
  useEffect(() => {
    if (route?.params?.image) {
      setBackgroundImage(route?.params?.image);
    }
  }, [route?.params]);
  const handleCancel = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  useEffect(() => {
    const updateTime = () => {
      const time = moment().tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
      const zone = moment.tz.guess();
      setCurrentTime(time);
      setTimeZone(zone);
    };

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleSelectedImage = image => {
    navigation.navigate('CreateTrip', {image});
    setModalVisible(false);
  };

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={{uri: backgroundImage}}>
        <View
          style={{
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={handleCancel} hitSlop={10}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 600}}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={handleCreateTrip}
            style={{padding: 10, borderRadius: 25, backgroundColor: 'white'}}>
            <Text
              style={{
                color: 'orange',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 500,
              }}>
              Create
            </Text>
          </Pressable>
        </View>
        <View style={{padding: 15}}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Trip Name"
                placeholderTextColor={'white'}
                onChangeText={setTripName}
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  backgroundColor: '#04010184',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          <DateRangePicker
            onChange={setDate}
            endDate={endDate}
            startDate={startDate}
            displayedDate={displayedDate}
            range>
            <View
              style={{
                marginVertical: 15,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  padding: 15,
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 7,
                }}>
                <AntDesign name="calendar" size={30} color="white"></AntDesign>
                <Text style={{fontSize: 16, color: 'white'}}>Itinerary </Text>
              </View>
              <View
                style={{
                  borderBlockColor: 'white',
                  borderBottomWidth: 1,
                }}></View>
              <View style={{padding: 15}}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                  }}>
                  <View>
                    <Text style={{color: 'white'}}>
                      {startDate ? startDay : 'Starts'}
                    </Text>
                    <Text style={{marginTop: 6, color: 'white', fontSize: 15}}>
                      {startDate ? formData(startDate) : 'Starts'}
                    </Text>
                  </View>

                  <AntDesign
                    name="arrowright"
                    size={20}
                    color="white"></AntDesign>
                  <View>
                    <Text style={{color: 'white'}}>
                      {endDate ? endDay : 'Ends'}
                    </Text>
                    <Text style={{marginTop: 6, color: 'white', fontSize: 15}}>
                      {endDate ? formData(endDate) : 'End Dates'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </DateRangePicker>
          <View
            style={{
              flexDirection: 'row',

              gap: 20,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                padding: 15,
                backgroundColor: '#04010184',
                borderRadius: 20,
                marginTop: 10,
              }}>
              <AntDesign name="earth" size={20} color="white" />
              <Text style={{color: 'white', fontSize: 15, marginTop: 10}}>
                TimeZone
              </Text>
              <Text style={{color: 'white', fontSize: 15, marginTop: 10}}>
                {currentTime}
              </Text>
              <Text style={{color: 'white', fontSize: 15, marginTop: 10}}>
                {timeZone}
              </Text>
            </View>

            <Pressable
              style={{
                flex: 1,
                marginTop: 10,
                backgroundColor: '#04010184',
                padding: 15,
                borderRadius: 20,

                justifyContent: 'center',
              }}
              onPress={() => setModalVisible(!modalVisible)}>
              <FontAwesome name="photo" size={25} color="white"></FontAwesome>
              <Text
                style={{color: 'white', fontSize: 15, marginTop: 10}}></Text>
              <Text style={{color: 'white', fontSize: 15, marginTop: 10}}>
                Choose Image
              </Text>
            </Pressable>
          </View>
        </View>
        <View>
          <Modal
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
            onbackdropPress={() => setModalVisible(!modalVisible)}
            modalAnimation={
              new SlideAnimation({
                slideFrom: 'bottom',
              })
            }
            visible={modalVisible}
            onTouchOutside={() => {
              setModalVisible(!modalVisible);
            }}
            onHardwareBackPress={() => {
              setModalVisible(!modalVisible); // Close modal
              return true; // Prevent default navigation
            }}>
            <View
              style={{
                width: '100%',
                height: '250',
                flex: 1,
                backgroundColor: 'black',
              }}>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 15,
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 16,
                  }}>
                  Choose Image
                </Text>
              </View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 10,
                    justifyContent: 'flex-start',
                  }}>
                  {images?.map((item, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectedImage(item?.image)}
                      style={{
                        width: '30%',
                        marginVertical: 10,
                        margin: 6,
                        padding: 5,
                      }}>
                      <Image
                        source={{uri: item.image}}
                        style={{width: '100%', height: 170, borderRadius: 10}}
                      />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal
            swipeDirection={['down', 'up']}
            swipeThreshold={200}
            onSwipeOut={() => setErrorModalVisible(false)}
            onbackdropPress={() => setErrorModalVisible(false)} // Close modal on backdrop press
            visible={errorModalVisible}
            onTouchOutside={() => setErrorModalVisible(false)} // Close modal on touch outside
            onHardwareBackPress={() => {
              setErrorModalVisible(false); // Close modal on hardware back press
              return true; // Prevent default navigation
            }}
            modalAnimation={new SlideAnimation({slideFrom: 'top'})}>
            <View
              style={{
                width: '100%',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: 20,
                }}>
                Please fill all the fields!
              </Text>
              <Pressable
                onPress={() => setErrorModalVisible(false)} // Close modal on press
                style={{
                  backgroundColor: 'orange',
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}>
                <Text style={{color: 'white', fontSize: 16}}>OK</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CreateTrip;

const styles = StyleSheet.create({});

//import moment from 'moment-timezone';

//  // Automatically gets the user's timezone
