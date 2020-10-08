import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../../constants";

interface Props {
  size?: number;
  type?: "active";
}

const BORDER_WIDTH = 2.5;
const BORDER_GAP = 2;
const SIZE_OFFSET = (BORDER_WIDTH + BORDER_GAP) * 2;

function Avatar({ size = 64, type }: Props) {
  const imageSize = size - SIZE_OFFSET;
  const borderRadius = Math.ceil(size / 2);
  const imageBorderRadius = Math.ceil(imageSize / 2);

  return (
    <View
      style={[
        { width: size, height: size, borderRadius },
        styles.container,
        type && styles[`${type}Container`],
      ]}
    >
      <Image
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageBorderRadius,
        }}
        source={{
          uri:
            "https://images.generated.photos/-a99Op_mk7sAPi-jXuHR9IMBc_Uj1ncJsu8fvWLzsrA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zLzA5/ODc1MTQuanBn.jpg",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BORDER_WIDTH,
    borderColor: "transparent",
  },
  activeContainer: {
    borderColor: colors.green,
  },
});

export default Avatar;
