import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Usamos la librería de íconos de Expo
import Colors from '../../constants/Colors';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      // screenOptions aplica esta configuración a TODAS las pantallas de este grupo
      screenOptions={{
        headerTitle: '', // Oculta el título de la pantalla
        headerShadowVisible: false, // Quita la sombra del header
        headerStyle: { backgroundColor: Colors.background }, // Usa nuestro color de fondo
        headerBackVisible: false, // Oculta la flecha de "volver" por defecto

        // Creamos nuestro propio botón de "volver" personalizado
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: 4 }}>
            <Ionicons name="arrow-back" size={28} color={Colors.text} />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Excepción: Para la pantalla de login, ocultamos el header por completo */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      
      {/* El resto de las pantallas heredarán el header con el botón personalizado */}
      <Stack.Screen name="register" />
      <Stack.Screen name="register-profile" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}