import { TouchableOpacity } from "react-native";
import type { IconProps } from "@tabler/icons-react-native";
import IconX from "@tabler/icons-react-native/IconX";

import { COLORS } from "../constants";

function CloseButton({ onPress, style, size = 32, ...props }: IconProps) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} style={style}>
      <IconX color={COLORS.WHITE} size={size} {...props} />
    </TouchableOpacity>
  );
}

export default CloseButton;
