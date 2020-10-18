import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TouchableOpacityProps,
  TextProps,
} from "react-native";
import { colors } from "../../constants";
import globalStyles from "../../styles";

interface Props extends TouchableOpacityProps {
  caption: string;
  variant?: "primary" | "cta" | "secondary" | "success";
  icon?: React.ComponentType<any>;
  style?: TouchableOpacityProps["style"];
  textStyle?: TextProps["style"];
}

function Button({
  caption,
  variant = "primary",
  icon,
  style = null,
  textStyle = null,
  ...props
}: Props) {
  return (
    <TouchableOpacity style={[styles[`${variant}Container`], style]} {...props}>
      <Text
        style={[
          styles[`${variant}Text`],
          textStyle,
          icon ? styles.hasIcon : {},
        ]}
      >
        {caption}
      </Text>
      {icon && (
        <View style={[styles[`${variant}IconWrapper`]]}>
          {React.createElement(icon, {
            color: "white",
          })}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.khakiDark,
    borderRadius: 25,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
  primaryText: {
    ...globalStyles.normal,
  },
  ctaContainer: {
    paddingVertical: 12,
    paddingHorizontal: 29,
    backgroundColor: "white",
    borderRadius: 32,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    elevation: 7,
    shadowRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  ctaText: {
    color: colors.grayDarker,
  },
  ctaIconWrapper: {
    backgroundColor: colors.green,
    alignSelf: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -24,
    marginBottom: -10,
    marginTop: -10,
  },
  hasIcon: {
    paddingRight: 21,
  },
  secondaryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.grayDarker,
    borderRadius: 25,
  },
  secondaryText: {
    ...globalStyles.normal,
    color: 'white',
  },
  successContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
    borderRadius: 25,
  },
  successText: {
    ...globalStyles.normal,
    color: 'white',
  },
});

export default Button;
