import React, { createContext, useContext, useEffect, useState } from "react";
import { loadFavorites, saveFavorites } from "../storage/favorites";
const FavoritesContext = createContext(null);
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function load() {
      const saved = await loadFavorites();
      setFavorites(saved);
      setReady(true);
    }
    load();
  }, []);
  useEffect(() => {
    if (ready) saveFavorites(favorites).catch(() => {});
  }, [favorites, ready]);
  function getId(item, category) {
    return `${category.key}:${item.slug || item.name}`;
  }
  function isFavorite(item, category) {
    return favorites.some((f) => f.id === getId(item, category));
  }
  function toggleFavorite(item, category) {
    const id = getId(item, category);
    setFavorites((current) =>
      current.some((f) => f.id === id)
        ? current.filter((f) => f.id !== id)
        : [...current, { id, item, category }],
    );
  }
  function removeFavorite(id) {
    setFavorites((current) => current.filter((f) => f.id !== id));
  }
  return (
    <FavoritesContext.Provider
      value={{ favorites, ready, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites precisa estar dentro de FavoritesProvider.");
  return context;
}
