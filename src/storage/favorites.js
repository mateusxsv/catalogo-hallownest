import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@hallownest:favorites";
export async function loadFavorites() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return [];
  }
}
export async function saveFavorites(favorites) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Erro ao salvar favoritos:", error);
    throw error;
  }
}
