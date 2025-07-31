// app/(profile)/about.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente de Encabezado Personalizado
const CustomHeader = ({ onBackPress }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Ionicons name="arrow-back" size={28} color={Colors.text} />
    </TouchableOpacity>
  </View>
);

// Componente para los pilares de la propuesta de valor
const Pillar = ({ iconName, title, children }) => (
  <View style={styles.pillar}>
    <Feather name={iconName} size={24} color={Colors.primary} />
    <Text style={styles.pillarTitle}>{title}</Text>
    <Text style={styles.paragraph}>{children}</Text>
  </View>
);

const AboutScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <ScrollView contentContainerStyle={styles.container}>

        <CustomHeader onBackPress={() => router.back()} />

        <Text style={styles.title}>Acerca de Manuales de Contrataciones Públicas</Text>
        
        <Text style={styles.paragraph}>
          La elaboración de un manual de contrataciones públicas es una tarea fundamental para toda institución del estado venezolano, pero también es un proceso que tradicionalmente ha sido complejo, lento y que consume una gran cantidad de recursos. Conscientes de este desafío, hemos creado una solución para transformar radicalmente esta realidad.
        </Text>
        
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Roboto_700Bold' }}>Manuales de Contrataciones Públicas</Text> es una aplicación desarrollada por Universitas Services que convierte la ardua tarea de redactar un manual en un proceso simple, guiado e intuitivo. A través de un cuestionario inteligente, nuestra plataforma le permite introducir la información clave de su institución y, en cuestión de minutos, genera un manual base personalizado, listo para ser utilizado y adaptado a sus necesidades específicas.
        </Text>

        <Text style={styles.subtitle}>Nuestra propuesta de valor se fundamenta en tres pilares esenciales:</Text>

        <Pillar iconName="zap" title="Eficiencia">
          Reduzca un trabajo de días a tan solo unos minutos.
        </Pillar>
        <Pillar iconName="dollar-sign" title="Asequibilidad">
          Obtenga un resultado profesional con una inversión significativamente menor al costo de un consultor externo.
        </Pillar>
        <Pillar iconName="shield" title="Confianza">
          Siéntase seguro sabiendo que la estructura y el contenido del manual han sido diseñados y validados por un equipo de expertos con más de veinte años de experiencia en la materia.
        </Pillar>

        <Text style={styles.paragraph}>
          Pero nuestra plataforma es mucho más que un generador de documentos. Es un ecosistema integral de servicios diseñado para el profesional del área de compras del estado. Dentro de la aplicación también encontrará acceso a un Repositorio Legal gratuito, la posibilidad de agendar Asesorías personalizadas, inscribirse en programas de Formación y, para nuestros usuarios PRO, consultar a un Asistente de Inteligencia Artificial experto en la materia.
        </Text>

        <Text style={styles.paragraph}>
          Nuestra misión es simplificar la complejidad de la gestión pública, poniendo herramientas poderosas y conocimiento experto al alcance de su mano.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 60,
  },
  backButton: {
    padding: 0,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 20,
  },
  paragraph: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  pillar: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  pillarTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 36,
    marginTop: -24,
    marginBottom: 4,
  },
});

export default AboutScreen;