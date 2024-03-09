import {Dimensions, StyleSheet} from "react-native";

import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

import { useEffect, useState } from "react";

import * as NetInfo from "@react-native-community/netinfo";
import { Button, Text } from "react-native-paper";

import React from 'react';
import { LineChart } from 'react-native-chart-kit';

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
            yAxisSuffix="k"
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
    console.log(strenghtChartData)
    useEffect(() => {
        const interval = setInterval(() => {
            NetInfo.refresh()
                .then((state) => {
                    console.log("Connection type", state.type);
                    console.log("Is connected?", state.isConnected);
                    console.log(state.details);
                    setNetInfo(() => state);
                    setCount((prev) => prev + 1);


                    setStrenghtChartData((prev) => {
                        const newData = [...prev]; // Create a copy of the current data array
                        newData.shift(); // Remove the first element
                        return [...newData, state.details.strenght ?? -1]
                    }); // Update the state with the new data
                     })
                .catch((err) => console.error(err));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <SimpleLineChart data={[...strenghtChartData]} />
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
