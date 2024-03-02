import { StyleSheet, View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useStore } from "zustand";

import UpperBar from "../../components/upper-bar";
import PrimaryStations from "../../components/primary-stations";
import DiscoveryButton from "../../components/discovery-button";

const PrimaryScreen = () => {
  // const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <UpperBar />
        <PrimaryStations />
        <DiscoveryButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000439",
    height: "102%",
  },
});
export default PrimaryScreen;
