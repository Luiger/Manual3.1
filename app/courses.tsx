import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Colors from '../constants/Colors';

// --- DATOS DE LOS CURSOS ---
const coursesData = [
  {
    id: '1',
    title: 'Fundamentos de la Contratación Pública',
    // URL de imagen directa de Google Drive
    imageUrl: 'https://drive.google.com/uc?export=view&id=1NDogJbh7eGBPgPIPNzLk7rp927eMT5ey',
    linkUrl: 'https://universitas.academy/cursos/fundamentos-de-la-contratacion-publica/',
  },
  {
    id: '2',
    title: 'Actas de entrega',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1jfseloH-vDfBibzC1CbZmHrZK6Hf5OaZ',
    linkUrl: 'https://universitas.academy/cursos/actas-de-entrega/',
  },
  {
    id: '3',
    title: 'Jornadas de Contrataciones Públicas',
    imageUrl: 'https://drive.google.com/uc?export=view&id=19MsqcnOKC89xszZNy7k3vK9jdIW1p0uN',
    linkUrl: 'https://universitas.academy/cursos/jornadas-contrataciones-publicas/',
  },
  {
    id: '4',
    title: 'Jornadas de Control Fiscal',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1Q87FU_XxROWp-RldPoAv6cqcISeoDmKI',
    linkUrl: 'https://universitas.academy/cursos/jornadas-de-control-fiscal/',
  },
];

// --- COMPONENTE ---
const CoursesScreen = () => {

  const handlePress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `No se puede abrir el enlace: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {coursesData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handlePress(item.linkUrl)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.footer}>
              <Text style={styles.footerText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- ESTILOS (idénticos a los de Repositorio) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default CoursesScreen;