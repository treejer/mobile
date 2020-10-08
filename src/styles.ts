import { Platform, StatusBar, StyleSheet, TextStyle } from "react-native";
import { colors } from "./constants";

export const fontDefaultColor: TextStyle = {
  color: colors.grayDarker,
};

export const fontNormal: TextStyle = {
  fontFamily: "Montserrat",
  ...fontDefaultColor,
};

export const fontBold: TextStyle = {
  fontFamily: "Montserrat-Bold",
  ...fontDefaultColor,
};

export const fontMedium: TextStyle = {
  fontFamily: "Montserrat-Medium",
  ...fontDefaultColor,
};

export const fontLight: TextStyle = {
  fontFamily: "Montserrat-Light",
  ...fontDefaultColor,
};

const globalStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  screenView: {
    backgroundColor: colors.khaki,
  },
  safeArea: {
    paddingTop: Platform.select({
      ios: 25,
      android: StatusBar.currentHeight,
    }),
  },
  horizontalStack: {
    flexDirection: "row",
  },
  justifyContentEvenly: {
    justifyContent: "space-evenly",
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
  pl1: {
    paddingStart: 20,
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  justifyContentEnd: {
    justifyContent: "flex-end",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  p1: {
    padding: 20,
  },
  p2: {
    padding: 25,
  },
  p3: {
    padding: 30,
  },
  textCenter: {
    textAlign: "center",
  },
  pt1: {
    paddingTop: 20,
  },
  pt3: {
    paddingTop: 30,
  },
  pv1: {
    paddingVertical: 20,
  },
  ph1: {
    paddingHorizontal: 20,
  },
  mb1: {
    marginBottom: 20,
  },
});

export default globalStyles;
