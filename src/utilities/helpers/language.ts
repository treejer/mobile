import {DefaultTheme, css} from 'styled-components/native';

export enum Locale {
  en = 'en',
  ar = 'ar',
  fr = 'fr',
  fa = 'fa',
  tr = 'tr',
  es = 'es',
}

export enum LanguageName {
  English = 'English',
  Arabic = 'Arabic',
  French = 'French',
  Persian = 'Persian',
  Turkish = 'Turkish',
  Español = 'Español',
}

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
  ar: {
    locale: Locale.ar,
    name: LanguageName.Arabic,
    direction: 'rtl',
  },
  fa: {
    locale: Locale.fa,
    name: LanguageName.Persian,
    direction: 'rtl',
  },
  en: {
    locale: Locale.en,
    name: LanguageName.English,
    direction: 'ltr',
  },
  fr: {
    locale: Locale.fr,
    name: LanguageName.French,
    direction: 'ltr',
  },
  tr: {
    locale: Locale.tr,
    name: LanguageName.Turkish,
    direction: 'ltr',
  },
  es: {
    locale: Locale.es,
    name: LanguageName.Español,
    direction: 'ltr',
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

export const treejerLanguages = Object.values(languages);
