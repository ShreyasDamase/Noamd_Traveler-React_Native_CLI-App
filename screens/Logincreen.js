import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

GoogleSignin.configure({
  webClientId:
    'your_webClientId',
  scopes: ['profile', 'email'],
});

const LoginScreen = () => {
  const {token, setToken} = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Initially true to show loading indicator
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate checking user status, such as if already logged in
    const checkUserStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          setLoading(false); // Hide the loading indicator if token exists
        } else {
          setLoading(false); // If no token found, hide loading and show login options
        }
      } catch (err) {
        console.log('Error checking token:', err);
        setLoading(false); // Ensure loading is hidden if there's an error
      }
    };
    checkUserStatus();
  }, []);

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google user info:', userInfo);
      return userInfo;
    } catch (error) {
      console.log('Google login error:', error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true); // Start loading when login process begins
    try {
      const response = await GoogleLogin(); // Sign in with Google
      const {idToken} = response; // Retrieve the ID token

      console.log('idToken:', idToken); // Log the idToken

      // If idToken is not found, extract it from response.data.idToken
      const extractedIdToken = idToken || response.data.idToken;
      console.log('Extracted idToken:', extractedIdToken);

      if (extractedIdToken) {
        // Send idToken to backend for verification
        const backendResponse = await axios.post(
          'https://localhost:8000/google-login',
          {idToken: extractedIdToken},
        );

        const data = backendResponse.data;
        console.log('Backend Response:', data);

        if (data.token) {
          await AsyncStorage.setItem('authToken', data.token);
          setToken(data.token);
        } else {
          throw new Error('No token received from server');
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.log('Login Error:', error);
    } finally {
      setLoading(false); // End loading after login attempt (success or failure)
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{marginTop: 30, alignItems: 'center', paddingHorizontal: 20}}>
        <Image
          style={{
            width: width * 0.9,
            height: 300,
            resizeMode: 'contain',
            marginBottom: 10,
          }}
          source={require('../assets/images/NomadTraveler.png')}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: '#333',
            marginBottom: 10,
          }}>
          Welcome Back!
        </Text>
        <Text style={{fontSize: 16, color: '#666', textAlign: 'center'}}>
          Sign in to continue your journey with us
        </Text>
      </View>

      {loading ? (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      ) : (
        <View
          style={{
            marginTop: 70,
            paddingHorizontal: 30,
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 70,
          }}>
          {error && (
            <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
          )}

          <Pressable
            onPress={handleGoogleLogin}
            style={({pressed}) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#4285F4',
              paddingVertical: 15,
              marginHorizontal: 12,
              borderRadius: 25,
              width: width * 0.8,
              alignSelf: 'center',
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
              opacity: pressed ? 0.9 : 1,
              transform: [{scale: pressed ? 0.98 : 1}],
            })}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 8,
                position: 'absolute',
                left: 10,
              }}>
              <AntDesign name="google" size={24} color="#4285F4" />
            </View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                letterSpacing: 0.5,
              }}>
              Continue with Google
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 30,
            }}>
            <View style={{flex: 1, height: 1, backgroundColor: '#E0E0E0'}} />

            <View style={{flex: 1, height: 1, backgroundColor: '#E0E0E0'}} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
