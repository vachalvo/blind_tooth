import { StyleSheet, TouchableOpacity, Vibration } from "react-native";

import { Text, View } from "@/components/Themed";
import React from "react";

export default function App() {
  const ONE_SECOND_IN_MS = 500;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
    4 * ONE_SECOND_IN_MS,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => Vibration.vibrate(250)} style={styles.button}>
          <Text>.25s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Vibration.vibrate(500)} style={[styles.button, styles.middleButton]}>
          <Text>.5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Vibration.vibrate([250, 500, 500, 500, 1000, 500], true)} style={[styles.button, styles.middleButton]}>
          <Text>test1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Vibration.vibrate([100, 50, 100, 50, 100, 50])} style={styles.button}>
          <Text>test2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => Vibration.vibrate(PATTERN)} style={styles.button}>
          <Text>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Vibration.vibrate()}
          style={[styles.button, styles.middleButton]}
        >
          <Text>star</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Vibration.cancel()} style={styles.button}>
          <Text>stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
