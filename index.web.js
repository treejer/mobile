/**
 * @format
 */

import {registerRootComponent} from 'expo';
import {version} from './package.json';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-loading-skeleton/dist/skeleton.css';
import {register} from './src/serviceWorkerRegistration';
import './index.css';

console.log('running web v', version);

registerRootComponent(App);
register();
