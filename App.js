import React, { useState } from 'react';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import {
  ActivityIndicator, FlatList, Image, Pressable, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';

const API = 'https://hallownest-api.vercel.app/api/v1';
const COLORS = {
  background: '#070c15', panel: '#101926', panelLight: '#1a2a3d',
  line: '#42536a', white: '#f1f2ed', muted: '#a0acba', glow: '#b6d7e7', gold: '#c6baa0',
};

const CATEGORIES = [
  { key: 'boss', title: 'Chefes', icon: '⚔', description: 'Desafios do reino e guerreiros dos sonhos' },
  { key: 'character', title: 'Personagens', icon: '♙', description: 'Habitantes, comerciantes e criaturas' },
  { key: 'area', title: 'Regiões', icon: '◇', description: 'Caminhos e lugares esquecidos' },
  { key: 'charm', title: 'Amuletos', icon: '✧', description: 'Relíquias com poderes especiais' },
  { key: 'skill', title: 'Habilidades', icon: '☾', description: 'Feitiços, técnicas e movimentos' },
];

function imageUri(item) {
  // Imagens opcionais: dependem do registro e da disponibilidade da wiki externa.
  const candidates = [
    item?.imageUrl, item?.image_url, item?.image?.url, item?.image,
    item?.wiki?.imageUrl, item?.wiki?.image, item?.artworkUrl,
  ];
  return candidates.find(value => typeof value === 'string' && /^https:\/\//.test(value)) || null;
}

function Portrait({ item, icon, large = false }) {
  const [failed, setFailed] = useState(false);
  const uri = imageUri(item);
  return (
    <View style={[styles.portrait, large && styles.portraitLarge]}>
      {!failed && uri ? (
        <Image source={{ uri }} style={styles.portraitImage} resizeMode="contain" onError={() => setFailed(true)} />
      ) : (
        <Text style={[styles.portraitFallback, large && styles.portraitFallbackLarge]}>{icon || '◇'}</Text>
      )}
    </View>
  );
}

function OrnamentalDivider() {
  return <View style={styles.ornamentalDivider}><View style={styles.dividerLine} /><Text style={styles.dividerGlyph}>✧ ◇ ✧</Text><View style={styles.dividerLine} /></View>;
}

function texto(valor) {
  if (valor === null || valor === undefined || valor === '') return 'Não informado';
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não';
  if (typeof valor === 'object') return valor.name || valor.title || valor.slug || JSON.stringify(valor);
  return String(valor);
}

function Linha({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{texto(value)}</Text>
    </View>
  );
}

function Card({ title, subtitle, icon, onPress, item }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Portrait key={item?.slug || title} item={item} icon={icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.cardSubtitle} numberOfLines={2}>{subtitle}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Cinzel_400Regular, Cinzel_700Bold });
  const [screen, setScreen] = useState('home');
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function request(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
    return response.json();
  }

  async function loadItems(selectedCategory, more = false, urlOverride = null) {
    if (more ? loadingMore || !nextUrl : loading) return;
    more ? setLoadingMore(true) : setLoading(true);
    setError('');
    try {
      const url = more ? nextUrl : (urlOverride || `${API}/${selectedCategory.key}?limit=50`);
      const data = await request(url);
      const result = Array.isArray(data) ? data : (data.results || data.data || []);
      if (!Array.isArray(result)) throw new Error('Formato de resposta inesperado');
      setItems(current => more ? [...current, ...result] : result);
      setNextUrl(data.next || null);
    } catch (err) {
      setError(`Não foi possível carregar os registros. ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function openCategory(selected) {
    setCategory(selected);
    setItems([]);
    setNextUrl(null);
    setQuery('');
    setError('');
    setScreen('list');
    // Também carrega quando a categoria é escolhida pela primeira vez.
    loadItems(selected);
  }

  async function openDetail(item) {
    setDetail(item);
    setDetailLoading(true);
    setError('');
    setScreen('detail');
    try {
      const url = item.url || `${API}/${category.key}/${item.slug}`;
      setDetail(await request(url));
    } catch (err) {
      setError(`Não foi possível carregar os detalhes. ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  }

  const filteredItems = items.filter(item =>
    texto(item.name).toLowerCase().includes(query.trim().toLowerCase())
  );

  function BackButton({ onPress }) {
    return (
      <Pressable onPress={onPress} style={styles.backButton}>
        <Text style={styles.backText}>‹  VOLTAR</Text>
      </Pressable>
    );
  }

  if (!fontsLoaded) return <View style={styles.safe}><ActivityIndicator size="large" color={COLORS.glow} style={styles.spinner} /></View>;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {screen === 'home' && (
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.heroSeal}><Text style={styles.heroSealText}>♕</Text><Text style={styles.heroSealSmall}>H A L L O W N E S T</Text></View>
          <Text style={styles.kicker}>OS ARQUIVOS DO REINO ESQUECIDO</Text>
          <Text style={styles.heroTitle}>CATÁLOGO DE{'\n'}HALLOWNEST</Text>
          <Text style={styles.heroSubtitle}>
            Entre as ruínas de um reino silencioso, cada registro guarda um fragmento de sua história.
          </Text>
          <OrnamentalDivider />
          <Text style={styles.sectionTitle}>ESCOLHA UM ARQUIVO</Text>
          {CATEGORIES.map(item => (
            <Card key={item.key} title={item.title} subtitle={item.description}
              icon={item.icon} onPress={() => openCategory(item)} />
          ))}
          <Text style={styles.footer}>Projeto de fãs • Dados: HallownestAPI</Text>
        </ScrollView>
      )}

      {screen === 'list' && (
        <View style={styles.fullPage}>
          <BackButton onPress={() => setScreen('home')} />
          <Text style={styles.kicker}>ARQUIVOS DE HALLOWNEST</Text>
          <Text style={styles.pageTitle}>{category.title}</Text>
          <Text style={styles.caption}>{category.description}</Text>
          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Pesquisar pelo nome..."
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          {loading ? <ActivityIndicator size="large" color={COLORS.glow} style={styles.spinner} /> : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => item.slug || String(index)}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Card title={item.name || item.slug || 'Registro'}
                  subtitle={item.area?.name || item.kind || item.summary || ''}
                  icon={category.icon} item={item} onPress={() => openDetail(item)} />
              )}
              ListEmptyComponent={<Text style={styles.empty}>Nenhum registro encontrado.</Text>}
              ListFooterComponent={
                <View>
                  {loadingMore && <ActivityIndicator color={COLORS.glow} />}
                  {!query && !!nextUrl && !loadingMore && (
                    <Pressable style={styles.moreButton} onPress={() => loadItems(category, true)}>
                      <Text style={styles.moreText}>CARREGAR MAIS REGISTROS</Text>
                    </Pressable>
                  )}
                </View>
              }
            />
          )}
          {!!error && <Pressable onPress={() => loadItems(category)}><Text style={styles.retry}>Tentar novamente</Text></Pressable>}
        </View>
      )}

      {screen === 'detail' && (
        <ScrollView contentContainerStyle={styles.page}>
          <BackButton onPress={() => { setError(''); setScreen('list'); }} />
          {detailLoading ? <ActivityIndicator size="large" color={COLORS.glow} style={styles.spinner} /> : (
            <>
              <OrnamentalDivider />
              <Text style={styles.kicker}>{category.title.toUpperCase()} • REGISTRO</Text>
              <Text style={styles.pageTitle}>{detail?.name || 'Registro desconhecido'}</Text>
              <Portrait key={detail?.slug || 'detail'} item={detail} icon={category.icon} large />
              {!!detail?.summary && <Text style={styles.summary}>{detail.summary}</Text>}
              {!!detail?.description && <Text style={styles.summary}>{detail.description}</Text>}
              {!!error && <Text style={styles.error}>{error}</Text>}
              <View style={styles.infoPanel}>
                <Text style={styles.sectionTitle}>INFORMAÇÕES DO REGISTRO</Text>
                <Linha label="Nome" value={detail?.name} />
                <Linha label="Região" value={detail?.area} />
                <Linha label="Tipo" value={detail?.kind} />
                <Linha label="Jogo" value={detail?.game === 'hk' ? 'Hollow Knight' : detail?.game} />
                <Linha label="Chefe opcional" value={detail?.optional} />
                <Linha label="Vida base" value={detail?.hp?.base} />
                <Linha label="Geo" value={detail?.geo} />
                <Linha label="Custo (espaços)" value={detail?.notches ?? detail?.notchCost} />
                <Linha label="Dano" value={detail?.damage} />
                <Linha label="Localização" value={detail?.location} />
                <Linha label="Identificador" value={detail?.slug} />
              </View>
              <Text style={styles.footer}>Os dados são fornecidos pela HallownestAPI.</Text>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  heroSeal: { width: 172, height: 172, borderRadius: 86, borderWidth: 1, borderColor: COLORS.line, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 28, backgroundColor: COLORS.panel },
  heroSealText: { color: COLORS.glow, fontSize: 80, marginBottom: -6 },
  heroSealSmall: { color: COLORS.gold, fontSize: 8, letterSpacing: 1.8 },
  ornamentalDivider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 29 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.line },
  dividerGlyph: { color: COLORS.gold, paddingHorizontal: 16, fontSize: 17 },
  portrait: { width: 70, height: 78, marginRight: 15, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.background, borderRadius: 5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  portraitLarge: { width: '100%', height: 245, marginRight: 0, marginTop: 22, marginBottom: 10 },
  portraitImage: { width: '100%', height: '100%' },
  portraitFallback: { color: COLORS.glow, fontSize: 33 },
  portraitFallbackLarge: { fontSize: 86 },
  page: { paddingHorizontal: 22, paddingVertical: 30, paddingBottom: 55 },
  fullPage: { flex: 1, paddingHorizontal: 22, paddingTop: 20 },
  ornament: { color: COLORS.glow, textAlign: 'center', fontSize: 23, letterSpacing: 12, marginBottom: 28 },
  kicker: { color: COLORS.glow, fontSize: 10, fontWeight: '700', letterSpacing: 2.8, textAlign: 'center', marginBottom: 12 },
  heroTitle: { color: COLORS.white, textAlign: 'center', fontSize: 30, fontFamily: 'Cinzel_700Bold', lineHeight: 44, letterSpacing: 1.2 },
  heroSubtitle: { color: COLORS.muted, textAlign: 'center', fontSize: 14, lineHeight: 23, marginTop: 17, marginHorizontal: 9 },
  divider: { backgroundColor: COLORS.line, height: 1, marginTop: 34, marginBottom: 30 },
  sectionTitle: { color: COLORS.glow, fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line, borderRadius: 5, padding: 10, marginBottom: 12 },
  pressed: { backgroundColor: COLORS.panelLight },
  cardIcon: { width: 50, height: 50, borderRadius: 8, backgroundColor: COLORS.panelLight, borderColor: COLORS.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardIconText: { color: COLORS.glow, fontSize: 26 },
  cardContent: { flex: 1 },
  cardTitle: { color: COLORS.white, fontSize: 16, fontFamily: 'Cinzel_700Bold' },
  cardSubtitle: { color: COLORS.muted, marginTop: 5, lineHeight: 18, fontSize: 12 },
  arrow: { color: COLORS.glow, fontSize: 29, marginLeft: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 12, marginBottom: 22 },
  backText: { color: COLORS.glow, fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  pageTitle: { color: COLORS.white, fontSize: 30, fontFamily: 'Cinzel_700Bold', textAlign: 'center', marginBottom: 8 },
  caption: { color: COLORS.muted, textAlign: 'center', marginBottom: 22 },
  search: { backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line, borderRadius: 8, color: COLORS.white, padding: 14, marginBottom: 16 },
  listContent: { paddingBottom: 35 },
  spinner: { marginTop: 45 },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 38 },
  error: { color: '#ffa7a7', textAlign: 'center', marginBottom: 12 },
  retry: { color: COLORS.glow, textAlign: 'center', padding: 12 },
  moreButton: { borderWidth: 1, borderColor: COLORS.line, padding: 15, borderRadius: 8, marginTop: 8 },
  moreText: { color: COLORS.glow, textAlign: 'center', letterSpacing: 1, fontSize: 11 },
  summary: { color: COLORS.muted, textAlign: 'center', lineHeight: 24, marginTop: 15, marginBottom: 18 },
  detailImage: { width: '100%', height: 220, marginVertical: 14 },
  infoPanel: { backgroundColor: COLORS.panel, borderColor: COLORS.line, borderWidth: 1, padding: 20, borderRadius: 10, marginTop: 22 },
  infoRow: { borderTopWidth: 1, borderTopColor: COLORS.line, paddingVertical: 14 },
  infoLabel: { color: COLORS.muted, fontSize: 11, marginBottom: 5 },
  infoValue: { color: COLORS.white, fontSize: 15 },
  footer: { color: COLORS.muted, textAlign: 'center', marginTop: 25, fontSize: 11 },
});
