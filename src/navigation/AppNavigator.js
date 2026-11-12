import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DetailScreen from "../screens/DetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { COLORS } from "../constants/categories";
const Stack = createNativeStackNavigator();
const options = {
  headerStyle: { backgroundColor: COLORS.panel },
  headerTintColor: COLORS.glow,
  headerTitleStyle: { fontFamily: "Cinzel_700Bold", fontSize: 16 },
  contentStyle: { backgroundColor: COLORS.background },
};
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Hallownest" }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.category.title })}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Registro" }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favoritos" }}
      />
    </Stack.Navigator>
  );
}
