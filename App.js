import React from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
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
        activeTintColor: 'rgb(0,110,220)',
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
            options={({ navigation }) => ({
              title: 'Havruta',
              headerTitle: <Image style={styles.image_title} source={require('./App/Assets/logo.png')} />,
              headerRight: () => (
                <TouchableOpacity
                  style={styles.register}
                  onPress={() => navigation.navigate('Registration')}>
                  {auth().currentUser && auth().currentUser.photoURL ?
                    <Image style={styles.user_image} source={{ uri: auth().currentUser.photoURL }} />
                    :
                    <Icon color={'#fff'} name={'user-alt'} size={20} />
                  }
                </TouchableOpacity>
              ),
            })} />
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
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.80,
    shadowRadius: 5,
  },
  user_image: {
    height: 35,
    width: 35,
    borderRadius: 20,
    overflow: 'hidden'
  },
  image_title: {
    height: 40,
    width: 80,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.80,
    shadowRadius: 5,
  }

});

export default App;
