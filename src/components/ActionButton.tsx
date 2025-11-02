import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

interface ActionButtonProps {
  text: string;
  onPress: () => void;
}

function ActionButton({ text, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
});

export default ActionButton;
