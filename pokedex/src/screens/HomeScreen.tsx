import { useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PokedexStackParamList } from "../../App";
import { usePokemonList } from "../hooks/usePokemonList";
import { useTypeFilter } from "../hooks/useTypeFilter";
import { PokemonCard } from "../components/PokemonCard";
import type { PokemonSummary } from "../types/pokemon";
import { SearchIcon, AlertIcon, EmptyIcon } from "../components/Icons";
import { TYPE_COLORS } from "../constants/typeColors";

type Props = NativeStackScreenProps<PokedexStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);

  const {
    pokemon: baseList,
    loading: listLoading,
    error: listError,
  } = usePokemonList(40);
  const { filteredList, types, loadingTypes, loadingFilter, filterError } =
    useTypeFilter(baseList, activeType);

  // Búsqueda sobre la lista activa (base o filtrada por tipo)
  const visibleList = useMemo(() => {
    if (!search.trim()) return filteredList;
    const q = search.trim().toLowerCase();
    return filteredList.filter((p) => p.name.includes(q));
  }, [filteredList, search]);

  const handleTypePress = useCallback((type: string) => {
    setSearch("");
    setActiveType((prev) => (prev === type ? null : type));
  }, []);

  if (listLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E3350D" />
        <Text style={styles.message}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (listError || filterError) {
    return (
      <View style={styles.centered}>
        <AlertIcon />
        <Text style={styles.message}>{listError ?? filterError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre…"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Tipos */}
      <View style={styles.typesContainer}>
        {loadingTypes ? null : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesRow}
          >
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  { backgroundColor: TYPE_COLORS[type] ?? "#A8A878" },
                  activeType === type ? styles.chipActive : styles.chipInactive,
                ]}
                onPress={() => handleTypePress(type)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Área de contenido: loader, sin resultados o lista */}
      <View style={styles.content}>
        {loadingFilter ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#E3350D" />
            <Text style={styles.message}>Filtrando por {activeType}…</Text>
          </View>
        ) : visibleList.length === 0 ? (
          // Sin resultados
          <View style={styles.centered}>
            <EmptyIcon />
            <Text style={styles.message}>No se encontraron Pokémon.</Text>
          </View>
        ) : (
          <FlatList
            data={visibleList}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            renderItem={({ item }: { item: PokemonSummary }) => (
              <PokemonCard
                pokemon={item}
                onPress={() =>
                  navigation.navigate("PokemonDetail", { id: item.id })
                }
              />
            )}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1f2937",
  },
  typesContainer: {
    height: 52,
    justifyContent: "center",
  },
  typesRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: "center",
  },
  chipActive: {
    opacity: 1,
  },
  chipInactive: {
    opacity: 0.6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
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
});
