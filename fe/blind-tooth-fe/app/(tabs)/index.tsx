import { PermissionsAndroid, Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

// import { BleManager } from "react-native-ble-plx";
import { useEffect, useState } from "react";

import * as Network from "expo-network";

import {
  addEventListener,
  useNetInfo,
  fetch as fetchNetInfo,
  configure,
} from "@react-native-community/netinfo";

import * as NetInfo from "@react-native-community/netinfo";

export default function TabOneScreen() {
  const [netInfo, setNetInfo] = useState<unknown>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.refresh()
        .then((state) => {
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected);
          console.log(state.details);
          setNetInfo(() => state);
          setCount((prev) => prev + 1);
        })
        .catch((err) => console.error(err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      {(netInfo as any) && (
        <Text>{JSON.stringify(netInfo as any, null, 2)}</Text>
      )}

      {count > 0 && <Text>{count}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
