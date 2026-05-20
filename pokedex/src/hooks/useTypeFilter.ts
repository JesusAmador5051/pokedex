import { useState, useEffect } from "react";
import type { PokemonSummary } from "../types/pokemon";
import { getTypes, getPokemonByType } from "../services/pokemonService";

export function useTypeFilter(
  baseList: PokemonSummary[],
  activeType: string | null,
) {
  const [types, setTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [filteredList, setFilteredList] = useState<PokemonSummary[]>(baseList);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // Carga el catálogo de tipos una sola vez
  useEffect(() => {
    let cancelled = false;
    getTypes()
      .then((data) => {
        if (!cancelled) setTypes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingTypes(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sincroniza filteredList con baseList cuando no hay tipo activo
  useEffect(() => {
    if (!activeType) setFilteredList(baseList);
  }, [baseList, activeType]);

  // Carga la lista filtrada cuando cambia el tipo activo
  useEffect(() => {
    if (!activeType) return;

    let cancelled = false;
    setLoadingFilter(true);
    setFilterError(null);

    getPokemonByType(activeType)
      .then((data) => {
        if (!cancelled) setFilteredList(data);
      })
      .catch(() => {
        if (!cancelled) setFilterError(`No se pudo filtrar por ${activeType}.`);
      })
      .finally(() => {
        if (!cancelled) setLoadingFilter(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeType]);

  return { filteredList, types, loadingTypes, loadingFilter, filterError };
}
