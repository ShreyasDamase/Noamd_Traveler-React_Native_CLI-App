import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState, useContext} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome
import moment from 'moment';
import {
  BottomModal,
  Modal,
  ModalContent,
  ModalTitle,
  SlideAnimation,
} from 'react-native-modals';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../AuthContext';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import axios from 'axios';
import Place from '../components/Place';
import Geolocation from '@react-native-community/geolocation';
import location from '../components/useLocation'; // Import the custom hook
import {filter} from 'core-js/core/array';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import {CategoryData} from '../components/Category';

const TripPlanScreen = () => {
  const {userId} = useContext(AuthContext); // Accessing userId from AuthContext
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params.item || {};
  const bgImage = item?.background;
  const [openShareModel, setOpenShareModel] = useState(false);
  const [options, setOptions] = useState('overview');
  const [modalVisible, setModalVisible] = useState(false);
  const [places, setPlaces] = useState([]);
  const [placeItems, setPlaceItems] = useState([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const {userLocation, error} = location(); // Use the custom hook to get location
  const [placeDetails, setPlaceDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [itinerary, setItinerary] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [budget, setBudget] = useState(0);
  const [expenseModal, setExpenseModal] = useState(false);
  const [modalView, setModalView] = useState('original');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [catImage, setCatImage] = useState('');
  const [value, setValue] = useState('');
  const [isSplitExpanded, setSplitExpanded] = useState(false);
  const [ispaidByExpanded, setPaidByExpanded] = useState(false);
  const [paidBy, setPaidBy] = useState('');
  const [expense, setExpences] = useState([]);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const tripName = item?.tripName;
  const senderName = item?.name;

  const formaDate = date => {
    return moment(date).format('D MMMM');
  };
  const openUrl = url => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };
  const tripId = item?._id;

  const fetchPlaceDetails = async placeId => {
    try {
      const response = await axios.post(
        `https://localhost:8000/trip/${tripId}/addPlace`,
        {placeId: placeId},
      );
      console.log('updated trip', response.data);
      if (response.status === 200) {
        setModalVisible(false);
      }
    } catch (error) {
      console.log('Error', error.response?.data || error.message);
    }
  };
  const fetchPlacesToVisit = async () => {
    try {
      const response = await axios.get(
        `https://localhost:8000/trip/${tripId}/placesToVisit`,
      );
      const placesToVisit = response.data;
      setPlaces(placesToVisit);
      console.log('places to visit', placesToVisit);
    } catch (error) {
      console.log('Error fetching places to visit:', error);
    }
  };
  useEffect(() => {
    fetchPlaceDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlacesToVisit();
    }, [modalVisible]),
  );
  useEffect(() => {
    if (userLocation) {
      const fetchRecommendedPlaces = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
            {
              params: {
                //location: '19.204056,73.868194',
                location: userLocation,
                radius: 5000, // 5km radius
                type: 'tourist_attraction',
                key: 'YourApiKey', // Replace with your Google API Key
              },
            },
          );
          setRecommendedPlaces(response.data.results.slice(0, 10)); // Get only 10 places
        } catch (error) {
          console.log('Error fetching recommended places:', error);
        }
      };

      fetchRecommendedPlaces();
    }
  }, [userLocation]);
  const fetchDetails = async placeId => {
    const API_KEY = 'YourApiKey'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const details = response.data.result;

      console.log('Place Details:', details);

      return details;
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const fetchAllPlaceDetails = async () => {
    const detailsPromises = recommendedPlaces
      .slice(0, 10)
      .map(place => fetchDetails(place.place_id));
    const fetchedDetails = await Promise.all(detailsPromises);

    // Filter out any places that failed to fetch details
    const validDetails = fetchedDetails.filter(details => details !== null);

    setPlaceDetails(validDetails); // Store the fetched details in state
  };

  // Fetch details when the component mounts
  useEffect(() => {
    if (recommendedPlaces.length > 0) {
      fetchAllPlaceDetails();
    }
  }, [recommendedPlaces]);

  // Log for placeItems
  console.log(`🌟 [Place Items]: ${JSON.stringify(placeItems, null, 2)}`);

  // Log for userLocation
  if (userLocation) {
    console.log(
      `📍 [User Location]: Latitude and Longitude -> ${userLocation}`,
    );
  } else {
    console.warn('⚠️ [User Location]: Location is null or unavailable.');
  }
  console.log('recomendedPlaces', recommendedPlaces);
  console.log('placeDetails', placeDetails);

  const serOpenModal = item => {
    setSelectedDate(item?.date);
    setModalVisible(true);
  };

  const addPlaceToItinerary = async place => {
    console.log('place', place);

    const newActivity = {
      date: selectedDate, // Ensure this matches the format in the database
      name: place.name, // Required field: name of the place
      phoneNumber: place.phoneNumber || null, // Fallback to null if not provided
      website: place.website || null,
      openingHours: place.openingHours || [], // Fallback to an empty array
      photos: place.photos?.[0] || '', // Fallback to an empty array
      reviews: place.reviews || [], // Fallback to an empty array
      formatted_address: place.formatted_address || '', // Match field name in your schema
      briefDescription: place.briefDescription || '',
      geometry: place.geometry || null, // Fallback to null if geometry is not provided
    };

    try {
      const response = await axios.post(
        `https://localhost:8000/trips/${tripId}/itinerary/${selectedDate}`,
        newActivity, // Send newActivity directly
      );

      console.log('Activity added successfully:', response.data);

      // Optional: Close modal or update UI state
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding place to itinerary:', error);
      // Optional: Show an error message to the user
    }
  };
  const fetchItinerary = async () => {
    try {
      const respons = await axios.get(
        `https://localhost:8000/trip/${tripId}/itinerary`,
      );
      const itinerary = respons.data;
      setItinerary(itinerary);
    } catch (error) {
      console.log('Error in getting itinerary:', error);
    }
  };
  useEffect(() => {
    fetchItinerary();
  }, [modalVisible]);

  const handleDeleteActivity = async (date, activityIndex) => {
    try {
      const response = await axios.delete(
        `https://localhost:8000/trip/${tripId}/itinerary/${date}/${activityIndex}`,
      );

      if (response.status === 200) {
        setItinerary(prevItinerary =>
          prevItinerary.map(itin =>
            itin.date === date
              ? {
                  ...itin,
                  activities: itin.activities.filter(
                    (_, i) => i !== activityIndex,
                  ),
                }
              : itin,
          ),
        );
      }
    } catch (error) {
      console.log('Error deleting activity:', error);
    }
  };

  const handleLongPress = (date, activityIndex, activityName) => {
    Alert.alert(
      'Delete Itinerary',
      `Are you sure you want to delete "${activityName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Yes', onPress: () => handleDeleteActivity(date, activityIndex)},
      ],
    );
  };
  const setTripBudget = async budget => {
    try {
      console.log('Trip ID:', tripId);
      console.log('Sending budget:', budget);

      const response = await axios.put(
        `https://localhost:8000/setBudget/${tripId}`,
        {budget},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setModalOpen(false);
      console.log('Budget data:', response.data);
    } catch (error) {
      console.log(
        'Error In setting Budget:',
        error.response?.data || error.message,
      );
    }
  };

  const goToBlankView = () => {
    setModalView('blank');
  };
  const goToOriginalView = () => {
    setModalView('original');
  };
  const selectCategory = item => {
    setCategory(item?.name);
    setCatImage(item?.image);
    setModalView('original');
  };

  const toggleSplit = () => {
    setSplitExpanded(!isSplitExpanded);
  };
  const togglePaidBy = () => {
    setPaidByExpanded(!ispaidByExpanded);
  };
  const addExpenseToTrip = async () => {
    try {
      console.log(
        'item:',
        'category',
        category,
        'price',
        price,
        'splitBy',
        value,
        'paidBy',
        paidBy,
      );

      const expenseData = {
        category: category,
        price: price,
        splitBy: value,
        paidBy: paidBy,
      };

      const response = await axios.post(
        `https://localhost:8000/addExpense/${tripId}`,
        expenseData,
        {
          headers: {'Content-Type': 'application/json'}, // ✅ Important Fix
        },
      );

      if (response.status === 200) {
        setExpenseModal(!expenseModal);
      }
    } catch (error) {
      console.log('Error while setting expense', error.response?.data || error);
    }
  };
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `https://localhost:8000/getExpense/${tripId}`,
      );

      if (response.status === 200) {
        setExpences(response.data.expenses);
      }
    } catch (error) {
      console.log('Error while fetching expense', error);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, [expenseModal]);
  console.log('expense data come ', expense);
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = input => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };
  const handleSendInvite = async () => {
    try {
      if (isValidEmail) {
        try {
          // Call the API to send the invite
          const response = await axios.post(
            'https://localhost:8000/sendInviteEmail',
            {
              email, // Email entered by the user
              tripId, // ID of the current trip (you should have this from your state/context)
              tripName, // Name of the trip (you should have this from your state/context)
              senderName, // Name of the person sending the invite (you can get it from the user context)
            },
          );

          if (response.status === 200) {
            console.log('Invitation sent successfully');
            setOpenShareModel(false);
          } else {
            console.log('Failed to send invitation');
          }
        } catch (error) {
          console.error('Error sending invite email:', error);
          // alert('Error occurred while sending the invitation.');
        } finally {
          setEmail(''); // Clear the input after sending the invite
        }
      } else {
        alert('Please enter a valid email.');
      }
    } catch (error) {
      console.log('Error in invite use', error);
    }
  };
  console.log('  randi', item, 'randiend');

  const [explore, setExplore] = useState([]);
  const [exploreModal, setExploreModal] = useState(false);

  const fetchExplore = async typeOfExplore => {
    try {
      console.log(typeOfExplore);
      let placeType = typeOfExplore;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            // location: '18.5196,73.8554',
            location: userLocation,
            radius: 5000, // 5km radius
            type: typeOfExplore,
            key: 'YourApiKey', // Replace with your Google API Key
          },
        },
      );
      setExplore(response.data.results.slice(0, 10));
      console.log('explore:', explore);
      setExploreModal(true);
    } catch (error) {
      console.log('Error fetching recommended places:', error);
    }
  };
  useEffect(() => {
    console.log('Updated explore state:', explore);
  }, [explore]);
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    console.log('Fetching note for tripId:', tripId);
    if (!tripId) {
      console.error('❌ tripId is undefined!');
      return;
    }
    axios
      .get(
        `https://localhost:8000/trip/${tripId}/note`,
      )
      .then(response => setNote(response.data.note))
      .catch(error => console.error('Error fetching note:', error));
  }, [tripId]);
  const updateNote = () => {
    axios
      .put(
        `https://localhost:8000/trip/${tripId}/note`,
        {note},
      )
      .then(response => {
        setNote(response.data.note);
        setEditing(false);
      })
      .catch(error => console.error('Error updating note:', error));
  };
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true when fetching data

      try {
        // Replace 'your-backend-url' with your actual backend URL
        const response = await axios.get(
          `https://localhost:8000/user/${userId}`,
        );
        setUserInfo(response.data.user); // Set user info from API response
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false); // Set loading to false after the request is done
      }
    };

    if (userId) {
      fetchUserData(); // Fetch data when userId is available
    }
  }, [userId]); // Re-run the effect when userId changes

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View>
            {bgImage ? (
              <Image
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover',
                }}
                source={{uri: bgImage}}
              />
            ) : (
              <Image
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover',
                }}
                source={{
                  uri: 'https://c4.wallpaperflare.com/wallpaper/155/905/98/animals-1920x1200-funny-wallpaper-preview.jpg',
                }}
              />
            )}
            <View>
              <View style={{backgroundColor: 'white'}}>
                <Pressable
                  style={{
                    padding: 20,
                    width: 300,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    position: 'absolute',
                    top: -120,
                    left: '50%',
                    transform: [{translateX: -150}],
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}>
                    Trip To {item?.tripName}
                  </Text>
                  <View style={{marginTop: 8}}>
                    <View>
                      <Text style={{fontSize: 13, fontWeight: 500}}>
                        {item?.startDate} - {item?.endDate}
                      </Text>
                      <Text
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          color: 'gray',
                        }}>
                        {item?.startDay} - {item?.endDay}
                      </Text>
                    </View>
                    <View style={{marginTop: 8}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <Image
                          style={{width: 34, height: 34, borderRadius: 17}}
                          source={{uri: userInfo.photo}}
                        />
                        <Pressable
                          onPress={() => setOpenShareModel(!openShareModel)}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25,
                            alignSelf: 'flex-start',
                            backgroundColor: 'black',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontWeight: 500,
                              fontSize: 12,
                            }}>
                            share
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
                <View
                  style={{
                    zIndex: -100,
                    height: 80,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    backgroundColor: 'white',
                    margin: 10,
                  }}>
                  <Pressable
                    onPress={() => setOptions('overview')}
                    hitSlop={20}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: options === 'overview' ? 'orange' : 'gray',
                      }}>
                      Overview
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setOptions('itinerary')}
                    hitSlop={20}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: options === 'itinerary' ? 'orange' : 'gray',
                      }}>
                      Itinerary
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setOptions('explore')} hitSlop={20}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: options === 'explore' ? 'orange' : 'gray',
                      }}>
                      Explore
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setOptions('budget')} hitSlop={20}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: options === 'budget' ? 'orange' : 'gray',
                      }}>
                      $
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View>
                {options === 'overview' && (
                  <ScrollView nestedScrollEnabled={true}>
                    <View
                      style={{
                        backgroundColor: '#ffffff',
                        marginVertical: 10,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 10,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                          }}>
                          <Icon
                            name="keyboard-arrow-down"
                            size={25}
                            color="black"
                          />
                          <Text>Notes</Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 200,

                          margin: 10,
                        }}>
                        {note.length > 0 || editing ? (
                          <ScrollView nestedScrollEnabled={true}>
                            {editing ? (
                              <TextInput
                                value={note}
                                onChangeText={setNote}
                                multiline
                                style={{
                                  height: '100%', // Ensures full usage of available space
                                  textAlignVertical: 'top',

                                  borderRadius: 10,
                                  color: 'orange',
                                }}
                                placeholderTextColor={'#5c5c5c'}
                                placeholder="Write or paste your notes here."
                              />
                            ) : (
                              <Text style={{flex: 1}}>{note}</Text>
                            )}
                          </ScrollView>
                        ) : (
                          <Text style={{color: '#5c5c5c'}}>
                            Write your notes here.{' '}
                          </Text>
                        )}
                        <View
                          style={{
                            flexDirection: 'row',

                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            bottom: 5,
                            right: 5,
                          }}>
                          {editing ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: 'orange',
                                alignItems: 'center',
                                justifyContent: 'center',

                                borderRadius: 40,
                                padding: 5,
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  updateNote;
                                  setEditing(false);
                                }}>
                                <Icon name="save" size={35} color="#ffffff" />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: 'orange',
                                alignItems: 'center',
                                justifyContent: 'center',

                                borderRadius: 40,
                                padding: 5,
                              }}>
                              <TouchableOpacity
                                onPress={() => setEditing(true)}>
                                <Icon
                                  name="edit-note"
                                  size={35}
                                  color="#ffffff"
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/*  */}

                    <View
                      style={{
                        backgroundColor: '#ffffffff',
                        borderRadius: 10,
                        marginVertical: 10,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                          <Icon
                            name="keyboard-arrow-down"
                            size={25}
                            color="balck"
                          />
                          <Text>Places to Visit</Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                          }}>
                          <Icon name="more-horiz" size={25} color="balck" />
                        </View>
                      </View>
                      <View>
                        {places &&
                          places.map((item, index) => (
                            <Place
                              key={index}
                              item={item}
                              index={index}
                              placeItems={placeItems}
                              setPlaceItems={setPlaceItems}
                            />
                          ))}
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <Pressable
                          onPress={() => setModalVisible(!modalVisible)}
                          style={{
                            padding: 5,
                            marginVertical: 5,
                            borderRadius: 10,
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: '#e0e0e0',
                            gap: 4,
                            flex: 1,
                          }}>
                          <Icon name="location-pin" size={25} color="#acacac" />
                          <Text style={{paddingVertical: 5}}>
                            Tap to add a place
                          </Text>
                        </Pressable>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#e0e0e0',
                            borderRadius: 22,
                            width: 44,
                            height: 44,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('map', {places: places})
                            }>
                            <Icon name="map" size={25} color="orange" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          marginLeft: 10,
                          marginTop: 15,
                        }}>
                        Recomended Places
                      </Text>
                      <View style={{marginHorizontal: 10, marginVertical: 15}}>
                        {placeDetails && (
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {placeDetails?.map((item, index) => {
                              const firstPhoto = item?.photos?.[0];
                              const imageUrl = firstPhoto
                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhoto.photo_reference}&key=YourApiKey`
                                : null;
                              return (
                                <Pressable
                                  key={index}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 12,
                                    borderColor: '#e0e0e0',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    padding: 10,
                                    marginBottom: 10,
                                    height: 100,
                                    overflow: 'hidden',
                                  }}>
                                  <View style={{marginRight: 10}}>
                                    {imageUrl ? (
                                      <Image
                                        source={{uri: imageUrl}}
                                        style={{
                                          width: 80,
                                          height: 80,
                                          borderRadius: 6,
                                        }}
                                        resizeMode="cover"></Image>
                                    ) : (
                                      <Text
                                        style={{
                                          flex: 1,
                                          padding: 5,
                                          paddingTop: 15,
                                          textAlign: 'center',
                                          fontSize: 13,
                                          fontWeight: 500,
                                          color: '#fffefe',
                                          width: 80,
                                          height: 80,
                                          backgroundColor: '#a8a8a8c9',
                                          borderRadius: 6,
                                        }}>
                                        No image Available
                                      </Text>
                                    )}
                                  </View>
                                  <Text
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    style={{
                                      flex: 1,

                                      width: 120,
                                      textAlign: 'center',
                                      fontSize: 13,
                                      fontWeight: 500,
                                      color: '#000000',
                                      borderRadius: 6,
                                    }}>
                                    {item.name}
                                  </Text>
                                </Pressable>
                              );
                            })}
                          </ScrollView>
                        )}
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>

              <View>
                {options == 'itinerary' && (
                  <ScrollView
                    style={{marginTop: 15, marginHorizontal: 10}}
                    //horizontal={true}
                    //showsHorizontalScrollIndicator={false}
                  >
                    <ScrollView horizontal={true}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        {item.itinerary.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              padding: 10,
                              borderRadius: 8,
                              marginBottom: 7,
                              backgroundColor: 'orange',
                              marginLeft: 10,
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 500,
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              {formaDate(item.date)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                    <View>
                      {item.itinerary.map((item, index) => (
                        <View
                          style={{
                            padding: 15,
                            borderRadius: 8,
                            backgroundColor: 'white',
                            marginVertical: 8,
                          }}
                          key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 8,
                              alignItems: 'center',
                            }}>
                            <Text style={{fontSize: 26, fontWeight: 'bold'}}>
                              {formaDate(item.date)}
                            </Text>
                          </View>
                          <View>
                            {itinerary
                              ?.filter(place => place.date == item?.date)
                              .map((filterItem, filterIndex) =>
                                filterItem?.activities?.map(
                                  (activity, index) => (
                                    <Pressable
                                      style={{marginTop: 12}}
                                      key={index}
                                      onLongPress={() =>
                                        handleLongPress(
                                          item.date,
                                          index,
                                          activity.name,
                                        )
                                      }>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: 10,
                                        }}>
                                        <View style={{flex: 1}}>
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              gap: 7,
                                            }}>
                                            <View
                                              style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 15,
                                                backgroundColor: '#0094d3',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}>
                                              <Text
                                                style={{
                                                  color: 'white',
                                                  fontWeight: 500,
                                                }}>
                                                {index + 1}
                                              </Text>
                                            </View>
                                            <Text
                                              numberOfLines={2}
                                              style={{
                                                fontSize: 16,
                                                fontWeight: 500,
                                                width: '82%',
                                              }}>
                                              {activity?.name}
                                            </Text>
                                          </View>
                                          <Text
                                            numberOfLines={3}
                                            style={{
                                              color: 'gray',
                                              marginTop: 7,
                                              width: '80%',
                                            }}>
                                            {activity?.briefDescription}
                                          </Text>
                                        </View>
                                        <View>
                                          <Image
                                            source={{uri: activity?.photos}}
                                            style={{
                                              width: 100,
                                              height: 100,
                                              borderRadius: 10,
                                            }}
                                            resizeMode="cover"
                                          />
                                        </View>
                                      </View>
                                    </Pressable>
                                  ),
                                ),
                              )}
                          </View>
                          <View
                            style={{
                              marginTop: 10,
                              flexDirection: 'row',
                              gap: 10,
                              alignItems: 'center',
                            }}>
                            <Pressable
                              onPress={() => serOpenModal(item)}
                              style={{
                                padding: 5,
                                marginVertical: 5,
                                borderRadius: 10,
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: '#e0e0e0',
                                gap: 4,
                                flex: 1,
                              }}>
                              <Icon
                                name="location-pin"
                                size={25}
                                color="#acacac"
                              />
                              <Text style={{paddingVertical: 5}}>
                                Tap to add a place
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>
              <View>
                {options == 'explore' && (
                  <ScrollView
                    style={{
                      marginTop: 15,
                      borderRadius: 10,
                      marginHorizontal: 12,
                    }}>
                    <View
                      style={{
                        padding: 10,
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: '#cbcbcb92',
                        flexDirection: 'row',
                      }}>
                      <Icon name="search" size={25} color="gray" />
                      <Text>{item?.tripName}</Text>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 12,
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Categories
                        </Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          See all
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable onPress={() => fetchExplore('restaurant')}>
                            <Text>🍽️Restaurant</Text>
                          </Pressable>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable onPress={() => fetchExplore('cafe')}>
                            <Text>☕cafe</Text>
                          </Pressable>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable onPress={() => fetchExplore('lodging')}>
                            <Text>🛏️lodging</Text>
                          </Pressable>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable onPress={() => fetchExplore('park')}>
                            <Text>🌲Park</Text>
                          </Pressable>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable
                            onPress={() => fetchExplore('bus_station')}>
                            <Text>🚍Bus Station</Text>
                          </Pressable>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#dadadac6',
                            padding: 12,
                            borderRadius: 7,
                            flex: 1,
                          }}>
                          <Pressable
                            onPress={() => fetchExplore('train_station')}>
                            <Text>🚉Train Station</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            marginTop: 10,
                          }}>
                          Video Guides
                        </Text>
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            gap: '20%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10,
                          }}>
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                openUrl(
                                  `https://www.youtube.com/results?search_query=${item?.tripName}`,
                                )
                              }>
                              <Image
                                style={{
                                  width: 180,
                                  height: 180,
                                  resizeMode: 'stretch',
                                  borderRadius: 10,
                                  marginTop: 10,
                                }}
                                source={{
                                  uri: 'https://raw.githubusercontent.com/ShreyasDamase/NomadTravelerImages/refs/heads/main/yt.png',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                openUrl(
                                  `https://www.tripadvisor.in/Search?q=${item?.tripName}`,
                                )
                              }>
                              <Image
                                style={{
                                  width: 100,
                                  height: 100,
                                  resizeMode: 'contain',
                                  borderRadius: 10,
                                  marginTop: 10,
                                  marginRight: 15,
                                }}
                                source={{
                                  uri: 'https://raw.githubusercontent.com/ShreyasDamase/NomadTravelerImages/refs/heads/main/tp.png',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
              <View>
                {options == 'budget' && (
                  <ScrollView>
                    <View>
                      <View style={{padding: 10, backgroundColor: '#f7a636'}}>
                        <Text
                          style={{
                            fontSize: 26,
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          ₹{budget ? budget : item?.budget}
                        </Text>
                        <Pressable onPress={() => setModalOpen(!modalOpen)}>
                          <Text
                            style={{
                              marginVertical: 13,
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 15,
                              borderRadius: 25,
                              borderColor: 'white',
                              borderWidth: 1,
                              padding: 10,
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}>
                            Set a budget
                          </Text>
                        </Pressable>
                        <View
                          style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            padding: 10,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 13,
                            }}>
                            Debt Summary
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View
                          style={{
                            padding: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                            Expenses
                          </Text>
                          <Icon name="person-search" size={25} color="black" />
                        </View>
                      </View>
                      {expense.length > 0 ? (
                        <View style={{marginHorizontal: 12}}>
                          {expense?.map((item, index) => (
                            <Pressable style={{marginTop: 10}} key={index}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 8,
                                }}>
                                <View
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: '#0066b2',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{color: 'white', fontWeight: '500'}}>
                                    {index + 1}
                                  </Text>
                                </View>

                                <Text
                                  style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    flex: 1,
                                  }}>
                                  {item?.category}
                                </Text>

                                <Text style={{fontSize: 15, color: '#606060'}}>
                                  ₹{item?.price} ({item?.splitBy})
                                </Text>
                              </View>
                              <Text style={{marginTop: 5, color: 'gray'}}>
                                Paid By - {item?.paidBy}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      ) : (
                        <Text style={{marginHorizontal: 12, color: 'gray'}}>
                          You haven't added any expenses yet!
                        </Text>
                      )}
                      <Pressable
                        onPress={() => setExpenseModal(!expenseModal)}
                        style={{
                          padding: 12,
                          backgroundColor: 'orange',
                          borderRadius: 25,
                          marginHorizontal: 'auto',
                          marginVertical: 30,
                        }}>
                        <Text style={{textAlign: 'center', color: 'white'}}>
                          Add Expense
                        </Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        swipeDirection={['up', 'down']}
        // onbackdropPress={() => setModalVisible(!modalVisible)}
        swipeThreshold={200}
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
          setModalVisible(false); // Close modal
          return true; // Prevent default navigation
        }}>
        <ModalContent
          style={{
            width: '100%',
            height: 390,
            backgroundColor: '#f8f8f8',
            paddingBottom: 125,
          }}>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            Select place
          </Text>
          <View style={{backgroundColor: '#f8f8f8'}}>
            <GooglePlacesAutocomplete
              styles={{
                container: {
                  flex: 0,
                  marginTop: 10,
                  width: '100%',

                  borderWidth: 1,
                  borderColor: '#ffffff',
                  marginTop: 20,
                },
                textInput: {
                  height: 38,
                  color: 'orange',
                  fontSize: 16,
                  borderRadius: 24,
                },
                textInputContainer: {
                  borderRadius: 20,
                },
              }}
              placeholder="Search"
              fetchDetails={true}
              onPress={(data, details = null) => {
                console.log('Selected Place:', data);
                if (details) {
                  const placeId = details.place_id;
                  console.log(placeId);
                  fetchPlaceDetails(placeId);
                }
              }}
              query={{
                language: 'en',
                key: 'YourApiKey',
              }}
            />
          </View>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                marginVertical: 12,
              }}></Text>
            {options !== 'overview' && (
              <ScrollView>
                {places &&
                  places?.map((item, index) => (
                    <Pressable
                      onPress={() => addPlaceToItinerary(item)}
                      style={{marginBottom: 12}}
                      key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 7,
                            }}>
                            <View
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: '#0094d3',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text style={{color: 'white', fontWeight: 500}}>
                                {index + 1}
                              </Text>
                            </View>
                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 16,
                                fontWeight: 500,
                                width: '82%',
                              }}>
                              {item.name}
                            </Text>
                          </View>
                          <Text
                            numberOfLines={3}
                            style={{color: 'gray', marginTop: 7, width: '80%'}}>
                            {item.briefDescription}
                          </Text>
                        </View>
                        <View>
                          <Image
                            source={{uri: item?.photos[0]}}
                            style={{width: 100, height: 100, borderRadius: 10}}
                            resizeMode="cover"
                          />
                        </View>
                      </View>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
          </View>
        </ModalContent>
      </BottomModal>
      <Modal
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        onbackdropPress={() => setModalOpen(!modalOpen)}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        visible={modalOpen}
        onTouchOutside={() => {
          setModalOpen(!modalOpen);
        }}
        onHardwareBackPress={() => {
          setModalOpen(!modalOpen); // Close modal
          return true; // Prevent default navigation
        }}>
        <ModalContent style={{width: 350, height: 'auto'}}>
          <View>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15, fontWeight: 500}}>Enter Budget</Text>
              <Feather name="edit-2" size={20} color="orange" />
            </View>
            <View
              style={{
                marginTop: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                value={budget}
                onChangeText={setBudget}
                placeholder="Enter a budget"
                placeholderTextColor="gray"
                style={{
                  width: '95%',
                  marginTop: 10,
                  paddingBottom: 10,
                  fontFamily: 'GeezaPro-Bold',

                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 25,
                }}></TextInput>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 25,
                marginTop: 20,
              }}>
              <Pressable
                onPress={() => setModalOpen(false)}
                style={{
                  padding: 10,
                  borderRadius: 25,
                  borderColor: '#E0E0E0',
                  borderWidth: 1,
                  width: 100,
                }}>
                <Text style={{textAlign: 'center'}}>Cancle</Text>
              </Pressable>
              <Pressable
                onPress={() => setTripBudget(budget)}
                style={{
                  padding: 10,
                  borderRadius: 25,

                  backgroundColor: 'orange',

                  width: 100,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </Modal>
      <BottomModal
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        onbackdropPress={() => setExpenseModal(!expenseModal)}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        visible={expenseModal}
        onTouchOutside={() => {
          setExpenseModal(!expenseModal);
        }}
        onHardwareBackPress={() => {
          setExpenseModal(!expenseModal); // Close modal
          return true; // Prevent default navigation
        }}>
        <ModalContent
          style={{
            width: '100%',
            height: 600,
            backgroundColor: '#f8f8f8',
          }}>
          {modalView == 'original' ? (
            <View>
              <Text
                style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
                Add a Expence
              </Text>
              <View
                style={{
                  marginVertical: 15,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>Rs</Text>
                <TextInput
                  placeholder="0.0"
                  value={price}
                  onChangeText={setPrice}
                  placeholderTextColor="gray"
                  style={{fontSize: 16}}></TextInput>
              </View>
              <Pressable
                onPress={goToBlankView}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text>Add a Event 🏷️ ( {category} )</Text>
                <Text
                  style={{
                    fontWeight: 500,
                    backgroundColor: 'orange',
                    padding: 4,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    textAlign: 'center',
                  }}>
                  Select Item
                </Text>
              </Pressable>
              <View
                style={{
                  height: 1,
                  borderColor: '#e0e0e0',
                  borderWidth: 2,
                  marginVertical: 20,
                  borderRadius: 4,
                }}></View>

              <Pressable
                onPress={togglePaidBy}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 15, fontWeight: 500}}>
                  Paid by: You
                </Text>
                <Icon
                  name={
                    ispaidByExpanded
                      ? 'keyboard-arrow-down'
                      : 'keyboard-arrow-right'
                  }
                  size={25}
                  color="black"
                />
              </Pressable>

              {ispaidByExpanded && (
                <View style={{marginTop: 10}}>
                  {item?.travelers?.map((item, index) => (
                    <Pressable
                      onPress={() => setPaidBy(item?.name)}
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginVertical: 5,
                      }}>
                      <Image
                        source={{uri: item?.photo}}
                        style={{width: 40, height: 40, borderRadius: 20}}
                      />
                      <Text
                        style={{
                          color: paidBy === item?.name ? 'orange' : 'black', // Change text color to orange if selected
                          fontSize: 16,
                        }}>
                        Paid by {item?.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              <View>
                <Pressable
                  onPress={toggleSplit}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 500}}>
                    Split : Don't Split
                  </Text>
                  <Icon
                    name={
                      isSplitExpanded
                        ? 'keyboard-arrow-down'
                        : 'keyboard-arrow-right'
                    }
                    size={25}
                    color="black"
                  />
                </Pressable>
                {isSplitExpanded && (
                  <View
                    style={{marginTop: 10, flexDirection: 'column', gap: 10}}>
                    <Pressable onPress={() => setValue('Indiviudals')}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: value === 'Indiviudals' ? 'orange' : 'gray',
                        }}>
                        Indiviudals
                      </Text>
                    </Pressable>

                    <Pressable onPress={() => setValue('Everyone')}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: value === 'Everyone' ? 'orange' : 'gray',
                        }}>
                        Everyone
                      </Text>
                    </Pressable>

                    <Pressable onPress={() => setValue("Don't Split")}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: value === "Don't Split" ? 'orange' : 'gray',
                        }}>
                        Don't Split
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  borderColor: '#e0e0e0',
                  borderWidth: 2,
                  marginVertical: 20,
                  borderRadius: 4,
                }}></View>
              <Pressable
                onPress={() => addExpenseToTrip()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'orange',
                  marginVertical: 10,
                  marginHorizontal: 10,
                  padding: 10,
                }}>
                <Text>Save Expense</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text
                style={{textAlign: 'center', fontWeight: 600, marginTop: 10}}>
                Expense Category
              </Text>
              <Pressable
                onPress={goToOriginalView}
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  backgroundColor: 'orange',
                  borderRadius: 5,
                  padding: 10,
                }}>
                <Text style={{color: 'white'}}>Go back</Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 60,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                {CategoryData?.map((item, index) => (
                  <Pressable onPress={() => selectCategory(item)} key={index}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 30,

                          resizeMode: 'center',
                        }}
                        source={{uri: item?.image}}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 10,
                          fontSize: 13,
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ModalContent>
      </BottomModal>
      <BottomModal
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        onbackdropPress={() => setOpenShareModel(!openShareModel)}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        visible={openShareModel}
        onTouchOutside={() => {
          setOpenShareModel(!openShareModel);
        }}
        onHardwareBackPress={() => {
          setOpenShareModel(!openShareModel); // Close modal
          return true; // Prevent default navigation
        }}>
        <ModalContent
          style={{width: '100%', height: 300, backgroundColor: 'f8f8f8'}}>
          <View>
            <Text style={{fontSize: 15, fontWeight: 500, textAlign: 'center'}}>
              Invite Tripmates
            </Text>
            <View
              style={{
                marginVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: '#e0e0e0',
                gap: 8,
                borderRadius: 7,
              }}>
              <Ionicons name="person-add-sharp" size={20} color="gray" />
              <TextInput
                placeholder="Invite by Email address"
                placeholderTextColor={'orange'}
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 12,
              }}></View>
            {isValidEmail && (
              <Pressable
                onPress={handleSendInvite}
                style={{
                  backgroundColor: '#e97451',
                  marginTop: 16,
                  padding: 10,
                  borderRadius: 8,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 500,
                    textAlign: 'center',
                  }}>
                  send Invite
                </Text>
              </Pressable>
            )}
          </View>
        </ModalContent>
      </BottomModal>

      {!editing && (
        <Pressable
          onPress={() => navigation.navigate('map', {places: places})}
          style={{
            width: 60,
            height: 60,
            borderRadius: 40,
            justifyContent: 'center',
            marginLeft: 'auto',
            position: 'absolute',
            bottom: 35,
            right: 25,
            alignContent: 'center',
            backgroundColor: 'orange',
          }}>
          <Feather
            style={{
              textAlign: 'center',
            }}
            name="map"
            size={24}
            color="#ffffff"
          />
        </Pressable>
      )}

      <Modal
        swipeThreshold={200}
        onBackdropPress={() => setExploreModal(false)}
        modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
        visible={exploreModal}
        onTouchOutside={() => setExploreModal(false)}
        onHardwareBackPress={() => {
          setExploreModal(false);
          return true;
        }}>
        <ModalContent
          style={{
            width: '95%',

            alignSelf: 'center',
            height: 600,
          }}>
          <View style={{flex: 1}}>
            <ScrollView
              style={{flex: 1}} // Ensure it expands
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {explore.length > 0 ? (
                explore.map((place, index) => (
                  <Pressable
                    key={index}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                    }}>
                    {place.photos?.[0]?.photo_reference ? (
                      <Image
                        style={{width: 100, height: 100, borderRadius: 10}}
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=YourApiKey`,
                        }}
                      />
                    ) : (
                      <Image
                        style={{width: 100, height: 100, borderRadius: 10}}
                        source={{
                          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png',
                        }}
                      />
                    )}

                    <View style={{padding: 10}}>
                      <Text
                        numberOfLines={1}
                        style={{fontSize: 16, fontWeight: '600'}}>
                        {place?.name}
                      </Text>
                      <Text numberOfLines={2} style={{color: '#c4c4c4'}}>
                        {place?.vicinity}
                      </Text>
                      <Text style={{color: '#505050'}}>
                        ⭐ {place?.rating || 'N/A'}
                      </Text>
                    </View>
                  </Pressable>
                ))
              ) : (
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 10,
                      color: 'gray',
                    }}>
                    No places found.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          <Pressable
            onPress={() => setExploreModal(false)}
            style={{
              padding: 10,
              backgroundColor: 'red',
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Close</Text>
          </Pressable>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TripPlanScreen;

const styles = StyleSheet.create({});
 