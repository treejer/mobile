import React, {useCallback, useEffect, useMemo} from 'react';
import {Image as NativeImage} from 'react-native';

import {isWeb} from 'utilities/helpers/web';
import {useSubmittedTrees} from 'utilities/hooks/useSubmittedTrees';
import {
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
  RotateIcon,
  SingUp,
  TreejerIcon,
  Welcome,
  onBoardingOne,
  onBoardingThree,
  onBoardingTwo,
} from '../../../assets/images';
import {MapMarker, TreeImage} from '../../../assets/icons/index';

const staticImages = [
  MapMarker,
  TreeImage,
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
  RotateIcon,
  SingUp,
  TreejerIcon,
  Welcome,
  onBoardingOne,
  onBoardingThree,
  onBoardingTwo,
];

function PreLoadImage() {
  const {submittedTrees} = useSubmittedTrees();

  useEffect(() => {
    if (isWeb()) {
      preFetchTreeImagesWeb();
    } else {
      preFetchTreeImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const treeImagesUrl = useMemo(
    () => submittedTrees?.map(tree => tree?.treeSpecsEntity?.imageFs).filter(Boolean),
    [submittedTrees],
  );

  const allImages = useMemo(() => [...staticImages, ...(treeImagesUrl || [])], [treeImagesUrl]);

  const preFetchTreeImages = useCallback(() => {
    treeImagesUrl?.forEach(async image => {
      await NativeImage.prefetch(String(image));
    });
  }, [treeImagesUrl]);

  const preFetchTreeImagesWeb = useCallback(() => {
    allImages?.forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, [allImages]);

  if (isWeb()) {
    return <></>;
  } else {
    return (
      <>
        {staticImages.map((img, index) => (
          <NativeImage key={index} source={img} style={{width: 0, height: 0}} />
        ))}
      </>
    );
  }
}

export default PreLoadImage;
