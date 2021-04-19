import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

App =  ()  => {

  return (
    <SafeAreaView style={styles.container}>
      <Icon name={"user-plus"} size={20} color={'rgba(0,0,0,1)'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 127, 255)',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
