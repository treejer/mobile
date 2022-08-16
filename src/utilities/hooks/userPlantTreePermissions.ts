import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {useAppState} from 'utilities/hooks/useAppState';

export type PermissionResult = typeof RESULTS[keyof typeof RESULTS];

const treejerPermissions = Platform.select({
  android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
  default: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
});

export function usePlantTreejerPermissions() {
  const {appState} = useAppState();

  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

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
      } else {
        setCameraPermission(res['ios.permission.CAMERA']);
        setLocationPermission(res['ios.permission.LOCATION_ALWAYS'] || res['ios.permission.LOCATION_WHEN_IN_USE']);
      }
      Object.entries(res).map(([key, value]) => {
        if (['blocked', 'denied'].includes(value)) {
          console.log('====================================');
          console.log(key, value);
          console.log('====================================');
          return Promise.reject(key);
        }
        return Promise.resolve(res);
      });
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
      } else {
        setCameraPermission(res['ios.permission.CAMERA']);
        setLocationPermission(res['ios.permission.LOCATION_ALWAYS'] || res['ios.permission.LOCATION_WHEN_IN_USE']);
      }
      setRequested(true);
      Object.entries(res).map(([key, value]) => {
        if (['blocked', 'denied'].includes(value)) {
          return Promise.reject(key);
        }
        return Promise.resolve(res);
      });
    } catch (e) {
      console.log(e, 'e requestPermission');
      return Promise.reject(e);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCameraBlocked = useMemo(
    () => (requested && cameraPermission === 'denied') || cameraPermission === 'blocked',
    [cameraPermission, requested],
  );
  const isLocationBlocked = useMemo(
    () => (requested && locationPermission === 'denied') || locationPermission === 'blocked',
    [locationPermission, requested],
  );

  const isCameraGranted = useMemo(() => cameraPermission === 'granted', [cameraPermission]);
  const isLocationGranted = useMemo(() => locationPermission === 'granted', [locationPermission]);

  return {
    cameraPermission,
    locationPermission,
    checkPermission,
    requestPermission,
    isCameraBlocked,
    isLocationBlocked,
    isCameraGranted,
    isLocationGranted,
  };
}
