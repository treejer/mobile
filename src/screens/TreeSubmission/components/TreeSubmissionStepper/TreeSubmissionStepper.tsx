import globalStyles from 'constants/styles';

import React from 'react';
import {Text, View} from 'react-native';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import {useTranslation} from 'react-i18next';

interface Props {
  currentStep: number;
  children: React.ReactNode;
  isUpdate?: boolean;
  isSingle?: boolean | null;
  count?: number;
  canUpdateLocation?: boolean;
}

function TreeSubmissionStepper(props: Props) {
  const {isUpdate, currentStep, children, isSingle, count, canUpdateLocation = true} = props;
  const {t} = useTranslation();

  const title = isSingle
    ? 'submitTree.submitTree'
    : isSingle === false
    ? 'submitTree.nurseryCount'
    : isUpdate
    ? 'submitTree.updateTree'
    : 'submitTree.submitTree';

  return (
    <>
      <Text style={[globalStyles.h5, globalStyles.textCenter]}>{t(title, {count})}</Text>
      <Spacer times={10} />
      <Steps.Container currentStep={currentStep} style={{width: 300}}>
        {/* Step 1  */}
        <Steps.Step step={1}>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>{t('submitTree.takePhoto')}</Text>

            {renderChildrenIfCurrentStep(1)}
          </View>
        </Steps.Step>

        {/* Step 2 - Only for creation */}
        {(!isUpdate || Boolean(canUpdateLocation)) && (
          <Steps.Step step={2}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>
                {t(canUpdateLocation ? 'submitTree.updateTreeLocation' : 'submitTree.treeLocation')}
              </Text>

              {renderChildrenIfCurrentStep(2)}
            </View>
          </Steps.Step>
        )}

        {/* Step 3 */}
        <Steps.Step step={3 - Number(!(!isUpdate || Boolean(canUpdateLocation)))}>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>{t('submitTree.uploadPhoto')}</Text>

            {renderChildrenIfCurrentStep(3)}
          </View>
        </Steps.Step>

        {/* Step 4 */}
        <Steps.Step step={4 - Number(!(!isUpdate || Boolean(canUpdateLocation)))} lastStep>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={globalStyles.h6}>{t('submitTree.signInWallet')}</Text>
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
