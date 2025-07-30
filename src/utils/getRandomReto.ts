import { Reto } from "../types";

const data: Record<string, Reto[]> = {
  clasico: require("../data/retos/clasico.json"),
  picante: require("../data/retos/picante.json"),
  parejas: require("../data/retos/parejas.json"),
  amigos: require("../data/retos/amigos.json"),
  "clasico-verdad": require("../data/retos/clasico-verdad.json"),
  "clasico-reto": require("../data/retos/clasico-reto.json"),
  "picante-verdad": require("../data/retos/picante-verdad.json"),
  "picante-reto": require("../data/retos/picante-reto.json"),
  "parejas-verdad": require("../data/retos/parejas-verdad.json"),
  "parejas-reto": require("../data/retos/parejas-reto.json"),
  "amigos-verdad": require("../data/retos/amigos-verdad.json"),
  "amigos-reto": require("../data/retos/amigos-reto.json"),
};

const usadosPorCategoria: Record<string, Set<number>> = {};

export function getRandomReto(categoria: string, type: string): Reto {
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

  return retos[index];
}
