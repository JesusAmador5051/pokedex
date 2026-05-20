import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PokemonSummary } from "../types/pokemon";

const FAVORITES_KEY = "pokedex:favorites";

export async function getFavorites(): Promise<PokemonSummary[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as PokemonSummary[]) : [];
}

export async function addFavorite(pokemon: PokemonSummary): Promise<void> {
  const current = await getFavorites();
  const alreadyExists = current.some((p) => p.id === pokemon.id);
  if (alreadyExists) return;
  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify([...current, pokemon]),
  );
}

export async function removeFavorite(id: number): Promise<void> {
  const current = await getFavorites();
  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(current.filter((p) => p.id !== id)),
  );
}
