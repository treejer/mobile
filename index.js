/**
 * @format
 */

import 'react-native-gesture-handler';
import './globals';
import {AppRegistry} from 'react-native';
import App from './NewApp';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
