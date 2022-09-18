# Treejer Ranger

> In a world full of indifference, a grand movement is rising to stand for the future. You might be the next link within this green chain. Adopt your unique tree and let locals plant it!

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

> Wrapper, global components, and Routes title are in [App.tsx](./App.tsx)

## components:

- Contexts
  - Provider: react-redux provider for wrapping store around the application
  - I18nextProvider: Multiple language
  - SafeAreaProvider: Safe area view for react-navigation
  - [SettingsProvider](./src/services): setting data provider
  - [Web3Provider](./src/services): wallet address, access token, user Id, magic token, blockchain network provider
  - [OfflineTreeProvider](/src/utilities/hooks): offline tree data provider
  - [ApolloProvider](./src/services): ------
  - [CurrentUserProvider](./src/services): user data provider
  - [CurrentJourneyProvide](./src/services)r: journey data provider
  - NavigationContainer: react-navigation wrapper
- [AppLoading](./src/components/AppLoading): loading content
- [NetInfo](./src/components/NetInfo): internet status
- [SwitchNetwork](./src/components/SwitchNetwork): switch network
- [PreLoadImage](./src/components/PreloadImage): pre load images
- ToastContainer: toast notification
- [LandScapeModal](./src/components/LandScapeModal): rotate your phone message
- [UpdateModal](./src/components/UpdateModal): check app version and update message in the mobile application.
- [RootNavigation](./src/navigation/README.md): root stacks are here.

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