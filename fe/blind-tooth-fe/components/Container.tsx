import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { View } from "./Themed";
import { StyleSheet } from "react-native";

type Props = Omit<ComponentPropsWithRef<typeof View>, "style">;

export function Container({ children, ...props }: Props) {
  return (
    <View style={styles.container} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
