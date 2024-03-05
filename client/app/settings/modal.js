import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useLineStore } from "../../components/zustand-stores";

// import { getAllTubeLines, informPreferredLine } from "../../api-client-service";
// import { forceDiscoverPrefetch } from "../discovery/discovery";
// import { useLineStore } from "../../components/upper-bar";

// const useAllLinesStore = create((set) => ({
//   allLines: ["test1", "test2", "test3"],
//   updateAllLines: (newLinesArray) => set({ allLines: newLinesArray }),
//   clearLines: () => set({ allLines: [] }),
// }));
// Above Store might be ready for removal. COME BACK TO THIS.

export default function Modal() {
  // const updateAllLines = useAllLinesStore((state) => state.updateAllLines);
  const updateActiveLine = useLineStore((state) => state.updateActiveLine);

  const linesArr = [
    "bakerloo",
    "central",
    "circle",
    "district",
    "hammersmith-city",
    "jubilee",
    "metropolitan",
    "northern",
    "piccadilly",
    "victoria",
    "waterloo-city",
  ];

  function onPress(selectedLine) {
    updateActiveLine(selectedLine);
    // informPreferredLine(selectedLine);  // NOTE IMPORTANT: This is being disabled. Review Obsidian for reasoning. Working on implementing multi-line challenges.
    // console.log("selectedLine", selectedLine);
  }

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <View style={styles.container}>
      {linesArr.map((line, index) => (
        <Link href={"../"} key={index} asChild>
          <Pressable onPress={() => onPress(line)}>
            <View style={styles.stationButton}>
              <Text style={styles.text}>{line}</Text>
            </View>
          </Pressable>
        </Link>
      ))}

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000439",
    gap: 10,
    alignItems: "center",
    paddingTop: 20,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingRight: 20,
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  stationButton: {
    backgroundColor: "#5758C1",
    borderRadius: 5,
    width: 320,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
});
