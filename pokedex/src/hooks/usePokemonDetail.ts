import { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import { getPokemonDetail } from "../services/pokemonService";

interface UsePokemonDetailResult {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
}

export function usePokemonDetail(
  idOrName: number | string,
): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setPokemon(null);

    getPokemonDetail(idOrName)
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el Pokémon.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [idOrName]);

  return { pokemon, loading, error };
}
