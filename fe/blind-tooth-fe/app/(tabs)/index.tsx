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
    const [count, setCount] = useState(0);
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
                        flexGrow: 1,
                        paddingLeft: 10
                    }}
                >

                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.share.background,
                            }
                        }}
                        textColor={Colors.share.color}
                    >
                        Sdílet kontakt
                    </Button>

                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.contacts.background,
                            }
                        }}
                        textColor={Colors.contacts.color}
                    >
                        Kontakty
                    </Button>

                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.contacts.background,
                            }
                        }}
                        textColor={Colors.contacts.color}
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
                        flexGrow: 1,
                        paddingRight: 10
                    }}
                >
                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.vibrations.background,
                            }
                        }}
                        textColor={Colors.vibrations.color}
                    >
                        Nastavení
                    </Button>

                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.dark.background,
                            }
                        }}
                        textColor={Colors.light.background}
                    >
                        TODO
                    </Button>

                    <Button
                        style={{
                            ...styles.buttonBase, ...{
                                backgroundColor: Colors.navigation.background
                            }
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

            <View style={{height: 30}}/>

            <Link href="/(tabs)/navigation">
                <Button
                    style={{
                        backgroundColor: Colors.navigation.background,
                        height: 100,
                        width: 200,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    textColor={Colors.navigation.color}
                    labelStyle={{color: Colors.dark.background, fontSize: 20}}
                >
                    Hledej
                </Button>
            </Link>
    
      <Link href="/findMe">
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
          Sdílet polohu
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
        backgroundColor: "#353531"
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
