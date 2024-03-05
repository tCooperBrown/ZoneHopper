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
          <Text style={[styles.text, { fontWeight: "400" }]}>
            {streak} weeks
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  innerContainer: {
    flexDirection: "row",
  },
  activeLine: {
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginLeft: 10,
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
  },
  dynamicStreak: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#4C83C2",
    borderRadius: 5,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 22,
    textTransform: "capitalize",
  },
});
