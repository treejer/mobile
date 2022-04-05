import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer/Spacer';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {currentTimestamp} from 'utilities/helpers/date';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useTranslation} from 'react-i18next';
import {useConfig, useWalletAccount, useWalletWeb3} from 'services/web3';
import {useNavigation} from '@react-navigation/native';
import Tree from 'components/Icons/Tree';
import Button from 'components/Button/Button';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSettings} from 'services/settings';
import {newTreeJSON} from 'utilities/helpers/submitTree';
import {ContractType} from 'services/config';
import {Routes} from 'navigation';
import {AlertMode, showAlert} from 'utilities/helpers/alert';

export interface SubmitTreeModalProps {
  journey: TreeJourney;
}

export type TreeRequests = {loading: boolean; error: string | null; hash: string | null}[];

export default function SubmitTreeModal(props: SubmitTreeModalProps) {
  const {journey} = props;

  const isConnected = useNetInfoConnected();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const {t} = useTranslation();
  const {navigate} = useNavigation<any>();
  const {useGSN} = useSettings();
  const config = useConfig();

  const [visible, setVisible] = useState<boolean>(true);

  const [requests, setRequests] = useState<TreeRequests>();

  const alertNoInternet = useCallback(() => {
    showAlert({
      title: t('noInternet'),
      message: t('submitWhenOnline'),
      mode: AlertMode.Error,
    });
  }, [t]);

  const handleSubmitTree = useCallback(
    async (treeJourney: TreeJourney) => {
      if (!treeJourney.photo?.path) {
        return;
      }
      const birthDay = currentTimestamp();
      try {
        const photoUploadResult = await upload(config.ipfsPostURL, treeJourney.photo?.path);
        const jsonData = newTreeJSON(config.ipfsGetURL, {
          journey: treeJourney,
          photoUploadHash: photoUploadResult.Hash,
        });

        const metaDataUploadResult = await uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));
        console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

        const receipt = await sendTransactionWithGSN(
          config,
          ContractType.TreeFactory,
          web3,
          wallet,
          'plantTree',
          [metaDataUploadResult.Hash, birthDay, 0],
          useGSN,
        );

        console.log(receipt, 'receipt');
        console.log(receipt.transactionHash, 'receipt.transactionHash');
        return Promise.resolve(receipt.transactionHash);
      } catch (e: any) {
        console.log(e, 'e happened submit <======');
        return Promise.reject(e?.message || e.error?.message || t('transactionFailed.tryAgain'));
      }
    },
    [config, t, useGSN, wallet, web3],
  );

  const handleSubmitAll = useCallback(
    async _requests => {
      if (!isConnected) {
        alertNoInternet();
      } else {
        const array = _requests?.filter(request => !request.hash);
        for (let i = 0; i < (array?.length || 0); i++) {
          setRequests(prevRequests =>
            prevRequests?.map((item, index) => (index === i ? {...item, loading: true, error: null} : item)),
          );
          try {
            const hash = await handleSubmitTree(journey);
            console.log(hash, 'hash <============');
            setRequests(prevRequests =>
              prevRequests?.map((item, index) => (index === i && hash ? {...item, loading: false, hash} : item)),
            );
          } catch (e: any) {
            setRequests(prevRequests =>
              prevRequests?.map((item, index) => (index === i ? {...item, loading: false, error: e} : item)),
            );
            return Promise.reject(e);
          }
        }
        showAlert({
          title: t('success'),
          message: t('submitTree.nurserySubmitted'),
          mode: AlertMode.Success,
        });
        navigate(Routes.GreenBlock);
        setVisible(false);
      }
    },
    [alertNoInternet, handleSubmitTree, isConnected, journey, navigate, t],
  );

  useEffect(() => {
    (async function () {
      if (isConnected) {
        const array: TreeRequests = [];
        for (let i = 0; i < (journey.nurseryCount || 0); i++) {
          array.push({
            loading: false,
            hash: null,
            error: null,
          });
        }
        setRequests(array);
        await handleSubmitAll(array);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleCancel = () => {
    setVisible(false);
    navigate(Routes.GreenBlock);
  };

  const hasLoading = Boolean(requests?.filter(request => request.loading)?.length);
  const tryAgain = !hasLoading && Boolean(requests?.find(request => request.error));

  const handlePressHash = (hash: string | null) => {
    if (hash) {
      Clipboard.setString(hash);
      showAlert({
        title: t('submitTree.hashCopied'),
        message: hash,
        mode: AlertMode.Success,
      });
    }
  };

  const handlePressError = (error?: string | null) => {
    showAlert({
      title: t('error'),
      message: error || t('unknownError'),
      mode: AlertMode.Error,
    });
  };

  return (
    <Modal style={styles.modal} visible={visible} onRequestClose={() => {}} transparent>
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.loader}>
            <ScrollView style={styles.scroll}>
              <Spacer times={10} />
              <Text>{t('submitTree.nurserySubmitting')}</Text>
              <Spacer times={10} />
              {requests?.map((request, i) => {
                const color = request.error ? colors.red : request.hash ? colors.green : colors.gray;
                const style = [{color}, styles.index];

                return (
                  <View key={i.toString()} style={[styles.request, {borderColor: color}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Tree color={color} size={16} />
                      <Text style={style}>{i + 1}</Text>
                    </View>
                    {request.loading && <ActivityIndicator size="small" color={color} />}
                    {request.hash && (
                      <Text onPress={() => handlePressHash(request.hash)} style={style}>
                        {request.hash.slice(0, 8)}...
                      </Text>
                    )}
                    {request.error && (
                      <Text onPress={() => handlePressError(request.error)} style={style}>
                        {request.error.slice(0, 8)}...
                      </Text>
                    )}
                  </View>
                );
              })}
              <Spacer times={10} />
              {tryAgain && (
                <>
                  <Button
                    caption={t('tryAgain')}
                    onPress={() => handleSubmitAll(requests)}
                    style={{alignItems: 'center', justifyContent: 'center'}}
                  />
                  <Spacer times={4} />
                  <Button
                    variant="secondary"
                    caption={t('cancel')}
                    onPress={handleCancel}
                    style={{alignItems: 'center', justifyContent: 'center'}}
                  />
                </>
              )}
              <Spacer times={10} />
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.grayOpacity,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loader: {
    width: '75%',
    backgroundColor: colors.khaki,
    maxHeight: Dimensions.get('window').height - 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scroll: {
    width: '100%',
    paddingHorizontal: 16,
  },
  request: {
    borderStyle: 'solid',
    borderWidth: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  index: {
    paddingHorizontal: 8,
  },
});
