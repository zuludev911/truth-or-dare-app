# Spec: Amigo secreto

Primer juego del "Juego navideño" (hoy es una tarjeta "Próximamente" en `HomeScreen`). Es la dinámica más usada en Colombia en diciembre (oficinas, familias, grupos de amigos) y es neutra, así que también cabe en la edición de iOS.

## 1. Alcance

**Versión 1 (esta spec)**: sorteo en persona, pasando el teléfono.

1. Se agregan los participantes.
2. Opcional: monto del regalo, fecha/lugar del intercambio y exclusiones (parejas que no se pueden tocar).
3. La app sortea.
4. Cada persona ve en secreto a quién le regala, y se pasa el teléfono.
5. Al final queda una pantalla de cierre.

**Fuera de alcance (versión 2)**: sorteo a distancia por WhatsApp con un enlace por persona. Se describe en la sección 8 porque cambia el diseño.

**Sin dependencias nativas nuevas**: solo `AsyncStorage`, `Share` de React Native, Reanimated y `Pressable`. Por eso puede salir por OTA en Android 1.4.0 y entrar de una vez en la build de iOS.

## 2. Flujo y pantallas

```
Home ──► Christmas (hub navideño) ──► SecretSantaSetup ──► SecretSantaReveal ──► (cierre)
```

| Pantalla | Qué hace |
|---|---|
| `Christmas` | Lista de juegos navideños con `ListCard`. Hoy solo "Amigo secreto"; "Aguinaldos" queda para después (ver `docs/specs` futura). Mientras haya un solo juego, la tarjeta del Home puede ir directo a `SecretSantaSetup` y el hub se agrega cuando haya un segundo juego. |
| `SecretSantaSetup` | Lista de participantes (mínimo 3, máximo 20), monto opcional, fecha/lugar opcionales, exclusiones opcionales. Botón "Sortear". |
| `SecretSantaReveal` | Una persona a la vez. Ver sección 4. |

### Setup

- Participantes: reusar el patrón de `PlayersSheet` (input + agregar + quitar). Conviene un componente propio con otro título ("Participantes") y el mínimo de 3, en vez de forzar `PlayersSheet`, que tiene el texto "Los nombres son opcionales".
- Precargar con los nombres guardados de `usePlayers`? **Decisión abierta (sección 9).**
- Monto: campo numérico opcional, con atajos de $20.000 / $50.000 / $100.000 COP. Se muestra en el reveal ("Tope: $50.000").
- Fecha y lugar: texto libre opcional ("24 de diciembre, donde la abuela"). Se muestra en el cierre.
- Exclusiones: botón "Restricciones" que abre una hoja (`BottomSheet`). Se elige una persona y se marcan a quién **no** puede tocarle. Se guardan como pares dirigidos; la UI las deja simétricas por defecto ("ninguno le regala al otro"), que es lo que se espera con las parejas.
- Validación antes de sortear: mínimo 3 participantes y que el sorteo sea posible con las exclusiones (sección 3). Si no, mensaje: "Con esas restricciones no hay forma de sortear. Quita alguna."

### Reveal (corazón de la experiencia)

Estado por persona: `esperando → viendo → visto`.

1. Pantalla "Pásale el teléfono a **Ana**" con botón "Soy Ana".
2. La pantalla siguiente tiene la tarjeta tapada. **Mantener presionado** (`onPressIn`/`onPressOut`) muestra "Le regalas a **Luis**"; al soltar se vuelve a tapar. Así nadie lo deja en pantalla por accidente.
3. Botón "Listo, pasar el teléfono" solo se habilita después de haber visto el nombre al menos una vez.
4. Se pasa a la siguiente persona sin ver; al terminar la última se llega al cierre.

Orden de presentación: el de la lista. Se puede saltar a alguien ("Ya vio" / "Falta") desde un resumen que **no** muestra asignaciones, solo quién ya vio.

### Cierre

- "¡Listo! Ya todos saben a quién le regalan."
- Resume monto, fecha y lugar si se pusieron.
- Botón "Compartir recordatorio": `Share.share` con texto **sin asignaciones** ("Amigo secreto: tope $50.000, 24 de diciembre en casa de la abuela").
- Botón "Nuevo sorteo" (confirmar antes de borrar el actual).
- Aviso: "Si alguien olvidó a quién le toca, puede revisarlo sin ver el de los demás" (ver abajo).

### ¿Qué pasa si alguien olvida su amigo?

Es el problema real del amigo secreto en persona. Propuesta: en el cierre, "Recordar el mío": elegir tu nombre y mantener presionado de nuevo. No tiene protección, pero es explícito; se acepta el riesgo de que alguien mire de más. No se agrega PIN en v1.

## 3. Algoritmo del sorteo

Función pura en `src/games/secretSanta.ts`:

```ts
export interface Draw { giver: string; receiver: string }
export function drawSecretSanta(
  names: string[],
  excluded: Array<[string, string]>, // [quien da, a quien no puede darle]
): Draw[] | null // null si es imposible
```

- Se baraja la lista (Fisher–Yates) y cada uno le regala al siguiente: **un solo ciclo**. Nadie se saca a sí mismo y no hay parejas cerradas A↔B, que es lo más raro de un sorteo con papelitos.
- Si algún par choca con una exclusión, se vuelve a barajar (hasta ~200 intentos).
- Si los intentos se agotan, se cae a una búsqueda con backtracking sobre todas las asignaciones válidas (cada uno recibe exactamente uno, sin excluidos, sin sí mismo). Permite varios ciclos cuando las exclusiones impiden uno solo.
- Si tampoco hay solución, devuelve `null`.
- Casos borde: nombres repetidos ya los impide el setup (comparación sin mayúsculas); mínimo 3.

Se verifica con un script en `scripts/` (el repo no tiene corredor de pruebas): miles de sorteos aleatorios comprueban que nadie se saca a sí mismo, que cada uno da una vez y recibe una vez, y que se respetan las exclusiones; más casos imposibles que deben devolver `null`.

## 4. Datos y persistencia

Clave `secretSanta` en `AsyncStorage` (mismo patrón de `src/services/players.ts`), con `{ participants, amount, date, place, exclusions, draw, seen }`. Se guarda en cuanto se sortea, para que cerrar la app por error no arruine el sorteo. "Nuevo sorteo" la borra.

Riesgo conocido: quien organiza puede abrir la app y ver todo. En v1 las asignaciones solo se muestran con "mantener presionado" por persona, nunca en lista.

## 5. Navegación y ajustes en el código existente

- `src/navigation/Navigation.tsx`: rutas `SecretSantaSetup` y `SecretSantaReveal` (y `Christmas` cuando exista el segundo juego).
- `src/screens/HomeScreen.tsx`: la tarjeta "Juego navideño" deja de ser `disabled`/"Próximamente"; quitar el `badge` y navegar. **Sin el bloque `!IOS_EDITION`**: aparece también en iOS (es un juego neutro y está terminado).
- `src/services/remoteConfig.ts`: ya solo maneja números. Para la ventana de fechas basta `christmas_enabled` (0/1) con valor por defecto calculado por fecha local (visible del **15 de noviembre al 6 de enero**), de modo que se pueda adelantar o cortar sin publicar.
- `src/services/analytics.ts`: agregar eventos (sección 6) y `"secret_santa"` al tipo de `AdPlacement`.
- Nuevo `src/services/secretSanta.ts` (persistencia) y `src/games/secretSanta.ts` (sorteo).
- Estilo: acento `nav` (`#3DDC84`, ya existe) e ilustración `nav` (ya existe). Reusar `Screen`, `Header`, `Button`, `ListCard`, `BottomSheet`.

## 6. Analítica

| Evento | Parámetros |
|---|---|
| `secret_santa_started` | `participants`, `has_amount`, `has_exclusions` |
| `secret_santa_drawn` | `participants`, `attempts` (para ver si el sorteo se complica) |
| `secret_santa_draw_failed` | `participants`, `exclusions` |
| `secret_santa_completed` | `participants` (todos vieron su amigo) |
| `secret_santa_reminder_shared` | — |
| `secret_santa_reset` | — |

El evento `home_game_selected` con `game: "christmas"` ya existe.

## 7. Anuncios

- Banner (`BannerSlot`) solo en `SecretSantaSetup`.
- **Sin banner en `SecretSantaReveal`**: un anuncio que se mueve o abre por un toque accidental durante el "mantener presionado" arruina el secreto.
- Un intersticial como máximo, al llegar al cierre, nunca antes de ver el nombre.

## 8. Versión 2: a distancia por WhatsApp

Es el uso más común del amigo secreto en grupos de amigos y familias que viven lejos.

- Cada participante recibe un enlace a una página en `verdad-o-reto.zuve.digital` con su asignación **codificada en el fragmento** (`#...`), que no se envía al servidor. La página lo decodifica en el navegador y lo muestra al abrir.
- El organizador manda un enlace por persona desde la app (`Share.share` por contacto).
- Limitación honesta: sin servidor no hay secreto real frente a quien organiza, que puede abrir los enlaces o leer el estado de la app. Funciona por confianza, igual que el sorteo con papelitos que hace una sola persona.
- Alternativa con garantía real: backend con códigos de un solo uso (Firebase). Es bastante más trabajo y datos de terceros; no lo recomiendo para el primer lanzamiento.
- Requiere decidir esquema de enlace, tamaño del fragmento (≤ ~2.000 caracteres para 20 participantes) y trabajo en la página de descarga.

## 9. Decisiones abiertas

1. **¿v1 solo en persona o ya con WhatsApp?** Recomiendo solo en persona y medir (`secret_santa_*`) antes de invertir en v2.
2. **¿Reutilizar la lista guardada de jugadores?** Recomiendo no precargarla: los participantes de Verdad o Reto casi nunca son los del amigo secreto. Guardar una lista propia solo mientras dure el sorteo.
3. **¿Hub `Christmas` ahora o tarjeta directa?** Recomiendo directo mientras sea un solo juego.
4. **Ventana de fechas**: 15 de nov – 6 de ene por defecto, ajustable con Remote Config.
5. **Monto**: ¿solo COP o detectar el país? La app es hispanohablante en general; propongo texto libre con atajos en COP.

## 10. Plan de trabajo (≈ 2–3 días)

1. `src/games/secretSanta.ts` + script de verificación del sorteo.
2. `src/services/secretSanta.ts` (persistencia).
3. `SecretSantaSetup` (participantes, monto, fecha/lugar, restricciones).
4. `SecretSantaReveal` (mantener para ver, pasar teléfono, cierre).
5. Navegación, tarjeta del Home, Remote Config, analítica.
6. Revisión en Android (OTA 1.4.0) y en iOS (entra con la build nativa de 1.5.0).

## 11. Riesgos

- **iOS**: la tarjeta navideña solo se muestra si el juego está terminado (guía 2.1). No lanzar con "Próximamente" en iOS.
- **Calendario**: si se quiere que el amigo secreto esté listo para diciembre, la OTA de Android puede salir antes; en iOS depende de la revisión de la build 1.5.0, que debería enviarse con margen antes del 15 de diciembre.
- **Mantener presionado** debe probarse en gestos de accesibilidad (TalkBack/VoiceOver): ofrecer una alternativa de tocar para mostrar y tocar para ocultar cuando el lector de pantalla esté activo.
