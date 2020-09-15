import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import globalStyles from "../../styles";

interface Props {
  caption: string;
}

function Button({ caption }: Props) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>{caption}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#E5E7DB",
    borderRadius: 25,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
  text: {
    ...globalStyles.normal,
  },
});

export default Button;
