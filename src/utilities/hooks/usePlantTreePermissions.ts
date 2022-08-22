import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform} from 'react-native';
import Permissions, {PERMISSIONS, RESULTS, openSettings} from 'react-native-permissions';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import {useAppState} from 'utilities/hooks/useAppState';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {useTranslation} from 'react-i18next';

export type PermissionResult = typeof RESULTS[keyof typeof RESULTS];

const treejerPermissions = Platform.select({
  android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
  default: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
});

export type TUsePlantTreePermissions = {
  cameraPermission: string | null;
  locationPermission: string | null;
  userLocation: TUserLocation | null;
  checkPermission: () => void;
  requestPermission: () => void;
  checkUserLocation: () => void;
  openPermissionsSettings: (isGranted?: boolean) => void;
  openGpsRequest: (isGranted?: boolean) => void;
  requestCameraPermission: (isGranted?: boolean) => void;
  requestLocationPermission: (isGranted?: boolean) => void;
  isCameraBlocked: boolean;
  isLocationBlocked: boolean;
  isCameraGranted: boolean;
  isLocationGranted: boolean;
  isGPSEnabled: boolean;
  hasLocation: boolean;
  isChecking: boolean;
  isGranted: boolean;
  cantProceed: boolean;
  requested: boolean;
};

export type TUserLocation = {
  latitude: number;
  longitude: number;
};

export const getCurrentPositionAsync = (showDialog: boolean = true) => {
  return new Promise<GeoPosition['coords']>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },
      err => {
        console.log(err, 'err inside updateCurrentPosition');
        reject(err);
      },
      {
        enableHighAccuracy: true,
        showLocationDialog: showDialog,
        timeout: 4000,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
      },
    );
  });
};

export type TPlantTreePermissionsOptions = {didMount: boolean};

export function usePlantTreePermissions(
  {didMount}: TPlantTreePermissionsOptions = {didMount: true},
): TUsePlantTreePermissions {
  const {appState} = useAppState();

  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<TUserLocation | null>(null);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    console.log({userLocation}, 'userLocation');
  }, [userLocation, locationPermission]);

  useEffect(() => {
    (async () => {
      try {
        if (didMount) {
          await checkPermission();
        }
      } catch (e) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
        await watchUserLocation();
        console.log('appState');
      } catch (e) {
        console.log(e, 'e inside useEffect AppState change usePlantTreePermissions');
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useRefocusEffect(() => {
    (async () => {
      await checkUserLocation();
      console.log('again ereresfsa');
    })();
  });

  const watchCurrentPositionAsync = useCallback(() => {
    return new Promise<GeoPosition['coords']>((resolve, reject) => {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log({latitude, longitude}, 'watcher logger');
          setUserLocation({latitude, longitude});
          resolve(position.coords);
        },
        err => {
          console.log(err, 'err inside watchCurrentPosition');
          setUserLocation({latitude: 0, longitude: 0});
          reject(err);
        },
        {
          enableHighAccuracy: true,
          accuracy: {
            android: 'high',
            ios: 'bestForNavigation',
          },
        },
      );
    });
  }, []);

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

      setChecked(true);
      return Promise.resolve(res);
    } catch (e: any) {
      console.log(e, 'Error inside checkPermission uesPlantTreePermissions');
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
      return Promise.resolve(res);
    } catch (e) {
      console.log(e, 'e requestPermission');
      return Promise.reject(e);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserLocation = useCallback(
    async (showDialog: boolean = true) => {
      try {
        const {latitude, longitude} = await getCurrentPositionAsync(showDialog);
        setUserLocation({
          latitude,
          longitude,
        });
      } catch (error: any) {
        if (checked) {
          showAlert({
            title: error.code
              ? t(`checkPermission.error.GPS.${error.code}Title`)
              : t('checkPermissions.error.unknownError'),
            message: error.code
              ? t(`checkPermission.error.GPS.${error.code}`, {message: error.message})
              : t('checkPermissions.error.unknownError'),
            mode: AlertMode.Error,
          });
        }
        setUserLocation({latitude: 0, longitude: 0});
      }
    },
    [checked, t],
  );

  const watchUserLocation = useCallback(async () => {
    try {
      await watchCurrentPositionAsync();
    } catch (error) {
      console.log(error);
      setUserLocation({latitude: 0, longitude: 0});
    }
  }, [watchCurrentPositionAsync]);

  const openPermissionsSettings = useCallback(async (isGranted?: boolean) => {
    if (isGranted) {
      return;
    }
    openSettings().catch(() => console.log('cant open settings for permissions'));
  }, []);

  const openGpsRequest = useCallback(
    async (isGranted?: boolean) => {
      if (isGranted) {
        return;
      }
      await checkUserLocation();
    },
    [checkUserLocation],
  );

  const isCameraBlocked = useMemo(
    () => cameraPermission === RESULTS.DENIED || cameraPermission === RESULTS.BLOCKED,
    [cameraPermission],
  );
  const isLocationBlocked = useMemo(
    () => locationPermission === RESULTS.DENIED || locationPermission === RESULTS.BLOCKED,
    [locationPermission],
  );

  const isCameraGranted = useMemo(() => cameraPermission === RESULTS.GRANTED, [cameraPermission]);
  const isLocationGranted = useMemo(() => locationPermission === RESULTS.GRANTED, [locationPermission]);
  const hasLocation = useMemo(() => !!(userLocation?.latitude && userLocation?.longitude), [userLocation]);

  const isGranted = useMemo(
    () => isCameraGranted && isLocationGranted && hasLocation,
    [hasLocation, isCameraGranted, isLocationGranted],
  );

  const isGPSEnabled = useMemo(() => !!userLocation, [userLocation]);

  const isChecking = useMemo(() => {
    return !checked && (!cameraPermission || !locationPermission);
  }, [checked, cameraPermission, locationPermission]);

  const cantProceed = useMemo(
    () => checked && (isCameraBlocked || isLocationBlocked || (isGPSEnabled && !hasLocation)),
    [checked, hasLocation, isCameraBlocked, isGPSEnabled, isLocationBlocked],
  );

  return {
    cameraPermission,
    locationPermission,
    userLocation,
    checkPermission,
    checkUserLocation,
    openPermissionsSettings,
    requestPermission,
    requestCameraPermission: () => {},
    requestLocationPermission: () => {},
    openGpsRequest,
    isCameraBlocked,
    isLocationBlocked,
    isCameraGranted,
    isLocationGranted,
    isChecking,
    isGranted,
    cantProceed,
    hasLocation,
    requested,
    isGPSEnabled,
  };
}
