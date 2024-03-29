# RangerTreejer

> In a world full of indifference, a grand movement is rising to stand for the future. You might be the next link within this green chain. Adopt your unique tree and let locals plant it!

<img src="./assets/images/splash.png" width="370px">

- ## [Navigation](./src/navigation)
- ## [Screens](./src/screens)
- ## [Components](./src/components)
- ## [Hooks](./src/utilities/hooks)
- ## [Helpers](./src/utilities/helpers)
- ## [Localization](./src/localization)
- ## [GlobalStyles](./src/constants)
- ## [Services](./src/services)
- ## [Redux](./src/redux)

# App.tsx

> Wrapper, global components, and init navigation are in [App.tsx](./App.tsx)

## components:

- InitNavigation: process state of the application, and global data providers
- ### Contexts
  - Provider: react-redux provider for wrapping store around the application
  - PersistGate: redux-persist wrapper
  - I18nextProvider: Multiple language
  - SafeAreaProvider: Safe area view for react-navigation

# Build Setup

```bash
# install dependencies
$ yarn
# iOS
$ yarn ios
# Android
$ yarn android
# Android Production
$ yarn android:play
# Web Development
# If you are running for the first time, install expo-cli globally
$ yarn add -g expo-cli # ONLY FIRST TIME
$ yarn web # ALWAYS
# Web Production
$ SERVER_USERNAME="username" SERVER_IP="0.0.0.0" PORT=4000 ./deploy.sh

```

### Translations :earth_americas:

- [Spanish version](./translations/README-es.md)
- [Portuguese version](./translations/README-pt-br.md)
