import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const About = () => {
  const handleContactEmail = () => {
    // Add your contact email action here
    Linking.openURL('mailto:shreyasdamase@gmail.com');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>About NomadTraveler</Text>

      <Text style={styles.text}>
        NomadTraveler is a free travel management app designed to help users
        plan their trips, manage their itinerary, and track their travel budget.
        With NomadTraveler, you can add places to visit, manage your travel
        expenses, and view your locations on a Google Map.
      </Text>

      <Text style={styles.subHeader}>Developer Information</Text>
      <Text style={styles.text}>Developer: Shreyas Damase</Text>
      <Text style={styles.text}>Location: Pune, Maharashtra</Text>
      <Text style={styles.text}>App Version: Initial Version</Text>
      <Text style={styles.text}>
        I am a fresh React Native developer, and this is my first app. I am
        dedicated to keeping your experience smooth and secure.
      </Text>

      <Text style={styles.subHeader}>App Features</Text>
      <Text style={styles.text}>- Google Sign-In for user authentication</Text>
      <Text style={styles.text}>
        - Add places to visit and manage your itinerary
      </Text>
      <Text style={styles.text}>
        - Budget tracking for your travel expenses
      </Text>
      <Text style={styles.text}>
        - View your locations marked on a Google Map
      </Text>

      <Text style={styles.subHeader}>Privacy & Data Usage</Text>
      <Text style={styles.text}>
        - NomadTraveler does not collect sensitive user data. We only store the
        email, name, and profile photo for Google authentication.
      </Text>
      <Text style={styles.text}>
        - We do not share or sell any user data to third parties.
      </Text>
      <Text style={styles.text}>
        - We do not use third-party advertisements or cookies in the app.
      </Text>
      <Text style={styles.text}>
        - User passwords are stored in an encrypted format for security.
      </Text>

      <Text style={styles.subHeader}>Terms & Conditions</Text>
      <Text style={styles.text}>
        By using NomadTraveler, you agree to our Terms of Service and Privacy
        Policy. We reserve the right to modify these terms at any time. Changes
        will be posted here.
      </Text>

      <Text style={styles.subHeader}>Contact</Text>
      <TouchableOpacity onPress={handleContactEmail}>
        <Text style={styles.email}>Contact us at: shreyasdamase@gmail.com</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        By using this app, you consent to our Privacy Policy and agree to these
        terms.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  email: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default About;
