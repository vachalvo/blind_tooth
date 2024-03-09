import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";

import * as NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import Calls from "@/utils/api/client";
import { Redirect } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { REGISTRATION_KEY } from "../register";
import { View } from "react-native";

export default function FindMePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getItem } = useAsyncStorage(REGISTRATION_KEY);

  useEffect(() => {
    getItem().then((res) => {
      setUserId(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().catch((err) =>
      console.error(err)
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userId) {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      NetInfo.refresh()
        .then((state) => {
          console.log(
            "posilam data",
            state.type === "wifi" ? state.details.strength : null
          );

          console.log(userId);
          Calls.post(
            "https://amvz1r06k6.execute-api.eu-west-1.amazonaws.com/default/postData",
            {
              compass: 180,
              gps: {
                longtitude: location.coords.longitude,
                latitude: location.coords.latitude,
                atltitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
              },
              wifiSignalStrength:
                state.type === "wifi" ? state.details.strength : null,
            },
            {
              headers: {
                ["logged-user-id"]: userId,
              },
            }
          ).catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }, 250);

    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <Text>Loading...</Text>;

  if (userId === null) return <Redirect href={"/register"} />;

  return (
    <Container>
      <View style={{ alignItems: "center" }}>
        <View style={{ flex: 1 }} />

        <Text style={{ textAlign: "center" }} variant="headlineMedium">
          Odesíláš data svému kamarádovi.
        </Text>

        <Text style={{ textAlign: "center" }} variant="headlineMedium">
          Počkej až tě najde.
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={{ textAlign: "center" }} variant="headlineMedium">
          Buď trpělivý :)
        </Text>
        <View style={{ flex: 1 }} />
      </View>
    </Container>
  );
}
