import { Reto } from "../types";

const data: Record<string, Reto[]> = {
  clasico: require("../data/retos/clasico.json"),
  picante: require("../data/retos/picante.json"),
  parejas: require("../data/retos/parejas.json"),
  amigos: require("../data/retos/amigos.json"),
};

export function getRandomReto(categoria: string): Reto {
  const retos = data[categoria] || data["clasico"];
  const index = Math.floor(Math.random() * retos.length);
  return retos[index];
}
