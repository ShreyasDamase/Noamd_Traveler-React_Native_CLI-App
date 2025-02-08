/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {StatusBar, StyleSheet, View} from 'react-native';
import {ModalPortal} from 'react-native-modals';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/MaterialIcons';
import StackNavigator from './navigation/StackNavigator';
import {AuthProvider} from './AuthContext';
function App() {
  return (
    <>
      <AuthProvider>
        <StatusBar backgroundColor="#ffa600ff" barStyle="light-content" />

        <StackNavigator />
        <ModalPortal></ModalPortal>
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
