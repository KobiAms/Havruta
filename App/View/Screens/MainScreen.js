/* eslint-disable semi */
import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'


function MainScreen({ navigation, route }) {

  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.clear_container}>
          <Icon name={'rocket-sharp'} size={40} color={'rgb(120,90,140)'} />
          <Text style={styles.table_clear}>
            {'Work in Progress'}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
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
  clear_container: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '40%',
  },
  table_clear: {
    fontSize: 20,
    color: 'rgb(0,0,0)',
    textAlign: 'center'
  }
});

export default MainScreen;
