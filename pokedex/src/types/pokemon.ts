// Respuesta del endpoint GET /pokemon?limit=N
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

// Respuesta del endpoint GET /pokemon/{id}
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatSlot[];
  abilities: PokemonAbilitySlot[];
}

export interface PokemonSprites {
  front_default: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedResource;
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface PokemonAbilitySlot {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonSummary {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export interface TypeListResponse {
  results: NamedResource[];
}

export interface TypeDetailResponse {
  pokemon: { pokemon: NamedResource }[];
}