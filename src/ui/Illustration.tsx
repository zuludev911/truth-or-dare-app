import { memo, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

import { colors } from "../theme";

const INK = colors.base;

// Vectores del prototipo (docs/prototipo/index.html, objeto ILL). viewBox 0 0 120 120.
const SHAPES: Record<string, ReactNode> = {
  vor: (
    <>
      <Path d="M34 70C22 54 32 42 38 26C46 40 60 44 56 62C54 74 44 80 34 70Z" fill="#FFC83D" />
      <Path d="M40 66C34 58 40 50 42 42C46 50 52 54 50 62C49 68 45 70 40 66Z" fill="#FFF1B0" stroke="none" />
      <Path d="M62 34C84 28 100 42 94 66C88 92 58 110 24 102C16 100 18 92 26 90C46 82 54 66 54 50C54 42 56 36 62 34Z" fill="#FF3B3B" />
      <Path d="M66 46C80 44 88 52 85 64" stroke="#fff" strokeOpacity={0.75} strokeWidth={5} />
      <Path d="M66 32C66 20 78 12 92 16C86 18 82 24 82 32C78 36 70 36 66 32Z" fill="#3DDC84" />
    </>
  ),
  yn: (
    <>
      <Path d="M30 24H90L82 100Q81 108 72 108H48Q39 108 38 100Z" fill="#fff" fillOpacity={0.9} />
      <Path d="M34 52H86L82 98Q81 103 73 103H47Q39 103 38 98Z" fill="#FFC83D" />
      <Path d="M44 34L48 92" stroke="#fff" strokeOpacity={0.8} strokeWidth={5} />
      <Circle cx={64} cy={70} r={4} fill="#FFF1B0" strokeWidth={2.5} />
      <Circle cx={74} cy={84} r={3} fill="#FFF1B0" strokeWidth={2.5} />
      <Path d="M96 16l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" strokeWidth={2.5} />
    </>
  ),
  qmp: (
    <>
      <Circle cx={30} cy={98} r={12} fill="#FF2E88" />
      <Path d="M12 120C12 108 20 108 30 108C40 108 48 108 48 120" fill="#FF2E88" />
      <Circle cx={90} cy={98} r={12} fill="#2DE2C6" />
      <Path d="M72 120C72 108 80 108 90 108C100 108 108 108 108 120" fill="#2DE2C6" />
      <Path d="M26 10H94Q108 10 108 24V58Q108 72 94 72H70L58 86L52 72H26Q12 72 12 58V24Q12 10 26 10Z" fill="#fff" />
      <Path d="M46 32C46 20 74 20 74 32C74 42 60 42 60 52" strokeWidth={7} />
      <Circle cx={60} cy={62} r={4.5} fill={INK} />
    </>
  ),
  her: (
    <>
      <G rotation={16} origin="82, 82">
        <Rect x={58} y={58} width={46} height={46} rx={12} fill="#FF2E88" />
        <Circle cx={72} cy={72} r={4.5} fill="#fff" stroke="none" />
        <Circle cx={90} cy={90} r={4.5} fill="#fff" stroke="none" />
      </G>
      <G rotation={-10} origin="44, 44">
        <Rect x={12} y={12} width={64} height={64} rx={16} fill="#fff" />
        {[[30, 30], [58, 30], [44, 44], [30, 58], [58, 58]].map(([cx, cy]) => (
          <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5.5} fill={INK} stroke="none" />
        ))}
      </G>
    </>
  ),
  nav: (
    <>
      <Rect x={52} y={86} width={16} height={20} rx={3} fill="#B7791F" />
      <Path d="M60 14L88 50H72L98 86H22L48 50H32Z" fill="#3DDC84" />
      <Circle cx={50} cy={72} r={5} fill="#FF3B3B" strokeWidth={3} />
      <Circle cx={72} cy={66} r={5} fill="#FFC83D" strokeWidth={3} />
      <Circle cx={60} cy={44} r={4.5} fill="#FF3B3B" strokeWidth={3} />
      <Path d="M60 2l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FFC83D" strokeWidth={3} />
    </>
  ),
  clasico: (
    <>
      <Path d="M14 18H70Q80 18 80 28V54Q80 64 70 64H44L30 78V64H24Q14 64 14 54V28Q14 18 14 18Z" fill="#fff" />
      <Path d="M52 52H98Q108 52 108 62V84Q108 94 98 94H92V106L78 94H62Q52 94 52 84V62Q52 52 52 52Z" fill="#2DE2C6" />
      <Path d="M34 32C34 24 52 24 52 32C52 38 44 38 44 44" strokeWidth={5} />
      <Circle cx={44} cy={53} r={3} fill={INK} />
    </>
  ),
  extremo: (
    <>
      <Path d="M60 8C70 28 98 40 98 72C98 98 80 112 60 112C40 112 22 98 22 72C22 56 30 48 34 36C42 46 46 52 52 50C58 42 56 24 60 8Z" fill="#FF8A1F" />
      <Path d="M60 46C66 60 82 66 82 84C82 98 72 106 60 106C48 106 38 98 38 84C38 74 46 68 50 60C54 66 58 66 60 62Z" fill="#FFC83D" />
      <Path d="M60 78C64 86 70 88 70 96C70 102 66 106 60 106C54 106 50 102 50 96C50 90 56 88 60 78Z" fill="#FFF1B0" strokeWidth={3} />
    </>
  ),
  parejas: (
    <>
      <Path d="M44 100C16 78 8 62 8 46C8 32 18 24 30 24C38 24 42 28 44 34C46 28 52 24 60 24C72 24 80 32 80 46C80 62 72 78 44 100Z" fill="#FF3B3B" />
      <Path d="M78 108C52 90 46 78 46 66C46 56 54 50 62 50C68 50 72 53 78 58C84 53 88 50 94 50C102 50 110 56 110 66C110 78 104 90 78 108Z" fill="#FF2E88" />
      <Path d="M22 42C22 36 28 34 32 36" stroke="#fff" strokeOpacity={0.8} strokeWidth={5} />
    </>
  ),
  amigos: (
    <>
      <G rotation={-14} origin="38, 66">
        <Path d="M16 36H62V92Q62 102 52 102H26Q16 102 16 92Z" fill="#FFC83D" />
        <Path d="M16 36H62V50H16Z" fill="#fff" />
      </G>
      <G rotation={14} origin="82, 66">
        <Path d="M62 36H108V92Q108 102 98 102H72Q62 102 62 92Z" fill="#FFC83D" />
        <Path d="M62 36H108V50H62Z" fill="#fff" />
      </G>
      <Path d="M60 10l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff" strokeWidth={2.5} />
    </>
  ),
  chicas: (
    <>
      <Path d="M8 62C24 38 46 40 60 52C74 40 96 38 112 62C96 94 76 102 60 102C44 102 24 94 8 62Z" fill="#FF2E88" />
      <Path d="M8 62C30 70 90 70 112 62" />
      <Path d="M34 52C42 48 50 50 54 54" stroke="#fff" strokeOpacity={0.8} strokeWidth={5} />
      <Path d="M96 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff" strokeWidth={2.5} />
    </>
  ),
};

export type IllustrationName = keyof typeof SHAPES;

interface Props {
  name: IllustrationName;
  size: number;
  /** Rotación en grados, como en las tarjetas del inicio. */
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}

function Illustration({ name, size, rotate = 0, style }: Props) {
  return (
    <View style={[{ width: size, height: size }, rotate ? { transform: [{ rotate: `${rotate}deg` }] } : null, style]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
          {SHAPES[name]}
        </G>
      </Svg>
    </View>
  );
}

export default memo(Illustration);

/** Destello de 4 puntas que decora las cartas. */
export const Spark = memo(({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20">
    <Path d="M10 0C11 6 14 9 20 10C14 11 11 14 10 20C9 14 6 11 0 10C6 9 9 6 10 0Z" fill="#fff" />
  </Svg>
));

/** Candado de las categorías bloqueadas. */
export const LockIcon = memo(({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={(size * 28) / 24} viewBox="0 0 24 28" fill="none">
    <Path d="M6 12V8a6 6 0 0 1 12 0v4" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
    <Rect x={2} y={12} width={20} height={14} rx={4} fill="#fff" />
    <Circle cx={12} cy={19} r={2.5} fill={INK} />
  </Svg>
));

/** Intensidad de una categoría: 1 a 3 llamas. */
export const Flames = memo(({ level }: { level: number }) => (
  <View style={{ flexDirection: "row", gap: 4, height: 24 }}>
    {[1, 2, 3].map((i) => (
      <Svg key={i} width={20} height={24} viewBox="0 0 20 24">
        <Path
          d="M10 1C11 7 18 10 18 16C18 21 14 23 10 23C6 23 2 21 2 16C2 12 5 10 6 6C8 8 8 10 9 10C10 8 10 5 10 1Z"
          fill={i <= level ? "#fff" : "rgba(19,10,46,.3)"}
        />
      </Svg>
    ))}
  </View>
));

/** Botella de la herramienta (viewBox 120×300; el ancho es 0,4 del alto). */
export const BottleIllustration = memo(({ height }: { height: number }) => (
  <Svg width={(height * 120) / 300} height={height} viewBox="0 0 120 300">
    <G fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <Path d="M48 8H72V70C72 90 100 100 100 130V272Q100 292 80 292H40Q20 292 20 272V130C20 100 48 90 48 70Z" fill="#3DDC84" />
      <Path d="M48 8H72V30H48Z" fill="#2DE2C6" />
      <Rect x={26} y={150} width={68} height={70} fill="#fff" fillOpacity={0.9} stroke="none" />
      <Path d="M34 120V260" stroke="#fff" strokeOpacity={0.5} strokeWidth={6} strokeLinecap="round" />
    </G>
  </Svg>
));
