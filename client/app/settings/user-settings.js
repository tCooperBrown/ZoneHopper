import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { useLineStore } from "../../components/zustand-stores";
import tubeLineColours from "../../tubeLineColours";

const SettingsScreen = () => {
  const activeLine = useLineStore((state) => state.line);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButton}>
        <Link href="/primary/primary" asChild>
          <Pressable>
            <Text style={styles.text}>Back</Text>
          </Pressable>
        </Link>
      </View>

      {/* Preferred Line Selector */}
      <View style={[styles.prefLineContainer, ,]}>
        <Text style={[styles.text, { fontSize: 30 }]}>Preferred Line: </Text>
        <View
          style={{
            backgroundColor: tubeLineColours[activeLine],
            alignItems: "center",
            borderRadius: 13,
            height: 50,
            justifyContent: "center",
          }}
        >
          <Link href="settings/modal" asChild>
            <Pressable>
              <Text
                style={[
                  styles.text,
                  { fontSize: 30, textTransform: "capitalize" },
                ]}
              >
                {activeLine}
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Logout - for testing purposes */}
      <View style={{ flex: 1, paddingTop: 550, alignItems: "center" }}>
        <View style={[styles.backButton, { width: 330, height: 55 }]}>
          <Link href="/" asChild>
            <Pressable>
              <Text style={{ fontSize: 35, color: "white" }}>
                Exit the experience
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* End master view */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000439",
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 20,
  },
  prefLineContainer: {
    flexDirection: "column",
    gap: 10,
  },
  backButton: {
    width: 110,
    alignItems: "center",
    backgroundColor: "#7C7CCC",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 40,
  },
});

export default SettingsScreen;
