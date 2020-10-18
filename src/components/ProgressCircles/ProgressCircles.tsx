import React from 'react';
import {StyleSheet, View} from 'react-native';
import globalStyles from 'constants/styles';

export interface ProgressCirclesProps {
  numberOfSteps: number;
  activeStep: number;
}

function ProgressCircles({numberOfSteps, activeStep, ...props}: ProgressCirclesProps) {
  return (
    <View style={[globalStyles.justifyContentCenter, globalStyles.horizontalStack]} {...props}>
      {Array.from({length: numberOfSteps}, (_, i) => i).map(i => {
        return (
          <View key={`step${i}`}>
            <View
              style={[
                {
                  backgroundColor: activeStep - 1 === i ? '#BDBDBD' : 'rgba(189, 189, 189, 0.5);',
                },
                styles.circle,
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});

export default ProgressCircles;
