import { StyleSheet, Text, View } from "react-native";
import tubeLineColours from "../tubeLineColours";
import { ScrollView } from "react-native";
import { fetchOrderedArrayOfStations } from "../api-client-service";
import { useEffect } from "react";
import "react-native-get-random-values";
import { v4 as uuid4 } from "uuid";
import {
  useLineStore,
  useStationsStore,
  useSuccessfulVisitStore,
} from "./zustand-stores";

export default function PrimaryStations() {
  const visitedStations_client = useSuccessfulVisitStore(
    (state) => state.visitedStations_client,
  );

  const stations = useStationsStore((state) => state.stations);
  const updateStations = useStationsStore((state) => state.updateStations);

  const activeLine = useLineStore((state) => state.line);

  useEffect(() => {
    fetchOrderedArrayOfStations(activeLine.toLowerCase())
      .then((res) => {
        res
          .json()
          .then((parsedStations) => updateStations([...parsedStations]));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <View style={styles.masterContainer}>
        <ScrollView style={styles.scrollContainer}>
          <View
            style={[
              styles.vertLineContainer,
              { backgroundColor: tubeLineColours[activeLine] },
              { height: stations.length * 103 },
            ]}
          ></View>
          {stations.map((station, index) => (
            <View style={styles.stationContainer} key={uuid4()}>
              <View style={styles.stationCircle}></View>
              <View
                style={[
                  styles.stationName,
                  visitedStations_client.includes(station.name)
                    ? { backgroundColor: "#4BC04B" }
                    : {},
                ]}
              >
                <Text style={[styles.text, { fontWeight: "500" }]}>
                  {station.name}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    paddingTop: 15,
    // paddingLeft: 20,
    // paddingRight: 20,
  },

  stationName: {
    backgroundColor: "#4C83C2",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    width: 300,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  stationContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
    minWidth: "75%",
  },
  stationCircle: {
    backgroundColor: "white",
    height: 30,
    width: 30,
    borderRadius: 15,
    alignSelf: "center",
  },
  scrollContainer: {},
  vertLineContainer: {
    flex: 1,
    width: 13,
    borderRadius: 10,
    position: "absolute",
    marginLeft: 7.8,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});
