import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MyTabBar } from "./src/components/MyTabBar";
import { PokedexIcon, FavoritesIcon } from "./src/components/Icons";
import { FavoritesProvider } from "./src/context/FavoritesContext";

import HomeScreen from "./src/screens/HomeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import DetailScreen from "./src/screens/DetailScreen";

export type PokedexStackParamList = {
  Home: undefined;
  PokemonDetail: { id: number };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  PokemonDetail: { id: number };
};

export type RootTabsParamList = {
  Inicio: undefined;
  Favoritos: undefined;
};

const PokedexStack = createNativeStackNavigator<PokedexStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const Tab = createBottomTabNavigator<RootTabsParamList>();

function PokedexStackNavigator() {
  return (
    <PokedexStack.Navigator>
      <PokedexStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Pokédex" }}
      />
      <PokedexStack.Screen
        name="PokemonDetail"
        component={DetailScreen}
        options={{ title: "" }}
      />
    </PokedexStack.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favoritos" }}
      />
      <FavoritesStack.Screen
        name="PokemonDetail"
        component={DetailScreen}
        options={{ title: "" }}
      />
    </FavoritesStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: { ...DefaultTheme.colors, background: "#f8fafc" },
          }}
        >
          <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Tab.Screen
              name="Inicio"
              component={PokedexStackNavigator}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <PokedexIcon size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Favoritos"
              component={FavoritesStackNavigator}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FavoritesIcon size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
