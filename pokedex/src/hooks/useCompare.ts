import { useState } from "react";
import type { Pokemon } from "../types/pokemon";
import { searchPokemon } from "../services/pokemonService";

interface SlotState {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
}

const EMPTY_SLOT: SlotState = { pokemon: null, loading: false, error: null };

interface UseCompareResult {
  slotA: SlotState;
  slotB: SlotState;
  loadSlot: (slot: "A" | "B", query: string) => Promise<void>;
  clearSlot: (slot: "A" | "B") => void;
}

export function useCompare(): UseCompareResult {
  const [slotA, setSlotA] = useState<SlotState>(EMPTY_SLOT);
  const [slotB, setSlotB] = useState<SlotState>(EMPTY_SLOT);

  const setSlot = (slot: "A" | "B") => (slot === "A" ? setSlotA : setSlotB);

  async function loadSlot(slot: "A" | "B", query: string): Promise<void> {
    const set = setSlot(slot);
    set({ pokemon: null, loading: true, error: null });
    try {
      const data = await searchPokemon(query);
      set({ pokemon: data, loading: false, error: null });
    } catch {
      set({ pokemon: null, loading: false, error: "Pokémon no encontrado." });
    }
  }

  function clearSlot(slot: "A" | "B") {
    setSlot(slot)(EMPTY_SLOT);
  }

  return { slotA, slotB, loadSlot, clearSlot };
}
