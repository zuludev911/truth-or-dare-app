import { ImageSourcePropType } from "react-native";

export interface Reto {
  type: "verdad" | "reto";
  text: string;
}

export interface Category {
  id: string;
  name: string;
  icon: ImageSourcePropType;
}
