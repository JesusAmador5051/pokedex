import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const PokedexIcon = (props: any) => (
  <MaterialCommunityIcons name="pokeball" size={24} color="black" {...props} />
);

export const FavoritesIcon = (props: any) => (
  <FontAwesome name="heart" size={24} color="black" {...props} />
);
