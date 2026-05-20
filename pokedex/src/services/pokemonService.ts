import axios from "axios";
import type {
  PokemonListResponse,
  Pokemon,
  PokemonSummary,
  TypeListResponse,
  TypeDetailResponse,
} from "../types/pokemon";

const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export async function getPokemonList(
  limit = 40,
  offset = 0,
): Promise<PokemonSummary[]> {
  const { data: listData } = await pokeApi.get<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
  );

  const detailRequests = listData.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return pokeApi.get<Pokemon>(`/pokemon/${id}`);
  });

  const responses = await Promise.all(detailRequests);

  return responses.map(({ data }) => ({
    id: data.id,
    name: data.name,
    imageUrl:
      data.sprites.other["official-artwork"].front_default ??
      data.sprites.front_default ??
      "",
    types: data.types.map((t) => t.type.name),
  }));
}

export async function getPokemonDetail(id: number): Promise<Pokemon> {
  const { data } = await pokeApi.get<Pokemon>(`/pokemon/${id}`);
  return data;
}

// Retorna la lista de nombres de tipos
export async function getTypes(): Promise<string[]> {
  const { data } = await pokeApi.get<TypeListResponse>("/type");
  // Filtrar tipos unknown y shadow
  const EXCLUDED = new Set(["unknown", "shadow"]);
  return data.results.map((t) => t.name).filter((name) => !EXCLUDED.has(name));
}

// Retornar hasta `limit` PokemonSummary del tipo dado, con detalle completo
export async function getPokemonByType(
  type: string,
  limit = 40,
): Promise<PokemonSummary[]> {
  const { data } = await pokeApi.get<TypeDetailResponse>(`/type/${type}`);

  const slice = data.pokemon.slice(0, limit);

  const detailRequests = slice.map(({ pokemon }) => {
    const id = extractIdFromUrl(pokemon.url);
    return pokeApi.get<Pokemon>(`/pokemon/${id}`);
  });

  const responses = await Promise.all(detailRequests);

  return responses.map(({ data: d }) => ({
    id: d.id,
    name: d.name,
    imageUrl:
      d.sprites.other["official-artwork"].front_default ??
      d.sprites.front_default ??
      "",
    types: d.types.map((t) => t.type.name),
  }));
}
