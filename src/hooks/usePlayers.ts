import { useCallback, useEffect, useState } from "react";

import { loadPlayers, savePlayers } from "../services/players";

/** Nombres de los jugadores, guardados en el teléfono para la próxima partida. */
export function usePlayers() {
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    loadPlayers().then(setPlayers);
  }, []);

  const updatePlayers = useCallback((next: string[]) => {
    setPlayers(next);
    savePlayers(next);
  }, []);

  return [players, updatePlayers] as const;
}
