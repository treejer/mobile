import {calcDistance, TPoint} from 'utilities/helpers/distance';
import {useCallback} from 'react';
import exifr from 'exifr';
import {TUserLocation} from './usePlantTreePermissions';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTranslation} from 'react-i18next';
import {useBrowserPlatform} from 'utilities/hooks/useBrowserPlatform';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();
  const browserPlatform = useBrowserPlatform();

  return useCallback(
    async (image64Base: string, userLocation: TUserLocation, successCallback: () => void) => {
      try {
        if (browserPlatform === 'iOS') {
          successCallback();
          return;
        }
        const {latitude, longitude, ...exif} = await exifr.parse(image64Base);
        console.log({exif, latitude, longitude}, 'safariiiiii cordinated');
        if (latitude > 0 && longitude > 0) {
          let maxDistance = 0.19369;
          if (userLocation) {
            const imageCoords: TPoint = {
              latitude,
              longitude,
            };
            const distance = calcDistance(imageCoords, userLocation);
            console.log({userLocation, imageCoords, distance});
            if (distance < maxDistance) {
              successCallback();
            } else {
              showAlert({
                title: t('inValidImage.title'),
                mode: AlertMode.Error,
                message: t('inValidImage.longDistance'),
              });
            }
          } else {
            showAlert({
              title: t('inValidImage.title'),
              mode: AlertMode.Error,
              message: t('inValidImage.hasNoLocation'),
            });
          }
        } else {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.hasNoLocation'),
          });
        }
      } catch (error) {
        showAlert({
          title: t('inValidImage.title'),
          mode: AlertMode.Error,
          message: t('inValidImage.hasNoLocation'),
        });
      }
    },
    [browserPlatform, t],
  );
};
