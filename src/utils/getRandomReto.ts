import { Reto } from "../types";

const data: Record<string, Reto[]> = {
  clasico: require("../data/retos/clasico.json"),
  picante: require("../data/retos/picante.json"),
  parejas: require("../data/retos/parejas.json"),
  amigos: require("../data/retos/amigos.json"),
};

const usadosPorCategoria: Record<string, Set<number>> = {};

export function getRandomReto(categoria: string): Reto {
  const retos = data[categoria] || data["clasico"];
  const usados = usadosPorCategoria[categoria] ?? new Set<number>();

  if (usados.size >= retos.length) {
    usados.clear();
  }

  let index;
  do {
    index = Math.floor(Math.random() * retos.length);
  } while (usados.has(index));

  usados.add(index);
  usadosPorCategoria[categoria] = usados;

  return retos[index];
}
