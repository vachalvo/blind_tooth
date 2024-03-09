import { StyleSheet, TouchableOpacity, Vibration } from "react-native";

import { Text, View } from "@/components/Themed";

export default function App() {
  const pattern_sym_short_one_shot: number[] = [80, 80];
  const pattern_sym_short_two_shot: number[] = [
    ...pattern_sym_short_one_shot,
    ...pattern_sym_short_one_shot,
  ];
  const pattern_sym_short_thee_shot: number[] = [
    ...pattern_sym_short_one_shot,
    ...pattern_sym_short_one_shot,
    ...pattern_sym_short_one_shot,
  ];

  const pattern_sym_long_one_shot: number[] = [200, 400];
  const pattern_sym_long_two_shot: number[] = [
    ...pattern_sym_long_one_shot,
    ...pattern_sym_long_one_shot,
  ];
  const pattern_sym_long_thee_shot: number[] = [
    ...pattern_sym_long_one_shot,
    ...pattern_sym_long_one_shot,
    ...pattern_sym_long_one_shot,
  ];

  const error_pattern: number[] = [
    100, 300, 80, 80, 80, 80, 200, 400, 200, 400,
  ];
  const wrong_way_pattern_singletime: number[] = [
    80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80,
  ];
  const wrong_way_pattern: number[] = [
    ...wrong_way_pattern_singletime,
    ...wrong_way_pattern_singletime,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(wrong_way_pattern_singletime)}
          style={styles.button}
        >
          <Text>wrong way</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_short_one_shot)}
          style={[styles.button, styles.middleButton]}
        >
          <Text>short1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_short_two_shot)}
          style={[styles.button, styles.middleButton]}
        >
          <Text>short2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_short_thee_shot)}
          style={styles.button}
        >
          <Text>short3</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(error_pattern)}
          style={styles.button}
        >
          <Text>error</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_long_one_shot)}
          style={[styles.button, styles.middleButton]}
        >
          <Text>long1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_long_two_shot)}
          style={[styles.button, styles.middleButton]}
        >
          <Text>long2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Vibration.vibrate(pattern_sym_long_thee_shot)}
          style={styles.button}
        >
          <Text>long3</Text>
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
