# Navigation

> Navigation config and process state of application and authorization stacks.
> 
> Screen and route path customization
> 
> Init navigation, root navigation, unverified user, verified user stacks are here.

## components:
- InitNavigation: process state of the application, and global data providers
- RootNavigation: root stack
- UnVerifiedUser: unverified user stack
- VerifiedUser: verified user stack


- ### contexts
  - NavigationContainer: react-navigation wrapper
  - [CurrentJourneyProvider](./src/services): journey data provider
  - [OfflineTreeProvider](./src/utilities/hooks): offline tree data provider
  - [ApolloProvider](./src/services): graphQl configuration
  - [ToastContainer](./src/components/Toast): custom toast notification container
  

- Toast: global toast notification component to open it outside the component
- [AppLoading](./src/components/AppLoading): loading content
- [NetInfo](./src/components/NetInfo): internet status
- [SwitchNetwork](./src/components/SwitchNetwork): switch network
- [RootNavigation](./src/navigation/README.md): root stacks are here.
  - [PreLoadImage](./src/components/PreloadImage): pre load images
  - [LandScapeModal](./src/components/LandScapeModal): rotate your phone message
  - [UpdateModal](./src/components/UpdateModal): check app version and update message in the mobile application.

