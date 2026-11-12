import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Divider, Text } from "react-native-paper";
import { COLORS } from "../constants/categories";
import { getItemDetails } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
function valueText(v) {
  if (v === null || v === undefined || v === "") return "";
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  if (typeof v === "object")
    return v.name || v.title || v.slug || JSON.stringify(v);
  return String(v);
}
function getImage(i) {
  const a = [
    i?.imageUrl,
    i?.image_url,
    i?.image?.url,
    i?.image,
    i?.wiki?.imageUrl,
    i?.wiki?.image,
    i?.artworkUrl,
  ];
  return a.find((v) => typeof v === "string" && v.startsWith("https://"));
}
export default function DetailScreen({ route }) {
  const { category, item } = route.params;
  const [detail, setDetail] = useState(item);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await getItemDetails(category, item);
        if (active) setDetail(result);
      } catch (err) {
        if (active)
          setError(`Não foi possível carregar os detalhes. ${err.message}`);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [category.key, item.slug]);
  const image = getImage(detail);
  const favorite = isFavorite(item, category);
  const fields = [
    ["Nome", detail?.name],
    ["Região", detail?.area],
    ["Tipo", detail?.kind],
    ["Jogo", detail?.game === "hk" ? "Hollow Knight" : detail?.game],
    ["Chefe opcional", detail?.optional],
    ["Vida base", detail?.hp?.base],
    ["Geo", detail?.geo],
    ["Custo (espaços)", detail?.notches ?? detail?.notchCost],
    ["Dano", detail?.damage],
    ["Localização", detail?.location],
    ["Identificador", detail?.slug],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");
  return (
    <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 45 }}>
      <Text
        style={{
          color: COLORS.glow,
          textAlign: "center",
          letterSpacing: 2,
          fontSize: 10,
        }}
      >
        {category.title.toUpperCase()} • REGISTRO
      </Text>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 27,
          fontFamily: "Cinzel_700Bold",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        {detail?.name || item.name || "Registro desconhecido"}
      </Text>
      {image ? (
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          style={{ width: "100%", height: 230, marginVertical: 22 }}
        />
      ) : (
        <View
          style={{
            height: 150,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 12,
          }}
        >
          <Text style={{ color: COLORS.glow, fontSize: 72 }}>◇</Text>
        </View>
      )}
      <Button
        mode={favorite ? "contained" : "outlined"}
        icon={favorite ? "heart" : "heart-outline"}
        onPress={() => toggleFavorite(item, category)}
        buttonColor={favorite ? COLORS.panelLight : undefined}
        textColor={COLORS.glow}
        style={{ borderColor: COLORS.line, marginBottom: 18 }}
      >
        {favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      </Button>
      {!!detail?.summary && (
        <Text
          style={{
            color: COLORS.muted,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 15,
          }}
        >
          {detail.summary}
        </Text>
      )}
      {!!detail?.description && (
        <Text
          style={{
            color: COLORS.muted,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 15,
          }}
        >
          {detail.description}
        </Text>
      )}
      {!!error && (
        <Text
          style={{ color: "#ffa7a7", textAlign: "center", marginBottom: 12 }}
        >
          {error}
        </Text>
      )}
      {loading && (
        <ActivityIndicator
          animating
          color={COLORS.glow}
          style={{ marginBottom: 15 }}
        />
      )}
      <View
        style={{
          backgroundColor: COLORS.panel,
          borderColor: COLORS.line,
          borderWidth: 1,
          padding: 18,
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            color: COLORS.glow,
            letterSpacing: 1.5,
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          INFORMAÇÕES DO REGISTRO
        </Text>
        {fields.map(([label, value]) => (
          <View key={label}>
            <Divider style={{ backgroundColor: COLORS.line }} />
            <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 12 }}>
              {label}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 14,
                marginTop: 4,
                marginBottom: 12,
              }}
            >
              {valueText(value)}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          color: COLORS.muted,
          textAlign: "center",
          marginTop: 22,
          fontSize: 11,
        }}
      >
        Os dados são fornecidos pela HallownestAPI.
      </Text>
    </ScrollView>
  );
}
