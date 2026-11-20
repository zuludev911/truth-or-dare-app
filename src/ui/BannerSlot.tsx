import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdBanner from "../components/AdBanner";
import { AdPlacement } from "../services/analytics";
import { BANNER_HEIGHT, space } from "../theme";

/**
 * Espacio del banner al pie de la pantalla (sección 8 del spec):
 * - reserva 60 dp aunque el anuncio no cargue, para que el diseño no salte;
 * - deja 16 dp de separación con el contenido (política de AdMob contra clics accidentales);
 * - queda por encima de la barra de gestos de Android y del indicador de inicio de iOS.
 * La pantalla que lo usa debe ir con `<Screen padBottom={false}>`.
 */
export default function BannerSlot({ placement }: { placement: AdPlacement }) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.slot, { marginBottom: bottom }]}>
      <AdBanner placement={placement} inline />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    minHeight: BANNER_HEIGHT,
    marginTop: space.s4,
    marginHorizontal: -space.s5, // el banner ocupa todo el ancho, sin el padding de Screen
    justifyContent: "center",
  },
});
