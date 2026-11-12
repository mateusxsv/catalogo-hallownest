# Catálogo de Hallownest

Aplicativo mobile desenvolvido com React Native e Expo para consultar informações de Hollow Knight usando a HallownestAPI.

## Funcionalidades
- Consulta de chefes, personagens, regiões, amuletos e habilidades.
- Pesquisa local nos registros carregados.
- Paginação para carregar mais resultados.
- Tela de detalhes.
- Navegação com React Navigation.
- Interface com React Native Paper.
- Favoritos persistidos no dispositivo com AsyncStorage.

## Tecnologias
React Native, Expo, HallownestAPI, React Navigation, React Native Paper, AsyncStorage e Expo Google Fonts (Cinzel).

## Executar
```bash
npm install
npx expo start
```
Leia o QR Code com o Expo Go.

## Estrutura
```text
src/
  components/ArchiveCard.js
  constants/categories.js
  context/FavoritesContext.js
  navigation/AppNavigator.js
  screens/
    HomeScreen.js
    CategoryScreen.js
    DetailScreen.js
    FavoritesScreen.js
  services/api.js
  storage/favorites.js
```

Os favoritos são armazenados localmente no aparelho. A pesquisa considera os registros já carregados; a API fornece paginação para carregar mais. A disponibilidade de imagens depende dos dados retornados.

Projeto de fãs, sem finalidade comercial. Hollow Knight e seus elementos pertencem aos respectivos titulares. Dados consultados da HallownestAPI. Verifique as licenças da API e de imagens de terceiros antes de redistribuir conteúdo.
