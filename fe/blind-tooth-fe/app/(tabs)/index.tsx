import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

import { useEffect, useState } from "react";

import * as NetInfo from "@react-native-community/netinfo";
import { Surface, Text } from "react-native-paper";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Button";
import Calls from "@/utils/api/client";

export default function TabOneScreen() {
  const [netInfo, setNetInfo] = useState<unknown>();
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     NetInfo.refresh()
  //       .then((state) => {
  //         console.log("Connection type", state.type);
  //         console.log("Is connected?", state.isConnected);
  //         console.log(state.details);
  //         setNetInfo(() => state);
  //         setCount((prev) => prev + 1);
  //       })
  //       .catch((err) => console.error(err));
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  const getTest = async () => {
    // const res = await Calls.get("", { userId: "Martin" });
    // console.log(res.data);
    // const ressss = await Calls.post("", {
    //   userId: "Martin",
    //   compass: 180,
    //   gps: {
    //     longtitude: 13.3,
    //     latitude: 12.2,
    //     atltitude: 50.3,
    //   },
    //   wifiSignalStrength: null,
    // });
    // console.log(ressss);
  };

  return (
    <View style={styles.container}>
      <Surface
        mode="flat"
        elevation={0}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Surface
          elevation={0}
          mode="flat"
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Button
            style={{
              backgroundColor: "blue",
            }}
            onPress={() => getTest()}
          >
            Axios Test
          </Button>

          <Button
            style={{
              backgroundColor: Colors.share.background,
            }}
          >
            Sdílet kontakt
          </Button>

          <Button
            style={{
              backgroundColor: Colors.contacts.background,
            }}
          >
            Kontakty
          </Button>

          <Button
            style={{
              backgroundColor: Colors.contacts.background,
            }}
          >
            Přidat kontakt
          </Button>
        </Surface>

        <Surface
          elevation={0}
          mode="flat"
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Button
            style={{
              backgroundColor: Colors.vibrations.background,
            }}
          >
            Nastavení
          </Button>

          <Link href="/vibrations">
            <Button
              style={{
                backgroundColor: Colors.vibrations.background,
              }}
            >
              Zvuk a vibrace
            </Button>
          </Link>

          <Button
            style={{
              backgroundColor: "red",
            }}
          >
            TODO
          </Button>

          <Button
            style={{
              backgroundColor: Colors.navigation.background,
            }}
          >
            STOP
          </Button>
        </Surface>
      </Surface>

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
