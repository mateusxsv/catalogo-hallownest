import { API } from "../constants/categories";
async function request(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
  return response.json();
}
export async function getCategoryItems(category, url = null) {
  const data = await request(url || `${API}/${category.key}?limit=50`);
  const items = Array.isArray(data) ? data : data.results || data.data || [];
  if (!Array.isArray(items)) throw new Error("Formato de resposta inesperado.");
  return { items, next: data.next || null };
}
export async function getItemDetails(category, item) {
  const data = await request(item.url || `${API}/${category.key}/${item.slug}`);
  return data.data || data;
}
