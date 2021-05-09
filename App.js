import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GenericFeed from './App/View/Screens/GenericFeed';
import OtherScreen from './App/View/Screens/OtherScreen';
import GenericChat from './App/View/Screens/GenericChat';
import MainScreen from './App/View/Screens/MainScreen';

const Tab = createBottomTabNavigator();

App = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="file-contract" size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Gays"
            component={GenericFeed}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="venus-double" size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Reprters"
            component={GenericChat}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="comment-alt" size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Judaism"
            component={GenericFeed}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="torah" size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Other"
            component={OtherScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="bars" size={25} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 127, 255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
