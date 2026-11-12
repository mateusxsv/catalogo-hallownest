import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';

const colors = { background:'#070c15', surface:'#101926', surfaceVariant:'#1a2a3d', primary:'#b6d7e7', secondary:'#c6baa0', outline:'#42536a', onSurface:'#f1f2ed', onSurfaceVariant:'#a0acba' };
const paperTheme = { ...MD3DarkTheme, colors:{ ...MD3DarkTheme.colors, ...colors } };
const navigationTheme = { ...NavigationDarkTheme, colors:{ ...NavigationDarkTheme.colors, background:colors.background, card:colors.surface, text:colors.onSurface, primary:colors.primary, border:colors.outline } };

export default function App() {
  const [fontsLoaded] = useFonts({ Cinzel_400Regular, Cinzel_700Bold });
  if (!fontsLoaded) return <View style={{flex:1,backgroundColor:colors.background,justifyContent:'center'}}><ActivityIndicator size="large" color={colors.primary}/></View>;
  return <PaperProvider theme={paperTheme}><FavoritesProvider><NavigationContainer theme={navigationTheme}><AppNavigator/></NavigationContainer></FavoritesProvider></PaperProvider>;
}
