import * as React from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Dash from 'react-native-dash'

interface Props {
  caption: string
}

function Button({ caption }: Props) {
  const [value, setValue] = React.useState(1);
  const handleIncrement = React.useCallback(() => setValue(value + 1), [value]);
  const handleDecrement = React.useCallback(() => setValue(value - 1), [value]);

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.buttonText}>{caption}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51BC8E',
    padding: 12,
    width: 190,
    borderRadius: 7,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 18,
    color: 'white',
  }
})

export default Button;
