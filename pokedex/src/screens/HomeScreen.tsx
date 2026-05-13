import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { usePokemonList } from "../hooks/usePokemonList";
import { PokemonCard } from "../components/PokemonCard";
import type { PokemonSummary } from "../types/pokemon";

export default function HomeScreen() {
  const { pokemon, loading, error } = usePokemonList(40);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E3350D" />
        <Text style={styles.message}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  if (pokemon.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No se encontraron Pokémon.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }: { item: PokemonSummary }) => (
          <PokemonCard pokemon={item} onPress={() => {}} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
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
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
  },
  errorIcon: {
    fontSize: 32,
  },
});
