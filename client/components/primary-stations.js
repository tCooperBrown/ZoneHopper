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
// import { useLineStore } from "./upper-bar";
// import { useSuccessfulVisitStore } from "../app/discovery/discovery";
// import { useStationsStore } from "../app";

export default function PrimaryStations() {
  const visitedStations_client = useSuccessfulVisitStore(
    (state) => state.visitedStations_client,
  );
  // const visitedVenues_client = useSuccessfulVisitStore(
  //   (state) => state.visitedVenues_client,
  // );
  const stations = useStationsStore((state) => state.stations);
  const updateStations = useStationsStore((state) => state.updateStations);

  const activeLine = useLineStore((state) => state.line);

  useEffect(() => {
    doOnce = () => {
      fetchOrderedArrayOfStations(activeLine.toLowerCase())
        .then((res) => {
          res
            .json()
            .then((parsedStations) => updateStations([...parsedStations]));
        })
        .catch((err) => console.error(err));
    };
    doOnce();
    // console.log("primA:", visitedStations_client);
    // console.log("primB:", visitedVenues_client);
  }, []);

  ///////////////// Call Below to test ////////////////
  // fetchOrderedArrayOfStations(activeLine.toLowerCase())
  //   .then((res) => {
  //     res.json().then((data) => console.log(data));
  //   })
  //   .catch((err) => console.error(err));

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
          {console.log("zozo", stations)}
          {stations.map((station, index) => (
            <View style={styles.stationContainer} key={uuid4()}>
              <View style={styles.stationCircle}></View>
              <View
                style={[
                  styles.stationName,
                  visitedStations_client.includes(station.name)
                    ? { backgroundColor: "green" }
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
    paddingLeft: 20,
    paddingRight: 20,
    // paddingBottom: 20,
    // height: "100%",
  },

  stationName: {
    backgroundColor: "#ee933c",
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
    // marginTop: 30,
    marginBottom: 20,
    minWidth: "75%",
    // minHeight: 60,
  },
  stationCircle: {
    backgroundColor: "white",
    height: 30,
    width: 30,
    borderRadius: 15,
    alignSelf: "center",
  },
  scrollContainer: {
    // height: "150%",
  },
  vertLineContainer: {
    flex: 1,
    width: 13,
    borderRadius: 10,
    position: "absolute",
    marginLeft: 7.8,
    // marginBottom: 30,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});

{
  /* <View
  style={[
    styles.vertLineContainer,
    { backgroundColor: tubeLineColours[activeLine] },
    {
      height: stations.length * 60,
    },
  ]}
></View>; */
}

// {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb97",
//       inboundOrder: 0,
//       lat: 51.592216,
//       line: "bakerloo",
//       lon: -0.334896,
//       name: "Harrow & Wealdstone",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb98",
//       inboundOrder: 1,
//       lat: 51.581786,
//       line: "bakerloo",
//       lon: -0.316946,
//       name: "Kenton",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb99",
//       inboundOrder: 2,
//       lat: 51.570229,
//       line: "bakerloo",
//       lon: -0.308448,
//       name: "South Kenton",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9a",
//       inboundOrder: 3,
//       lat: 51.56258,
//       line: "bakerloo",
//       lon: -0.303992,
//       name: "North Wembley",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9b",
//       inboundOrder: 4,
//       lat: 51.55232,
//       line: "bakerloo",
//       lon: -0.296642,
//       name: "Wembley Central",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9c",
//       inboundOrder: 5,
//       lat: 51.544041,
//       line: "bakerloo",
//       lon: -0.275859,
//       name: "Stonebridge Park",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9d",
//       inboundOrder: 6,
//       lat: 51.536305,
//       line: "bakerloo",
//       lon: -0.257774,
//       name: "Harlesden",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9e",
//       inboundOrder: 7,
//       lat: 51.532556,
//       line: "bakerloo",
//       lon: -0.243006,
//       name: "Willesden Junction",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fb9f",
//       inboundOrder: 8,
//       lat: 51.530545,
//       line: "bakerloo",
//       lon: -0.22505,
//       name: "Kensal Green",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba0",
//       inboundOrder: 9,
//       lat: 51.534443,
//       line: "bakerloo",
//       lon: -0.204882,
//       name: "Queen's Park",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba1",
//       inboundOrder: 10,
//       lat: 51.534979,
//       line: "bakerloo",
//       lon: -0.194232,
//       name: "Kilburn Park Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba2",
//       inboundOrder: 11,
//       lat: 51.529777,
//       line: "bakerloo",
//       lon: -0.185758,
//       name: "Maida Vale Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba3",
//       inboundOrder: 12,
//       lat: 51.523263,
//       line: "bakerloo",
//       lon: -0.183783,
//       name: "Warwick Avenue Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba4",
//       inboundOrder: 13,
//       lat: 51.516981,
//       line: "bakerloo",
//       lon: -0.17616,
//       name: "Paddington",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba5",
//       inboundOrder: 14,
//       lat: 51.520299,
//       line: "bakerloo",
//       lon: -0.17015,
//       name: "Edgware Road (Bakerloo) Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba6",
//       inboundOrder: 15,
//       lat: 51.521602,
//       line: "bakerloo",
//       lon: -0.163013,
//       name: "Marylebone",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba7",
//       inboundOrder: 16,
//       lat: 51.522883,
//       line: "bakerloo",
//       lon: -0.15713,
//       name: "Baker Street Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba8",
//       inboundOrder: 17,
//       lat: 51.523344,
//       line: "bakerloo",
//       lon: -0.146444,
//       name: "Regent's Park Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fba9",
//       inboundOrder: 18,
//       lat: 51.515224,
//       line: "bakerloo",
//       lon: -0.141903,
//       name: "Oxford Circus Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbaa",
//       inboundOrder: 19,
//       lat: 51.51005,
//       line: "bakerloo",
//       lon: -0.133798,
//       name: "Piccadilly Circus Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbab",
//       inboundOrder: 20,
//       lat: 51.507819,
//       line: "bakerloo",
//       lon: -0.126137,
//       name: "Charing Cross",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbac",
//       inboundOrder: 21,
//       lat: 51.507058,
//       line: "bakerloo",
//       lon: -0.122666,
//       name: "Embankment Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbad",
//       inboundOrder: 22,
//       lat: 51.504269,
//       line: "bakerloo",
//       lon: -0.113356,
//       name: "Waterloo",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbae",
//       inboundOrder: 23,
//       lat: 51.498808,
//       line: "bakerloo",
//       lon: -0.112315,
//       name: "Lambeth North Underground Station",
//     },
//     {
//       __v: 0,
//       _id: "65e1c226d055d3dfb606fbaf",
//       inboundOrder: 24,
//       lat: 51.494505,
//       line: "bakerloo",
//       lon: -0.099185,
//       name: "Elephant & Castle",
//     },
