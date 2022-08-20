import {useCallback, useEffect, useMemo, useState} from 'react';
import {TUsePlantTreePermissions, TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';

export const getCurrentPositionAsyncWeb = () => {
  return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const {latitude, longitude} = position.coords;
      if (latitude === null || longitude === null) {
        reject('err');
      } else {
        resolve(position.coords);
      }
    });
  });
};

export function usePlantTreePermissions(): TUsePlantTreePermissions {
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<TUserLocation | null>(null);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
        await watchUserLocation();
      } catch (err) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useRefocusEffect(() => {
    (async () => {
      await checkUserLocation();
      console.log('again ereresfsa');
    })();
  });

  const watchCurrentPositionAsyncWeb = useCallback(() => {
    return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
      navigator.geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
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
          timeout: 2000,
        },
      );
    });
  }, []);

  const checkPermission = useCallback(() => {
    navigator.permissions
      // @ts-ignore
      .query({name: 'camera'})
      .then(({state}) => {
        console.log({state}, 'camera permission');
        setCameraPermission(state === 'granted' ? state : 'blocked');
      })
      .catch(err => {
        console.log(err, 'error request permissions web');
      });
    navigator.permissions
      .query({name: 'geolocation'})
      .then(({state}) => {
        console.log({state}, 'geolocation permission');
        setLocationPermission(state === 'granted' ? state : 'blocked');
      })
      .catch(err => {
        console.log(err, 'error request permissions web');
      });

    setChecked(true);
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      await checkPermission();
    } catch (err) {
      console.log(err);
    }
    setRequested(true);
  }, [checkPermission]);

  const checkUserLocation = useCallback(async () => {
    try {
      const {latitude, longitude} = await getCurrentPositionAsyncWeb();
      console.log({latitude, longitude}, 'user location');
      setUserLocation({
        latitude,
        longitude,
      });
    } catch (error) {
      console.log(error);
      setUserLocation({latitude: 0, longitude: 0});
    }
  }, []);

  const watchUserLocation = useCallback(async () => {
    try {
      await watchCurrentPositionAsyncWeb();
    } catch (error) {
      console.log(error);
    }
  }, [watchCurrentPositionAsyncWeb]);

  const openPermissionsSettings = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({audio: false, video: true})
      .then(result => {
        if (result.active) {
          setCameraPermission('granted');
        }
      })
      .catch(e => {
        setCameraPermission('blocked');
      });
  }, []);

  const isCameraBlocked = useMemo(() => cameraPermission === 'blocked', [cameraPermission]);
  const isLocationBlocked = useMemo(() => locationPermission === 'blocked', [locationPermission]);

  const isCameraGranted = useMemo(() => cameraPermission === 'granted', [cameraPermission]);
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
    openPermissionsSettings,
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
  };
}
