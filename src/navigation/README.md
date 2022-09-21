# Navigation

> Navigation config and process state of application and authorization stacks.
> 
> Screen and route path customization.
> 
> Init navigation, root navigation, unverified user, verified user stacks.

## components:
- [InitNavigation](./InitNavigation.tsx): process state of the application, and global data providers
- [RootNavigation](./Navigation.tsx): root stack
- [UnVerifiedUser](./UnVerifiedUser.tsx): unverified user stack
- [VerifiedUser](./VerifiedUser.tsx): verified user stack


- ### contexts
  - NavigationContainer: react-navigation wrapper
  - [CurrentJourneyProvider](../services): journey data provider
  - [OfflineTreeProvider](../utilities/hooks): offline tree data provider
  - [ApolloProvider](../services): graphQl configuration
  - [ToastContainer](../components/Toast): custom toast notification container


- Toast: global toast notification component to open it outside the component
- [AppLoading](../components/AppLoading): loading content
- [NetInfo](../components/NetInfo): internet status
- [SwitchNetwork](../components/SwitchNetwork): switch network
- [RootNavigation](../navigation/README.md): root stack is here
  - [PreLoadImage](../components/PreloadImage): pre load images
  - [LandScapeModal](../components/LandScapeModal): rotate your phone message
  - [UpdateModal](../components/UpdateModal): check app version and update message in the mobile application.

