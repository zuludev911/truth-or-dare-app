import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { colors, space } from "../theme";
import {
  Badge,
  BannerSlot,
  BottomSheet,
  Button,
  CategoryCard,
  GameCard,
  Header,
  Illustration,
  IllustrationName,
  ListCard,
  Pill,
  Screen,
  Text,
} from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "DesignSystem">;

const ILLUSTRATIONS: IllustrationName[] = [
  "vor", "yn", "qmp", "her", "nav", "clasico", "extremo", "parejas", "amigos", "chicas",
];

/**
 * Catálogo de los componentes del rediseño. Solo existe en desarrollo
 * (se abre con el botón "DS" del inicio) y sirve para revisarlos en el teléfono.
 */
export default function DesignSystemScreen({ navigation }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const noop = () => {};

  return (
    <Screen padBottom={false}>
      <Header title="Sistema de diseño" onLeadingPress={navigation.goBack} trailing={<Pill label="3 jugadores" onPress={noop} />} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Texto">
          <Text variant="hero">¿A qué jugamos?</Text>
          <Text variant="title">Título de tarjeta</Text>
          <Text variant="body">Texto normal de la interfaz.</Text>
          <Text variant="caption">Ayuda o subtítulo atenuado.</Text>
        </Section>

        <Section title="Colores">
          <View style={styles.row}>
            {(["vor", "yn", "qmp", "her", "nav", "verdad", "reto"] as const).map((c) => (
              <View key={c} style={[styles.swatch, { backgroundColor: colors[c] }]}>
                <Text variant="badge" color={colors.onAccent}>{c}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Botones">
          <Button label="Primario" onPress={noop} />
          <View style={styles.row}>
            <Button label="Verdad" accent="verdad" size="tall" style={styles.flex} onPress={noop} />
            <Button label="Reto" accent="reto" size="tall" style={styles.flex} onPress={noop} />
          </View>
          <Button label="Siguiente" accent="yn" onPress={noop} />
          <Button label="¡Listos!" accent="qmp" onPress={noop} />
          <Button label="Secundario" variant="secondary" onPress={noop} />
          <Button label="Compartir carta" variant="ghost" size="small" onPress={noop} />
          <Button label="Deshabilitado" disabled onPress={noop} />
          <Button label="Cargando" loading onPress={noop} />
        </Section>

        <Section title="Etiquetas y píldoras">
          <View style={styles.row}>
            <Badge label="Nuevo" />
            <Badge label="¡Nuevas!" variant="new" />
            <Badge label="Próximamente" variant="soon" />
            <Badge label="Quedan 1 h 45 min" />
          </View>
          <View style={styles.row}>
            <Pill label="Picante" accent="vor" icon={<Illustration name="vor" size={22} />} />
            <Pill label="3 jugadores" onPress={noop} />
          </View>
        </Section>

        <Section title="Tarjetas de juego (inicio)">
          <GameCard title="Verdad o Reto" subtitle="El clásico, de suave a extremo" accent="vor" illustration="vor" illustrationRotate={-8} onPress={noop} />
          <GameCard title="Yo nunca" subtitle="Confiesa lo que sí has hecho" accent="yn" illustration="yn" illustrationRotate={8} badge="Nuevo" onPress={noop} />
          <GameCard title="¿Quién es más probable que…?" subtitle="Señala al culpable" accent="qmp" illustration="qmp" illustrationRotate={-6} badge="Nuevo" onPress={noop} />
          <GameCard title="Herramientas" subtitle="Dado, botella y más" accent="her" illustration="her" illustrationRotate={6} onPress={noop} />
          <GameCard title="Juego navideño" subtitle="Llega en diciembre" accent="nav" illustration="nav" illustrationRotate={-6} badge="Próximamente" disabled onPress={() => Toast.show({ type: "info", text1: "¡Llega en diciembre! 🎄", text2: "El juego navideño viene en camino" })} />
        </Section>

        <Section title="Categorías">
          <View style={styles.row}>
            <CategoryCard name="Clásico" illustration="clasico" level={1} onPress={noop} />
            <CategoryCard name="Picante" illustration="vor" level={2} isNew onPress={noop} />
          </View>
          <View style={styles.row}>
            <CategoryCard name="Extremo" illustration="extremo" level={3} isNew locked onPress={noop} />
            <CategoryCard name="Chicas" illustration="chicas" level={2} timeLeft="Quedan 1 h 45 min" onPress={noop} />
          </View>
        </Section>

        <Section title="Niveles y herramientas">
          <ListCard title="Clásico" subtitle="Para romper el hielo" accent="yn" media={<Illustration name="clasico" size={80} />} onPress={noop} />
          <ListCard title="Dado" subtitle="Lanza de 1 a 4 dados" media={<Illustration name="her" size={72} />} onPress={noop} />
          <ListCard title="Papa caliente" subtitle="Próximamente" soon media={<Illustration name="extremo" size={72} />} onPress={noop} />
        </Section>

        <Section title="Ilustraciones">
          <View style={styles.row}>
            {ILLUSTRATIONS.map((name) => (
              <Illustration key={name} name={name} size={64} />
            ))}
          </View>
        </Section>

        <Section title="Hoja inferior y toasts">
          <Button label="Abrir hoja inferior" variant="secondary" onPress={() => setSheetVisible(true)} />
          <View style={styles.row}>
            <Button label="Toast info" variant="secondary" size="small" style={styles.flex} onPress={() => Toast.show({ type: "info", text1: "¡Categoría desbloqueada!", text2: "Acceso por 2 horas" })} />
            <Button label="Toast error" variant="secondary" size="small" style={styles.flex} onPress={() => Toast.show({ type: "error", text1: "Sin conexión a internet", text2: "Conéctate para ver el video." })} />
          </View>
        </Section>
      </ScrollView>
      <BannerSlot placement="categories" />

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="Jugadores" subtitle="Los nombres son opcionales. Máximo 20 jugadores.">
        <Button label="¡A jugar!" onPress={() => setSheetVisible(false)} />
      </BottomSheet>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="caption" style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: space.s4, gap: space.s6 },
  section: { gap: space.s3 },
  sectionTitle: { letterSpacing: 1.5 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: space.s3 },
  flex: { flex: 1 },
  swatch: { width: 64, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
