import React, { useState } from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import OtherScreen from './App/View/Screens/OtherScreen';
import GenericChat from './App/View/Screens/GenericChat';
import MainScreen from './App/View/Screens/MainScreen';
import Wizard from './App/View/Components/NewUserWizard'
import GenericFeed from './App/View/Screens/GenericFeed'
import ArticleScreen from './App/View/Screens/ArticleScreen'
import auth from '@react-native-firebase/auth'
import RegistrationScreen from './App/View/Screens/RegistrationScreen';
import ManageUsers from './App/View/Components/ManageUsers';
import ManageUser from './App/View/Components/ManageUser';
import ChatScreen from './App/View/Screens/ChatScreen';
import AddChat from './App/View/Screens/AddChat';
import DonationScreen from './App/View/Screens/DonationScreen';
import EventsScreen from './App/View/Screens/EventsScreen';
import AddEvent from './App/View/Screens/AddEvent';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const hide_tab_bar_screens = [
  'Registration',
  'Manage Users',
  'Manage User',
  'ArticleScreen',
];

MainScreenNavigator = () => {
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (hide_tab_bar_screens.includes(routeName)) {
      return false;
    }
    return true;
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#0d5794',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="MainScreen" component={MainScreen}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="file-contract" size={25} color={color} />), })} />
      <Tab.Screen name="Community" component={GenericFeed}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="transgender" size={25} color={color} />), })} />
      <Tab.Screen name="Reporters" component={GenericChat}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="comment-alt" size={25} color={color} />), })} />
      <Tab.Screen name="Judaism" component={GenericFeed}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="torah" size={25} color={color} />), })} />
      <Tab.Screen name="Other" component={OtherScreen}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="bars" size={25} color={color} />), })} />
    </Tab.Navigator>
  );
};


App = () => {
  return (
    <SafeAreaProvider style={{ height: '100%', width: '100%' }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: styles.stack_header,
            headerTitleStyle: styles.stack_title,
            headerTintColor: '#fff'
          }}>
          <Stack.Screen
            name="MainScreenNavigator"
            component={MainScreenNavigator}
            // set the main header to show logo, search and user 
            options={({ navigation }) => {
              // state for search box open or close and state fo rthe search text
              const [close, setClose] = useState(true);
              const [toSearch, setToSearch] = useState('');
              return ({
                title: 'Havruta',
                headerLeft: () => {
                  if (close) {
                    return (
                      <Image style={styles.image_title} source={require('./App/Assets/logo.png')} />
                    )
                  } else {
                    return (
                      <TouchableOpacity style={{ padding: 10 }} onPress={() => { setToSearch(''); setClose(true) }}>
                        <Icon style={styles.search_icon} color={'#fff'} size={20} name={'chevron-left'} />
                      </TouchableOpacity>
                    )
                  }
                },
                headerTitle: () => {
                  return (
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                      {
                        close ?
                          <TouchableOpacity style={{ padding: 10 }} onPress={() => close ? setClose(false) : console.log(toSearch)}>
                            <Icon style={styles.search_icon} color={'#fff'} size={20} name={'search'} />
                          </TouchableOpacity>
                          :
                          <TextInput
                            value={toSearch}
                            onChangeText={setToSearch}
                            placeholder={'Search Here...'}
                            placeholderTextColor={'#fffa'}
                            returnKeyType={'search'}
                            style={styles.stack_search}
                            autoFocus={true}
                            onSubmitEditing={() => toSearch.length == 0 ? setClose(true) : navigation.navigate('GenericFeed', { toSearch: toSearch })}
                          />
                      }
                    </View>
                  )
                }
                ,
                // this butten show the Profile button
                headerRight: () => {
                  if (close) {
                    return (
                      <TouchableOpacity
                        style={styles.register}
                        onPress={() => navigation.navigate('Registration')}>
                        <Icon color={auth().currentUser ? '#fff' : '#f0fbff'} name={'user-alt'} size={20} />
                      </TouchableOpacity>
                    )
                  } else {
                    return (
                      <TouchableOpacity style={{ padding: 10 }} onPress={() => toSearch.length == 0 ? setClose(true) : navigation.navigate('GenericFeed', { toSearch: toSearch })}>
                        <Icon style={styles.search_icon} color={'#fff'} size={20} name={'search'} />
                      </TouchableOpacity>
                    )
                  }
                },
              })
            }} />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ title: 'Registration', }} />
          <Stack.Screen
            name="Manage Users"
            component={ManageUsers}
            options={{ title: 'Manage Users', }} />
          <Stack.Screen
            name="Manage User"
            component={ManageUser}
            options={{ title: 'Manage User', }} />
          <Stack.Screen
            name="Wizard"
            component={Wizard}
            options={{ title: 'Welcome', }} />
          <Stack.Screen
            name="GenericFeed"
            component={GenericFeed}
          />
          <Stack.Screen
            name="ArticleScreen"
            component={ArticleScreen}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
          />
          <Stack.Screen
            name="GenericChat"
            component={GenericChat}
          />
          <Stack.Screen
            name="AddChat"
            component={AddChat}
          />
          <Stack.Screen
            name="DonationScreen"
            component={DonationScreen}
          />
          <Stack.Screen
            name="EventsScreen"
            component={EventsScreen}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEvent}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 127, 255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack_header: {
    backgroundColor: '#0d5794',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(200,200,200)',
  },
  stack_title: {
    color: "#fff"
  },
  register: {
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.80,
    shadowRadius: 4,
  },
  user_image: {
    height: 25,
    width: 25,
    borderRadius: 20,
    overflow: 'hidden'
  },
  image_title: {
    height: 50,
    width: 50,
  },
  stack_search: {
    width: Dimensions.get('screen').width * 0.6,
    height: '100%',
    color: '#fff'
  },
  search_icon: {
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.80,
    shadowRadius: 4,
  }

});

export default App;
