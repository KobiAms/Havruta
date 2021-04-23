import 'react-native-gesture-handler';  // must be the first line of the App for ios development and production

/**
 * index is the highest continer of the app,
 * Here we control the main view, user status & listener 
 * and loads the App component wich control the logic of the 
 * current screen & components that display. 
 *  */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
