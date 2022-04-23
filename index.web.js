/**
 * @format
 */

import {registerRootComponent} from 'expo';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-loading-skeleton/dist/skeleton.css';
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import './index.css';

console.log('running index.web');

registerRootComponent(App);
serviceWorkerRegistration.register();
