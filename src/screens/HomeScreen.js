import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { CATEGORIES, COLORS } from "../constants/categories";
export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 45 }}>
      <View
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          borderWidth: 1,
          borderColor: COLORS.line,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
          marginBottom: 25,
          backgroundColor: COLORS.panel,
        }}
      >
        <Text style={{ color: COLORS.glow, fontSize: 66 }}>♕</Text>
        <Text style={{ color: COLORS.gold, fontSize: 8, letterSpacing: 2 }}>
          H A L L O W N E S T
        </Text>
      </View>
      <Text
        style={{
          color: COLORS.glow,
          textAlign: "center",
          letterSpacing: 2,
          fontSize: 10,
        }}
      >
        OS ARQUIVOS DO REINO ESQUECIDO
      </Text>
      <Text
        style={{
          color: COLORS.white,
          textAlign: "center",
          fontSize: 29,
          fontFamily: "Cinzel_700Bold",
          marginTop: 12,
          lineHeight: 40,
        }}
      >
        CATÁLOGO DE{"\n"}HALLOWNEST
      </Text>
      <Text
        style={{
          color: COLORS.muted,
          textAlign: "center",
          lineHeight: 23,
          marginTop: 15,
          marginBottom: 25,
        }}
      >
        Entre as ruínas de um reino silencioso, cada registro guarda um
        fragmento de sua história.
      </Text>
      <Button
        mode="contained-tonal"
        icon="bookmark"
        onPress={() => navigation.navigate("Favorites")}
        style={{ marginBottom: 26, backgroundColor: COLORS.panelLight }}
        textColor={COLORS.glow}
      >
        Meus favoritos
      </Button>
      <Text
        style={{
          color: COLORS.glow,
          letterSpacing: 2,
          fontSize: 12,
          marginBottom: 15,
        }}
      >
        ESCOLHA UM ARQUIVO
      </Text>
      {CATEGORIES.map((c) => (
        <Card
          key={c.key}
          mode="outlined"
          onPress={() => navigation.navigate("Category", { category: c })}
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.line,
            marginBottom: 12,
          }}
        >
          <Card.Title
            title={c.title}
            subtitle={c.description}
            titleStyle={{ color: COLORS.white, fontFamily: "Cinzel_700Bold" }}
            subtitleStyle={{ color: COLORS.muted, fontSize: 12 }}
            left={() => (
              <Text
                style={{ color: COLORS.glow, fontSize: 27, marginLeft: 15 }}
              >
                {c.icon}
              </Text>
            )}
            right={() => (
              <Text
                style={{ color: COLORS.glow, fontSize: 25, marginRight: 15 }}
              >
                ›
              </Text>
            )}
          />
        </Card>
      ))}
      <Text
        style={{
          color: COLORS.muted,
          textAlign: "center",
          marginTop: 20,
          fontSize: 11,
        }}
      >
        Projeto de fãs • Dados: HallownestAPI
      </Text>
    </ScrollView>
  );
}
