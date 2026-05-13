import { useEffect, useState } from "react";
import { getPokemonList } from "../services/pokemonService";
import type { PokemonSummary } from "../types/pokemon";

interface UsePokemonListState {
  pokemon: PokemonSummary[];
  loading: boolean;
  error: string | null;
}

export function usePokemonList(limit = 40) {
  const [state, setState] = useState<UsePokemonListState>({
    pokemon: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPokemon() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await getPokemonList(limit);
        if (!cancelled)
          setState({ pokemon: data, loading: false, error: null });
      } catch {
        if (!cancelled)
          setState({
            pokemon: [],
            loading: false,
            error: "No se pudo cargar la lista de Pokémon.",
          });
      }
    }

    fetchPokemon();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
