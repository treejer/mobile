import * as React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Dash from 'react-native-dash'

interface Props {
  renderDash?: boolean
}

function Steps({ renderDash = true }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>1</Text>
      </View>
      {renderDash && <Dash
        dashGap={2}
        dashLength={2}
        dashThickness={2}
        style={{ flexDirection: 'column', width: 1, flex: 1 }}
        dashColor="#9E9E9E"
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 18
  },
  badge: {
    backgroundColor: '#51BC8E',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  filler: {
    flex: 1,
    width: 8,
    height: 40,
    borderColor: 'red',
    borderStyle: 'dashed',

    borderWidth: 2,
    // borderColor: 'blue',
    borderLeftWidth: 2,
    // borderRadius: 1,
    position: 'relative',
  }
})

export default Steps;
