import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useCompare } from "../hooks/useCompare";
import { PokemonPickerModal } from "../components/PokemonPickerModal";
import { TYPE_COLORS } from "../constants/typeColors";
import type { Pokemon } from "../types/pokemon";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

const MAX_STAT = 255;

// Colores para indicar cuál Pokémon gana cada stat
const WIN_COLOR = "rgba(0,0,0,0.18)";
const LOSE_COLOR = "rgba(0,0,0,0.07)";

type ActiveSlot = "A" | "B" | null;

export default function CompareScreen() {
  const { slotA, slotB, loadSlot, clearSlot } = useCompare();
  const [modalSlot, setModalSlot] = useState<ActiveSlot>(null);

  function handleSelect(pokemon: Pokemon) {
    if (!modalSlot) return;
    loadSlot(modalSlot, String(pokemon.id));
  }

  function openModal(slot: "A" | "B") {
    setModalSlot(slot);
  }

  function closeModal() {
    setModalSlot(null);
  }

  const bothLoaded = slotA.pokemon !== null && slotB.pokemon !== null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageSubtitle}>
        Elige dos Pokémon para comparar sus estadísticas base
      </Text>

      {/* Slots de selección */}
      <View style={styles.slotsRow}>
        <PokemonSlot
          label="Pokémon A"
          slot={slotA}
          accentColor="#3b82f6"
          onPick={() => openModal("A")}
          onClear={() => clearSlot("A")}
        />
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <PokemonSlot
          label="Pokémon B"
          slot={slotB}
          accentColor="#E3350D"
          onPick={() => openModal("B")}
          onClear={() => clearSlot("B")}
        />
      </View>

      {/* Tabla de stats */}
      {bothLoaded && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas base</Text>
          {slotA.pokemon!.stats.map((statSlot, index) => {
            const statName = statSlot.stat.name;
            const valA = statSlot.base_stat;
            const valB = slotB.pokemon!.stats[index]?.base_stat ?? 0;
            const label = STAT_LABELS[statName] ?? statName;
            return (
              <StatCompareRow
                key={statName}
                label={label}
                valA={valA}
                valB={valB}
                colorA="#3b82f6"
                colorB="#E3350D"
              />
            );
          })}

          {/* Total */}
          <TotalRow
            totalA={slotA.pokemon!.stats.reduce((s, x) => s + x.base_stat, 0)}
            totalB={slotB.pokemon!.stats.reduce((s, x) => s + x.base_stat, 0)}
          />
        </View>
      )}

      {/* Modal de búsqueda */}
      <PokemonPickerModal
        visible={modalSlot !== null}
        title={modalSlot === "A" ? "Elegir Pokémon A" : "Elegir Pokémon B"}
        onClose={closeModal}
        onSelect={handleSelect}
      />
    </ScrollView>
  );
}

// Slot de un Pokémon (vacío o con datos)
interface SlotProps {
  label: string;
  slot: { pokemon: Pokemon | null; loading: boolean; error: string | null };
  accentColor: string;
  onPick: () => void;
  onClear: () => void;
}

function PokemonSlot({ label, slot, accentColor, onPick, onClear }: SlotProps) {
  const { pokemon, loading, error } = slot;

  const primaryType = pokemon?.types[0]?.type.name ?? null;
  const cardColor = primaryType
    ? (TYPE_COLORS[primaryType] ?? "#A8A878")
    : null;
  const imageUrl =
    pokemon?.sprites.other["official-artwork"].front_default ??
    pokemon?.sprites.front_default ??
    "";

  if (loading) {
    return (
      <View style={[styles.slot, styles.slotEmpty]}>
        <ActivityIndicator color={accentColor} />
      </View>
    );
  }

  if (pokemon && cardColor) {
    return (
      <View style={[styles.slot, { backgroundColor: cardColor }]}>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: imageUrl }}
          style={styles.slotImage}
          resizeMode="contain"
        />
        <Text style={styles.slotNumber}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.slotName}>{pokemon.name}</Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <View key={t.slot} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.slot, styles.slotEmpty, { borderColor: accentColor }]}
      onPress={onPick}
      activeOpacity={0.75}
    >
      <Text style={[styles.slotLabel, { color: accentColor }]}>{label}</Text>
      <Text style={[styles.slotPlus, { color: accentColor }]}>+</Text>
      <Text style={styles.slotHint}>Toca para elegir</Text>
      {error && <Text style={styles.slotError}>{error}</Text>}
    </TouchableOpacity>
  );
}

// Fila de una stat comparada
interface StatRowProps {
  label: string;
  valA: number;
  valB: number;
  colorA: string;
  colorB: string;
}

function StatCompareRow({ label, valA, valB, colorA, colorB }: StatRowProps) {
  const aWins = valA >= valB;

  return (
    <View style={styles.statRow}>
      {/* Crece hacia la izquierda */}
      <View style={styles.barSideA}>
        <Text style={[styles.statVal, { color: colorA }]}>{valA}</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${(valA / MAX_STAT) * 100}%`,
                backgroundColor: colorA,
                opacity: aWins ? 1 : 0.35,
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.statLabel}>{label}</Text>

      {/* Crece hacia la derecha */}
      <View style={styles.barSideB}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${(valB / MAX_STAT) * 100}%`,
                backgroundColor: colorB,
                opacity: aWins ? 0.35 : 1,
              },
            ]}
          />
        </View>
        <Text style={[styles.statVal, { color: colorB }]}>{valB}</Text>
      </View>
    </View>
  );
}

// Fila de total
function TotalRow({ totalA, totalB }: { totalA: number; totalB: number }) {
  const aWins = totalA >= totalB;
  return (
    <View style={[styles.statRow, styles.totalRow]}>
      <Text
        style={[
          styles.totalVal,
          { color: "#3b82f6", opacity: aWins ? 1 : 0.45 },
        ]}
      >
        {totalA}
      </Text>
      <Text style={styles.totalLabel}>TOTAL</Text>
      <Text
        style={[
          styles.totalVal,
          { color: "#E3350D", opacity: aWins ? 0.45 : 1 },
        ]}
      >
        {totalB}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    marginBottom: 20,
  },
  slotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slot: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    minHeight: 170,
    justifyContent: "center",
  },
  slotEmpty: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 6,
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  slotPlus: {
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 36,
  },
  slotHint: {
    fontSize: 11,
    color: "#9ca3af",
  },
  slotError: {
    fontSize: 11,
    color: "#E3350D",
    textAlign: "center",
    marginTop: 4,
  },
  slotImage: {
    width: 80,
    height: 80,
  },
  slotNumber: {
    fontSize: 11,
    color: "rgba(0,0,0,0.3)",
    fontWeight: "700",
    marginTop: 4,
  },
  slotName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 2,
    textAlign: "center",
  },
  typesRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  typeBadge: {
    backgroundColor: "rgba(0,0,0,0.15)",
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
  clearButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#d1d5db",
  },
  statsSection: {
    marginTop: 28,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  barSideA: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // la barra de A crece desde el centro hacia la izquierda
    flexDirection: "row-reverse",
  },
  barSideB: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  statLabel: {
    width: 52,
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    textAlign: "center",
  },
  statVal: {
    fontSize: 12,
    fontWeight: "700",
    width: 26,
    textAlign: "center",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
    marginTop: 4,
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#374151",
    letterSpacing: 0.5,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: "800",
    width: 50,
    textAlign: "center",
  },
});
