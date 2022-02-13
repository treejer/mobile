import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import * as React from 'react';
import {StyleSheet, View, Text, ViewProps} from 'react-native';

interface StepProps {
  children: React.ReactNode;
  step: number;
  lastStep?: boolean;
}

interface StepContainerProps extends ViewProps {
  children: React.ReactNode;
  currentStep: number;
}

interface StepNumberProps {
  renderLine: boolean;
  step: number;
}

interface StepContentProps {
  children: React.ReactNode;
}

const StepContext = React.createContext({currentStep: 1});

function StepNumber({renderLine, step}: StepNumberProps) {
  const {currentStep} = React.useContext(StepContext);
  const active = step < currentStep;
  const isCurrentStep = step === currentStep;
  return (
    <View style={styles.container}>
      <View style={[styles.badge, active && styles.activeBadge, isCurrentStep && styles.currentStepBadge]}>
        <Text style={styles.badgeText}>{step}</Text>
      </View>
      {renderLine && (
        <View
          style={[
            {
              backgroundColor: active ? colors.green : colors.gray,
            },
            styles.line,
          ]}
        />
      )}
    </View>
  );
}

export function StepContent({children}: StepContentProps) {
  return <View style={styles.stepContentContainer}>{children}</View>;
}

export function Step({lastStep = false, children, step}: StepProps) {
  return (
    <View style={styles.stepContainer}>
      <StepNumber step={step} renderLine={!lastStep} />
      <StepContent>{children}</StepContent>
    </View>
  );
}

export function StepContainer({currentStep, children, ...props}: StepContainerProps) {
  return (
    <StepContext.Provider value={{currentStep}}>
      <View {...props}>{children}</View>
    </StepContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 18,
  },
  badge: {
    backgroundColor: colors.gray,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...globalStyles.h6,
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  activeBadge: {
    backgroundColor: colors.green,
  },
  currentStepBadge: {
    backgroundColor: colors.grayLight,
  },
  line: {
    marginVertical: 4,
    width: 2,
    flex: 1,
  },
  stepsContainer: {
    marginTop: 30,
    marginHorizontal: 30,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepContentContainer: {
    paddingBottom: 20,
    paddingLeft: 15,
    flex: 1,
  },
  stepHeader: {
    // fontFamily: 'Montserrat-Light',
  },
});
