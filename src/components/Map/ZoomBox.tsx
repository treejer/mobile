import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {isWeb} from 'utilities/helpers/web';

export enum TZoomType {
  In = 'In',
  Out = 'Out',
}

export type TZoomBoxProps = {
  onZoom: (zoomType: TZoomType) => void;
  disabled?: boolean;
};

export function ZoomBox(props: TZoomBoxProps) {
  const {onZoom, disabled} = props;

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
        <Icon name="add" size={24} />
      </TouchableOpacity>
      <Spacer />
      <TouchableOpacity
        onPress={() => onZoom(TZoomType.Out)}
        onLongPress={() => handleLongPress(TZoomType.Out)}
        onPressOut={handlePressOut}
        style={styles.btn}
        accessible
        disabled={disabled}
      >
        <Icon name="remove" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    bottom: isWeb() ? 95 : 120,
    paddingHorizontal: isWeb() ? 0 : 20,
  },
  btn: {
    width: 45,
    height: 45,
    backgroundColor: colors.khaki,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
  },
});
