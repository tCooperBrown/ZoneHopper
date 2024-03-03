import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { create } from "zustand";
import { useLineStore } from "../../components/upper-bar";
import { getAllTubeLines } from "../../api-client-service";
import { useEffect } from "react";

const useAllLinesStore = create((set) => ({
  allLines: ["test1", "test2", "test3"],
  updateAllLines: (newLinesArray) => set({ allLines: newLinesArray }),
  clearLines: () => set({ allLines: [] }),
}));

export default function Modal() {
  const allLines = useAllLinesStore((state) => state.allLines);
  const activeLine = useLineStore((state) => state.line);
  const updateAllLines = useAllLinesStore((state) => state.updateAllLines);
  const updateActiveLine = useLineStore((state) => state.updateActiveLine);
  //   const updateLine = useLineStore()

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
  }

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <View style={styles.container}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}

      {allLines.map((line, index) => (
        <Pressable onPress={() => onPress(line)} key={index}>
          <Text style={styles.text}>{line}</Text>
        </Pressable>
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
    // alignItems: "center",
    // justifyContent: "center",
    // paddingTop: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  text: {
    color: "white",
    fontSize: 40,
  },
});

// { flex: 1, alignItems: "center", justifyContent: "center" }
