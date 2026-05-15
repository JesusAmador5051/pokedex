import axios from "axios";
import type {
  PokemonListResponse,
  Pokemon,
  PokemonSummary,
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

export async function getPokemonDetail(
  idOrName: number | string,
): Promise<Pokemon> {
  const { data } = await pokeApi.get<Pokemon>(`/pokemon/${idOrName}`);
  return data;
}
