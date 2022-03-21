import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en} from './en';
import {fa} from './fa';
import {defaultLocale} from 'services/config';

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fa: {
      translation: fa,
    },
  },
  lng: defaultLocale,
  // fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
  // @here check later for upgrading to v4
  compatibilityJSON: 'v3',
});

export {i18next};
