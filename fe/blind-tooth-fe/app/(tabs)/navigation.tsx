import { useState, useEffect } from "react";
import { Image, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Magnetometer } from "expo-sensors";

const { height, width } = Dimensions.get("window");

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [magnetometer, setMagnetometer] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  const _slow = () => Magnetometer.setUpdateInterval(1000);
  const _fast = () => Magnetometer.setUpdateInterval(10000);

  const _subscribe = () => {
    Magnetometer.isAvailableAsync().then((available) => {
      if (!available) {
        Magnetometer.requestPermissionsAsync().then((status) => {
          if (!status.granted) {
            alert("Permission to access location was denied");
          }

          setSubscription(
            Magnetometer.addListener((MagnetometerData) => {
              setData(MagnetometerData);
            })
          );
        });
      }
    });

    setSubscription(
      Magnetometer.addListener((MagnetometerData) => {
        setData(MagnetometerData);
        setMagnetometer(_angle(MagnetometerData));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _angle = (magnetometer: any) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const _direction = (degree: any) => {
    if (degree >= 22.5 && degree < 67.5) {
      return "NE";
    } else if (degree >= 67.5 && degree < 112.5) {
      return "E";
    } else if (degree >= 112.5 && degree < 157.5) {
      return "SE";
    } else if (degree >= 157.5 && degree < 202.5) {
      return "S";
    } else if (degree >= 202.5 && degree < 247.5) {
      return "SW";
    } else if (degree >= 247.5 && degree < 292.5) {
      return "W";
    } else if (degree >= 292.5 && degree < 337.5) {
      return "NW";
    } else {
      return "N";
    }
  };

  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  const _degree = (magnetometer: any) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  return (
    <Grid style={{ backgroundColor: "black" }}>
      <Row style={{ alignItems: "center" }} size={0.9}>
        <Col style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: height / 26,
              fontWeight: "bold",
            }}
          >
            {_direction(_degree(magnetometer))}
          </Text>
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={0.1}>
        <Col style={{ alignItems: "center" }}>
          <View
            style={{
              position: "absolute",
              width: width,
              alignItems: "center",
              top: 0,
            }}
          >
            <Image
              source={require("../../assets/images/compass_pointer.png")}
              style={{
                height: height / 26,
                resizeMode: "contain",
              }}
            />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={2}>
        <Text
          style={{
            color: "#fff",
            fontSize: height / 27,
            width: width,
            position: "absolute",
            textAlign: "center",
          }}
        >
          {_degree(magnetometer)}°
        </Text>

        <Col style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/compass_bg.png")}
            style={{
              height: width - 80,
              justifyContent: "center",
              alignItems: "center",
              resizeMode: "contain",
              transform: [{ rotate: 360 - magnetometer + "deg" }],
            }}
          />
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={1}></Row>
    </Grid>
  );
}
