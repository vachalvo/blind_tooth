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

export const REGISTRATION_KEY = "registrationKey";

export default function App() {
    const {  setItem } = useAsyncStorage(REGISTRATION_KEY);
    const [text, setText] = useState("");
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        if(text.length === 0) {
            setError("Vyplňte prosím jméno")
            return;
        }

        setError("")

        setLoading(true)
        const body = {
            userId: text
        };
        const res = await Calls.post("users", body)
        if(res.status === 200) {
            setItem(text)
            router.replace("/(tabs)")
            setLoading(false)
            return;
        }
        setLoading(false)
        setError("Jméno již existuje. Vyberte jiné jméno.")
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
                    error={error.length > 0}
                    disabled={loading}
                    editable={!loading}
                />
                {error && <Text style={{color: "red"}}>
                    Napište svoje jméno
                </Text>}
                <View style={{flex: 1}} />
                <Button style={{
                    backgroundColor: Colors.contacts.background,
                }} onPress={handleRegister} disabled={loading}>
                    Registrovat
                </Button>
            </View>

        </Container>
    );
}
