import { StyleSheet, TextStyle } from "react-native";

const fontDefaultColor: TextStyle = {
  color: "#424242",
};

const fontNormal: TextStyle = {
  fontFamily: "Montserrat",
  ...fontDefaultColor,
};

const fontBold: TextStyle = {
  fontFamily: "Montserrat-Bold",
  ...fontDefaultColor,
};

const fontMedium: TextStyle = {
  fontFamily: "Montserrat-Medium",
  ...fontDefaultColor,
};

const fontLight: TextStyle = {
  fontFamily: "Montserrat-Light",
  ...fontDefaultColor,
};

const globalStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  horizontalStack: {
    flexDirection: "row",
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
});

export default globalStyles;
