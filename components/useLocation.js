import {useState, useEffect} from 'react';
import {Text, SafeAreaView, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

// Custom hook implementation
const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const GOOGLE_API_KEY = 'YourApiKey';

  const fetchGoogleLocation = async () => {
    try {
      const response = await axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
        {},
      );
      const {lat, lng} = response.data.location;
      setUserLocation(`${lat},${lng}`);
    } catch (err) {
      console.error('Google API failed, using device GPS:', err);
      getDeviceGPSLocation();
    }
  };

  const getDeviceGPSLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation(`${latitude},${longitude}`);
      },
      error => {
        setError('Failed to get location: ' + error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    fetchGoogleLocation();
  }, []);

  return {userLocation, error};
};

export default useLocation;
