import React from 'react';
import {Text, View} from 'react-native';

import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import globalStyles from 'constants/styles';

interface Props {
  currentStep: number;
  children: React.ReactNode;
}

function TreeSubmissionStepper({currentStep, children}: Props) {
  return (
    <Steps.Container currentStep={currentStep} style={{width: 300}}>
      {/* Step 1  */}
      <Steps.Step step={1}>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={globalStyles.h6}>Take a photo of the tree</Text>

          {renderChildrenIfCurrentStep(1)}
        </View>
      </Steps.Step>

      {/* Step 2 */}
      <Steps.Step step={2}>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={globalStyles.h6}>Submit tree location</Text>

          {renderChildrenIfCurrentStep(2)}
        </View>
      </Steps.Step>

      {/* Step 3 */}
      <Steps.Step step={3}>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={globalStyles.h6}>Upload photo</Text>

          {renderChildrenIfCurrentStep(3)}
        </View>
      </Steps.Step>

      {/* Step 4 */}
      <Steps.Step step={4} lastStep>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={globalStyles.h6}>Sign with wallet</Text>
          {renderChildrenIfCurrentStep(4)}
        </View>
      </Steps.Step>
    </Steps.Container>
  );

  function renderChildrenIfCurrentStep(step: number) {
    if (step === currentStep) {
      return children;
    }

    if (step < currentStep) {
      return (
        <>
          <Spacer times={2} />
          <Text>Done!</Text>
        </>
      );
    }

    return null;
  }
}

export default TreeSubmissionStepper;
