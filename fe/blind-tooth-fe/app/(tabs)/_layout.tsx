import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Link, Tabs} from "expo-router";
import {Pressable, View, Text, SafeAreaView} from "react-native";

import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";
import {useClientOnlyValue} from "@/components/useClientOnlyValue";
import {Button} from "@/components/Button";
import {useSoundsMode} from "@/utils/sounds";
import {useVibrationsMode} from "@/utils/vibrations";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

const CustomHeader = () => {
    const {soundsMode, storeSoundsMode} = useSoundsMode();
    const {vibrationsMode, storeVibrationsMode} = useVibrationsMode();
    const onSoundClicked = () => {
        storeSoundsMode(soundsMode === "on" ? "off" : "on")
    }

    const onVibrationsClicked = () => {
        storeVibrationsMode(vibrationsMode === "off" ? "soft" : "off");
    }

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 100,
            backgroundColor: Colors.header.background,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20
        }}>
            <View><Text style={{color: "white"}}>Stav</Text></View>

            <View style={{flexDirection: "row", gap: 5}}>
                <Button style={{backgroundColor: soundsMode === "on" ? "green" : "red"}} onPress={onSoundClicked}>Zvuk</Button>
                <Button style={{backgroundColor: vibrationsMode === "off" ? "red" : "green"}} onPress={onVibrationsClicked}>Vibrace</Button></View>
        </View>
    );
};

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (<>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,

                    // Disable the static render of the header on web
                    // to prevent a hydration error in React Navigation v6.
                    headerShown: useClientOnlyValue(false, true),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        header: () => <CustomHeader/>,
                        unmountOnBlur: true
                    }}
                />
                <Tabs.Screen
                    name="navigation"
                    options={{
                        title: "Navigace",
                        tabBarIcon: ({color}) => <TabBarIcon name="code" color={color}/>,
                        unmountOnBlur: true,
                    }}
                />
                <Tabs.Screen
                    name="contacts"
                    options={{
                        title: "Kontakty",
                        tabBarIcon: ({color}) => <TabBarIcon name="code" color={color}/>,
                    }}
                />
            </Tabs></>
    );
}
