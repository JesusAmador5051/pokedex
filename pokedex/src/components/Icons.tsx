import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const PokedexIcon = (props: any) => (
  <MaterialCommunityIcons name="pokeball" size={24} color="black" {...props} />
);

export const FavoritesIcon = (props: any) => (
  <FontAwesome name="heart" size={24} color="black" {...props} />
);

export const SearchIcon = (props: any) => (
  <FontAwesome name="search" size={16} color="#9ca3af" {...props} />
);

export const HeartIcon = (props: any) => (
  <FontAwesome name="heart" size={22} color="#E3350D" {...props} />
);

export const HeartOutlineIcon = (props: any) => (
  <FontAwesome name="heart-o" size={22} color="#E3350D" {...props} />
);

export const AlertIcon = (props: any) => (
  <MaterialCommunityIcons
    name="alert-circle-outline"
    size={40}
    color="#9ca3af"
    {...props}
  />
);

export const EmptyIcon = (props: any) => (
  <MaterialCommunityIcons
    name="pokeball"
    size={40}
    color="#d1d5db"
    {...props}
  />
);
