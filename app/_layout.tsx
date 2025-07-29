// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../hooks/useAuth';

// ✅ 1. Importa 'useFonts' y las fuentes Roboto que usaremos
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_900Black, Roboto_500Medium, Roboto_300Light } from '@expo-google-fonts/roboto';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // ✅ 2. Carga las fuentes en la aplicación
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular, // Peso Regular (400)
    Roboto_500Medium,  // Peso Medium (500) - útil para Semibold
    Roboto_700Bold,    // Peso Bold (700)
    Roboto_900Black,   // Peso Black (900)
  });

  useEffect(() => {
    // Ocultamos la pantalla de carga solo cuando las fuentes estén listas.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Si las fuentes no han cargado, no renderizamos nada para que el splash siga visible.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack>
            {/* El resto de la configuración del Stack se mantiene igual */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="manual-form" options={{ title: 'Manual de Contrataciones' }} />
            <Stack.Screen name="repository" options={{ title: 'Repositorio Legal' }} />
            <Stack.Screen name="courses" options={{ title: 'Cursos Virtuales' }} />
            <Stack.Screen name="manual-express-form" options={{ title: 'Manual Express' }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}