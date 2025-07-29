// app/(profile)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

// Layout para el grupo de rutas (profile).
// Define un Stack Navigator para todas las pantallas de perfil.
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        // Opciones por defecto para todas las pantallas en este stack
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false, // Quita la sombra del header
      }}
    >
      {/* Cada Stack.Screen define una pantalla en el navegador */}
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
    </Stack>
  );
}