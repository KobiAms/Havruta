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
import SubjectArticles from './App/View/Screens/SubjectArticles'
import ArticleScreen from './App/View/Screens/ArticleScreen'
import auth from '@react-native-firebase/auth'
import RegistrationScreen from './App/View/Screens/RegistrationScreen';
import ManageUsers from './App/View/Components/ManageUsers';
import ManageUser from './App/View/Components/ManageUser';


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
        activeTintColor: 'rgb(120,90,140)',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="MainScreen" component={MainScreen}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="file-contract" size={25} color={color} />), })} />
      <Tab.Screen name="Gays" component={SubjectArticles}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="transgender" size={25} color={color} />), })} />
      <Tab.Screen name="Reporters" component={GenericChat}
        options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="comment-alt" size={25} color={color} />), })} />
      <Tab.Screen name="Judaism" component={SubjectArticles}
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
            name="SubjectArticles"
            component={SubjectArticles}
          />
          <Stack.Screen
            name="ArticleScreen"
            component={ArticleScreen}
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
    backgroundColor: 'rgb(120,90,140)',
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
