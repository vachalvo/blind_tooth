import { Container } from "@/components/Container";
import { Text, TextInput } from "react-native-paper";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import Colors from "@/constants/Colors";
import { View } from "react-native";
import Calls from "@/utils/api/client";
import { navigate } from "expo-router/build/global-state/routing";
import { router } from "expo-router";

export const REGISTRATION_KEY = "registrationKey";

export default function App() {
  const { setItem } = useAsyncStorage(REGISTRATION_KEY);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (text.length === 0) {
      setError("Vyplňte prosím jméno");
      return;
    }

    setError("");

    setLoading(true);
    const body = {
      userId: text,
    };

    let res;
    try {
      res = await Calls.post(
        "https://rz4v35jq20.execute-api.eu-west-1.amazonaws.com/default/postUser",
        body
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Něco se pokazilo");
      return;
    }

    if (res.status === 200) {
      await setItem(text);
      router.replace("/(tabs)");
      setLoading(false);
      return;
    }
    setLoading(false);
    setError("Jméno již existuje. Vyberte jiné jméno.");
  };

  return (
    <Container>
      <View style={{ width: "100%", height: "100%", padding: 20, gap: 20 }}>
        <View style={{ flex: 1 }} />
        <Text variant="displaySmall">Registrace</Text>
        <TextInput
          style={{ width: "100%" }}
          label="Jméno"
          value={text}
          onChangeText={(text) => setText(text)}
          error={error.length > 0}
          disabled={loading}
          editable={!loading}
        />
        {error && <Text style={{ color: "red" }}>Napište svoje jméno</Text>}
        <View style={{ flex: 1 }} />
        <Button
          style={{
            backgroundColor: Colors.contacts.background,
          }}
          onPress={handleRegister}
          disabled={loading}
        >
          Registrovat
        </Button>
      </View>
    </Container>
  );
}
