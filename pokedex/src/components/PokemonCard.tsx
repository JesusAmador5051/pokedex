import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { PokemonSummary } from "../types/pokemon";
import { TYPE_COLORS } from "../constants/typeColors";

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
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  number: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: "rgba(0,0,0,0.25)",
    fontWeight: "700",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 6,
  },
  typesRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
    marginBottom: 2,
  },
  typeBadge: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
