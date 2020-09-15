import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Times } from "../Icons";

interface Props {
  icon?: string;
  variant?: "success" | "primary";
}

function IconButton({ icon, variant = "primary" }: Props) {
  return (
    <TouchableOpacity style={[styles.container, styles[`${variant}Container`]]}>
      <Times />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryContainer: {
    backgroundColor: "#E5E7DB",
  },
  successContainer: {
    backgroundColor: "#66B28A",
  },
});

export default IconButton;
