import React from "react";
import { View } from "react-native";

export interface ProgressCirclesProps {
  numberOfSteps: number;
  activeStep: number;
}

function ProgressCircles({
  numberOfSteps,
  activeStep,
  ...props
}: ProgressCirclesProps) {
  return (
    <View style={{justifyContent: "center", flexDirection: "row"}} {...props}>
      {Array.from({ length: numberOfSteps }, (_, i) => i).map((i) => {
        return (
          <View key={`step${i}`}>
            {activeStep - 1 === i ? (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#BDBDBD",
                  marginHorizontal: 8
                }}
              />
            ) : (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(189, 189, 189, 0.5);",
                  marginHorizontal: 8,
                  
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

export default ProgressCircles;
