import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { PokemonSummary } from "../types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
  normal: "#A8A878",
};

interface PokemonCardProps {
  pokemon: PokemonSummary;
  onPress: (pokemon: PokemonSummary) => void;
}

export function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const primaryType = pokemon.types[0];
  const cardColor = TYPE_COLORS[primaryType] ?? "#A8A878";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.85}
    >
      <Text style={styles.number}>#{String(pokemon.id).padStart(3, "0")}</Text>
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{pokemon.name}</Text>
      <View style={styles.typesRow}>
        {pokemon.types.map((type) => (
          <View key={type} style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  number: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "600",
  },
  image: {
    width: 90,
    height: 90,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 4,
  },
  typesRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
