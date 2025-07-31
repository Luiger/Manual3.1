import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import * as Linking from 'expo-linking';

// --- DATOS DE LAS TARJETAS ---
const cardData = [
  {
    id: '1',
    icon: { family: Feather, name: 'file-text' },
    title: 'Manual Express',
    subtitle: 'Elabora tu Manual Express',
    buttonText: 'Elaborar',
    buttonVariant: 'express',
    action: (router) => router.push('/manual-express-form'),
  },
  {
    id: '2',
    title: 'Manual PRO',
    subtitle: 'Elabora tu Manual PRO',
    icon: { family: Feather, name: 'file-text' },
    buttonText: 'Elaborar',
    buttonVariant: 'pro',
    action: (router) => router.push('/manual-form'),
  },
  {
    id: '3',
    title: 'Repositorio legal',
    subtitle: 'Consulta nuestro Repositorio Legal',
    icon: { family: FontAwesome5, name: 'gavel' },
    buttonText: 'Explorar',
    buttonVariant: 'transparent',
    action: (router) => router.push('/repository'),
  },
  {
    id: '4',
    title: 'Soporte',
    subtitle: 'Soporte técnico',
    icon: { family: FontAwesome5, name: 'whatsapp' },
    buttonText: 'Contactar',
    buttonVariant: 'transparent',
    //action: () => console.log('Abriendo Soporte...'),
    action: (router) => router.push('/support'),
  },
  {
    id: '5',
    title: 'Asesoría',
    subtitle: 'Agenda una asesoría con nuestros expertos',
    icon: { family: Feather, name: 'calendar' },
    buttonText: 'Agendar',
    buttonVariant: 'transparent',
    /*action: () => console.log('Abriendo Asesoría...'),*/
    action: () => Linking.openURL('https://universitas.legal/contrataciones-publicas/')
  },
  {
    id: '6',
    title: 'Formación',
    subtitle: 'Conoce nuestros cursos',
    icon: { family: Feather, name: 'monitor' },
    buttonText: 'Ver cursos',
    buttonVariant: 'transparent',
    action: (router) => router.push('/courses'),
  },
];

// --- COMPONENTE CARD ---
const Card = ({ icon, title, buttonText, buttonVariant, onPress }) => {
  const IconComponent = icon.family;
  
  const buttonStyle = [ 
    styles.cardButton, 
    buttonVariant === 'express' && styles.buttonExpress, 
    buttonVariant === 'pro' && styles.buttonPro, 
    buttonVariant === 'transparent' && styles.buttonTransparent ];
  const buttonTextStyle = [ styles.cardButtonText, 
    buttonVariant === 'express' && styles.buttonTextExpress, 
    (buttonVariant === 'pro' || buttonVariant === 'transparent') && styles.buttonTextLight ];

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        {/* 1. Contenedor flexible para el ícono */}
        <View style={styles.cardIconContainer}>
          <IconComponent name={icon.name} size={40} color={Colors.textLight} />
        </View>

        {/* 2. Contenedor para el título y el botón */}
        <View style={styles.cardFooter}>
          <Text style={styles.cardTitle}>{title}</Text>
          <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- PANTALLA PRINCIPAL ---
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Obtenemos el usuario actual

  // Filtramos las tarjetas antes de mostrarlas
  const visibleCards = cardData.filter(card => {
    if (card.title === 'Manual Express' && user?.Rol === 'Usuario Pago') {
      return false; // Oculta esta tarjeta si el usuario es de pago
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(profile)/menu')}>
          <View style={styles.avatar}>
            <Image source={require('../../assets/images/Icono blanco Universitas.png')} style={styles.headerLogo} resizeMode='contain' />
          </View>
        </TouchableOpacity>
        {/*<Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain' />*/}
        <Text style={styles.headerTitle}>Manuales de Contrataciones</Text>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardRow}>
          {visibleCards.map(card => (
            <Card
              key={card.id}
              icon={card.icon}
              title={card.title}
              buttonText={card.buttonText}
              buttonVariant={card.buttonVariant}
              onPress={() => card.action(router)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, backgroundColor: Colors.background,
  },
  scrollView: { flex: 1 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, //backgroundColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
    borderColor: Colors.primary,
    //borderWidth: 2,
  },
  avatarText: { color: Colors.textLight, fontWeight: 'bold', fontSize: 16 },
  headerLogo: { width: 40, height: 40, borderRadius: 30 },// Anteriormente 24 en width y height
  headerTitle: {
    marginLeft: 8, fontSize: 18, fontWeight: '600',
    color: Colors.text, fontFamily: 'Roboto_500Medium',
    textAlign: 'center', flex: 1,
  },
  contentContainer: { flexGrow: 1, padding: 8 },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap' },
  cardWrapper: { width: '50%', padding: 8 },
  cardContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    height: 220,
    justifyContent: 'space-between',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  // 3. Nuevos estilos para la distribución interna de la tarjeta
  cardIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    // No necesita estilos adicionales
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    color: Colors.textLight,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardButton: {
    borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  cardButtonText: { fontFamily: 'Roboto_500Medium', fontSize: 14 },
  buttonExpress: { backgroundColor: Colors.accentExpress },
  buttonTextExpress: { color: Colors.primary },
  buttonPro: { backgroundColor: Colors.accentPRO },
  buttonTransparent: { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
  buttonTextLight: { color: Colors.textLight },
});