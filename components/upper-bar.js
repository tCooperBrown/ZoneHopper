// This component contains Completion%, Line Indicator, Streak Indicator, & Settings Button
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { create } from "zustand";

export const useStreakStore = create((set) => ({
  streak: 0,
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak + 1,
    })),
  clearStreak: () => set({ streak: 0 }),
}));

export const useLineStore = create((set) => ({
  line: "Bakerloo",
  updateLine: (newLine) => set({ line: newLine }),
}));

export const useCompletionStore = create((set) => ({
  percentage: 0,
  increasePercentage: () =>
    set((state) => ({ percentage: state.percentage + 1 })),
  clearPercentage: () => set({ percentage: 0 }),
  updatePercentage: (newPercentage) => set({ percentage: newPercentage }),
}));
export default function UpperBar() {
  const percentage = useCompletionStore((state) => state.percentage);
  const line = useLineStore((state) => state.line);
  const streak = useStreakStore((state) => state.streak);

  const circleSize = 40;
  const circleRadius = circleSize / 2;

  return (
    <>
      <View style={styles.outerContainer}>
        <Text style={styles.text}>Completion: {percentage}%</Text>

        <View style={styles.innerContainer}>
          <Text style={styles.text}>Line: </Text>
          <View style={styles.activeLine}>
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
        <Text style={styles.text}>Streak: </Text>
        <View style={styles.dynamicStreak}>
          <Text style={[styles.text, { color: "#000" }]}>{streak} weeks</Text>
        </View>
      </View>
    </>
  );
}

{
  /* <View>
  <Text>Settings component is working!</Text>
  <Button
    title="Go back to primary view"
    onPress={() => navigation.navigate("Primary")}
  ></Button>
</View>; */
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  innerContainer: {
    flexDirection: "row",
  },
  activeLine: {
    height: 20,
    width: 70,
    backgroundColor: "#8b4e26",
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
  },
  dynamicStreak: {
    height: 20,
    width: 70,
    backgroundColor: "#95e9f1",
    borderRadius: 5,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
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
