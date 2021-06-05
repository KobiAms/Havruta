/* eslint-disable semi */
import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

function MainScreen({ navigation, route }) {
  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.body}>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    height: Dimensions.get('screen').height * (9 / 10),
    width: '100%',
    paddingTop: '10%',
    alignItems: 'center'
  },
  screen_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(255,255,255)',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
  },
  register: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back_button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;
