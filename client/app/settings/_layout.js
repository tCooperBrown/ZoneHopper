import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="user-settings"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Preferred Line",
        }}
      />
    </Stack>
  );
}
