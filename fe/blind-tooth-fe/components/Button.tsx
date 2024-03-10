import Colors from "@/constants/Colors";
import { ComponentPropsWithRef } from "react";
import { Button as PaperButton } from "react-native-paper";



export function Button({ children, ...props }: any) {
  return (
    <PaperButton {...props} labelStyle={{ color: props?.textColor ?? Colors.light.background, fontSize: props?.fontSize }}>
      {children}
    </PaperButton>
  );
}
