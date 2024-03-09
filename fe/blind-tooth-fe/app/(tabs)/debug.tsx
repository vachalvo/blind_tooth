import {Dimensions, ScrollView, StyleSheet} from "react-native";

import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

import { useEffect, useState } from "react";

import * as NetInfo from "@react-native-community/netinfo";
import { Button, Text } from "react-native-paper";

import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import {Magnetometer} from "expo-sensors";

const SimpleLineChart = ({ data }: any) => {
    const labels = Array.from({ length: 20 }, (_, i) => (i + 1).toString()); // Create labels dynamically

    return (
        <LineChart
            data={{
                labels: labels,
                datasets: [
                    {
                        data: data,
                    },
                ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisInterval={1}
            chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                },
            }}
        />
    );
};

export default function TabOneScreen() {
    const [netInfo, setNetInfo] = useState<unknown>();
    const [strenghtChartData, setStrenghtChartData] = useState(Array.from({ length: 20 }, () => 0))

    const [count, setCount] = useState(0);

    const [magnetometerX, setMagnetometerX] = useState(Array.from({ length: 20 }, () => 0))
    const [magnetometerY, setMagnetometerY] = useState(Array.from({ length: 20 }, () => 0))

    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            NetInfo.refresh()
                .then((state) => {
                    setNetInfo(() => state);
                    setCount((prev) => prev + 1);

                    setStrenghtChartData((prev) => {
                        const newData = [...prev]; // Create a copy of the current data array
                        newData.shift(); // Remove the first element
                        return [...newData, state.details.strenght ?? -1]
                    }); // Update the state with the new data
                })
                .catch((err) => console.error(err));
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    Magnetometer.setUpdateInterval(1000)

    const _subscribe = () => {
        Magnetometer.isAvailableAsync().then((available) => {
            if (!available) {
                Magnetometer.requestPermissionsAsync().then((status) => {
                    if (!status.granted) {
                        alert("Permission to access location was denied");
                    }

                    setSubscription(
                        Magnetometer.addListener((MagnetometerData) => {
                            setMagnetometerX((prev) => {
                                const newData = [...prev]; // Create a copy of the current data array
                                newData.shift(); // Remove the first element
                                return [...newData,MagnetometerData.x]
                            }); // Update the state with the new data


                            setMagnetometerY((prev) => {
                                const newData = [...prev]; // Create a copy of the current data array
                                newData.shift(); // Remove the first element
                                return [...newData,MagnetometerData.y]
                            }); // Update the state with the new data
                        })
                    );
                });
            }
        });

        setSubscription(
            Magnetometer.addListener((MagnetometerData) => {
                setMagnetometerX((prev) => {
                    const newData = [...prev]; // Create a copy of the current data array
                    newData.shift(); // Remove the first element
                    return [...newData,MagnetometerData.x]
                }); // Update the state with the new data


                setMagnetometerY((prev) => {
                    const newData = [...prev]; // Create a copy of the current data array
                    newData.shift(); // Remove the first element
                    return [...newData,MagnetometerData.y]
                }); // Update the state with the new data
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

    return (
        <ScrollView style={styles.container}>
            <SimpleLineChart data={[...strenghtChartData]} />
            <SimpleLineChart data={[...magnetometerX]} />
            <SimpleLineChart data={[...magnetometerY]} />
            <EditScreenInfo path="app/(tabs)/index.tsx" />
            {(netInfo as any) && (
                <Text>{JSON.stringify(netInfo as any, null, 2)}</Text>
            )}

            {count > 0 && <Text>{count}</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
