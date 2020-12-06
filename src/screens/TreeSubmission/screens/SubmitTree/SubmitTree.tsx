import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View, ScrollView, ActivityIndicator} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useTreeFactory, useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'screens/TreeSubmission/TreeSubmission';
import {upload} from 'utilities/helpers/IPFS';

interface Props {}

function SubmitTree(_: Props) {
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();
  const [photoHash, setPhotoHash] = useState<string>();
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const web3 = useWeb3();
  const treeFactory = useTreeFactory();

  const wallet = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
  }, [web3]);

  const handleUploadToIpfs = useCallback(async () => {
    if (!journey.photo || !journey.location) {
      return;
    }

    const result = await upload(journey.photo.uri);

    setPhotoHash(result.Hash);
  }, []);

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      alert('Wallet not provided');
      return;
    }

    setSubmitting(true);

    const {address, privateKey} = wallet;

    const networkId = await web3.eth.net.getId();

    console.log('1 - Location', journey.location);

    // TODO: Hard coded type id, gb id, tree name, height, and diameter
    const tx = treeFactory.methods.plant(
      0,
      3,
      ['My Tree', journey.location.latitude.toString(), journey.location.longitude.toString()],
      ['1', '1'],
    );
    console.log('2 - Transaction Created');
    const gas = await tx.estimateGas({from: address});
    console.log('3 - Gas estimated', gas);
    const gasPrice = await web3.eth.getGasPrice();
    console.log('4 - Gas price ready', gasPrice);
    const data = tx.encodeABI();
    console.log('5 - ABI encoded');
    const nonce = await web3.eth.getTransactionCount(address);
    console.log('6 - Nonce', nonce);
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: treeFactory.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId,
      },
      privateKey,
    );

    console.log('7 - Transaction signed');

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('8 - Transaction sent');

    alert('Transaction was sucessfully done!');

    setSubmitting(false);
    setTxHash(receipt.transactionHash);

    console.log(`Transaction hash: ${receipt.transactionHash}`);
  }, []);

  useEffect(() => {
    handleUploadToIpfs();
  }, [handleUploadToIpfs]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />
        <Text style={[globalStyles.h5, globalStyles.textCenter]}>Submit a new tree</Text>
        <Spacer times={10} />

        {photoHash ? (
          <TreeSubmissionStepper currentStep={4}>
            <Spacer times={1} />

            {txHash ? (
              <Text>Your transaction hash: {txHash}</Text>
            ) : (
              <>
                <Text>Please confirm to plant the tree</Text>
                <Button
                  variant="success"
                  onPress={handleSignTransaction}
                  caption="Confirm"
                  loading={submitting}
                  disabled={submitting}
                />
              </>
            )}
          </TreeSubmissionStepper>
        ) : (
          <TreeSubmissionStepper currentStep={3}>
            <Spacer times={1} />

            <Text>Your photo is being uploaded</Text>

            <View style={{alignItems: 'center', justifyContent: 'center', padding: 15}}>
              <ActivityIndicator size="large" color={colors.green} />
            </View>
          </TreeSubmissionStepper>
        )}
      </View>
    </ScrollView>
  );
}

export default SubmitTree;
