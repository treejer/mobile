import globalStyles from 'constants/styles';

import React from 'react';
import {Text, View} from 'react-native';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';

interface Props {
  currentStep: number;
  children: React.ReactNode;
  isUpdate?: boolean;
}

function TreeSubmissionStepper({isUpdate, currentStep, children}: Props) {
  const title = isUpdate ? 'Update tree' : 'Submit a new tree';

  return (
    <>
      <Text style={[globalStyles.h5, globalStyles.textCenter]}>{title}</Text>
      <Spacer times={10} />
      <Steps.Container currentStep={currentStep} style={{width: 300}}>
        {/* Step 1  */}
        <Steps.Step step={1}>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>Take a photo of the tree</Text>

            {renderChildrenIfCurrentStep(1)}
          </View>
        </Steps.Step>

        {/* Step 2 - Only for creation */}
        {!isUpdate && (
          <Steps.Step step={2}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Submit tree location</Text>

              {renderChildrenIfCurrentStep(2)}
            </View>
          </Steps.Step>
        )}

        {/* Step 3 */}
        <Steps.Step step={3 - Number(isUpdate)}>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>Upload photo</Text>

            {renderChildrenIfCurrentStep(3)}
          </View>
        </Steps.Step>

        {/* Step 4 */}
        <Steps.Step step={4 - Number(isUpdate)} lastStep>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>Sign with wallet</Text>
            {renderChildrenIfCurrentStep(4)}
          </View>
        </Steps.Step>
      </Steps.Container>
    </>
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
