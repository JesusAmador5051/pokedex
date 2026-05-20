import { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PokedexStackParamList } from "../../App";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { useFavorites } from "../context/FavoritesContext";
import { TYPE_COLORS } from "../constants/typeColors";
import { HeartIcon, HeartOutlineIcon, AlertIcon } from "../components/Icons";

// Nombres legibles para cada stat
const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

const MAX_STAT = 255;

type Props = NativeStackScreenProps<PokedexStackParamList, "PokemonDetail">;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { pokemon, loading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Inyecta el botón de favorito en el header de navegación una vez que el pokémon carga
  useEffect(() => {
    if (!pokemon) return;

    const summary = {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl:
        pokemon.sprites.other["official-artwork"].front_default ??
        pokemon.sprites.front_default ??
        "",
      types: pokemon.types.map((t) => t.type.name),
    };

    const fav = isFavorite(pokemon.id);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => toggleFavorite(summary)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {fav ? <HeartIcon /> : <HeartOutlineIcon />}
        </TouchableOpacity>
      ),
    });
  }, [pokemon, isFavorite, toggleFavorite, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E3350D" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <AlertIcon />
        <Text style={styles.errorText}>{error ?? "Error desconocido"}</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const headerColor = TYPE_COLORS[primaryType] ?? "#A8A878";
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ??
    pokemon.sprites.front_default ??
    "";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header con color de tipo */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.name}>{pokemon.name}</Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <View key={t.slot} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Medidas */}
      <View style={styles.row}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>
            {(pokemon.height / 10).toFixed(1)} m
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>
            {(pokemon.weight / 10).toFixed(1)} kg
          </Text>
        </View>
      </View>

      {/* Habilidades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.row}>
          {pokemon.abilities.map((a) => (
            <View key={a.slot} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>
                {a.ability.name}
                {a.is_hidden ? " ✦" : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas base</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statLabel}>
              {STAT_LABELS[s.stat.name] ?? s.stat.name}
            </Text>
            <Text style={styles.statValue}>{s.base_stat}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(s.base_stat / MAX_STAT) * 100}%`,
                    backgroundColor: headerColor,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#6b7280",
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  number: {
    alignSelf: "flex-end",
    fontSize: 13,
    color: "rgba(0,0,0,0.35)",
    fontWeight: "600",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 4,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  abilityBadge: {
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  abilityText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  statLabel: {
    width: 56,
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
  },
  statValue: {
    width: 30,
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "right",
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
