/** Quién le regala a quién. */
export interface Assignment {
  giver: string;
  receiver: string;
}

/** `[quien da, a quien no puede darle]`. */
export type Exclusion = [string, string];

export const MIN_PARTICIPANTS = 3;
export const MAX_PARTICIPANTS = 20;

/** Intentos de un solo ciclo antes de pasar a la búsqueda completa. */
const CYCLE_ATTEMPTS = 200;
/** Pasos máximos de la búsqueda aleatoria; si se agota se usa un emparejamiento válido. */
const SEARCH_BUDGET = 50_000;

const pairKey = (giver: string, receiver: string) => `${giver}\u0000${receiver}`;

/** Fisher–Yates sobre una copia. */
function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Emparejamiento completo (cada quien da y recibe una vez) con el algoritmo de Kuhn; null si no existe. */
function findMatching(n: number, allowed: boolean[][]): number[] | null {
  const giverOf: number[] = new Array(n).fill(-1);

  const tryAssign = (giver: number, visited: boolean[]): boolean => {
    for (let receiver = 0; receiver < n; receiver++) {
      if (!allowed[giver][receiver] || visited[receiver]) continue;
      visited[receiver] = true;
      if (giverOf[receiver] === -1 || tryAssign(giverOf[receiver], visited)) {
        giverOf[receiver] = giver;
        return true;
      }
    }
    return false;
  };

  for (let giver = 0; giver < n; giver++) {
    if (!tryAssign(giver, new Array(n).fill(false))) return null;
  }

  const receiverOf: number[] = new Array(n).fill(-1);
  giverOf.forEach((giver, receiver) => (receiverOf[giver] = receiver));
  return receiverOf;
}

/** Búsqueda aleatoria con retroceso; null si se agota el presupuesto. */
function randomSearch(n: number, allowed: boolean[][], random: () => number): number[] | null {
  const receiverOf: number[] = new Array(n).fill(-1);
  const taken: boolean[] = new Array(n).fill(false);
  const order = shuffled(
    Array.from({ length: n }, (_, i) => i),
    random
  );
  let steps = 0;

  const place = (position: number): boolean => {
    if (position === n) return true;
    const giver = order[position];
    const candidates = shuffled(
      Array.from({ length: n }, (_, i) => i).filter((r) => allowed[giver][r] && !taken[r]),
      random
    );
    for (const receiver of candidates) {
      if (++steps > SEARCH_BUDGET) return false;
      receiverOf[giver] = receiver;
      taken[receiver] = true;
      if (place(position + 1)) return true;
      taken[receiver] = false;
    }
    return false;
  };

  return place(0) ? receiverOf : null;
}

/**
 * Sortea el amigo secreto. Cada persona le regala a una y recibe de una, nadie se
 * saca a sí mismo y se respetan las exclusiones. Prefiere un solo ciclo grande
 * (sin parejas que se regalan entre sí); si las exclusiones lo impiden, busca
 * cualquier asignación válida. Devuelve null si no existe ninguna.
 */
export function drawSecretSanta(
  names: string[],
  exclusions: Exclusion[] = [],
  random: () => number = Math.random
): Assignment[] | null {
  const n = names.length;
  if (n < MIN_PARTICIPANTS || new Set(names).size !== n) return null;

  const blocked = new Set(exclusions.map(([giver, receiver]) => pairKey(giver, receiver)));
  const isAllowed = (giver: string, receiver: string) =>
    giver !== receiver && !blocked.has(pairKey(giver, receiver));

  for (let attempt = 0; attempt < CYCLE_ATTEMPTS; attempt++) {
    const order = shuffled(names, random);
    const valid = order.every((giver, i) => isAllowed(giver, order[(i + 1) % n]));
    if (valid) return order.map((giver, i) => ({ giver, receiver: order[(i + 1) % n] }));
  }

  const allowed = names.map((giver) => names.map((receiver) => isAllowed(giver, receiver)));
  const guaranteed = findMatching(n, allowed);
  if (!guaranteed) return null;

  const receiverOf = randomSearch(n, allowed, random) ?? guaranteed;
  return names.map((giver, i) => ({ giver, receiver: names[receiverOf[i]] }));
}
