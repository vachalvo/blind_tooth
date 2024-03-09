import { useState, useEffect } from "react";
import {
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Magnetometer } from "expo-sensors";

import * as NetInfo from "@react-native-community/netinfo";
import Calls from "@/utils/api/client";
import * as Location from "expo-location";
import { Container } from "@/components/Container";
import { Text } from "react-native-paper";
import { vibrateLong, vibrateMedium, vibrateShort } from "@/utils/vibrations";
import { ResponseData, useCache } from "@/utils/cache";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { REGISTRATION_KEY } from "../register";
import { Redirect } from "expo-router";

const { height, width } = Dimensions.get("window");

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<ResponseData>();
  const { getItem } = useAsyncStorage(REGISTRATION_KEY);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const cache = useCache();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const latestData = cache.getData();
      if (cache.isEmpty(latestData)) {
        return;
      }

      if (cache.isStale(latestData)) {
        alert("Data is stale");
        return;
      }

      setLatestData(latestData);

      const value = latestData.newSignalAvg;
      // if (!value || value < 39) {
      //   vibrateShort();
      //   return;
      // }

      // if (value < 69) {
      //   vibrateMedium();
      //   return;
      // }

      // vibrateLong();
    }, 1000);

    return () => clearInterval(interval);
  }, [cache]);

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
              userId: userId,
              compass: 180,
              gps: {
                longtitude: location.coords.longitude,
                latitude: location.coords.latitude,
                atltitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
              },
              wifiSignalStrength:
                state.type === "wifi" ? state.details.strength : null,
            }
          ).catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }, 250);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      let response;
      try {
        response = await Calls.get<ResponseData>(
          "https://7gw9q7p1i4.execute-api.eu-west-1.amazonaws.com/default/getData",
          {
            params: {
              // TODO, tady musi byt kamarad
              userId: userId,
            },
            headers: {
              ["logged-user-id"]: userId,
            },
          }
        );
      } catch (error) {
        console.error(error);
        return;
      }

      console.log("dostal jsem data");
      if (response.status !== 200) {
        console.log("Error fetching data");
        return;
      }

      const { data } = response;
      console.log(data);
      cache.storeData(data);
      setLatestData(data);
    }, 750);

    return () => clearInterval(interval);
  }, [userId, cache, setLatestData]);

  const [magnetometer, setMagnetometer] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    getItem().then((res) => {
      setUserId(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <Text>Loading...</Text>;

  if (userId === null) return <Redirect href={"/register"} />;

  const _slow = () => Magnetometer.setUpdateInterval(1000);
  const _fast = () => Magnetometer.setUpdateInterval(10000);

  // const _subscribe = () => {
  //   Magnetometer.isAvailableAsync().then((available) => {
  //     if (!available) {
  //       Magnetometer.requestPermissionsAsync().then((status) => {
  //         if (!status.granted) {
  //           alert("Permission to access location was denied");
  //         }

  //         setSubscription(
  //           Magnetometer.addListener((MagnetometerData) => {
  //             setData(MagnetometerData);
  //           })
  //         );
  //       });
  //     }
  //   });

  //   setSubscription(
  //     Magnetometer.addListener((MagnetometerData) => {
  //       setData(MagnetometerData);
  //       setMagnetometer(_angle(MagnetometerData));
  //     })
  //   );
  // };

  // const _unsubscribe = () => {
  //   subscription && subscription.remove();
  //   setSubscription(null);
  // };

  // useEffect(() => {
  //   _subscribe();
  //   return () => _unsubscribe();
  // }, []);

  // const _angle = (magnetometer: any) => {
  //   let angle = 0;
  //   if (magnetometer) {
  //     let { x, y, z } = magnetometer;
  //     if (Math.atan2(y, x) >= 0) {
  //       angle = Math.atan2(y, x) * (180 / Math.PI);
  //     } else {
  //       angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  //     }
  //   }
  //   return Math.round(angle);
  // };

  // const _direction = (degree: any) => {
  //   if (degree >= 22.5 && degree < 67.5) {
  //     return "NE";
  //   } else if (degree >= 67.5 && degree < 112.5) {
  //     return "E";
  //   } else if (degree >= 112.5 && degree < 157.5) {
  //     return "SE";
  //   } else if (degree >= 157.5 && degree < 202.5) {
  //     return "S";
  //   } else if (degree >= 202.5 && degree < 247.5) {
  //     return "SW";
  //   } else if (degree >= 247.5 && degree < 292.5) {
  //     return "W";
  //   } else if (degree >= 292.5 && degree < 337.5) {
  //     return "NW";
  //   } else {
  //     return "N";
  //   }
  // };

  // // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  // const _degree = (magnetometer: any) => {
  //   return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  // };

  const direction =
    (latestData?.newSignalAvg ?? 0) - (latestData?.oldSignalAvg ?? 0) >= 0
      ? "good"
      : "bad";

  if (direction === "good") {
    vibrateShort();
  }

  if (direction === "bad") {
    vibrateLong();
  }

  return (
    <Container>
      <ScrollView>
        <Text variant="bodySmall">{JSON.stringify(latestData)}</Text>

        <Text variant="bodyLarge">
          {direction === "good" ? "Vedeš si dobře" : "Moc ti to nejde"}
        </Text>

        <Text variant="bodyLarge">
          Síla signálu: {latestData?.newSignalAvg}
        </Text>
      </ScrollView>
    </Container>
    // <Grid style={{ backgroundColor: "black" }}>
    //   <Row style={{ alignItems: "center" }} size={0.9}>
    //     <Col style={{ alignItems: "center" }}>
    //       <Text
    //         style={{
    //           color: "#fff",
    //           fontSize: height / 26,
    //           fontWeight: "bold",
    //         }}
    //       >
    //         {_direction(_degree(magnetometer))}
    //       </Text>
    //     </Col>
    //   </Row>

    //   <Row style={{ alignItems: "center" }} size={0.1}>
    //     <Col style={{ alignItems: "center" }}>
    //       <View
    //         style={{
    //           position: "absolute",
    //           width: width,
    //           alignItems: "center",
    //           top: 0,
    //         }}
    //       >
    //         <Image
    //           source={require("../../assets/images/compass_pointer.png")}
    //           style={{
    //             height: height / 26,
    //             resizeMode: "contain",
    //           }}
    //         />
    //       </View>
    //     </Col>
    //   </Row>

    //   <Row style={{ alignItems: "center" }} size={2}>
    //     <Text
    //       style={{
    //         color: "#fff",
    //         fontSize: height / 27,
    //         width: width,
    //         position: "absolute",
    //         textAlign: "center",
    //       }}
    //     >
    //       {_degree(magnetometer)}°
    //     </Text>

    //     <Col style={{ alignItems: "center" }}>
    //       <Image
    //         source={require("../../assets/images/compass_bg.png")}
    //         style={{
    //           height: width - 80,
    //           justifyContent: "center",
    //           alignItems: "center",
    //           resizeMode: "contain",
    //           transform: [{ rotate: 360 - magnetometer + "deg" }],
    //         }}
    //       />
    //     </Col>
    //   </Row>

    //   <Row style={{ alignItems: "center" }} size={1}></Row>
    // </Grid>
  );
}
