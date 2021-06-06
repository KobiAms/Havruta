import React from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GenericFeed from './App/View/Screens/GenericFeed';
import OtherScreen from './App/View/Screens/OtherScreen';
import GenericChat from './App/View/Screens/GenericChat';
import MainScreen from './App/View/Screens/MainScreen';
import RegistrationScreen from './App/View/Screens/RegistrationScreen';
import ManageUsers from './App/View/Components/ManageUsers';
import ManageUser from './App/View/Components/ManageUser';
import { WebView } from 'react-native-webview';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const hide_tab_bar_screens = [
  'Registration',
  'Manage Users',
  'Manage User',
  'ArticleScreen',
];

App = () => {
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (hide_tab_bar_screens.includes(routeName)) {
      return false;
    }
    return true;
  };

  return (
    <SafeAreaProvider style={{ height: '100%', width: '100%' }}>
       <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="MainScreen" component={MainScreenNavigator}
            options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="file-contract" size={25} color={color} />), })} />
          <Tab.Screen name="Gays" component={GenericFeed}
            options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="transgender" size={25} color={color} />), })} />
          <Tab.Screen name="Reporters" component={GenericChat}
            options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="comment-alt" size={25} color={color} />), })} />
          <Tab.Screen name="Judaism" component={GenericFeed}
            options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="torah" size={25} color={color} />), })} />
          <Tab.Screen name="Other" component={OtherScreen}
            options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route), tabBarIcon: ({ color }) => (<Icon name="bars" size={25} color={color} />), })} />
        </Tab.Navigator>
      </NavigationContainer> 
    </SafeAreaProvider>
  );
};

MainScreenNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={MainScreen}
        options={{ title: 'Havruta', headerStyle: { backgroundColor: 'rgb(117,25,124)', borderBottomWidth: 1, borderBottomColor: 'rgb(200,200,200)', }, headerTitleStyle: { fontWeight: 'bold', }, }} />
      <Stack.Screen name="Registration" component={RegistrationScreen}
        options={{ title: 'Registration', headerStyle: { borderBottomWidth: 1, borderBottomColor: 'rgb(200,200,200)', }, headerTitleStyle: { fontWeight: 'bold', }, }} />
      <Stack.Screen name="Manage Users" component={ManageUsers}
        options={{ title: 'Manage Users', headerStyle: { backgroundColor: 'rgb(120,90,140)', borderBottomWidth: 1, borderBottomColor: 'rgb(200,200,200)', }, headerTitleStyle: { fontWeight: 'bold', }, }} />
      <Stack.Screen name="Manage User" component={ManageUser}
        options={{ title: 'Manage User', headerStyle: { backgroundColor: 'rgb(120,90,140)', borderBottomWidth: 1, borderBottomColor: 'rgb(200,200,200)', }, headerTitleStyle: { fontWeight: 'bold', }, }} />
    </Stack.Navigator>
  );
};

// DonatePage = () => {
//   return(
//     <WebView source={{ uri: 'https://havruta.org.il/donate/'}} style={{ marginTop: 20 }}/>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 127, 255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
