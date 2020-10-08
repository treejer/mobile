import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image } from "react-native";

import BackgroundEntropy from "../../components/BackgroundEntropy";
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import globalStyles from "../../styles";

interface Props {}

function Welcome(props: Props) {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.fill}>
      <BackgroundEntropy />
      <View
        style={[
          globalStyles.alignItemsCenter,
          globalStyles.justifyContentCenter,
          globalStyles.fill,
        ]}
      >
        <Text
          style={[globalStyles.h2, globalStyles.textCenter, globalStyles.mb1]}
        >
          TREEJER{"\n"}RANGER APP
        </Text>
        <Image source={require("../../../assets/images/welcome.png")} />
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>
          Choose language
        </Text>
        <View
          style={[
            globalStyles.horizontalStack,
            globalStyles.ph1,
            globalStyles.pt1,
          ]}
        >
          <Button
            caption="English"
            onPress={() => {
              navigation.navigate("Onboarding");
            }}
          />
          <Spacer />
          <Button disabled caption="Français" />
          <Spacer />
          <Button disabled caption="فارسی" />
        </View>
        <View
          style={[
            globalStyles.horizontalStack,
            globalStyles.ph1,
            globalStyles.pt1,
          ]}
        >
          <Button disabled caption="Español" />
          <Spacer />
          <Button disabled caption="Turkish" />
          <Spacer />
          <Button disabled caption="العربيه" />
        </View>
      </View>
    </View>
  );
}

export default Welcome;
