import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Searchbar, Text } from "react-native-paper";
import ArchiveCard from "../components/ArchiveCard";
import { COLORS } from "../constants/categories";
import { getCategoryItems } from "../services/api";
export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [items, setItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  async function load(more = false) {
    if (more && (!nextUrl || loadingMore)) return;
    more ? setLoadingMore(true) : setLoading(true);
    setError("");
    try {
      const result = await getCategoryItems(category, more ? nextUrl : null);
      setItems((current) =>
        more ? [...current, ...result.items] : result.items,
      );
      setNextUrl(result.next);
    } catch (err) {
      setError(`Não foi possível carregar os registros. ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }
  useEffect(() => {
    setItems([]);
    setNextUrl(null);
    setQuery("");
    load(false);
  }, [category.key]);
  const filtered = useMemo(
    () =>
      items.filter((i) =>
        String(i.name || i.slug || "")
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [items, query],
  );
  return (
    <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 16 }}>
      <Text
        style={{ color: COLORS.muted, textAlign: "center", marginBottom: 14 }}
      >
        {category.description}
      </Text>
      <Searchbar
        placeholder="Pesquisar pelo nome..."
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: COLORS.panel,
          marginBottom: 15,
          borderRadius: 8,
        }}
        inputStyle={{ color: COLORS.white }}
        iconColor={COLORS.glow}
        placeholderTextColor={COLORS.muted}
      />
      {!!error && (
        <Text
          style={{ color: "#ffa7a7", textAlign: "center", marginBottom: 12 }}
        >
          {error}
        </Text>
      )}
      {loading ? (
        <ActivityIndicator
          animating
          size="large"
          color={COLORS.glow}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i, index) => i.slug || `${category.key}-${index}`}
          renderItem={({ item }) => (
            <ArchiveCard
              title={item.name || item.slug || "Registro"}
              subtitle={item.area?.name || item.kind || item.summary || ""}
              item={item}
              icon={category.icon}
              onPress={() => navigation.navigate("Detail", { category, item })}
            />
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: COLORS.muted,
                textAlign: "center",
                marginTop: 35,
              }}
            >
              Nenhum registro encontrado.
            </Text>
          }
          ListFooterComponent={
            nextUrl && !query ? (
              <Button
                mode="outlined"
                textColor={COLORS.glow}
                loading={loadingMore}
                disabled={loadingMore}
                onPress={() => load(true)}
                style={{ borderColor: COLORS.line, marginVertical: 10 }}
              >
                Carregar mais registros
              </Button>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 25 }}
        />
      )}
      {!!error && (
        <Button textColor={COLORS.glow} onPress={() => load(false)}>
          Tentar novamente
        </Button>
      )}
    </View>
  );
}
