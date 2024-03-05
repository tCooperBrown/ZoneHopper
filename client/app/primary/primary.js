import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
// import { useStore } from "zustand";
// import { create } from "zustand";

import UpperBar from "../../components/upper-bar";
import PrimaryStations from "../../components/primary-stations";
import DiscoveryButton from "../../components/discovery-button";
// import { useStationsStore } from "..";

const PrimaryScreen = () => {
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
