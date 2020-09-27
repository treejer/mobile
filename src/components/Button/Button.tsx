import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TouchableOpacityProps,
} from "react-native";
import globalStyles from "../../styles";

interface Props extends TouchableOpacityProps {
  caption: string;
  variant?: "primary" | "cta";
  icon?: React.ComponentType<any>;
}

function Button({
  caption,
  variant = "primary",
  icon,
  style = null,
  ...props
}: Props) {
  return (
    <TouchableOpacity style={[styles[`${variant}Container`], style]} {...props}>
      <Text style={[styles[`${variant}Text`], icon ? styles.hasIcon : {}]}>
        {caption}
      </Text>
      {icon && (
        <View style={styles[`${variant}IconWrapper`]}>
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
    backgroundColor: "#E5E7DB",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  ctaText: {
    color: "#424242",
  },
  ctaIconWrapper: {
    backgroundColor: "#67B68C",
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  hasIcon: {
    paddingRight: 21,
  },
});

export default Button;
