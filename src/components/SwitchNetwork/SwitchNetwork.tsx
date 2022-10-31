import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Card from 'components/Card/Card';
import {SelectNetwork} from 'components/SwitchNetwork/SelectNetwork';
import {ConfirmationNetwork} from 'components/SwitchNetwork/ConfirmationNetwork';
import {colors} from 'constants/values';
import {BlockchainNetwork} from 'services/config';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {useUserWeb3, useConfig} from 'ranger-redux/modules/web3/web3';

export function SwitchNetwork() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const config = useConfig();
  const [confirming, setConfirming] = useState<BlockchainNetwork | null>(null);
  const {changeNetwork} = useUserWeb3();

  const {handleLogout} = useProfile();

  const {t} = useTranslation();

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setConfirming(null);
    setShowModal(false);
  }, []);
  const handleSelectNetwork = useCallback((network: BlockchainNetwork) => {
    setConfirming(network);
  }, []);
  const handleDismiss = useCallback(() => {
    setConfirming(null);
  }, []);
  const handleConfirmNetwork = useCallback(
    async (network: BlockchainNetwork) => {
      try {
        await handleLogout(true);
        changeNetwork(network);
        setConfirming(null);
        setShowModal(false);
      } catch (e: any) {
        console.log(e, 'error is here');
      }
    },
    [changeNetwork, handleLogout],
  );

  return (
    <>
      <Modal transparent visible={showModal} style={{flex: 1}} onRequestClose={handleCloseModal} animationType="fade">
        <SafeAreaView style={{flex: 1, backgroundColor: colors.grayOpacity}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{flex: 0.8, flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{flex: 0.8, backgroundColor: colors.khakiDark, borderRadius: 8, padding: 24}}>
                <ScrollView>
                  {confirming ? (
                    <ConfirmationNetwork
                      network={confirming}
                      onDismiss={handleDismiss}
                      onConfirm={handleConfirmNetwork}
                    />
                  ) : (
                    <SelectNetwork
                      handleSelectNetwork={handleSelectNetwork}
                      activeNetwork={config.magicNetwork}
                      handleCloseModal={handleCloseModal}
                    />
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={{top: 8, right: 32, bottom: 8, left: 32}}
        style={styles.container}
        onPress={handleOpenModal}
      >
        <Card style={[styles.card]}>
          <Text style={styles.text}>{`${t('networks.switchHeader')}: ${config.magicNetwork}`}</Text>
        </Card>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: -1,
  },
  card: {
    width: -1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: colors.khakiDark,
  },
  text: {
    fontSize: 9,
    color: colors.grayDarker,
  },
});
