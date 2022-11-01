# Hooks

> Custom hooks for reusing them everywhere, to sharing logic to avoid duplicate codes


- [useAnalytics](./useAnalytics.ts): firebase logger
- [useAnalytics.web](./useAnalytics.web.ts): it does not return anything, just because don't receive error on the web
- [useAppState](./useAppState.ts): application state (foreground, active...)
- [useBrowserName](./useBrowserName.ts): browser name
- [useBrowserPlatform](./useBrowserPlatform.ts): return OS name
- [useCamera](./useCamera.ts): open camera and library in the mobile application
- [useCamera.web](./useCamera.web.ts): it does not return anything, just because don't receive errors on the web
- [useCheckTreePhoto](./useCheckTreePhoto.ts): check taken photo metadata for checking location and distance between picture and submitted location on map
- [useCheckTreePhoto.web](./useCheckTreePhoto.web.ts): check taken photo metadata for checking location and distance between picture and submitted location on map on the web
- [useDeepLinking](./useDeepLinking.ts): deep linking for refer and organization
- [useNetInfo](./useNetInfo.ts): check internet connection
- [useOfflineTrees](./useOfflineTrees.tsx): offline trees context, list of offline trees
- [useOrientation](./useOrientation.ts): check device rotation
- [usePlantedTrees](./usePlantedTrees.ts): list of planted trees
- [usePlanterStatusQuery](./usePlanterStatusQuery.ts): planter status query
- [usePlantTreePermissions](./usePlantTreePermissions.ts): check user's permissions for plant or update tree
- [usePlantTreePermissions.web](./usePlantTreePermissions.web.ts): check user's permissions for plant or update tree on the web
- [useRefocusEffect](./useRefocusEffect.ts): refocus on screens
- [useStore](./useStore.ts): custom useAppSelector and useDispatch with store types
- [useTempTrees](./useTempTrees.ts): list all the trees
- [useTimer](./useTimer.ts): dynamic timer
- [useTransition](./useTransition.ts): ui animation
- [useTreeUpdateInterval](./useTreeUpdateInterval.ts): it does return how much time is left to update the tree
- [useWindowSize](./useWindowSize.ts): it does return device screen size
