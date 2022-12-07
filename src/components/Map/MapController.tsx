import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import {isWeb} from 'utilities/helpers/web';
import {Hr} from 'components/Common/Hr';

export enum TZoomType {
  In = 'In',
  Out = 'Out',
}

export type TMapControllerProps = {
  onZoom: (zoomType: TZoomType) => void;
  onLocate: () => void;
  disabled?: boolean;
};

export function MapController(props: TMapControllerProps) {
  const {onZoom, onLocate, disabled} = props;

  const [isHeld, setIsHeld] = useState<boolean>(false);
  const [zoomType, setZoomType] = useState<TZoomType | null>(null);

  const zoomRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (isHeld && zoomType) {
      zoomRef.current = setInterval(() => {
        onZoom(zoomType);
      }, 200);
    }
    return () => {
      if (zoomRef.current) {
        clearInterval(zoomRef.current);
      }
    };
  }, [isHeld, zoomType]);

  const handleLongPress = useCallback((newZoomType: TZoomType) => {
    setIsHeld(true);
    setZoomType(newZoomType);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsHeld(false);
    setZoomType(null);
    if (zoomRef.current) {
      clearInterval(zoomRef.current);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onZoom(TZoomType.In)}
        onLongPress={() => handleLongPress(TZoomType.In)}
        onPressOut={handlePressOut}
        style={styles.btn}
        accessible
        disabled={disabled}
      >
        <Icon style={styles.controller} name="plus" size={24} />
      </TouchableOpacity>
      <Hr styles={styles.hr} />
      <TouchableOpacity onPress={onLocate} style={styles.btn} accessible>
        <Icon style={styles.myLocation} name="location-arrow" size={24} />
      </TouchableOpacity>
      <Hr styles={styles.hr} />
      <TouchableOpacity
        onPress={() => onZoom(TZoomType.Out)}
        onLongPress={() => handleLongPress(TZoomType.Out)}
        onPressOut={handlePressOut}
        style={styles.btn}
        accessible
        disabled={disabled}
      >
        <Icon style={styles.controller} name="minus" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 54,
    height: 124,
    position: 'absolute',
    bottom: isWeb() ? 95 : 120,
    right: isWeb() ? 4 : 25,
    backgroundColor: colors.khaki,
    borderRadius: 6,
    ...colors.smShadow,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
  },
  hr: {
    backgroundColor: colors.khakiDark,
    width: '100%',
  },
  myLocation: {
    fontWeight: '700',
    color: colors.grayDarker,
  },
  controller: {
    fontWeight: '700',
    color: colors.grayOpacity,
  },
});
