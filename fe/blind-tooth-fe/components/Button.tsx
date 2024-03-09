import Colors from "@/constants/Colors";
import { ComponentPropsWithRef } from "react";
import { Button as PaperButton } from "react-native-paper";

type Props = ComponentPropsWithRef<typeof PaperButton>;

export function Button({ children, ...props }: Props) {
  return (
    <PaperButton {...props} labelStyle={{ color: props?.textColor ?? Colors.light.background }}>
      {children}
    </PaperButton>
  );
}
