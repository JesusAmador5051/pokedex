import { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import type { Pokemon } from "../types/pokemon";
import { searchPokemon } from "../services/pokemonService";
import { TYPE_COLORS } from "../constants/typeColors";
import { SearchIcon } from "./Icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (pokemon: Pokemon) => void;
  title: string;
}

export function PokemonPickerModal({
  visible,
  onClose,
  onSelect,
  title,
}: Props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpia el estado al cerrar
  useEffect(() => {
    if (!visible) {
      setQuery("");
      setResult(null);
      setError(null);
    }
  }, [visible]);

  // Busca con debounce mientras el usuario escribe
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResult(null);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const data = await searchPokemon(trimmed);
        setResult(data);
      } catch {
        setError("No encontrado. Intenta con otro nombre o número.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSelect() {
    if (!result) return;
    onSelect(result);
    onClose();
  }

  const primaryType = result?.types[0]?.type.name ?? "normal";
  const cardColor = TYPE_COLORS[primaryType] ?? "#A8A878";
  const imageUrl =
    result?.sprites.other["official-artwork"].front_default ??
    result?.sprites.front_default ??
    "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header del modal */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Input de búsqueda */}
        <View style={styles.searchRow}>
          <SearchIcon />
          <TextInput
            style={styles.input}
            placeholder="Nombre o número (ej: pikachu, 25)"
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>

        {/* Estados */}
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#E3350D" />
          </View>
        )}

        {error && !loading && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Resultado encontrado */}
        {result && !loading && (
          <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: cardColor }]}
            onPress={handleSelect}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.resultImage}
              resizeMode="contain"
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultNumber}>
                #{String(result.id).padStart(3, "0")}
              </Text>
              <Text style={styles.resultName}>{result.name}</Text>
              <View style={styles.typesRow}>
                {result.types.map((t) => (
                  <View key={t.slot} style={styles.typeBadge}>
                    <Text style={styles.typeText}>{t.type.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.selectHint}>Toca para elegir</Text>
          </TouchableOpacity>
        )}

        {/* Hint inicial */}
        {!query && !loading && (
          <View style={styles.centered}>
            <Text style={styles.hintText}>
              Escribe el nombre o número de un Pokémon
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 15,
    color: "#E3350D",
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  hintText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  resultCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  resultImage: {
    width: 90,
    height: 90,
  },
  resultInfo: {
    flex: 1,
  },
  resultNumber: {
    fontSize: 12,
    color: "rgba(0,0,0,0.3)",
    fontWeight: "700",
  },
  resultName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 2,
  },
  typesRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  selectHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    alignSelf: "flex-end",
  },
});
