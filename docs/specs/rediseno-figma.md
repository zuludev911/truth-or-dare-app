# Spec: rediseño de "Verdad o Reto 🔥" en Figma

## 1. Objetivo

Rediseñar la app completa en Figma con una identidad visual nueva, llamativa y de fiesta, y entregar:

1. **Sistema de diseño**: tokens (color, tipografía, espaciado, radios, sombras) y componentes base con variantes.
2. **Pantallas** de todos los flujos descritos en este documento, incluidos estados vacíos, de carga, de error y sin conexión.
3. **Prototipo navegable** de los flujos principales.

La app pasa de ser "un juego de verdad o reto" a ser **un centro de juegos para fiestas y reuniones**. El rediseño tiene que dejar espacio para sumar juegos nuevos sin rehacer la navegación.

## 2. Contexto del producto

| | |
|---|---|
| Nombre | Verdad o Reto 🔥 (paquete `com.anfezuar.truthordareapp`) |
| Plataforma | **Android (Google Play) e iOS (App Store)**: iOS sale pronto, así que el diseño cubre las dos desde el inicio. Solo vertical (portrait). |
| Tecnología | React Native + Expo SDK 54. Animaciones con Reanimated. Íconos actuales: Tabler Icons. |
| Público | **Mayores de 18 años**, hispanohablantes (Latinoamérica y España). Se usa en grupo, con el teléfono pasando de mano en mano, a menudo con poca luz, música y algo de alcohol. |
| Modelo de ingresos | Gratis con anuncios de AdMob: banner, intersticial y video recompensado. No hay compras dentro de la app. |
| Idioma de la interfaz | Español neutro (tuteo). |

### Lo que usa hoy la gente (Firebase, primeras semanas)

Entradas a cada categoría de Verdad o Reto, de mayor a menor: **Picante** (la más jugada), **Amigos**, **Extremo** (la que más usuarios distintos abren), **Parejas**, **Clásico** y **Chicas**. Picante y Extremo merecen protagonismo visual.

### Identidad actual (referencia, no hay que conservarla)

- Rojo `#E63140` como primario, turquesa `#97d0ca` como secundario, blanco y negro.
- Fondos con imagen, tarjeta blanca que gira, botones planos con sombra.
- Íconos de categoría en imágenes (`.webp`).

## 3. Investigación: qué hacen las apps de referencia

Antes de diseñar, revisa en las tiendas al menos estas apps: **Picolo**, **TOZ**, **Truth or Dare: Party Game**, **Exposed (Never Have I Ever / Most Likely To)** y **Truth or Dare Spicy Party Game**. Lo que ya se sabe de ellas:

- **El color organiza el juego.** Picolo usa fondos de color a pantalla completa según el tipo de carta (por ejemplo, verde para retos generales y amarillo para reglas que duran varias rondas). Así el grupo entiende la carta de un vistazo, incluso con poca luz.
- **Agregar jugadores tiene que ser rapidísimo.** En Picolo se escribe un nombre, se presiona *Enter* y el foco pasa al siguiente sin tocar nada más.
- **Avanzar con un toque o deslizando.** Un gesto universal reduce la carga en un grupo distraído.
- **Varios juegos en una sola app.** TOZ y otras combinan Verdad o Reto, Yo nunca, ¿Quién es más probable que…? y ¿Qué prefieres?.
- **Niveles de intensidad** (de "suave" a "+18") y modos para parejas son lo habitual.
- **Lo que más critican los usuarios:** paywalls en el primer arranque y contenido que se repite rápido. Esta app no tiene paywall, y eso es una ventaja que el diseño no debe esconder.

**Entregable de la investigación:** una página en Figma con capturas comentadas de 4 o 5 apps, anotando qué copiar, qué evitar y qué podemos hacer diferente.

## 4. Dirección visual

- **Llamativa y nocturna.** Una base oscura (morado o azul noche) con acentos neón saturados funciona bien en fiestas con poca luz y hace que el color de cada juego destaque. Propón 2 direcciones antes de cerrar una.
- **Un color por juego**, aplicado a fondos, tarjetas y botones de ese modo. Por ejemplo: Verdad o Reto en rojo y magenta, Yo nunca en violeta, ¿Quién es más probable que…? en amarillo o naranja, Herramientas en turquesa, Navidad en verde y rojo.
- **Dentro de Verdad o Reto, Verdad y Reto también se distinguen por color** de un vistazo, como hoy (rojo frente a turquesa), pero con la paleta nueva.
- **Tipografía grande y legible a distancia:** las cartas se leen en voz alta y a veces desde lejos. Texto de carta de 24 a 28 pt como mínimo. Usa una fuente de Google Fonts con licencia libre (una display con personalidad para títulos y una sans muy legible para el texto).
- **Contraste AA como mínimo** (4.5:1 para texto), áreas táctiles de **48×48 dp** como mínimo.
- **Ilustraciones o íconos de categoría nuevos** con el mismo estilo (pueden seguir siendo imágenes). Para íconos de interfaz, prioriza **Tabler Icons**, que ya está en el código.
- **Movimiento:** la carta que gira es parte de la identidad; mantenla y documenta las animaciones (duración y curva) en el prototipo.

### 4.1 Android e iOS

Un solo diseño para las dos plataformas, con identidad propia (no hace falta imitar Material ni el estilo nativo de iOS), pero respetando lo que cada sistema espera:

- **Áreas seguras:** en iOS, la isla dinámica o el notch arriba y el **indicador de inicio** abajo; en Android, la barra de estado y la barra de gestos o de navegación. Ningún botón ni texto importante puede quedar debajo de ellas.
- **Volver atrás:** en iOS se vuelve deslizando desde el borde izquierdo y no hay botón físico; toda pantalla secundaria necesita un botón visible de volver o cerrar. En Android también existe el gesto y el botón atrás del sistema.
- **Diálogos del sistema:** el menú de compartir, el formulario de consentimiento de Google y la solicitud de calificación los dibuja cada sistema con su propio estilo. Diseña lo que va antes y después, no el diálogo.
- **Vibración:** en iOS se usan respuestas hápticas más sutiles. Indica en el prototipo dónde conviene una vibración (por ejemplo, al girar la carta o al "explotar" la papa caliente).
- **Tipografía:** usa la misma fuente de Google Fonts en ambas plataformas, incluida en la app, para que se vea igual.

## 5. Navegación y arquitectura

Hoy, una pantalla de inicio con un botón **JUGAR** lleva a una barra inferior con dos pestañas (Inicio → Categorías → Juego, y Herramientas → Dado o Botella).

**Propuesta:** la pantalla principal pasa a ser el **centro de juegos** y la barra inferior desaparece. Cada juego se abre desde ahí y vuelve ahí. Si el diseñador encuentra un motivo para mantener la barra inferior, que lo justifique.

```
Inicio (centro de juegos)
├── Verdad o Reto ──► Categorías ──► [Jugadores] ──► Juego
│                        └── categoría bloqueada ──► Modal de video ──► Juego
├── Yo nunca ──► Niveles ──► [Jugadores] ──► Juego
├── ¿Quién es más probable que…? ──► Niveles ──► [Jugadores] ──► Juego
├── Herramientas ──► Dado / Botella  (+ futuras: Papa caliente, Charadas)
└── Juego navideño  (deshabilitado, "Próximamente")
```

## 6. Pantallas

Para cada pantalla, diseña los estados indicados. Los textos entre comillas son la copia actual o la propuesta y se pueden mejorar.

### 6.1 Splash
- Logo y nombre sobre el fondo de la marca nueva. Se muestra mientras la app carga (hasta unos 3 segundos sin conexión).

### 6.2 Inicio: centro de juegos (pantalla principal)
Cinco tarjetas o botones grandes, cada uno con el color de su juego, un ícono o ilustración y un subtítulo corto:

| Juego | Subtítulo sugerido | Estado |
|---|---|---|
| **Verdad o Reto** | "El clásico, de suave a extremo" | Activo |
| **Yo nunca** | "Confiesa lo que sí has hecho" | Activo (nuevo, con etiqueta "Nuevo") |
| **¿Quién es más probable que…?** | "Señala al culpable" | Activo (nuevo, con etiqueta "Nuevo") |
| **Herramientas** | "Dado, botella y más" | Activo |
| **Juego navideño** | (nombre por definir) | **Deshabilitado**, con la etiqueta **"Próximamente"** |

- El juego navideño se ve atenuado, no responde como los demás y al tocarlo muestra un mensaje breve tipo *"¡Llega en diciembre! 🎄"*. Su nombre y su diseño final se definen más adelante; por ahora es un espacio reservado.
- Enlace pequeño **"Privacidad y anuncios"** al pie. Solo aparece para usuarios de Europa, pero el diseño debe reservarle lugar.
- Opcional: acceso a "Jugadores" desde el inicio, para configurar el grupo una sola vez y usarlo en todos los juegos.
- **Esta pantalla no tiene banner de anuncios**, como hoy. Es la primera impresión.

### 6.3 Jugadores (compartida por todos los juegos)
Hoy es una ventana dentro del juego; puede pasar a ser una pantalla o una hoja inferior (bottom sheet).
- Campo de nombre y botón "+"; al presionar *Enter* se agrega y el foco queda en el campo para el siguiente (patrón de Picolo).
- Lista de nombres con opción de quitar. Máximo 20 jugadores y 20 caracteres por nombre.
- Error de nombre repetido: *"Ese nombre ya está en la lista."*
- Botón principal *"¡A jugar!"*; si no hay nombres, *"Jugar sin nombres"* (los nombres son opcionales).
- Los nombres se guardan para la próxima partida: diseña el estado "lista ya cargada".
- Cuidado con el teclado: el campo no puede quedar tapado en pantallas pequeñas.

### 6.4 Verdad o Reto: categorías
Seis categorías: **Clásico, Picante, Extremo, Parejas, Amigos, Chicas**.
- **Extremo y Chicas están bloqueadas**: se desbloquean viendo un video y quedan abiertas 2 horas (el tiempo se puede cambiar de forma remota). Diseña el candado y, si es posible, el tiempo restante cuando estén desbloqueadas.
- Etiqueta **"¡Nuevas!"** en las categorías con cartas nuevas (hoy Picante y Extremo).
- Considera mostrar el nivel de intensidad de cada categoría (por ejemplo, con 1 a 3 llamas).
- **Banner de anuncios abajo** (ver sección 8).

### 6.5 Modal de desbloqueo con video
- Imagen de la categoría, texto: *"Esta categoría es para adultos y contiene contenido sensible. Para acceder debes ver un video de publicidad, el cual te dará acceso por 2 horas."* (Chicas tiene su propio texto).
- Botón *"Ver video ▶"* y botón de cerrar.
- Estados: video listo; video cargando; **sin conexión** (*"Sin conexión a internet. Conéctate para ver el video y desbloquear esta categoría."*); sin anuncios disponibles (*"No se cargaron anuncios, intenta más tarde"*).

### 6.6 Verdad o Reto: juego
- Arriba: botón de cerrar, botón de jugadores (con el número de jugadores) y la imagen o nombre de la categoría.
- **"Le toca a {nombre}"** muy visible sobre la carta, cuando hay jugadores. Los turnos rotan con cada carta.
- **Carta**, con tres estados:
  1. Reverso (antes de la primera carta o mientras gira).
  2. **Verdad**: encabezado con "VERDAD", texto de la pregunta.
  3. **Reto**: encabezado con "RETO", texto del reto.
- Pie de la carta: *"Si no respondes toma"* / *"Si no lo haces toma"* con 1 a 3 íconos de trago al azar.
- Tocar la carta saca una nueva al azar. Botones grandes **Verdad** y **Reto** para elegir.
- Botón **"Compartir carta"** (abre el menú de compartir del teléfono con el texto de la carta y el enlace a la tienda: Play Store en Android y App Store en iOS).
- Textos largos: prueba la carta con una de 200 caracteres sin que se corte.
- **Banner abajo.** Cada 20 cartas puede aparecer un anuncio a pantalla completa (intersticial): no hay que diseñarlo, pero sí la transición antes y después.

### 6.7 Yo nunca (nuevo)
- Selector de nivel: **Clásico, Picante, Parejas** (mismo patrón visual que las categorías).
- Carta con el texto *"Yo nunca…"* y la regla: *"Quien lo haya hecho, toma"*.
- Mismos elementos que el juego de Verdad o Reto: "Le toca leer a {nombre}", compartir, banner abajo.
- Opcional: un contador de "dedos" por jugador (variante clásica de 5 vidas).

### 6.8 ¿Quién es más probable que…? (nuevo)
- Selector de nivel (por definir, por ejemplo Clásico, Picante y Amigos).
- Carta con la pregunta (*"¿Quién es más probable que se duerma primero en la fiesta?"*).
- **Cuenta regresiva 3-2-1** antes de que todos señalen a alguien al mismo tiempo; diseña la animación.
- Regla: *"El más señalado toma"*.
- Compartir y banner abajo.

### 6.9 Herramientas
- Lista de herramientas: **Dado** y **Botella** activas; **Papa caliente** y **Charadas** como "Próximamente" (mismo tratamiento que el juego navideño).
- Banner abajo.

### 6.10 Dado
- Selector de 1 a 4 dados, dados grandes con animación de lanzamiento (ya existe), botón *"Lanzar"*.
- Banner abajo. Cada 20 tiradas puede aparecer un intersticial.

### 6.11 Botella
- Botella grande que gira al tocarla, con sonido. Texto de ayuda: *"Toca la botella para girarla"*.
- Banner abajo. Cada 20 giros puede aparecer un intersticial.

### 6.12 Permiso de seguimiento en iOS (App Tracking Transparency)
En iOS, Apple exige pedir permiso antes de usar el identificador de publicidad. El diálogo lo muestra el sistema y **solo se puede mostrar una vez**, así que conviene una **pantalla previa propia** que explique el motivo antes de lanzarlo:
- Ilustración y texto breve, por ejemplo: *"Los anuncios mantienen la app gratis. Si permites el seguimiento, verás anuncios más relevantes para ti."*
- Un solo botón *"Continuar"*, que abre el diálogo del sistema. Según las reglas de Apple, la pantalla no puede presionar ni engañar para que acepten (nada de "Permitir" falso ni de ocultar la opción de rechazar).
- Se muestra una sola vez, en el primer arranque y después del consentimiento de Google si aplica.

### 6.13 Estados y elementos transversales
- **Mensajes emergentes (toasts)**: informativo y de error, con título y subtítulo.
- **Sin conexión**: el juego funciona igual (todo el contenido está en el teléfono); solo fallan los anuncios y el desbloqueo con video.
- **Formulario de consentimiento de Google** (Europa): lo dibuja Google, no hay que diseñarlo, pero aparece sobre el splash o el inicio.
- **Pedir calificación** en la tienda tras una buena partida (futuro): lo muestran Google y Apple con su propio diálogo.

## 7. Componentes base (con variantes)

| Componente | Variantes y estados |
|---|---|
| Botón | primario, secundario, fantasma, de ícono; normal, presionado, deshabilitado, cargando |
| Tarjeta de juego (inicio) | activa, "Nuevo", deshabilitada con "Próximamente"; un color por juego |
| Tarjeta de categoría o nivel | normal, bloqueada (candado), desbloqueada con tiempo restante, con "¡Nuevas!" |
| Carta de juego | reverso, verdad, reto, yo nunca, quién es más probable; con y sin jugador; texto corto y largo |
| Etiqueta (badge) | "Nuevo", "¡Nuevas!", "Próximamente", contador de jugadores |
| Indicador de turno | "Le toca a {nombre}" |
| Fila de jugador | nombre con botón de quitar |
| Campo de texto | vacío, con foco, con texto, con error |
| Modal | genérico, desbloqueo con video y sus estados |
| Hoja inferior (bottom sheet) | para jugadores u opciones |
| Toast | informativo, error |
| Encabezado de pantalla | con cerrar o volver, título, acción a la derecha |
| Indicador de intensidad | 1 a 3 llamas |
| Íconos de trago | 1 a 3 |
| Contenedor de banner | espacio reservado de anuncio (ver sección 8) |
| Dado | caras 1 a 6 |

**Tokens:** colores (base, superficies, texto, un color por juego, Verdad, Reto, estados), tipografía (display, títulos, texto de carta, texto de interfaz, etiquetas), espaciado en múltiplos de 4, radios, sombras o brillos, duraciones de animación. Usa **Variables de Figma** para los colores y prepara los modos si se proponen variantes de color.

## 8. Publicidad: reglas para el diseño

Los anuncios son el único ingreso de la app, pero no pueden arruinar la experiencia ni violar las políticas de AdMob.

- **Banner adaptable anclado** en la parte inferior de: Categorías, Juego (de los 3 juegos), Herramientas, Dado y Botella. **No va en Inicio** ni en Jugadores.
  - Ocupa todo el ancho, con una **altura variable de 50 a 90 dp** según el teléfono. Diseña con un espacio reservado de **60 dp** y prueba también con 90 dp.
  - Va **encima del área segura inferior**: la barra de gestos de Android y el indicador de inicio de iOS. Ese margen se suma a la altura del banner.
  - **Ningún botón ni zona táctil puede quedar pegado al banner** (política de AdMob contra clics accidentales): deja al menos **16 dp** de separación y no pongas los botones Verdad/Reto justo encima de él.
  - El contenido de la pantalla tiene que verse completo con el banner presente: no lo tapes con la carta ni con los botones.
  - Si no hay anuncio (sin conexión o sin inventario), el espacio puede quedar vacío; que el diseño no se vea roto.
- **Intersticial** (pantalla completa) cada cierto número de cartas, tiradas o giros. Lo dibuja Google; solo cuida que no aparezca en mitad de una animación.
- **Video recompensado**: solo cuando el usuario lo pide, para desbloquear una categoría (sección 6.5).
- No hay anuncio al abrir la app (se descartó por invasivo).

## 9. Prototipo: flujos a conectar

1. Splash → (iOS, primer arranque) pantalla previa de seguimiento → diálogo del sistema → Inicio.
2. Inicio → Verdad o Reto → Categoría Picante → Jugadores (agregar 3 nombres) → Juego → sacar varias cartas (Verdad y Reto, con "Le toca a…") → Compartir carta → volver al inicio.
3. Inicio → Verdad o Reto → Extremo (bloqueada) → Modal de video → Juego. Variante: modal sin conexión.
4. Inicio → Yo nunca → nivel → Juego.
5. Inicio → ¿Quién es más probable que…? → nivel → cuenta regresiva → carta.
6. Inicio → Herramientas → Dado (lanzar) → volver → Botella (girar).
7. Inicio → Juego navideño (deshabilitado) → mensaje "Próximamente".

Incluye las animaciones clave: giro de la carta, transición entre cartas, cuenta regresiva y aparición de las etiquetas.

## 10. Entregables y formato

1. Página **Investigación**: capturas comentadas de las apps de referencia.
2. Página **Fundamentos**: tokens como Variables, estilos de texto y ejemplos de color.
3. Página **Componentes**: todos los de la sección 7, con propiedades y variantes (Auto Layout).
4. Página **Pantallas**: diseño base en un marco de **393×852** (iPhone 15/16), y las pantallas clave también en **360×800** (Android compacto) y **430×932** (iPhone Pro Max). Una sección por flujo. Marca las áreas seguras en cada marco.
5. Página **Prototipo**: flujos de la sección 9 conectados, con la pantalla de inicio como punto de partida.
6. **Exportables**:
   - Ilustraciones de categorías y juegos en PNG o WebP @1x/@2x/@3x.
   - **Ícono de la app:** Android (512×512 y adaptable, con capas de frente y fondo) e iOS (1024×1024 sin transparencia ni esquinas redondeadas; iOS las aplica solo). Incluye las variantes oscura y tintada de iOS si es posible.
   - **Tiendas:** gráfico de funciones de 1024×500 para la Play Store y capturas para ambas tiendas (App Store: 1320×2868 para iPhone de 6,9"; Play Store: vertical 9:16) con los textos de venta.
7. Nota breve de traspaso: decisiones de diseño, comportamientos y animaciones (duración y curva).

## 11. Fuera de alcance por ahora

- El diseño definitivo del juego navideño (solo el botón deshabilitado).
- Papa caliente y Charadas (solo su lugar como "Próximamente" en Herramientas).
- Cartas personalizadas creadas por el grupo y recordatorios con notificaciones (ideas para más adelante).
- Compras dentro de la app o suscripciones.
- Versión para tablet o iPad y modo horizontal.

## 12. Referencias

- [Picolo en la App Store](https://apps.apple.com/app/id1001473964) y [teardown de su diseño en ScreensDesign](https://screensdesign.com/showcase/picolo-party-game)
- [TOZ - Party games](https://apps.apple.com/app/id1476978964)
- [Truth Or Dare : Party Game](https://apps.apple.com/us/app/-/id1225189596)
- [Exposed - Never Have I Ever](https://apps.apple.com/app/id1474787177)
- [Truth or Dare Spicy Party Game](https://apps.apple.com/app/id6746348883)
- [Truth or Dare - T and D (incluye "Who is most likely to")](https://apps.apple.com/app/id1445141782)
- [Reseña de apps de juegos para beber (críticas de precio y repetición)](https://alittlebithuman.com/13-best-drinking-game-apps-for-your-phone-free-and-paid/)
