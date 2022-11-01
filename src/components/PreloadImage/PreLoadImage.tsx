import React, {useCallback, useEffect, useMemo} from 'react';
import {Image as NativeImage} from 'react-native';

import {isWeb} from 'utilities/helpers/web';
import usePlantedTrees from 'utilities/hooks/usePlantedTrees';
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
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';

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
  const address = useWalletAccount();
  const {plantedTrees} = usePlantedTrees(address);

  useEffect(() => {
    if (isWeb()) {
      preFetchTreeImagesWeb();
    } else {
      preFetchTreeImages();
    }
  }, [plantedTrees]);

  const treeImagesUrl = useMemo(
    () => plantedTrees?.map(tree => tree.treeSpecsEntity.imageFs).filter(Boolean),
    [plantedTrees],
  );

  const allImages = useMemo(() => [...staticImages, ...(treeImagesUrl || [])], [plantedTrees, treeImagesUrl]);

  const preFetchTreeImages = useCallback(() => {
    treeImagesUrl?.forEach(image => {
      NativeImage.prefetch(String(image));
    });
  }, [plantedTrees, treeImagesUrl]);

  const preFetchTreeImagesWeb = useCallback(() => {
    allImages?.forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, [plantedTrees, allImages]);

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
