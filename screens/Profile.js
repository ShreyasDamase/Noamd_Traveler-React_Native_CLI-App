import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage import
import {GoogleSignin} from '@react-native-google-signin/google-signin'; // GoogleSignin import
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Ensure you've installed react-native-vector-icons

const Profile = () => {
  const {userId, setToken} = useContext(AuthContext); // Accessing userId and setToken from AuthContext
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false); // For managing settings dropdown visibility
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://localhost:8000/user/${userId}`,
        );
        setUserInfo(response.data.user); // Set user info from API response
      } catch (err) {
        setError('Error fetching user data.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData(); // Fetch data when userId is available
    }
  }, [userId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f9f9f9',
        }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f9f9f9',
        }}>
        <Text>{error}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Remove token from AsyncStorage
      setToken(null); // Clear the token in the context
      GoogleSignin.signOut(); // Optional: Sign out from Google
      console.log('User logged out');
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `https://localhost:8000/user/${userId}`,
      );
      await AsyncStorage.removeItem('authToken'); // Remove token
      setToken(null); // Clear token from context
      GoogleSignin.signOut(); // Sign out from Google
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
      }}>
      <Image
        source={{uri: userInfo.photo}}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          marginBottom: 15,
          borderWidth: 2,
          borderColor: '#ddd',
        }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 5,
          color: '#333',
        }}>
        {userInfo.name}
      </Text>
      <Text style={{fontSize: 16, color: '#777', marginBottom: 20}}>
        {userInfo.email}
      </Text>

      {/* Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
            }}>
            <Text style={{fontSize: 18, marginBottom: 20}}>
              Are you sure you want to delete your account?
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{fontSize: 16, color: 'gray'}}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirmDelete}>
                <Text style={{fontSize: 16, color: 'red'}}>Yes, Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Dropdown */}
      {settingsVisible && (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 10,
            width: '50%',
            position: 'absolute',
            top: 75,
            right: 4,
            elevation: 5,
          }}>
          <Pressable onPress={handleLogout}>
            <Text style={{fontSize: 16, color: '#333'}}>Logout</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={{fontSize: 16, color: 'red', marginTop: 5}}>
              Delete Account
            </Text>
          </Pressable>
        </View>
      )}

      <View
        style={{
          marginTop: 30,
          paddingHorizontal: 20,
          justifyContent: 'flex-end',
          marginBottom: 40,
          width: '100%',
        }}></View>

      {/* Gear Icon Dropdown */}
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 30,
          elevation: 5,
        }}>
        <TouchableOpacity onPress={() => setSettingsVisible(!settingsVisible)}>
          <Icon name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
