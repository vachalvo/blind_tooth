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

const { height, width } = Dimensions.get("window");

type ResponseData = {
  wifiSignalStrength: number | null;
  userId: string;
  [key: string]: any;
};

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<ResponseData[]>([]);

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
      const location = await Location.getCurrentPositionAsync({});
      NetInfo.refresh()
        .then((state) => {
          // console.log("Connection type", state.type);
          // console.log("Is connected?", state.isConnected);
          // console.log(state.details);

          console.log(
            "posilam data",
            state.type === "wifi" ? state.details.strength : null
          );
          Calls.post("", {
            userId: "Martin",
            compass: 180,
            gps: {
              longtitude: location.coords.longitude,
              latitude: location.coords.latitude,
              atltitude: location.coords.altitude,
              accuracy: location.coords.accuracy,
            },
            wifiSignalStrength:
              state.type === "wifi" ? state.details.strength : null,
          });

          // setNetInfo(() => state);
          // setCount((prev) => prev + 1);
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await Calls.get<ResponseData[]>("", {
        userId: "Martin",
      });
      console.log("dostal jsem data");
      if (response.status !== 200) {
        console.log("Error fetching data");
        return;
      }

      const { data } = response;

      // console.log(data);

      const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);

      const value = sortedData.at(-1)?.wifiSignalStrength;
      setLatestData(data.slice(-1));

      if (!value || value < 39) {
        vibrateShort();
        return;
      }

      if (value < 69) {
        vibrateMedium();
        return;
      }

      vibrateLong();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const [magnetometer, setMagnetometer] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

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

  return (
    <Container>
      <ScrollView>
        <Text variant="bodySmall">{JSON.stringify(latestData)}</Text>
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
