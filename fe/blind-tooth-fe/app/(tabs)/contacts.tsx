import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Contacty</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
