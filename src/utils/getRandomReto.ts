import { Reto } from "../types";

const data: Record<string, Reto[]> = {
  "clasico-verdad": require("../data/retos/clasico-verdad.json"),
  "clasico-reto": require("../data/retos/clasico-reto.json"),
  "picante-verdad": require("../data/retos/picante-verdad.json"),
  "picante-reto": require("../data/retos/picante-reto.json"),
  "parejas-verdad": require("../data/retos/parejas-verdad.json"),
  "parejas-reto": require("../data/retos/parejas-reto.json"),
  "amigos-verdad": require("../data/retos/amigos-verdad.json"),
  "amigos-reto": require("../data/retos/amigos-reto.json"),
  "chicas-verdad": require("../data/retos/chicas-verdad.json"),
  "chicas-reto": require("../data/retos/chicas-reto.json"),
  "extremo-verdad": require("../data/retos/extremo-verdad.json"),
  "extremo-reto": require("../data/retos/extremo-reto.json"),
  "navidad-verdad": require("../data/retos/navidad-verdad.json"),
  "navidad-reto": require("../data/retos/navidad-reto.json"),
};

const usadosPorCategoria: Record<string, Set<number>> = {};

export function getRandomReto(
  categoria: string,
  type: "verdad" | "reto"
): Reto {
  const retos = data[`${categoria}-${type}`] || data["clasico-verdad"];
  const usados =
    usadosPorCategoria[`${categoria}-${type}`] ?? new Set<number>();

  if (usados.size >= retos.length) {
    usados.clear();
  }

  let index;
  do {
    index = Math.floor(Math.random() * retos.length);
  } while (usados.has(index));

  usados.add(index);
  usadosPorCategoria[`${categoria}-${type}`] = usados;

  return { ...retos[index], type };
}
