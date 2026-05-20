import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { PokemonCard } from "../components/PokemonCard";
import { EmptyIcon, AlertIcon } from "../components/Icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FavoritesStackParamList } from "../../App";
import type { PokemonSummary } from "../types/pokemon";

type Props = NativeStackScreenProps<FavoritesStackParamList, "Favorites">;

export default function FavoritesScreen({ navigation }: Props) {
  const { favorites, loading } = useFavorites();

  if (loading) return null;

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyIcon />
        <Text style={styles.message}>No tienes favoritos aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      renderItem={({ item }: { item: PokemonSummary }) => (
        <PokemonCard
          pokemon={item}
          onPress={() => navigation.navigate("PokemonDetail", { id: item.id })}
        />
      )}
      contentContainerStyle={styles.list}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  list: {
    padding: 6,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
  },
});
