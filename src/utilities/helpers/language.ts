import {DefaultTheme, css} from 'styled-components/native';

export type Locale = 'en' | 'ar' | string;

export type LanguageName = 'English' | 'Arabic';
export type LanguageDirection = 'rtl' | 'ltr';

export const languageUtil = {
  direction: (locale: Locale) => languages[locale].direction,
  isRTL: function (locale: Locale) {
    return this.direction(locale) === 'rtl';
  },
  start: function (locale: Locale) {
    return this.isRTL(locale) ? 'right' : 'left';
  },
  end: function (locale: Locale) {
    return this.isRTL(locale) ? 'left' : 'right';
  },
};

export type Language = {
  locale: Locale;
  direction: LanguageDirection;
  name: LanguageName;
};

export type Languages = {
  [locale in Locale]: Language;
};

export const languages: Languages = {
  en: {
    locale: 'en',
    name: 'English',
    direction: 'ltr',
  },
  ar: {
    locale: 'ar',
    name: 'Arabic',
    direction: 'rtl',
  },
};

export type SetLanguageDirection = {
  locale?: Locale;
  theme?: DefaultTheme;
};
export const setLanguageDirection = (props: SetLanguageDirection) =>
  !props.locale
    ? ''
    : css`
        text-align: ${languageUtil.start(props.locale)};
      `;
