import { StyleSheet, Text, View } from "react-native";
import { create } from "zustand";
import {
  SafeAreaInsetsContext,
  SafeAreaView,
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { useLineStore } from "./upper-bar";
import tubeLineColours from "../../tubeLineColours";
import Svg, { Circle, Rect } from "react-native-svg";
import { ScrollView } from "react-native";

const useStationsStore = create((set) => ({
  stations: [
    "a street",
    "b street",
    "c street",
    "d street",
    "e street",
    "f street",
    "g street",
    "h street",
    "i street",
    "j street",
    "k street",
    "l street",
  ],
  updateStations: (newStationsArray) => set({ stations: newStationsArray }),
  clearStations: () => set({ stations: [] }),
}));

export default function PrimaryStations() {
  const stations = useStationsStore((state) => state.stations);
  const { top, bottom, left, right } = useSafeAreaInsets();
  const activeLine = useLineStore((state) => state.line);

  const circleSize = 45;
  const circleRadius = circleSize / 2;

  return (
    <>
      <ScrollView style={[styles.container]}>
        <View
          style={[
            styles.vertLineContainer,
            { backgroundColor: tubeLineColours[activeLine] },
            {
              height: stations.length * 87,
            },
          ]}
        >
          <Svg style={styles.svg}>
            {stations.map((station, index) => (
              <Circle
                cx={circleRadius}
                cy={circleSize + index * 85}
                r={circleRadius - 5}
                fill={"#FFF"}
                key={index}
              ></Circle>
            ))}
          </Svg>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  svg: {
    padding: 20,
    marginLeft: -10.5,
  },
  container: {
    height: "100%",
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  vertLineContainer: {
    width: 23,
    borderRadius: 10,
  },
  text: {
    color: "#FFF",
  },
});
