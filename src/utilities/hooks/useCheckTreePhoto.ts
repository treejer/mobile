import {useTranslation} from 'react-i18next';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistance} from 'utilities/helpers/distance';
import {TUserLocation} from './usePlantTreePermissions';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();

  return (
    image64Base: string,
    userLocation: TUserLocation | null,
    successCallback: () => void,
    imageLocation?: TUserLocation,
    fromGallery?: boolean,
  ) => {
    if (imageLocation?.latitude && imageLocation?.longitude) {
      // @here
      let maxDistance = 0.19369;
      if (userLocation) {
        const distance = calcDistance(imageLocation, userLocation);
        console.log({userLocation, imageLocation, distance});

        if (distance < maxDistance) {
          successCallback();
        } else {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.longDistance'),
          });
        }
      }
    } else {
      if (fromGallery) {
        showAlert({
          title: t('inValidImage.title'),
          mode: AlertMode.Error,
          message: t('inValidImage.message'),
        });
      } else {
        showAlert({
          title: t('inValidImage.title'),
          mode: AlertMode.Error,
          message: t('inValidImage.hasNoLocation'),
        });
      }
    }
  };
};
