import { StyleSheet, TextStyle } from "react-native";

const fontNormal: TextStyle = {
  fontFamily: "Montserrat",
};

const fontBold: TextStyle = {
  fontFamily: "Montserrat-Bold",
};

const fontMedium: TextStyle = {
  fontFamily: "Montserrat-Medium",
};

const fontLight: TextStyle = {
  fontFamily: "Montserrat-Light",
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
});

export default globalStyles;
