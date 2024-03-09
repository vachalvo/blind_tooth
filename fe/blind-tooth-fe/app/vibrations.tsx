import { Container } from "@/components/Container";
import { View } from "@/components/Themed";
import { Button, RadioButton, Surface, Text } from "react-native-paper";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useVibrationsMode } from "@/utils/vibrations";

export default function Vibrations() {
  const { vibrationsMode, storeVibrationsMode } = useVibrationsMode();

  return (
    <Container>
      <Surface
        mode="flat"
        elevation={0}
        style={{
          display: "flex",
          gap: 16,
          flexDirection: "row",
        }}
      >
        <Surface
          mode="flat"
          elevation={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text>Vibrace</Text>
          <View style={{ height: 18 }} />

          <Button>Silně</Button>
          <Button>Středně</Button>
          <Button>Slabě</Button>
          <Button>Vypnuto</Button>
        </Surface>

        <Surface
          mode="flat"
          elevation={0}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text>Vibrace</Text>

          <View style={{ height: 18 }} />

          <RadioButton.Item
            label="Silně"
            value="heavy"
            status={vibrationsMode === "heavy" ? "checked" : "unchecked"}
            onPress={() => storeVibrationsMode("heavy")}
          />

          <RadioButton.Item
            label="Středně"
            value="medium"
            status={vibrationsMode === "medium" ? "checked" : "unchecked"}
            onPress={() => storeVibrationsMode("medium")}
          />

          <RadioButton.Item
            label="Slabě"
            value="soft"
            status={vibrationsMode === "soft" ? "checked" : "unchecked"}
            onPress={() => storeVibrationsMode("soft")}
          />

          <RadioButton.Item
            label="Vypnuto"
            value="off"
            status={vibrationsMode === "off" ? "checked" : "unchecked"}
            onPress={() => storeVibrationsMode("off")}
          />
        </Surface>
      </Surface>
    </Container>
  );
}
