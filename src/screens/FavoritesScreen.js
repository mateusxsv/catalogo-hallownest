import React from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";
import ArchiveCard from "../components/ArchiveCard";
import { COLORS } from "../constants/categories";
import { useFavorites } from "../context/FavoritesContext";
export default function FavoritesScreen({ navigation }) {
  const { favorites, ready, removeFavorite } = useFavorites();
  if (!ready)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ color: COLORS.muted, textAlign: "center" }}>
          Carregando favoritos...
        </Text>
      </View>
    );
  return (
    <View style={{ flex: 1, padding: 18 }}>
      <Text style={{ color: COLORS.muted, marginBottom: 16 }}>
        Seus registros salvos neste dispositivo.
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(f) => f.id}
        renderItem={({ item: f }) => (
          <View>
            <ArchiveCard
              title={f.item.name || f.item.slug || "Registro"}
              subtitle={f.category.title}
              item={f.item}
              icon={f.category.icon}
              onPress={() =>
                navigation.navigate("Detail", {
                  category: f.category,
                  item: f.item,
                })
              }
            />
            <Button
              compact
              textColor={COLORS.glow}
              icon="heart-broken"
              onPress={() => removeFavorite(f.id)}
              style={{ alignSelf: "flex-end", marginTop: -12, marginBottom: 8 }}
            >
              Remover
            </Button>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              color: COLORS.muted,
              textAlign: "center",
              marginTop: 45,
              lineHeight: 24,
            }}
          >
            Você ainda não salvou nenhum registro.{"\n"}Abra um registro e toque
            em “Adicionar aos favoritos”.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}