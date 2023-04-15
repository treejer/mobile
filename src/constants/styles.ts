import {colors} from 'constants/values';

import {PixelRatio, Platform, StatusBar, StyleSheet, TextStyle} from 'react-native';

export const fontDefaultColor: TextStyle = {
  color: colors.grayDarker,
};

export const fontNormal: TextStyle = {
  fontFamily: 'Montserrat',
  ...fontDefaultColor,
};

export const fontBold: TextStyle = {
  fontFamily: 'Montserrat-Bold',
  ...fontDefaultColor,
};

export const fontMedium: TextStyle = {
  fontFamily: 'Montserrat-Medium',
  ...fontDefaultColor,
};

export const fontLight: TextStyle = {
  fontFamily: 'Montserrat-Light',
  ...fontDefaultColor,
};

export const space = [0, 20, 25, 30];

const globalStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  screenView: {
    backgroundColor: colors.khaki,
  },
  screenViewBottom: {paddingBottom: Platform.OS === 'android' ? 40 : 4},
  safeArea: {
    paddingTop: Platform.select({
      ios: 25,
      android: StatusBar.currentHeight,
    }),
  },
  horizontalStack: {
    flexDirection: 'row',
  },
  justifyContentEvenly: {
    justifyContent: 'space-evenly',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  small: {
    fontSize: 12,
    ...fontNormal,
  },
  body1: {
    ...fontLight,
    fontSize: 14,
  },
  body2: {
    ...fontNormal,
    fontSize: 18,
  },
  normal: {
    ...fontNormal,
    fontSize: 14,
  },
  h1: {
    fontSize: 42,
    ...fontBold,
  },
  h2: {
    fontSize: 34,
    ...fontBold,
  },
  h3: {
    fontSize: 28,
    ...fontMedium,
  },
  h4: {
    fontSize: 22,
    ...fontMedium,
  },
  h5: {
    fontSize: 18,
    ...fontMedium,
  },
  h6: {
    fontSize: 14,
    ...fontMedium,
  },
  tiny: {
    fontSize: 11,
    ...fontMedium,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  p1: {
    padding: space[1],
  },
  p2: {
    padding: space[2],
  },
  p3: {
    padding: space[3],
  },
  pl1: {
    paddingStart: space[1],
  },
  pr1: {
    paddingVertical: space[1],
  },
  pt1: {
    paddingTop: space[1],
  },
  pt3: {
    paddingTop: space[3],
  },
  pv1: {
    paddingVertical: space[1],
  },
  ph1: {
    paddingHorizontal: space[1],
  },
  mb1: {
    marginBottom: space[1],
  },
  mt3: {
    paddingTop: space[3],
  },
});

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

export default globalStyles;
