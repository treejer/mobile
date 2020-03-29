import * as React from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Dash from 'react-native-dash'

interface Props {
}

function NumberInput({ }: Props) {
  const [value, setValue] = React.useState(1);
  const handleIncrement = React.useCallback(() => setValue(value + 1), [value]);
  const handleDecrement = React.useCallback(() => setValue(value - 1), [value]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <View style={styles.inputBox}>
        <Text style={{ textAlign: 'center' }}>{value}</Text>
      </View>
      <TouchableOpacity onPress={handleIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBox: {
    borderRadius: 7,
    borderColor: '#777',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    width: 80,
    backgroundColor: 'white',
    marginHorizontal: 20,
    textAlign: 'center'
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    color: '#777'
  }
})

export default NumberInput;
