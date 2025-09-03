import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Colors from '../constants/Colors';

// --- DATOS DEL REPOSITORIO ---
// Nota: Las URLs de Google Drive han sido transformadas a enlaces directos para que la imagen se pueda mostrar.
const repositoryData = [
  {
    id: '1',
    title: 'Legislación en materia de Contrataciones Públicas',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1XRDqEeSAOVr6spZQLnMxKyoOeD8TMnE-',
    linkUrl: 'https://universitas.legal/legislacion-contrataciones/',
  },
  {
    id: '2',
    title: 'Biblioteca de Contrataciones Públicas',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1-L9Ps6eUvPl33O2URVRT3e6MG4rNQVPZ',
    linkUrl: 'https://universitas.legal/contrataciones-publicas/',
  },
  {
    id: '3',
    title: 'Biblioteca de Control Fiscal',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1KGOEZUxjqshU2_Ff6AJDc23Elxaaebmi',
    linkUrl: 'https://universitas.legal/control-fiscal/',
  },
  {
    id: '4',
    title: 'Biblioteca de Ordenanzas municipales',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1NL6qB8CJzzWMJhc3NeEMQWr7O8-iA5gI',
    linkUrl: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
  },
];

// --- COMPONENTE ---
const RepositoryScreen = () => {

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
        {repositoryData.map(item => (
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

// --- ESTILOS ---
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
    height: 180, // Altura fija para todas las imágenes
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

export default RepositoryScreen;