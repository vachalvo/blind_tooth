import { Container } from "@/components/Container";
import {Text, TextInput} from "react-native-paper";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import {Button} from "@/components/Button";
import Colors from "@/constants/Colors";
import {View} from "react-native";
import Calls from "@/utils/api/client";
import {navigate} from "expo-router/build/global-state/routing";
import {router} from "expo-router";

const REGISTRATION_KEY = "registrationKey";

export default function App() {
    const { getItem, setItem, removeItem } = useAsyncStorage(REGISTRATION_KEY);
    const [text, setText] = useState("");
    const [error, setError] = useState(false)

    useEffect(() => {
        getItem().then((uu) => {
            if(uu !== null)
                router.replace("/(tabs)")
        })

        removeItem()
    }, []);

    const handleRegister = async () => {
        console.log(text);
        if(text.length === 0) {
            setError(true)
            return;
        }

        setError(false)

        const body = {
            userId: text
        };
        const res = await Calls.post("users", body)
        setItem(JSON.stringify(body))
        router.replace("/(tabs)")

        console.log(res.data)
    }

    return (
        <Container>
            <View style={{width: "100%", height: "100%", padding: 20, gap: 20}}>
                <View style={{flex: 1}} />
                <Text variant="displaySmall">Registrace</Text>
                <TextInput
                    style={{width: "100%"}}
                    label="Jméno"
                    value={text}
                    onChangeText={text => setText(text)}
                    error={error}
                />
                {error && <Text style={{color: "red"}}>
                    Napište svoje jméno
                </Text>}
                <View style={{flex: 1}} />
                <Button style={{
                    backgroundColor: Colors.contacts.background,
                }} onPress={handleRegister}>
                    Registrovat
                </Button>
            </View>

        </Container>
    );
}
