import React, {useCallback, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'constants/values';
import Card from 'components/Card/Card';
import {useTranslation} from 'react-i18next';
import {useChangeNetwork, useConfig} from 'services/web3';
import {BlockchainNetwork} from 'services/config';
import {SelectNetwork} from 'components/SwitchNetwork/SelectNetwork';
import {ConfirmationNetwork} from 'components/SwitchNetwork/ConfirmationNetwork';
import RNRestart from 'react-native-restart';
import {useCurrentUser} from 'services/currentUser';

export function SwitchNetwork() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const config = useConfig();
  const [confirming, setConfirming] = useState<BlockchainNetwork | null>(null);
  const changeNetwork = useChangeNetwork();

  const {handleLogout} = useCurrentUser();

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
    (network: BlockchainNetwork) => {
      changeNetwork(network);
      setConfirming(null);
      setShowModal(false);
      handleLogout();
      RNRestart.Restart();
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
                    <SelectNetwork handleSelectNetwork={handleSelectNetwork} activeNetwork={config.magicNetwork} />
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
        style={[styles.container, {top: insets.top + 4, right: insets.right + 40}]}
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
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: -1,
    zIndex: 9,
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
