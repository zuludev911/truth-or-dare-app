declare module "*.png" {
  const value: any;
  export = value;
}
declare module "*.webp" {
  const value: any;
  export = value;
}
declare module "*.wav" {
  const value: any;
  export = value;
}
// @tabler/icons-react-native no publica .d.ts por ícono; los imports directos
// (evitan meter los ~5000 íconos del barrel en el bundle) se tipan aquí.
declare module "@tabler/icons-react-native/*" {
  import type { Icon } from "@tabler/icons-react-native";
  const component: Icon;
  export default component;
}
