import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { useLineStore } from "../../components/zustand-stores";

const SettingsScreen = () => {
  const activeLine = useLineStore((state) => state.line);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Link href="/primary/primary" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Back</Text>
        </Pressable>
      </Link>

      {/* Preferred Line Selector */}
      <View style={styles.prefLineContainer}>
        <Text style={[styles.text, { fontSize: 30 }]}>Preferred Line: </Text>
        <Link href="settings/modal" asChild>
          <Pressable>
            <Text style={[styles.text, { fontSize: 30 }]}>{activeLine}</Text>
          </Pressable>
        </Link>
      </View>

      {/* Logout - for testing purposes */}
      <Link href="/">
        <Text style={styles.text}>Logout</Text>
      </Link>

      {/* End master view */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000439",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    color: "white",
    fontSize: 40,
    textTransform: "capitalize",
  },
  button: {
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "#5758C1",
    width: 130,
    alignItems: "center",
  },
  prefLineContainer: {
    flexDirection: "row",
  },
});

export default SettingsScreen;
