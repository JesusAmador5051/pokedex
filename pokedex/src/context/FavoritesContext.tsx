import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { PokemonSummary } from "../types/pokemon";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../storage/favoritesStorage";

interface FavoritesContextValue {
  favorites: PokemonSummary[];
  loading: boolean;
  toggleFavorite: (pokemon: PokemonSummary) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites().then((data) => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const toggleFavorite = useCallback(
    async (pokemon: PokemonSummary) => {
      const isFav = favorites.some((p) => p.id === pokemon.id);
      if (isFav) {
        await removeFavorite(pokemon.id);
        setFavorites((prev) => prev.filter((p) => p.id !== pokemon.id));
      } else {
        await addFavorite(pokemon);
        setFavorites((prev) => [...prev, pokemon]);
      }
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((p) => p.id === id),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
