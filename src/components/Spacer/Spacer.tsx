import React from "react";
import { View } from "react-native";

interface SpacerProps {
  times?: number;
}

const Spacer = ({ times = 2 }: SpacerProps) => (
  <View style={{ height: 4 * times, width: 4 * times }} />
);

export default Spacer;
