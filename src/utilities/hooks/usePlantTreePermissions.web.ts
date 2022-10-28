import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TFunction, useTranslation} from 'react-i18next';

import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useAppState} from 'utilities/hooks/useAppState';
import {TUsePlantTreePermissions, TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {useBrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {useBrowserName} from 'utilities/hooks/useBrowserName';

export const getCurrentPositionAsyncWeb = (t: TFunction<'translation', undefined>) => {
  return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const {latitude, longitude} = position.coords;

          if (latitude == null || longitude == null) {
            console.log('err lat nad long = null');
            reject('err lat nad long = null');
          } else {
            resolve(position.coords);
          }
        },
        function (err) {
          reject(err);
        },
        {maximumAge: 999999999, timeout: 6000, enableHighAccuracy: true},
      );
    } else {
      reject(t('checkPermission.error.cantSupportGeo'));
    }
  });
};

export function usePlantTreePermissions(): TUsePlantTreePermissions {
  const {appState} = useAppState();

  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<TUserLocation | null>(null);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const browserPlatform = useBrowserPlatform();
  const browserName = useBrowserName();

  const {t} = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        await checkUserLocation();
        requestCameraPermission();
        intervalRef.current = setInterval(async () => {
          await checkPermission();
        }, 5000);
      } catch (err) {}
    })();

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (() => {
      if (checked) {
        checkCameraPermission();
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useRefocusEffect(() => {
    (async () => {
      try {
        await checkPermission();
        requestCameraPermission();
      } catch (err) {
        setUserLocation({latitude: 0, longitude: 0});
        setLocationPermission('blocked');
      }
    })();
  });

  const checkCameraPermission = useCallback(() => {
    if (browserPlatform !== 'iOS') {
      // @ts-ignore
      navigator.permissions.query({name: 'camera'}).then(({state}) => {
        setCameraPermission(state === 'granted' ? state : 'blocked');
      });
    }
  }, [browserPlatform]);

  const watchCurrentPositionAsyncWeb = useCallback(async () => {
    return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setUserLocation({latitude, longitude});
            setLocationPermission('granted');
            resolve(position.coords);
          },
          err => {
            setUserLocation({latitude: 0, longitude: 0});
            setLocationPermission('blocked');
            reject(err);
          },
          {
            maximumAge: 9999999999,
            timeout: 6000,
            enableHighAccuracy: true,
          },
        );
      } else {
        reject(t('checkPermission.error.cantSupportGeo'));
      }
    });
  }, [t]);

  const checkUserLocation = useCallback(async () => {
    try {
      const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
      if (userLocation?.latitude !== latitude || userLocation.longitude === longitude) {
        setUserLocation({
          latitude,
          longitude,
        });
      }
      setLocationPermission('granted');
    } catch (error: any) {
      showAlert({
        title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
        message: error.code
          ? browserName === 'Safari'
            ? t(`checkPermission.error.GPS.${error.code}`, {message: error.message})
            : t(`checkPermission.error.${error.code}`, {message: error.message})
          : t('checkPermission.error.unknownError'),
        mode: AlertMode.Info,
      });
      setUserLocation({latitude: 0, longitude: 0});
      setLocationPermission('blocked');
    }
  }, [browserName, t, userLocation]);

  const watchUserLocation = useCallback(async () => {
    try {
      await watchCurrentPositionAsyncWeb();
    } catch (error) {
      console.log(error);
    }
  }, [watchCurrentPositionAsyncWeb]);

  const checkPermission = useCallback(async () => {
    if (browserPlatform === 'iOS' || (browserName === 'Firefox' && browserPlatform === 'Android')) {
      getCurrentPositionAsyncWeb(t)
        .then(({latitude, longitude}) => {
          setUserLocation({
            latitude,
            longitude,
          });
          setLocationPermission('granted');
        })
        .catch(error => {
          console.log(error, 'error in checkPermissions');
          setUserLocation({latitude: 0, longitude: 0});
          setLocationPermission('blocked');
        });
    } else {
      navigator?.permissions
        ?.query({name: 'geolocation'})
        .then(async ({state}) => {
          setLocationPermission(state === 'granted' ? state : 'blocked');
          if (state === 'granted' && !checked) {
            await checkUserLocation();
          } else {
            setUserLocation({latitude: 0, longitude: 0});
          }
        })
        .catch(err => {
          console.log(err, 'error request permissions web');
        });
    }
    setChecked(true);
  }, [browserName, browserPlatform, checkUserLocation, checked, t]);

  const requestPermission = useCallback(async () => {
    try {
      navigator.mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(result => {
          if (result.active) {
            setCameraPermission('granted');
            const mediaStreamTracks = result.getTracks();
            mediaStreamTracks.forEach(track => {
              track.stop();
            });
          }
        })
        .catch(e => {
          setCameraPermission('blocked');
        });
      const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
      setUserLocation({
        latitude,
        longitude,
      });
      setLocationPermission('granted');
    } catch (err) {
      console.log(err);
      setUserLocation({
        latitude: 0,
        longitude: 0,
      });
      setLocationPermission('blocked');
    }
    setRequested(true);
  }, [t]);

  const requestCameraPermission = useCallback(
    (isGranted?: boolean) => {
      if (isGranted) {
        return;
      }
      navigator.mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(result => {
          if (result.active) {
            setCameraPermission('granted');
            const mediaStreamTracks = result.getTracks();
            mediaStreamTracks.forEach(track => {
              track.stop();
            });
          }
        })
        .catch(error => {
          if (browserPlatform && browserPlatform !== 'iOS') {
            showAlert({
              title: t('checkPermission.error.deviceNotFound'),
              message: t('checkPermission.error.deviceNotFound', {message: String(error)}),
              mode: AlertMode.Error,
            });
          }
          console.log(error, 'error');
          setCameraPermission('blocked');
        });
    },
    [browserPlatform, t],
  );

  const requestLocationPermission = useCallback(
    async (isGranted?: boolean) => {
      try {
        if (isGranted) {
          return;
        }
        if (browserPlatform !== 'iOS') {
          const state = (await navigator?.permissions?.query({name: 'geolocation'})).state;
          if (state === 'granted') {
            const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
            setLocationPermission('granted');
            setUserLocation({
              latitude,
              longitude,
            });
          } else {
            showAlert({
              title: t('checkPermission.error.siteSettings'),
              message: t('checkPermission.error.turnOnGPS'),
              mode: AlertMode.Info,
            });
          }
        } else {
          if (browserName !== 'Chrome') {
            const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
            setLocationPermission('granted');
            setUserLocation({
              latitude,
              longitude,
            });
          } else {
            showAlert({
              title: t('checkPermission.error.siteSettings'),
              message: t('checkPermission.error.turnOnGPS'),
              mode: AlertMode.Info,
            });
          }
        }
      } catch (error: any) {
        console.log(error, 'error in last deploy');
        showAlert({
          title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
          message: error.code
            ? browserName === 'Safari'
              ? t('checkPermission.error.turnOnGPS', {message: error.message})
              : t(`checkPermission.error.${error.code}`, {message: error.message})
            : t('checkPermission.error.unknownError'),
          mode: AlertMode.Info,
        });
        setLocationPermission('blocked');
        setUserLocation({
          latitude: 0,
          longitude: 0,
        });
      }
    },
    [browserName, browserPlatform, t],
  );

  const openGpsRequest = useCallback(
    async (isGranted?: boolean) => {
      if (isGranted) {
        return;
      }
      try {
        if (browserPlatform !== 'iOS') {
          const state = (await navigator?.permissions?.query({name: 'geolocation'})).state;
          if (state !== 'granted') {
            throw {code: 1, message: 'geolocation denied'};
          }
        }
        if (browserName !== 'Chrome') {
          await checkUserLocation();
        } else {
          showAlert({
            title: t('checkPermission.error.siteSettings'),
            message: t('checkPermission.error.1'),
            mode: AlertMode.Info,
          });
        }
      } catch (error: any) {
        console.log(error, 'errirrrrsrseresrseresres');
        showAlert({
          title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
          message: error.code
            ? browserName === 'Safari'
              ? t(`checkPermission.error.GPS.${error.code}`, {message: error.message})
              : t(`checkPermission.error.${error.code}`, {message: error.message})
            : t('checkPermission.error.unknownError'),
          mode: AlertMode.Info,
        });
      }
    },
    [browserName, browserPlatform, checkUserLocation, t],
  );

  const isCameraBlocked = useMemo(() => cameraPermission === 'blocked', [cameraPermission]);
  const isLocationBlocked = useMemo(() => locationPermission === 'blocked', [locationPermission]);

  const isCameraGranted = useMemo(() => cameraPermission === 'granted', [cameraPermission]);
  // const isCameraGranted = useMemo(() => true, []);
  const isLocationGranted = useMemo(() => locationPermission === 'granted', [locationPermission]);
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
    requestPermission,
    openPermissionsSettings: () => {},
    openGpsRequest,
    requestCameraPermission,
    requestLocationPermission,
    isCameraBlocked,
    isLocationBlocked,
    isCameraGranted,
    isLocationGranted,
    isGPSEnabled,
    hasLocation,
    isChecking,
    cantProceed,
    requested,
    isGranted,
    showPermissionModal: (!isGranted || isChecking) && browserPlatform !== 'iOS',
  };
}
