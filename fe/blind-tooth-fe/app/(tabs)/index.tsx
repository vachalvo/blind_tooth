import {StyleSheet} from "react-native";

import {View} from "@/components/Themed";

import {useEffect, useState} from "react";

import {Surface, Text} from "react-native-paper";
import {Link, Redirect} from "expo-router";
import Colors from "@/constants/Colors";
import {Button} from "@/components/Button";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {REGISTRATION_KEY} from "@/app/register";

export default function TabOneScreen() {
    const [netInfo, setNetInfo] = useState<unknown>();
    const {getItem} = useAsyncStorage(REGISTRATION_KEY);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        getItem().then((res) => {
            setUserId(res);
            setLoading(false);
        });
    }, []);

    console.log(userId);

    if (loading) return <Text>Loading...</Text>;

    if (userId === null) return <Redirect href={"/register"}/>;

    return (
        <View style={styles.container}>
            {(netInfo as any) && (
                <Text>{JSON.stringify(netInfo as any, null, 2)}</Text>
            )}

            <View style={{height: 30}}/>

            <Link href="/(tabs)/contacts">
                <Button
                    style={{
                        backgroundColor: Colors.contacts.background,
                        height: 100,
                        width: 300,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    textColor={Colors.contacts.color}
                    labelStyle={{color: Colors.dark.background, fontSize: 20}}
                >
                    Hledej
                </Button>
            </Link>

            <View style={{height: 30}}/>

            <Link href="/findMe" >
                <Button
                  style={{
                    backgroundColor: Colors.navigation.background,
                    height: 100,
                    width: 300,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textColor={Colors.navigation.color}
                  labelStyle={{ color: Colors.dark.background, fontSize: 20 }}
                >
                    Sdílet polohu
                </Button>
            </Link>

            <View style={{height: 30}}/>

            <Link href="/(tabs)/contacts">
                <Button
                    style={{
                        backgroundColor: Colors.settings.background,
                        height: 100,
                        width: 300,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    textColor={Colors.settings.color}
                    labelStyle={{color: Colors.dark.background, fontSize: 20}}
                >
                    Nastavení
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
        backgroundColor: "#151514",
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
    buttonBase: {
        minHeight: 75,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 5
    }
});
