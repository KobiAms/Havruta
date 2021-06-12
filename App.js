import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Image, Dimensions, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFW from 'react-native-vector-icons/FontAwesome';
import IconIC from 'react-native-vector-icons/Ionicons';
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
import AboutScreen from './App/View/Screens/AboutScreen';
import EventsScreen from './App/View/Screens/EventsScreen';
import AddEvent from './App/View/Screens/AddEvent';
import UserProfile from './App/View/Screens/UserProfile';

const HebrewDate = `<div>
<script type="text/javascript" charset="utf-8"
        src="https://www.hebcal.com/etc/hdate-he.js"></script></div>`;

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
        activeTintColor: '#fff',
        inactiveTintColor: '#0d5794',
        activeBackgroundColor: '#0d5794',
        keyboardHidesTabBar: Platform.OS == 'ios' ? true : false,
        style: {
          position: 'absolute',
          bottom: Platform.OS == 'ios' ? 8 : 10,
          left: Platform.OS == 'ios' ? 8 : 10,
          right: Platform.OS == 'ios' ? 8 : 10,
          borderRadius: Platform.OS == 'ios' ? 40 : 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderWidth: 2,
          borderColor: '#1111',
          elevation: 5,
          backgroundColor: '#f2f2f3',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }
      }}>
      <Tab.Screen
        name="דף הבית"
        component={MainScreen}
        initialParams={{ categories_id: '122' }}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<IconFW name="home" size={25} color={color} />), })} />
      <Tab.Screen
        name="מעט לעת"
        component={GenericFeed}
        initialParams={{ category_id: '402' }}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="book-open" size={25} color={color} />), })} />
      <Tab.Screen
        name="צ׳אט הכתבים"
        component={GenericChat}
        initialParams={{ id: 'reporters', show_input: false, chat_name: "צ׳אט הכתבים" }}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<IconIC name="ios-chatbubbles-sharp" size={25} color={color} />), })} />
      <Tab.Screen
        name="דוברות"
        component={GenericFeed}
        initialParams={{ category_id: '404' }}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="torah" size={25} color={color} />), })} />
      <Tab.Screen
        name=" "
        component={OtherScreen}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="bars" size={25} color={color} />), })} />
    </Tab.Navigator>
  );
};


App = () => {
  const [hebrewDate, setHebrewDate] = useState();
  async function getHebrewDate() {
    const dateURL = `https://www.hebcal.com/etc/hdate-he.js`;
    const response = await fetch(dateURL);
    const htmlStr = await response.text();
    const date = htmlStr.substring(16, htmlStr.length - 4)
    setHebrewDate(date)
  }
  useEffect(() => {
    getHebrewDate()
  }, [])
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

              return ({
                title: 'חברותא',
                headerLeft: () => <Image style={styles.image_title} source={require('./App/Assets/logo.png')} />,
                headerTitle: () => <Text style={styles.hebrew_date}>{hebrewDate}</Text>
                ,
                // this butten show the Profile button
                headerRight: () =>
                  <TouchableOpacity
                    style={styles.register}
                    onPress={() => navigation.navigate('Registration')}>
                    <Icon color={auth().currentUser ? '#fff' : '#f0fbff'} name={'user-alt'} size={25} />
                  </TouchableOpacity>
              })
            }} />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ title: 'Registration', }} />
          <Stack.Screen
            name="Manage Users"
            component={ManageUsers}
            options={{ title: 'ניהול', }} />
          <Stack.Screen
            name="Manage User"
            component={ManageUser}
            options={{ title: 'ניהול', }} />
          <Stack.Screen
            name="Wizard"
            component={Wizard}
            options={{ title: 'ברוכים הבאים', }} />
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
            name="AboutScreen"
            component={AboutScreen}
          />
          <Stack.Screen
            name="EventsScreen"
            component={EventsScreen}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEvent}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
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
    marginLeft: 10,
  },
  stack_search: {
    width: Dimensions.get('screen').width * 0.6,
    height: '100%',
    color: '#fff',
    textAlign: 'right'
  },
  search_icon: {
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.80,
    shadowRadius: 4,
  },
  hebrew_date: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }

});

export default App;
