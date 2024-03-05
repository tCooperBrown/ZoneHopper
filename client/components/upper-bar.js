// This component contains Completion%, Line Indicator, Streak Indicator, & Settings Button
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import tubeLineColours from "../tubeLineColours";
import {
  useCompletionStore,
  useLineStore,
  useStationsStore,
  useStreakStore,
  useSuccessfulVisitStore,
} from "./zustand-stores";

export default function UpperBar() {
  const stations = useStationsStore((state) => state.stations);
  const visitedStations_client = useSuccessfulVisitStore(
    (state) => state.visitedStations_client,
  );
  const percentage = useCompletionStore((state) => state.percentage);
  const line = useLineStore((state) => state.line);
  const streak = useStreakStore((state) => state.streak);

  const circleSize = 40;
  const circleRadius = circleSize / 2;
  console.log("stations11", stations);

  return (
    <>
      <View style={styles.outerContainer}>
        <Text style={styles.text}>
          Completion:{" "}
          {(visitedStations_client.length / stations.length).toFixed(2) * 100}%
        </Text>

        <View style={styles.innerContainer}>
          <Text style={[styles.text, { paddingTop: 5 }]}>Line: </Text>
          <View
            style={[
              styles.activeLine,
              { backgroundColor: tubeLineColours[line] },
            ]}
          >
            <Text style={styles.text}>{line}</Text>
          </View>

          <View style={styles.settings}>
            <Link href="/settings" asChild>
              <Svg width={circleSize} height={circleSize}>
                {/* Render the bigger white circle as backdrop */}
                <Circle
                  cx={circleRadius}
                  cy={circleRadius}
                  r={circleRadius - 5}
                  fill={"#FFF"}
                ></Circle>
                {/* Render the "..." circles on top */}
                <Circle
                  cx={circleRadius - circleSize * 0.2}
                  cy={circleRadius}
                  r={3}
                  fill="black"
                />
                <Circle
                  cx={circleRadius + circleSize * 0.2}
                  cy={circleRadius}
                  r={3}
                  fill="black"
                />
                <Circle
                  cx={circleRadius}
                  cy={circleRadius}
                  r={3}
                  fill="black"
                />
              </Svg>
            </Link>
          </View>
        </View>
      </View>

      {/* Streak Counter */}
      <View style={styles.streakContainer}>
        <Text style={[styles.text, { paddingTop: 5 }]}>Streak: </Text>
        <View style={styles.dynamicStreak}>
          <Text style={[styles.text, { color: "#000" }]}>{streak} weeks</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 20,
    gap: 5,
    paddingTop: 5,
  },
  innerContainer: {
    flexDirection: "row",
    // backgroundColor: "white",
    paddingRight: 20,
  },
  activeLine: {
    // height: 20,
    // width: 70,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginLeft: 10,
    // backgroundColor: "#8b4e26",
  },
  settings: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  streakContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingRight: 20,
  },
  dynamicStreak: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#95e9f1",
    borderRadius: 5,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 22,
    // backgroundColor: "red",
  },
});

{
  /* <Pressable style={styles.settings}>
  <Text style={styles.textSettings}>...</Text>
</Pressable>; */
}

//   settings: {
//     width: "8%",
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "blue",
//     flexDirection: "row",
//     borderRadius: 10,
//   },
//   textSettings: {
//     textAlign: "right",
//     color: "#FFF",
//   },
//   text: {
//     color: "#FFF",
//     textAlign: "center",
//   },
