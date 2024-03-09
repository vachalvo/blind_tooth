import { PermissionsAndroid, Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

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
import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";

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

      <View style={{ height: 30 }} />

      <Link href="/(tabs)/navigation">
        <Button
          style={{
            backgroundColor: Colors.navigation.background,
            height: 80,
            width: 200,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          textColor={Colors.dark.background}
          labelStyle={{ color: Colors.dark.background, fontSize: 20 }}
        >
          Hledej
        </Button>
      </Link>
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
