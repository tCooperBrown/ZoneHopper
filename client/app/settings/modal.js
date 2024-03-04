import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { create } from "zustand";
import { useLineStore } from "../../components/upper-bar";
import { getAllTubeLines, informPreferredLine } from "../../api-client-service";
import { useEffect } from "react";
import { forceDiscoverPrefetch } from "../discovery/discovery";

const useAllLinesStore = create((set) => ({
  allLines: ["test1", "test2", "test3"],
  updateAllLines: (newLinesArray) => set({ allLines: newLinesArray }),
  clearLines: () => set({ allLines: [] }),
}));
// Above Store might be ready for removal. COME BACK TO THIS.

export default function Modal() {
  const allLines = useAllLinesStore((state) => state.allLines);
  const activeLine = useLineStore((state) => state.line);
  const updateAllLines = useAllLinesStore((state) => state.updateAllLines);
  const updateActiveLine = useLineStore((state) => state.updateActiveLine);

  useEffect(() => {
    function doOnce() {
      getAllTubeLines()
        .then((res) => {
          updateAllLines([...res]);
        })
        .catch((err) => console.error(err));
    }
    doOnce();
  }, []);

  function onPress(selectedLine) {
    updateActiveLine(selectedLine);
    // informPreferredLine(selectedLine);  // NOTE IMPORTANT: This is being disabled. Review Obsidian for reasoning. Working on implementing multi-line challenges.
    // console.log("selectedLine", selectedLine);
  }

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <View style={styles.container}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}

      {allLines.map((line, index) => (
        <Link href={"../"} key={index} asChild>
          <Pressable onPress={() => onPress(line)}>
            <View style={styles.stationButton}>
              <Text style={styles.text}>{line}</Text>
            </View>
          </Pressable>
        </Link>
      ))}

      {/* {!hasChosen && <Link href="../"></Link>} */}

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

// { flex: 1, alignItems: "center", justifyContent: "center" }
