import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {useAppState} from 'utilities/hooks/useAppState';

export type PermissionResult = typeof RESULTS[keyof typeof RESULTS];

const treejerPermissions = Platform.select({
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
  ],
  default: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.LOCATION_ALWAYS,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.MEDIA_LIBRARY,
  ],
});

export type TUsePlantTreePermissions = {
  cameraPermission: string | null;
  locationPermission: string | null;
  libraryPermission: string | null;
  checkPermission: () => void;
  requestPermission: () => void;
  isCameraBlocked: boolean;
  isLocationBlocked: boolean;
  isLibraryBlocked: boolean;
  isCameraGranted: boolean;
  isLocationGranted: boolean;
  isLibraryGranted: boolean;
  isChecking: boolean;
  isGranted: boolean;
  cantProceed: boolean;
  requested: boolean;
};

export function usePlantTreePermissions(): TUsePlantTreePermissions {
  const {appState} = useAppState();

  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [libraryPermission, setLibraryPermission] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
      } catch (e) {}
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await checkPermission();
        console.log(res, 'permission appState changed');
      } catch (e) {
        console.log(e, 'e inside useEffect AppState change useRNContacts');
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  // useEffect(() => {
  //   console.log(permission, '<== contact permission updated');
  // }, [permission]);

  const checkPermission = useCallback(async () => {
    try {
      const res = await Permissions.checkMultiple(treejerPermissions);

      if (Platform.OS === 'android') {
        setCameraPermission(res['android.permission.CAMERA']);
        setLocationPermission(res['android.permission.ACCESS_FINE_LOCATION']);
        setLibraryPermission(res['android.permission.READ_MEDIA_IMAGES']);
      } else {
        setCameraPermission(res['ios.permission.CAMERA']);
        setLocationPermission(res['ios.permission.LOCATION_ALWAYS'] || res['ios.permission.LOCATION_WHEN_IN_USE']);
        setLibraryPermission(res['ios.permission.MEDIA_LIBRARY']);
      }

      setChecked(true);
      return Promise.resolve(res);
    } catch (e: any) {
      console.log(e, 'Error inside checkPermission useRNContacts');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      await checkPermission();
      const res = await Permissions.requestMultiple(treejerPermissions);
      // console.log(res, 'res is here permission');
      if (Platform.OS === 'android') {
        setCameraPermission(res['android.permission.CAMERA']);
        setLocationPermission(res['android.permission.ACCESS_FINE_LOCATION']);
        setLibraryPermission(res['android.permission.READ_MEDIA_IMAGES']);
      } else {
        setCameraPermission(res['ios.permission.CAMERA']);
        setLocationPermission(res['ios.permission.LOCATION_ALWAYS'] || res['ios.permission.LOCATION_WHEN_IN_USE']);
        setLibraryPermission(res['ios.permission.MEDIA_LIBRARY']);
      }
      setRequested(true);
      return Promise.resolve(res);
    } catch (e) {
      console.log(e, 'e requestPermission');
      return Promise.reject(e);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCameraBlocked = useMemo(
    () => cameraPermission === RESULTS.DENIED || cameraPermission === RESULTS.BLOCKED,
    [cameraPermission],
  );
  const isLocationBlocked = useMemo(
    () => locationPermission === RESULTS.DENIED || locationPermission === RESULTS.BLOCKED,
    [locationPermission],
  );

  const isLibraryBlocked = useMemo(
    () => libraryPermission === RESULTS.DENIED || libraryPermission === RESULTS.BLOCKED,
    [libraryPermission],
  );

  const isCameraGranted = useMemo(() => cameraPermission === RESULTS.GRANTED, [cameraPermission]);
  const isLocationGranted = useMemo(() => locationPermission === RESULTS.GRANTED, [locationPermission]);
  const isLibraryGranted = useMemo(() => libraryPermission === RESULTS.GRANTED, [libraryPermission]);

  const isChecking = useMemo(() => {
    return !checked && (!cameraPermission || !locationPermission);
  }, [checked, cameraPermission, locationPermission]);

  const cantProceed = useMemo(
    () => checked && (isCameraBlocked || isLocationBlocked),
    [checked, isCameraBlocked, isLocationBlocked],
  );

  const isGranted = useMemo(
    () => !isChecking && isCameraGranted && isLocationGranted,
    [isCameraGranted, isChecking, isLocationGranted],
  );

  return {
    cameraPermission,
    locationPermission,
    libraryPermission,
    checkPermission,
    requestPermission,
    isCameraBlocked,
    isLocationBlocked,
    isLibraryBlocked,
    isCameraGranted,
    isLocationGranted,
    isLibraryGranted,
    isChecking,
    isGranted,
    cantProceed,
    requested,
  };
}
