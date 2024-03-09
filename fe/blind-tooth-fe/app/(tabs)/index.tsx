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

// configure({
//   reachabilityShortTimeout: 5 * 1000,
//   reachabilityLongTimeout: 60 * 1000,
// });

// Subscribe
// const unsubscribe = addEventListener((state) => {
//   console.log("Connection type", state.type);
//   console.log("Is connected?", state.isConnected);
//   console.log(state.details);
// });

// Unsubscribe
// unsubscribe();

// export const manager = new BleManager();

// async function requestBluetoothPermission() {
//   if (Platform.OS === "ios") {
//     return true;
//   }
//   if (
//     Platform.OS === "android" &&
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//   ) {
//     const apiLevel = parseInt(Platform.Version.toString(), 10);

//     if (apiLevel < 31) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     if (
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
//     ) {
//       const result = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ]);

//       return (
//         result["android.permission.BLUETOOTH_CONNECT"] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//         result["android.permission.BLUETOOTH_SCAN"] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//         result["android.permission.ACCESS_FINE_LOCATION"] ===
//           PermissionsAndroid.RESULTS.GRANTED
//       );
//     }
//   }

//   alert("Permission have not been granted");
//   // this.showErrorToast("Permission have not been granted");

//   return false;
// }

// function scanAndConnect() {
//   const permission = requestBluetoothPermission();
//   console.log(permission);
//   if (!permission) {
//     return;
//   }

//   manager.startDeviceScan(null, null, (error, device) => {
//     if (error) {
//       // Handle error (scanning will be stopped automatically)
//       return;
//     }

//     // Check if it is a device you are looking for based on advertisement data
//     // or other criteria.
//     console.log(device);
//     if (device?.name === "TI BLE Sensor Tag" || device?.name === "SensorTag") {
//       // Stop scanning as it's not necessary if you are scanning for one device.
//       manager.stopDeviceScan();

//       // Proceed with connection.
//     }
//   });
// }

export default function TabOneScreen() {
  // useEffect(() => {
  //   requestBluetoothPermission();
  // }, []);

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

  // useEffect(() => {
  //   const unsubscribe = addEventListener((state) => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     console.log(state.details);

  //     setNetInfo(() => state);
  //   });

  //   return unsubscribe;
  // }, [setNetInfo]);

  // const { details } = useNetInfo();

  // console.log(details);

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
