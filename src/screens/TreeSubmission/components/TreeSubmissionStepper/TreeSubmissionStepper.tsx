import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {useCurrentJourney} from 'services/currentJourney';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import TreeSymbol from 'components/TreeList/TreeSymbol';
import {isWeb} from 'utilities/helpers/web';
import {canUpdateTreeLocation} from 'utilities/helpers/submitTree';

interface Props {
  currentStep: number;
  children: React.ReactNode;
}

function TreeSubmissionStepper(props: Props) {
  const {currentStep, children} = props;

  const {t} = useTranslation();
  const {journey} = useCurrentJourney();

  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  const canUpdateLocation = canUpdateTreeLocation(journey, isNursery);

  const imageSize = useMemo(
    () =>
      isWeb() ? (journey.tree?.treeSpecsEntity.imageFs ? 136 : 80) : journey.tree?.treeSpecsEntity.imageFs ? 200 : 120,
    [journey.tree?.treeSpecsEntity.imageFs],
  );

  return (
    <>
      <View style={[globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}></View>
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
      <View style={[globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, {marginTop: 16}]}>
        {isUpdate && (
          <TreeSymbol
            tree={journey.tree}
            tint={false}
            treeUpdateInterval={1}
            color={colors.green}
            size={imageSize}
            autoHeight
            hideId
          />
        )}
      </View>
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
